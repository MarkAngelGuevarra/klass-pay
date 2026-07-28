#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, contracterror, Address, Env, panic_with_error, Vec, token};

/// Bill information stored on-chain.
#[contracttype]
#[derive(Clone)]
pub struct BillInfo {
    pub organizer: Address,
    pub token: Address, // NEW: We must track the specific asset (XLM) being collected
    pub target: i128,   // CHANGED: Soroban tokens use i128 for amounts (stroops)
    pub funded: i128,
    pub settled: bool,
    pub payers: Vec<Address>,
}

/// Contract error codes.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum Error {
    AlreadyInit = 1,
    NotFound = 2,
    Overfund = 3,
    AlreadySettled = 4,
    ZeroAmount = 5,
    NotOrganizer = 6, // NEW: Security check for withdrawals
}

#[contract]
pub struct SplitPayContract;

#[contractimpl]
impl SplitPayContract {
    pub fn create(env: Env, organizer: Address, token: Address, bill_id: u32, amount: i128) {
        organizer.require_auth();

        if amount <= 0 {
            panic_with_error!(&env, Error::ZeroAmount);
        }

        if env.storage().persistent().has(&bill_id) {
            panic_with_error!(&env, Error::AlreadyInit);
        }

        let bill = BillInfo {
            organizer,
            token,
            target: amount,
            funded: 0,
            settled: false,
            payers: Vec::new(&env),
        };

        env.storage().persistent().set(&bill_id, &bill);
        env.storage().persistent().extend_ttl(&bill_id, 500, 1000);
    }

    pub fn pay(env: Env, payer: Address, bill_id: u32, amount: i128) {
        payer.require_auth();

        if amount <= 0 {
            panic_with_error!(&env, Error::ZeroAmount);
        }

        let mut bill: BillInfo = env
            .storage()
            .persistent()
            .get(&bill_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));

        if bill.settled {
            panic_with_error!(&env, Error::AlreadySettled);
        }

        if bill.funded + amount > bill.target {
            panic_with_error!(&env, Error::Overfund);
        }

        // NEW: The actual blockchain transfer! Move XLM from Payer to the Smart Contract.
        let token_client = token::Client::new(&env, &bill.token);
        token_client.transfer(&payer, &env.current_contract_address(), &amount);

        bill.funded += amount;
        
        if !bill.payers.contains(&payer) {
            bill.payers.push_back(payer);
        }

        if bill.funded == bill.target {
            bill.settled = true;
        }

        env.storage().persistent().set(&bill_id, &bill);
        env.storage().persistent().extend_ttl(&bill_id, 500, 1000);
    }

    // NEW: The Organizer needs a secure way to pull the funds out of the contract!
    pub fn withdraw(env: Env, organizer: Address, bill_id: u32) {
        organizer.require_auth();

        let mut bill: BillInfo = env
            .storage()
            .persistent()
            .get(&bill_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));

        if bill.organizer != organizer {
            panic_with_error!(&env, Error::NotOrganizer);
        }
        if bill.funded == 0 {
            panic_with_error!(&env, Error::ZeroAmount); // Nothing to withdraw
        }

        // Move the collected funds from the Smart Contract directly to the Organizer
        let token_client = token::Client::new(&env, &bill.token);
        token_client.transfer(&env.current_contract_address(), &organizer, &bill.funded);
        
        // Reset funded to 0 to prevent double-withdrawals
        bill.funded = 0; 
        env.storage().persistent().set(&bill_id, &bill);
    }

    pub fn get(env: Env, bill_id: u32) -> BillInfo {
        env.storage()
            .persistent()
            .get(&bill_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::NotFound))
    }
}
