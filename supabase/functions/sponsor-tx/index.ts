import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Keypair, Transaction, TransactionBuilder } from "https://esm.sh/@stellar/stellar-sdk@11.2.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Only ever sponsor calls to our own contract - never sponsor arbitrary
// transactions, or anyone who finds this URL could drain the sponsor
// wallet by getting unrelated transactions fee-bumped for free.
const ALLOWED_CONTRACT_ID = (Deno as any).env.get('KLASSPAY_CONTRACT_ID') ??
  'CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ'

serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { signedTxXdr } = await req.json()
    if (!signedTxXdr) {
      throw new Error("Missing signedTxXdr in request body")
    }

    const sponsorSecret = (Deno as any).env.get('SPONSOR_SECRET_KEY')
    if (!sponsorSecret) {
      throw new Error("Server configuration error: SPONSOR_SECRET_KEY not found")
    }

    const sponsorKeypair = Keypair.fromSecret(sponsorSecret)

    // Parse the inner transaction
    const innerTx = new Transaction(signedTxXdr, "Public Global Stellar Network ; September 2015")

    // Validate every operation targets our own contract before agreeing to
    // pay the fee. Anything else gets rejected.
    for (const op of innerTx.operations) {
      const opAny = op as any
      const targetContract =
        opAny.func?.value?.().invokeContract?.().contractAddress?.().contractId?.() ??
        opAny.contract

      if (opAny.type !== 'invokeHostFunction' || String(targetContract) !== ALLOWED_CONTRACT_ID) {
        throw new Error('Refusing to sponsor: transaction does not call the KlassPay contract')
      }
    }

    // Build FeeBumpTransaction
    const tx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      "100", // BASE_FEE
      innerTx,
      "Public Global Stellar Network ; September 2015"
    );

    tx.sign(sponsorKeypair)

    return new Response(
      JSON.stringify({ success: true, xdr: tx.toXDR() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})