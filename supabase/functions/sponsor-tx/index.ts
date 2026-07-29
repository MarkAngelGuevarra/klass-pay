import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Keypair, Transaction, TransactionBuilder } from "https://esm.sh/@stellar/stellar-sdk@11.2.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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