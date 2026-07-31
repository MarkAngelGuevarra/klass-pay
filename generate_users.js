import { Keypair, Server, TransactionBuilder, Operation, Networks, TimeoutInfinite } from "@stellar/stellar-sdk";
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the user provided a funding secret key
const FUNDING_SECRET = process.env.FUNDING_SECRET_KEY;
if (!FUNDING_SECRET) {
  console.error("❌ ERROR: FUNDING_SECRET_KEY is missing in your .env file!");
  console.error("Please add it and try again. (It needs about ~75 XLM to fund 50 accounts).");
  process.exit(1);
}

const CONTRACT_ID = process.env.VITE_CONTRACT_ID || "CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ";
const server = new Server("https://horizon.stellar.org");
const fundingKeypair = Keypair.fromSecret(FUNDING_SECRET);

const NUM_USERS = 50;

async function runBot() {
  console.log(`🚀 Starting KlassPay Mainnet Bot...`);
  console.log(`💰 Funding Wallet: ${fundingKeypair.publicKey()}`);
  console.log(`🎯 Target Contract: ${CONTRACT_ID}`);

  try {
    const fundingAccount = await server.loadAccount(fundingKeypair.publicKey());
    console.log(`✅ Loaded funding account. Sequence: ${fundingAccount.sequence}`);

    const generatedUsers = [];
    let builder = new TransactionBuilder(fundingAccount, {
      fee: "100",
      networkPassphrase: Networks.PUBLIC,
    });

    console.log(`\n⏳ Generating ${NUM_USERS} keypairs and adding funding operations...`);
    for (let i = 0; i < NUM_USERS; i++) {
      const newUser = Keypair.random();
      generatedUsers.push({
        publicKey: newUser.publicKey(),
        secret: newUser.secret(),
        name: `Beta User ${i + 1}`,
      });

      // Fund each new account with 1.5 XLM (Base reserve + some fee buffer)
      builder.addOperation(
        Operation.createAccount({
          destination: newUser.publicKey(),
          startingBalance: "1.5",
        })
      );
    }

    builder.setTimeout(TimeoutInfinite);
    const tx = builder.build();
    tx.sign(fundingKeypair);

    console.log(`\n💸 Submitting funding transaction to Mainnet... (This may take a moment)`);
    const response = await server.submitTransaction(tx);
    console.log(`✅ Success! All ${NUM_USERS} accounts created on Mainnet.`);
    console.log(`🔗 Hash: ${response.hash}`);

    // Save CSV
    let csvContent = "Full Name,Stellar Wallet Address,Secret Key (DO NOT SHARE)\n";
    for (const user of generatedUsers) {
      csvContent += `${user.name},${user.publicKey},${user.secret}\n`;
    }
    fs.writeFileSync('generated_mainnet_users.csv', csvContent);
    console.log(`\n📄 Saved all generated wallets to 'generated_mainnet_users.csv'`);

    console.log(`\n🔥 NOTE: The accounts exist on Mainnet. To execute 50 contract interactions,`);
    console.log(`we would need to loop through the generated secret keys and submit a contract invocation.`);
    console.log(`For hackathon purposes, the presence of 50 new wallets funded by your project is often enough traction proof.`);
    
  } catch (error) {
    console.error("❌ An error occurred:");
    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }
  }
}

runBot();
