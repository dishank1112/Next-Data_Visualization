import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    try:
        # Open the CSV file
        with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
            # Read CSV using DictReader (maps headers to values)
            reader = csv.DictReader(csv_file)
            data = list(reader)

        # Write JSON output
        with open(json_file_path, mode='w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4, ensure_ascii=False)

        print(f"✅ Successfully converted '{os.path.basename(csv_file_path)}' to '{os.path.basename(json_file_path)}'")

    except Exception as e:
        print(f"❌ Error: {e}")

# Example usage
if __name__ == "__main__":
    input_csv = "data.csv"   # <-- Replace with your CSV file path
    output_json = "output_data.json"  # <-- Replace with your desired JSON file path
    
    csv_to_json(input_csv, output_json)
