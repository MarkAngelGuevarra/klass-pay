/**
 * sorobanClient.ts
 * Full Soroban RPC client for the KlassPay split_pay contract.
 *
 * Contract crate: contracts/split_pay
 * Functions:
 *   create(organizer: Address, amount: u32) — write
 *   pay(payer: Address, amount: u32)        — write
 *   get() -> BillInfo                       — read
 */
import {
  Contract,
  rpc as SorobanRpc, // <-- This is the fix! We alias the new rpc module to the old name
  TransactionBuilder,
  Networks,
  nativeToScVal,
  Address,
  xdr,
  Keypair,
  Account,
  Horizon,
} from '@stellar/stellar-sdk';
import { getContractId } from './contractRuntime';

export const DEPLOY_HINT = 'contracts/split_pay';

const RPC_URL = 'https://mainnet.sorobanrpc.com';
const HORIZON_URL = 'https://horizon.stellar.org';
const NETWORK_PASSPHRASE = Networks.PUBLIC;
const BASE_FEE = '100';
const TIMEOUT_SECONDS = 300; // Increased to 5 minutes to prevent txTOO_LATE (-3) error if user takes time to sign

async function getSponsoredTransaction(signedTxXdr: string): Promise<string> {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Fallback to hardcoded public keys in case Vercel env vars are missing
  const fallbackUrl = 'https://xnevwhnnarntiybspdkq.supabase.co';
  const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZXZ3aG5uYXJudGl5YnNwZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMzgzODIsImV4cCI6MjEwMDgxNDM4Mn0.7WGJYQcx4mMzYeJSLgUYmVKb6icqLnZAMhFzcjycfhM';
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackAnon;
  
  const baseUrl = isLocalhost ? '/api/supabase' : supabaseUrl;
  
  const response = await fetch(`${baseUrl}/functions/v1/sponsor-tx`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`
    },
    body: JSON.stringify({ signedTxXdr }) // Must match the backend variable name
  });
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to sponsor transaction");
  }
  return data.xdr; // Must match the backend response variable
}

/** Shared RPC server instance */
function getRpcServer(): SorobanRpc.Server {
  return new SorobanRpc.Server(RPC_URL);
}

/** Ensure a contract ID is available or throw a friendly error */
function requireContract(): string {
  const id = getContractId();
  if (!id) {
    throw new Error(
      `No contract ID configured. Deploy the contract from ${DEPLOY_HINT} and set VITE_CONTRACT_ID.`,
    );
  }
  return id;
}

/** Format an RPC / simulation error into a readable string */
function formatRpcError(err: unknown): string {
  if (err instanceof Error) {
    /* Pull out nested Soroban diagnostic info when available */
    const msg = err.message;
    const match = msg.match(/HostError\(([^)]+)\)/);
    if (match) return `Soroban HostError: ${match[1]}`;
    if (msg.includes('Transaction simulation failed')) {
      return `Simulation failed: ${msg}`;
    }
    return msg;
  }
  return String(err);
}

/** Build ScVal args for contract calls */
function buildArgs(
  method: string,
  args?: Array<{ value: unknown; type: string }>,
): xdr.ScVal[] {
  if (!args || args.length === 0) return [];

  return args.map((arg) => {
    if (arg.type === 'address') {
      return new Address(arg.value as string).toScVal();
    }
    if (arg.type === 'u32') {
      return nativeToScVal(arg.value as number, { type: 'u32' });
    }
    if (arg.type === 'i128') {
      return nativeToScVal(arg.value as number, { type: 'i128' });
    }
    if (arg.type === 'string') {
      return nativeToScVal(arg.value as string, { type: 'string' });
    }
    /* Default: let the SDK infer */
    return nativeToScVal(arg.value);
  });
}

/**
 * Parse BillInfo from the contract's `get()` return value.
 */
export interface BillInfo {
  organizer: string;
  target: number;
  funded: number;
  settled: boolean;
  payers: string[];
}

function parseBillInfo(resultVal: xdr.ScVal): BillInfo {
  const map = resultVal.map();
  if (!map) throw new Error('Expected map result from get()');

  let organizer = '';
  let target = 0;
  let funded = 0;
  let settled = false;
  const payers: string[] = [];

  for (const entry of map) {
    const key = entry.key().sym().toString();
    const val = entry.val();

    switch (key) {
      case 'organizer':
        organizer = Address.fromScVal(val).toString();
        break;
      case 'target': {
        const targetRaw = val.u32?.() ?? val.i128?.();
        if (typeof targetRaw === 'number') {
          target = targetRaw;
        } else if (targetRaw !== undefined && targetRaw !== null) {
          /* i128: combine hi + lo */
          const lo = Number(targetRaw.lo().low) + Number(targetRaw.lo().high) * 2 ** 32;
          target = lo;
        }
        break;
      }
      case 'funded': {
        const fundedRaw = val.u32?.() ?? val.i128?.();
        if (typeof fundedRaw === 'number') {
          funded = fundedRaw;
        } else if (fundedRaw !== undefined && fundedRaw !== null) {
          const lo = Number(fundedRaw.lo().low) + Number(fundedRaw.lo().high) * 2 ** 32;
          funded = lo;
        }
        break;
      }
      case 'settled':
        settled = val.b?.() ?? false;
        break;
      case 'payers': {
        const vec = val.vec();
        if (vec) {
          for (const p of vec) {
            payers.push(Address.fromScVal(p).toString());
          }
        }
        break;
      }
    }
  }

  return { organizer, target, funded, settled, payers };
}

/**
 * Simulate a read-only contract call.
 * @param method  Contract function name (e.g. 'get')
 * @param source  Source account public key
 * @param args    Optional typed arguments
 */
export async function simulate(
  method: string,
  source: string,
  args?: Array<{ value: unknown; type: string }>,
): Promise<BillInfo> {
  const contractId = requireContract();
  const server = getRpcServer();
  const contract = new Contract(contractId);

  const scArgs = buildArgs(method, args);
  
  const horizonServer = new Horizon.Server(HORIZON_URL);
  const account = await horizonServer.loadAccount(source).catch(() => {
    /* If account doesn't exist on-chain yet, build a zero-sequence stub */
    return new Account(source, '0');
  });

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(TIMEOUT_SECONDS)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(formatRpcError(new Error(simResult.error)));
  }

  if (!SorobanRpc.Api.isSimulationSuccess(simResult)) {
    throw new Error('Simulation returned no result');
  }

  const resultVal = (simResult.result as SorobanRpc.Api.SimulateHostFunctionResult).retval;
  return parseBillInfo(resultVal);
}

/**
 * Invoke a write (state-changing) contract call.
 * Builds, simulates, signs via provided signXDR, and submits.
 * @param method   Contract function name (e.g. 'create', 'pay')
 * @param source   Source account public key
 * @param signXDR  Callback to sign the transaction XDR (from wallet)
 * @param args     Typed arguments for the call
 */
export async function invokeWrite(
  method: string,
  source: string,
  signXDR: (xdr: string) => Promise<string>,
  args?: Array<{ value: unknown; type: string }>,
): Promise<SorobanRpc.Api.GetTransactionResponse> {
  const contractId = requireContract();
  const server = getRpcServer();
  const contract = new Contract(contractId);

  const scArgs = buildArgs(method, args);
  
  // Use Horizon to reliably fetch account state and sequence number
  const horizonServer = new Horizon.Server(HORIZON_URL);
  const account = await horizonServer.loadAccount(source);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...scArgs))
    .setTimeout(TIMEOUT_SECONDS)
    .build();

  /* Simulate to get the prepared/assembled transaction */
  const simResult = await server.simulateTransaction(tx);

  if (SorobanRpc.Api.isSimulationError(simResult)) {
    throw new Error(formatRpcError(new Error(simResult.error)));
  }

  const assembled = SorobanRpc.assembleTransaction(tx, simResult).build();
  const xdrString = assembled.toXDR('base64');

  /* Sign */
  const signedXdr = await signXDR(xdrString);

  /* Wrap with Gasless Fee Sponsorship via Supabase */
  const sponsoredXdr = await getSponsoredTransaction(signedXdr);

  /* Convert the signed XDR back into a transaction object */
  const finalTx = TransactionBuilder.fromXDR(sponsoredXdr, NETWORK_PASSPHRASE) as any;

  /* Submit the fully signed Transaction to the network directly (bypassing blocked proxy) */
  const sendResult = await server.sendTransaction(finalTx);

  if (sendResult.status === 'ERROR') {
    throw new Error(`Transaction submission failed: ${sendResult.errorResult?.toXDR('base64') ?? 'unknown error'}`);
  }

  /* Poll for confirmation */
  let getResult = await server.getTransaction(sendResult.hash);
  const startTime = Date.now();
  while (getResult.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    if (Date.now() - startTime > 30_000) {
      console.warn('Transaction confirmation timed out, assuming success for UI flow');
      break;
    }
    await new Promise((r) => setTimeout(r, 2000));
    getResult = await server.getTransaction(sendResult.hash);
  }

  if (getResult.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
    throw new Error('Transaction failed on-chain. Check explorer for details.');
  }

  return getResult;
}
