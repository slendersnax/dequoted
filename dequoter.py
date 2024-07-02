import json, csv

json_file = open("testdata.json", "rt")
csv_file = open("result.csv", "wt")

table_data = json.load(json_file)

print(table_data)
csv_file.write("# = " + table_data[0]["name"] + ",\n")

for item in table_data[0]["items"]:
	for key, value in item.items():
		for i in range(1, int(value) + 1):
			csv_file.write(key + "_" + str(i) + ",999\n")

json_file.close()