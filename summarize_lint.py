import json
import os

def summarize_lint():
    try:
        with open('lint_report.json', 'r', encoding='utf-16') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    errors = []
    for file_data in data:
        file_path = file_data.get('filePath', 'unknown')
        for msg in file_data.get('messages', []):
            if msg.get('severity') == 2: # Error
                errors.append(f"{file_path}:{msg.get('line')}:{msg.get('column')} - {msg.get('message')} ({msg.get('ruleId')})")
    
    if not errors:
        print("No errors found.")
    else:
        for err in errors:
            print(err)

if __name__ == "__main__":
    summarize_lint()
