#![cfg(test)]

use super::*;
use soroban_sdk::testutils::Address as _;
use soroban_sdk::{token, Env};

/// Sets up a contract client plus a real Stellar Asset Contract token
/// so `pay`/`withdraw` (which move real tokens) can be tested.
fn setup() -> (
    Env,
    SplitPayContractClient<'static>,
    Address,
    token::Client<'static>,
    token::StellarAssetClient<'static>,
) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(SplitPayContract, ());
    let client = SplitPayContractClient::new(&env, &contract_id);

    let token_admin = Address::generate(&env);
    let token_sac = env.register_stellar_asset_contract_v2(token_admin);
    let token_address = token_sac.address();
    let token_client = token::Client::new(&env, &token_address);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_address);

    (env, client, token_address, token_client, token_admin_client)
}

#[test]
fn test_happy_path() {
    let (env, client, token_address, token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let payer = Address::generate(&env);
    token_admin.mint(&payer, &100);

    client.create(&organizer, &token_address, &1, &100);
    client.pay(&payer, &1, &40);

    let bill = client.get(&1);
    assert_eq!(bill.organizer, organizer);
    assert_eq!(bill.target, 100);
    assert_eq!(bill.funded, 40);
    assert_eq!(bill.settled, false);
    assert_eq!(bill.payers.len(), 1);

    // Real token movement: payer's balance dropped, contract now holds it
    assert_eq!(token_client.balance(&payer), 60);
    assert_eq!(token_client.balance(&client.address), 40);
}

#[test]
#[should_panic(expected = "Error(Contract, #5)")]
fn test_zero_amount_rejected() {
    let (env, client, token_address, _token_client, _token_admin) = setup();
    let organizer = Address::generate(&env);

    client.create(&organizer, &token_address, &1, &0);
}

#[test]
fn test_state_persists_two_pays() {
    let (env, client, token_address, _token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let payer_a = Address::generate(&env);
    let payer_b = Address::generate(&env);
    token_admin.mint(&payer_a, &30);
    token_admin.mint(&payer_b, &25);

    client.create(&organizer, &token_address, &2, &100);
    client.pay(&payer_a, &2, &30);
    client.pay(&payer_b, &2, &25);

    let bill = client.get(&2);
    assert_eq!(bill.funded, 55);
    assert_eq!(bill.payers.len(), 2);
    assert_eq!(bill.settled, false);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn test_overfunding_rejected() {
    let (env, client, token_address, _token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let payer = Address::generate(&env);
    token_admin.mint(&payer, &51);

    client.create(&organizer, &token_address, &3, &50);
    client.pay(&payer, &3, &51);
}

#[test]
#[should_panic(expected = "Error(Contract, #4)")]
fn test_cannot_pay_after_settled() {
    let (env, client, token_address, _token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let payer_a = Address::generate(&env);
    let payer_b = Address::generate(&env);
    token_admin.mint(&payer_a, &10);
    token_admin.mint(&payer_b, &1);

    client.create(&organizer, &token_address, &4, &10);
    client.pay(&payer_a, &4, &10);

    let bill = client.get(&4);
    assert_eq!(bill.settled, true);

    // This pay should fail because the bill is already settled
    client.pay(&payer_b, &4, &1);
}

#[test]
fn test_withdraw() {
    let (env, client, token_address, token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let payer = Address::generate(&env);
    token_admin.mint(&payer, &100);

    client.create(&organizer, &token_address, &5, &100);
    client.pay(&payer, &5, &100);
    assert_eq!(token_client.balance(&client.address), 100);

    client.withdraw(&organizer, &5);

    assert_eq!(token_client.balance(&organizer), 100);
    assert_eq!(token_client.balance(&client.address), 0);

    let bill = client.get(&5);
    assert_eq!(bill.funded, 0);
}

#[test]
#[should_panic(expected = "Error(Contract, #6)")]
fn test_withdraw_rejects_non_organizer() {
    let (env, client, token_address, _token_client, token_admin) = setup();
    let organizer = Address::generate(&env);
    let stranger = Address::generate(&env);
    let payer = Address::generate(&env);
    token_admin.mint(&payer, &10);

    client.create(&organizer, &token_address, &6, &10);
    client.pay(&payer, &6, &10);

    // Someone who is not the organizer should not be able to withdraw
    client.withdraw(&stranger, &6);
}
