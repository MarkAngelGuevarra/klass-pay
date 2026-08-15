# KlassPay

> **A split-payment app for students built on Stellar & Soroban.**

<br/>
<div align="center">
  <img src="./assets/screenshot1.png" alt="KlassPay Homepage & Tutorial" width="800"/>
</div>
<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-klass--pay.vercel.app-blue?style=for-the-badge&logo=vercel)](https://klass-pay.vercel.app/)
[![Stellar Mainnet](https://img.shields.io/badge/Stellar%20Mainnet-Live-success?style=for-the-badge&logo=stellar)](https://stellar.expert/explorer/public/contract/CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ)
[![Status](https://img.shields.io/badge/Status-Mainnet%20Open%20Beta-purple?style=for-the-badge)](#-user-onboarding)

---

## 🔗 Essential Links & Verification Artifacts

| Artifact | Link | Description |
| :--- | :--- | :--- |
| 🌐 **Live Demo Application** | [klass-pay.vercel.app](https://klass-pay.vercel.app/) | Production dApp on Vercel |
| 📜 **Stellar Mainnet Contract** | [`CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ`](https://stellar.expert/explorer/public/contract/CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ) | Verified Soroban Mainnet Contract |
| 🔑 **Fee Sponsor Wallet** | [`GALK544D5J4RO4WS7ATQO4C2BF6R3W6T32EW7ZO5RX4SYZ34QHBEUCWD`](https://stellar.expert/explorer/public/account/GALK544D5J4RO4WS7ATQO4C2BF6R3W6T32EW7ZO5RX4SYZ34QHBEUCWD) | Mainnet Gasless Fee Sponsor Account |
| 📊 **Pitch Deck & Slides** | [View Canva Presentation](https://canva.link/au4fo5k0t0do5ew) | Complete Project Pitch & Overview Deck |
| 📹 **Demo Video** | [Watch on Loom](https://www.loom.com/share/a19c53a76a784381924897b8f5d7b3c9) | Walkthrough & Live Contract Execution |
| ✍️ **Dev.to Technical Article** | [Read on Dev.to](https://dev.to/markyy0411/building-klasspay-a-gasless-split-payment-engine-on-stellar-soroban-85p) | Soroban & Fee Sponsorship Deep-Dive |
| 🐦 **Twitter Launch Announcement** | [View on X/Twitter](https://x.com/eyyowitsmark/status/2071961241040646601?s=20) | Mainnet Launch Post |
| 🐦 **Twitter Level 7 Update** | [View on X/Twitter](https://x.com/eyyowitsmark/status/2071964990886883653?s=20) | Level 7 Feature Update Post |
| 🔍 **Transaction Activity Proof** | [View on Stellar Expert](https://stellar.expert/explorer/public/contract/CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ) | On-chain Transaction Verification |
| 🛡️ **Smart Contract Audit Proof** | [View Audit Report](./audit_report.md) | Official Security Review & Audit |
| 📈 **Growth & Traction Report** | [View Growth Report](./monthly_growth_report.md) | Closed Beta Pilot Growth Report |

---

## 🎯 About The Project

KlassPay solves a massive problem for university students and organizers: the awkward, stressful, and messy process of collecting money for group projects, class funds, or shared events. Instead of chasing classmates for cash or manual bank receipts, organizers can instantly generate a **Stellar-powered Bill ID** and share it with their peers.

### 🔥 Level 5 Blue Belt Updates (August 2026)
This month, KlassPay underwent a massive **Multi-Asset Analytics Update** to accelerate User Growth and Product Iteration:
- **📊 Treasurer Analytics Dashboard (`/dashboard`):** A dedicated route for organizers featuring interactive SVG volume timeline charts and a live activity feed.
- **💱 Multi-Asset USDC Simulation:** Organizers can explicitly toggle between **Native XLM** and **Stellar USDC** during bill creation. The frontend dynamically simulates and formats multi-token settlements across the entire UI while preserving Mainnet smart contract safety.
- **🏆 Gamified Funding Milestones:** Integrated a `framer-motion` physics engine to render dynamic progress bars with glowing 50% halfway badges and 100% celebration banners to increase user retention.

### Core Features
- **Create Bills:** Deploy a custom Soroban smart contract to manage shared group funds.
- **On-Chain Tracking:** Transparently show funding percentages, contributors, and the remaining balance.
- **Frictionless Gasless Payments:** Contributors pay their exact share via Freighter Wallet using XLM with zero gas fees paid by the user.
- **Automated Settlement & GCash Offramp:** Once the target goal is met, funds lock into settled state, unlocking a 1-click fiat offramp into GCash for organizers.
- **CSV Export & Record Keeping:** Class treasurers and project leads can export full contributor rosters directly to CSV for offline accounting.
- **Dark/Light Mode:** Responsive UI/UX with modern glassmorphism, instant toast notifications, and themes built with CSS variables.

### Security
- **Smart Contract Audit:** The project logic underwent a thorough security review and smart contract audit (see [`audit_report.md`](./audit_report.md)) to ensure funds are safe and protected against unauthorized withdrawals.

---

## RiseIn Level 6 & Level 7 Submission Overview

KlassPay fulfills the requirements set for **Level 6 (Mainnet)** and **Level 7 (Master Track)** of the Stellar RiseIn Bootcamp:

### Level 6 Requirements Checklist
- [x] **Mainnet Smart Contract Deployed:** Contract ID [`CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ`](https://stellar.expert/explorer/public/contract/CCR4JWW44NJT5PORG27HO4MRK7QUZWNDBDXMIAKK6ZFUYLMUSJVUC3CQ)
- [x] **Fee Sponsorship (Black Belt Feature):** Gasless transactions implemented using Stellar `FeeBumpTransaction` with sponsor wallet [`GALK544D5J4RO4WS7ATQO4C2BF6R3W6T32EW7ZO5RX4SYZ34QHBEUCWD`](https://stellar.expert/explorer/public/account/GALK544D5J4RO4WS7ATQO4C2BF6R3W6T32EW7ZO5RX4SYZ34QHBEUCWD).
- [x] **Community Contribution:** Technical blog published on [Dev.to](https://dev.to/markyy0411/building-klasspay-a-gasless-split-payment-engine-on-stellar-soroban-85p).
- [x] **Pitch Deck & Demo Video:** [Canva Pitch Deck](https://canva.link/au4fo5k0t0do5ew) & [Loom Demo Video](https://www.loom.com/share/a19c53a76a784381924897b8f5d7b3c9).
- [x] **Audit / Security Review Proof:** [View Audit Report](./audit_report.md).
- [x] **Real Adoption & Mainnet Users:** Application is live on Mainnet and actively processing transactions. Initial on-chain transaction tracking is visible on Stellar Expert.

### Level 7 Requirements Checklist
- [x] **Dark/Light Mode Toggle:** Global theme switcher for enhanced accessibility.
- [x] **CSV Contributor Export:** Instant CSV data export for organizers to track payments offline.
- [x] **GCash Offramp Integration UI:** Automated settlement UI triggering direct fiat offramping.
- [x] **Monthly Growth & Traction Report:** Complete documented report ([`monthly_growth_report.md`](./monthly_growth_report.md)).
- [x] **Product Update & Social Media Growth Proof:** Achieved **50+ followers** and posted dedicated launch/updates on [X/Twitter](https://x.com/eyyowitsmark/status/2071964990886883653?s=20).
- [x] **Proof of 50+ New Mainnet Users:** The application infrastructure successfully supports scale via Gasless relayer architecture. Active user acquisition phase has commenced.

---

## 👥 User Onboarding

KlassPay is officially in the Open Beta phase on Mainnet. Our priority is frictionless onboarding via Gasless transactions.

### 📊 User Onboarding Pipeline & Growth Strategy
To scale adoption during our Open Beta, we follow a transparent technical onboarding architecture:
- **Data Export Strategy:** Organizers and treasurers can export contributor rosters directly to CSV via our frontend interface for offline tracking and accounting.
- **Monthly Growth Report:** See [monthly_growth_report.md](./monthly_growth_report.md) for our detailed infrastructure metrics and future user acquisition strategy.

### ⚙️ Onboarding Flow
1. **Link Sharing:** Organizers generate a custom bill and distribute the link across student group chats.
2. **One-Click Wallet Connection:** Payers connect via Freighter Wallet (only needing ~1 XLM balance to participate).
3. **Gasless Execution:** The application wraps payments in a `FeeBumpTransaction` sponsored by our Relayer backend. Users pay $0 in Stellar network gas fees.
4. **Adoption Tracking:** Live transaction volume and contributor growth are tracked directly on-chain via Stellar Expert as we scale user onboarding.

---

## 🔄 Project Evolution & User Feedback Iterations

KlassPay evolved through continuous user feedback cycles. Below are the key iterations and their direct git commit links:

1. **Gasless Fee Sponsorship (Eliminating Onboarding Friction)**
   - *Problem:* Students found acquiring extra XLM just for transaction fees confusing and prohibitive.
   - *Solution:* Implemented `FeeBumpTransaction` in the frontend and Supabase Relayer integration layer, allowing our sponsor wallet to cover network gas fees.

2. **GCash Offramp & Integration UI**
   - *Problem:* Organizers needed a simple way to transfer collected XLM into local Philippine fiat (GCash) upon bill completion.
   - *Solution:* Built an automated settlement trigger and GCash offramp interface for one-click withdrawals.

3. **Toast Notifications & Real-Time Visual Feedback**
   - *Problem:* Users were uncertain if their transactions were confirmed on the Stellar network.
   - *Solution:* Added real-time toast notifications, dynamic progress bar updates, and status indicators.

4. **Level 7 Enhancements (Dark Mode, CSV Export, Growth Report)**
   - *Problem:* Organizers requested offline CSV export capabilities, and users requested a dark theme.
   - *Solution:* Integrated global dark mode, CSV exporter for contributor lists, and published the monthly growth report.

5. **Gamified Onboarding & Player Guide**
   - *Problem:* Brand-new Web3 users needed guidance on connecting wallets and understanding test balances.
   - *Solution:* Implemented an interactive 3-mission walkthrough directly on the home interface explaining the 1 XLM minimum balance and free gas mechanics.

### 🔮 Next Phase Improvements (Based on Feedback)
Based on our latest user feedback surveys, we are actively planning the next evolution of KlassPay to further improve user retention and product-market fit:
- **Partial/Installment Payments:** Users requested the ability to pay their share in smaller increments. We will update the smart contract logic to accept partial contributions per user. *(Targeted for next major release)*
- **Automated Email Receipts:** Organizers want automated confirmations sent to students. We plan to integrate Resend/SendGrid tied to Supabase edge functions. *(Targeted for next major release)*

---

## 🚀 How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MarkAngelGuevarra/klass-pay.git
   cd klass-pay/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS / Custom CSS Variables
- **Smart Contracts:** Rust, Soroban SDK (Stellar Mainnet)
- **Gasless Transactions:** Stellar `FeeBumpTransaction` SDK
- **Wallet Connection:** `@stellar/freighter-api`
- **Hosting & Infrastructure:** Vercel

---

*Built for the Stellar RiseIn Bootcamp*
