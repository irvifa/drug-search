import csv
import yaml

def csv_to_yaml(csv_file, yaml_file):
    # Read CSV file
    with open(csv_file, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        data = list(csv_reader)

    # Convert to YAML
    with open(yaml_file, 'w', encoding='utf-8') as file:
        yaml.dump(data, file, allow_unicode=True, default_flow_style=False)

# Usage
csv_to_yaml('data/drugs.csv', 'data/drugs.yml')
