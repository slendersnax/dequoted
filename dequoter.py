import json, csv

json_file = open("testdata.json", "rt")
csv_file = open("result.csv", "wt")

table_data = json.load(json_file)

print(table_data)

def rec_quotaline(arr, s_line):
	for i in range(1, int(arr[0][1]) + 1):
		if len(arr) > 1:
			rec_quotaline(arr[1:], s_line + "{}_{},".format(arr[0][0], str(i)))
		else:
			csv_file.write(s_line + "{}_{},999\n".format(arr[0][0], str(i)))

for quota in table_data:
	csv_file.write("# " + ("" if quota["cellcount"] == "1" else "cells:{} ".format(quota["cellcount"])) + "= " + quota["name"] + (",#" * (len(quota["items"]) - 1)) + "\n")

	stack = []

	for item in quota["items"]:
		for key, value in item.items():
			stack.append([key, value])

	rec_quotaline(stack, "")
	csv_file.write("\n")

json_file.close()