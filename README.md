# dequoted

A JSON-to-CSV quota generator for Decipher

### prerequisites

Python. That's it :D. I've only tested with Python 3.x so far, though it should work with Python 2.x as well. I'll update this page when I find out.

### usage

Right now you should modify the `testdata.json` file according to your needs, then run `python dequoter.py` from the command line. See the results in...`result.csv`.

### q&a

Why JSON to CSV?

JSON is very popular and (I think) easy to understand. CSV because it's easy to generate and because the quota files for Decipher are Excel 2010 (.xls) files - which means that copying the data from the CSV file to a quota file is very easy.

### to-do

- [ ] test on Python 2.x
- [ ] add examples
- [ ] add easy-to-run Bash and Batch files
- [ ] make input and output filenames parameters