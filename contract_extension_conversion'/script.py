import pandas as pd
import json

# === STEP 1: Load the CSV file ===
file_path = "./file.csv"  # Replace with your actual file name
df = pd.read_csv(file_path)

# === STEP 2: Rename and select required columns ===
df = df.rename(columns={
    'CRS ID': 'oyo_id',
    'FROM': 'valid_from',
    'TO': 'valid_till'
})[['oyo_id', 'valid_from', 'valid_till']]

# === STEP 3: Convert date columns to string format YYYY-MM-DD ===
df['valid_from'] = pd.to_datetime(df['valid_from'], errors='coerce').dt.strftime('%Y-%m-%d')
df['valid_till'] = pd.to_datetime(df['valid_till'], errors='coerce').dt.strftime('%Y-%m-%d')

# === STEP 4: Convert to list of dictionaries ===
json_data = df.to_dict(orient='records')

# === STEP 5: Save to JSON file ===
with open('contract_extensions.json', 'w') as f:
    json.dump(json_data, f, indent=2)

print("✅ JSON file saved as 'contract_extensions.json'")
