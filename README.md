# dequoted

A JSON-to-CSV quota generator for Decipher

### prerequisites

Python. That's it :D. I've only tested with Python 3.x so far, though it should work with Python 2.x as well. I'll update this page when I find out.

### usage

From the command line, use:

`python dequoter.py [list of json files separated by space]`

The JSON files should have the following format:

```
[
	{
		"name" : "gender x age quota",
		"cellcount": "1",
		"items": [{"gender": "2"}, {"age" : "8"}]
	},
	{
		"name" : "region quota",
		"cellcount": "1",
		"items": [{"region" : "5"}]
	},
		{
		"name" : "country x csp x cell quota",
		"cellcount": "2",
		"items": [{"country": "4"}, {"csp" : "3"}, {"cell": "5"}]
	}
]
```

Where:

- name: the name of the quota sheet
- cellcount: the number of cells to be selected by the Least Fill
- items: an array of **key: value** pairs, which will determine the quota cell names and how many of them to create
	- use one element to create simple quotas, and multiple to create crossed quotas

For example, the first two elements of the JSON code above will generate the following:

```
# = gender x age quota,#
gender_1,age_1,999
gender_1,age_2,999
gender_1,age_3,999
gender_1,age_4,999
gender_1,age_5,999
gender_1,age_6,999
gender_1,age_7,999
gender_1,age_8,999
gender_2,age_1,999
gender_2,age_2,999
gender_2,age_3,999
gender_2,age_4,999
gender_2,age_5,999
gender_2,age_6,999
gender_2,age_7,999
gender_2,age_8,999

# = region quota
region_1,999
region_2,999
region_3,999
region_4,999
region_5,999
```

### bugs

At the moment, when using the script in Powershell it will fail when given filenames in this format: `.\filename.json`, due to the first `.` character.

### q&a

Why JSON to CSV?

JSON is very popular and (I think) easy to understand. CSV because it's easy to generate and because the quota files for Decipher are Excel 2010 (.xls) files - which means that copying the data from the CSV file to a quota file is very easy.

### to-do

- [ ] test on Python 2.x
- [ ] add examples
- [ ] create option to make irregular numbering patterns
- [x] ~~add easy-to-run Bash and Batch files~~
	- [ ] test on Windows - apparently depending on the Python installation, executing `python`, `python.exe`, `python3.exe` doesn't actually execute python
- [x] make input and output filenames parameters