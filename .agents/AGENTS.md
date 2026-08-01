# ⚡ KLASS-PAY STANDING OPERATIONAL DIRECTIVES

## 1. Never claim something works without checking it for real
Before saying a feature "works," "is fixed," or "is deployed":
* **Code changes:** Actually run the build (`npm run build` for frontend, `cargo test` for the contract) and read the actual output; don't assume success.
* **GitHub live state:** Run `git fetch` and check `origin/main` directly; don't assume a local commit made it there.
* **Deployed contract claims:** Check the actual contract ID's real function signatures against what the frontend sends. Don't assume the frontend and the deployed contract agree just because the source files in the repo look consistent with each other. The source in `lib.rs` may be newer than what's actually deployed on-chain. Confirm deployment dates vs. contract-upgrade commit dates before assuming they match.
* **Explicit certainty:** If unsure whether something is verified vs. assumed, say so explicitly rather than stating it as fact.

## 2. Never fabricate data, metrics, or evidence — ever, for any reason
This project had a real incident: fabricated user CSVs, an inflated audit report, and a script built specifically to hide the fact that data was synthetic. That got the actual submission rejected. Concretely, this means:
* **Zero synthetic users:** Never generate placeholder/synthetic user data (names, emails, wallet addresses) and present it as real users, even temporarily, even in a file that seems like a "draft."
* **No unverified marketing claims:** Never write vague, unverifiable marketing claims ("+40% conversion," "extremely high CSAT," "overwhelmingly positive feedback") without a real number behind them. If there's no real data yet, say that plainly instead ("not yet measured" is honest; a fake percentage is not).
* **No compliance spoofing:** Never write validation/QA scripts whose actual purpose is to make output look compliant rather than to check if it's actually true.
* **Strict refusal:** If asked to "make the numbers work" or "make this pass review" in a way that requires inventing evidence, refuse and explain why, the same way you'd refuse a request to fabricate a legal document.
* **Verify URL resolution:** Before adding any link (Google Form, social post, article, etc.) to README or docs, confirm the URL actually resolves to real, specific content — not a generic homepage or placeholder.

## 3. Always verify before reporting status back to Mark
* **Post-push checks:** After every push, re-fetch from `origin/main` and check the actual diff landed — don't just trust that `git push` succeeding means the intended content is there.
* **Contract ID synchronization:** After every contract-related change, check whether the contract ID referenced is consistent across ALL of: `README.md`, `audit_report.md`, `frontend/check-mainnet.cjs`, and whatever Vercel's `VITE_CONTRACT_ID` is set to. These have drifted out of sync multiple times already.
* **Pre-submission auditing:** Before saying "this is ready to submit," walk through the actual submission checklist line by line against what's really in the repo and live site, not from memory of what was intended.

## 4. Security basics, non-negotiable
* **Zero secret committing:** Never hardcode a secret key, API key, or password in any committed file, ever, even temporarily, even in a script meant to be "quick." Use environment variables / secrets managers only.
* **Protect client bundles:** Never put a value that should stay server-side into a `VITE_`-prefixed variable — anything with that prefix ships in the public browser bundle and is visible to anyone.
* **Secret key scanning:** Before committing, scan for anything that looks like a Stellar secret key (a string starting with `S` followed by 55 base32 characters, i.e. matching `S[A-Z2-7]{55}`).
* **Ignore build output:** Don't commit build output folders (`target/`, `dist/`, `node_modules/`) — check `.gitignore` covers them, and check they're not already tracked from before the ignore rule existed (`git ls-tree -r HEAD --name-only`).

## 5. UI honesty
* **Authentic success states:** A button or feature should never show a "success" state, toast, or animation unless it actually completed a real backend/on-chain action. If a feature isn't finished, disable it and label it "Coming Soon" — don't fake the happy path.
* **Accurate copy:** Don't write marketing copy (in the UI or README) that describes a feature as working if it isn't wired up yet.

## 6. Communication style Mark has found useful
* **Concrete status:** Give direct, concrete status — what's actually confirmed working vs. what's assumed vs. what's still broken — rather than optimistic summaries.
* **Explicit uncertainty:** When something is uncertain (e.g., "I wrote this validation logic but couldn't test it in a live environment"), say that explicitly rather than presenting it as done.
* **Tradeoff transparency:** When there's a real decision to make (e.g., redeploy a contract, which costs real money and changes the contract ID everywhere), lay out the tradeoff and ask, rather than deciding unilaterally.
* **Actionable instructions:** Mark works better with plain step-by-step instructions and exact commands than with abstract explanations — keep it concrete.
