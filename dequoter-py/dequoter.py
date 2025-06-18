import json, csv, sys, os

def generate_quotaline(csv_file, marker_lists, s_line):
	for marker in marker_lists[0]:
		if (len(marker_lists) > 1):
			generate_quotaline(csv_file, marker_lists[1:], s_line + "{},".format(marker))
		else:
			global quota_limit
			csv_file.write(s_line + "{},{}\n".format(marker, quota_limit))


def generate_csv(json_file):
	global quota_limit
	json_file = open(json_file, "rt")
	# that long ass .format is just to include the JSON file's name without the extension or the full path
	csv_file = open("result_{}.csv".format(os.path.basename(json_file.name).split(".")[0]), "wt")

	table_data = json.load(json_file)

	for quota in table_data:
		csv_file.write("# " + "cells:{} ".format(quota["cells"]) + "= " + quota["name"] + (",#" * (len(quota["markers"]) - 1)) + "\n")

		quota_limit = quota["limit"]

		marker_lists = []

		# if it's a list, cool, but if it's an object / dict, we have to create a corresponding list
		for item in quota["markers"]:
			if isinstance(item, list):
				marker_lists.append(item[:])
			elif isinstance(item, dict):
				markers = []
				for i in range(int(item["start"]), int(item["end"]) + 1, int(item["step"])):
					markers.append("{}{}{}".format(item["label"], item["separator"], i))

				marker_lists.append(markers)

		generate_quotaline(csv_file, marker_lists, "")
		csv_file.write("\n")

	csv_file.close()
	json_file.close()


quota_limit = "999"

# 1st file is the dequoter.py so we ignore that
for file in sys.argv[1:]:
	generate_csv(file)