import csv
import json

def convert_csv_to_json(csv_file_path, json_file_path):
    data = {}

    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',')

        for row in reader:
            provincia = row['NOME PROVINCIA (ISTAT)']
            codice_provincia = row['CODICE PROVINCIA ISTAT (STORICO)']
            codice_nuts3 = row['CODICE NUTS 3 2021']
            denominazione = row['DENOMINAZIONE CORRENTE']

            if provincia not in data:
                data[provincia] = {
                    "codice_provincia": codice_provincia,
                    "codice_nuts3": codice_nuts3,
                    "denominazione": denominazione,
                    "indicatori": []
                }

            indicatore = {
                "nome": row['INDICATORE'],
                "valore": float(row['VALORE']),
                "unita_di_misura": row['UNITA\' DI MISURA']
            }
            
            data[provincia]["indicatori"].append(indicatore)

    with open(json_file_path, mode='w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, ensure_ascii=False, indent=4)

    print(f"Conversione completata. Il file JSON ottimizzato è stato salvato in: {json_file_path}")

# Esempio di utilizzo:
csv_file = "db_2024.csv" 
json_file = "src/app/assets/db/2024.json" 
convert_csv_to_json(csv_file, json_file)