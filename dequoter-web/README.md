# dequoter-web

A web-based quota generator for Decipher. 
Did you know that you can copy html tables into Excel and they'll keep their data? :D

### prerequisites

- a relatively modern browser that supports Custom Web Components and the Shadow Root
- an Office Suite or a standalone program that has support for `.xls` (Excel 97-2003 Workbook) files

### usage

Open `index-dequote.html` in your browser of choice. 

You can generate JSON from the existing quotas and you can generate quotas from existing JSON code. This little world revolves around JSON. :)

0. \[Optional - See Step 5 before this\] Copy any JSON code you may have into the text field above the `generate quotas from JSON` button, then press the button to generate the saved quota setup
1. Create a quota or multiple quotas
2. Inside each quota are text fields that directly correspond to attributes from [quota tables](https://forstasurveys.zendesk.com/hc/en-us/articles/10100597040795-Adding-Quotas-Using-the-XML-Editor)
    - name: table name
    - cell number: number of cells to be picked from the table; this is 1 by default, increase for quotas based on Multiple Choice questions or Least Fill setups
    - hover over the four buttons that are side-by-side to see what each does:
        - **pattern markers**: a list of markers which can be generated due to its pattern-like nature, e.g. cells based on a `QRegion` question with item labels going from `r1` to `r40` (basically a `for` loop, but specifically based on the Python `range()` function)
        - **predefined markers**: a list of markers *separated by spaces* which can't be generated using a pattern
3. Once you've defined a quota you can press the `generate table` button to see the result. Each button press overwrites the previous table.
4. If you're satisfied with the result, you can press `copy quota table` - this will copy the quota table to the clipboard and you can paste it into the quota excel file
5. \[Optional\] If you want to save all of these quotas you can press the `generate JSON from quotas` button in the top-right of the page. This will generate JSON code in the text field above that you can save for future use.

#### JSON structure / example

```
[
    {
        "name":"gender x age",
        "cell_number":"1",
        "markers":[
            ["gender_1","gender_8","gender49"],
            {"label":"age","separator":"_","start":"2","end":"6","step":"1"}
        ]
    },
    {
        "name":"country x cell",
        "cell_number":"1",
        "markers":[
            {"label":"dCountry","separator":".r","start":"1","end":"4","step":"1"},
            {"label":"dCell","separator":".r","start":"1","end":"4","step":"1"}
        ]
    }
]
```

This JSON code will create the following setup:

![example quota](example_1.png?)
![example quota](example_2.png?)