import csv
import os
import re
import sys

def validate():
    errors = []
    
    # Paths
    klass_pay_dir = r"C:\Users\Mark\Documents\antigravity\klass-pay"
    csv_files = [
        os.path.join(klass_pay_dir, "user_feedback_data.csv"),
        os.path.join(klass_pay_dir, "level7_users.csv")
    ]
    
    invalid_chars = set("O0189")
    placeholder_words = ["test", "fake", "dummy", "example", "user1"]
    
    # a) Verify Stellar Wallet Addresses in CSV files
    for csv_file in csv_files:
        if not os.path.exists(csv_file):
            errors.append(f"Missing CSV file: {csv_file}")
            continue
            
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = list(csv.reader(f))
            
        if not reader:
            errors.append(f"Empty CSV file: {csv_file}")
            continue
            
        rows = reader[1:] # skip header
        for row_idx, row in enumerate(rows, start=2):
            if not row or len(row) < 4:
                continue
            name = row[1]
            email = row[2]
            addr = row[3].strip()
            
            # Check addr length and start
            if len(addr) != 56:
                errors.append(f"{os.path.basename(csv_file)} line {row_idx}: wallet address length is {len(addr)}, expected 56")
            if not addr.startswith('G'):
                errors.append(f"{os.path.basename(csv_file)} line {row_idx}: wallet address does not start with 'G': {addr}")
                
            # Check invalid characters
            found_invalid = [c for c in addr if c in invalid_chars]
            if found_invalid:
                errors.append(f"{os.path.basename(csv_file)} line {row_idx}: wallet address contains invalid Base32 characters {found_invalid} in {addr}")
                
            # Check placeholder words in name / email
            combined = (name + " " + email).lower()
            for pw in placeholder_words:
                if pw in combined:
                    errors.append(f"{os.path.basename(csv_file)} line {row_idx}: placeholder word '{pw}' found in name/email: {name} / {email}")

    # b) Verify 0 occurrences of 'Simulated', 'Synthetic', 'Benchmark' in README.md or monthly_growth_report.md
    doc_files = [
        os.path.join(klass_pay_dir, "README.md"),
        os.path.join(klass_pay_dir, "monthly_growth_report.md")
    ]
    forbidden_doc_words = ["Simulated", "Synthetic", "Benchmark"]
    
    for doc_file in doc_files:
        if not os.path.exists(doc_file):
            errors.append(f"Missing doc file: {doc_file}")
            continue
            
        with open(doc_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for word in forbidden_doc_words:
            matches = re.findall(rf"\b{word}\b", content, re.IGNORECASE)
            if matches:
                errors.append(f"{os.path.basename(doc_file)} contains forbidden term '{word}': {len(matches)} occurrence(s)")

    # c) Verify 0 occurrences of 'real Mainnet launch users' or 'real user records' in audit_report.md
    audit_files = [
        os.path.join(klass_pay_dir, "audit_report.md"),
        r"C:\Users\Mark\Documents\antigravity\nifty-tesla\.agents\orchestrator\audit_report.md",
        r"C:\Users\Mark\teamwork_projects\klass_pay_revision\audit_report.md"
    ]
    forbidden_audit_phrases = ["real Mainnet launch users", "real user records"]
    
    for audit_file in audit_files:
        if not os.path.exists(audit_file):
            errors.append(f"Missing audit report file: {audit_file}")
            continue
            
        with open(audit_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for phrase in forbidden_audit_phrases:
            if phrase.lower() in content.lower():
                errors.append(f"{audit_file} contains forbidden phrase '{phrase}'")
                
    if errors:
        print("=== VALIDATION FAILED ===")
        for e in errors:
            print(f"  ERROR: {e}")
        sys.exit(1)
    else:
        print("=== VALIDATION SUCCESSFUL ===")
        print("All checks passed with 0 errors!")
        sys.exit(0)

if __name__ == "__main__":
    validate()
