import json, csv, sys, os

def rec_quotaline(csv_file, arr, s_line):
		# the value format in these items is the same as for the range() function
		# start, end, step
		nStart = 1
		nEnd = arr[0][1]
		nStep = 1

		if len(arr[0]) > 2:
			nStart = arr[0][1]
			nEnd = arr[0][2]

		if len(arr[0]) > 3:
			nStep = arr[0][3]

		for i in range(nStart, nEnd + 1, nStep):
			if len(arr) > 1:
				rec_quotaline(csv_file, arr[1:], s_line + "{}_{},".format(arr[0][0], str(i)))
			else:
				csv_file.write(s_line + "{}_{},999\n".format(arr[0][0], str(i)))

def generate_csv(json_file):
	json_file = open(json_file, "rt")
	# that long ass .format is just to include the JSON file's name without extension or the full path
	csv_file = open("result_{}.csv".format(os.path.basename(json_file.name).split(".")[0]), "wt")

	table_data = json.load(json_file)

	for quota in table_data:
		csv_file.write("# " + ("" if quota["cellcount"] == "1" else "cells:{} ".format(quota["cellcount"])) + "= " + quota["name"] + (",#" * (len(quota["items"]) - 1)) + "\n")

		stack = []

		for item in quota["items"]:
			arr = []

			for key in item.keys():
				arr.append(key)
			
			for value in item.values():
				if type(value) == int:
					arr.append(value)
				else:
					for el in value:
						arr.append(el)

			stack.append(arr)

		rec_quotaline(csv_file, stack, "")
		csv_file.write("\n")

	csv_file.close()
	json_file.close()


# 1st file is the dequoter.py
for file in sys.argv[1:]:
	generate_csv(file)