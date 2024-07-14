import json, csv, sys

def rec_quotaline(csv_file, arr, s_line):
		for i in range(1, int(arr[0][1]) + 1):
			if len(arr) > 1:
				rec_quotaline(csv_file, arr[1:], s_line + "{}_{},".format(arr[0][0], str(i)))
			else:
				csv_file.write(s_line + "{}_{},999\n".format(arr[0][0], str(i)))

def generate_csv(json_file):
	json_file = open(json_file, "rt")
	csv_file = open("result_{}.csv".format(json_file.name.split(".")[0]), "wt")

	table_data = json.load(json_file)

	for quota in table_data:
		csv_file.write("# " + ("" if quota["cellcount"] == "1" else "cells:{} ".format(quota["cellcount"])) + "= " + quota["name"] + (",#" * (len(quota["items"]) - 1)) + "\n")

		stack = []

		for item in quota["items"]:
			for key, value in item.items():
				stack.append([key, value])

		rec_quotaline(csv_file, stack, "")
		csv_file.write("\n")

	csv_file.close()
	json_file.close()


# 1st file is the dequoter.py
for file in sys.argv[1:]:
	generate_csv(file)