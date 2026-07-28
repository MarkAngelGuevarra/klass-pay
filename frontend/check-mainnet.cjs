const { rpc } = require('@stellar/stellar-sdk');

async function check() {
  const server = new rpc.Server('https://soroban-rpc.mainnet.stellar.org');
  try {
    const res = await server.getLedgerEntries(
      rpc.getLedgerKeyForContract('CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ')
    );
    console.log(res);
  } catch(e) {
    console.error(e);
  }
}
check();
