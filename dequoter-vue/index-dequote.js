// quick 'n' dirty to avoid boilerplate
function getElement(tag, id = "", classList = "", attributes = "") {
    const el = document.createElement(tag);

    if (id != "") {
        el.id = id;
    }

    if (classList != "") {
        el.className = classList;
    }

    if (attributes != "") {
        let attributeList = JSON.parse(attributes);
        let attributeKeys = Object.keys(attributeList);

        for (let i = 0; i < attributeKeys.length; i ++) {
            el.setAttribute(attributeKeys[i], attributeList[attributeKeys[i]]);
        }
    }   

    return el;
}

class Pattern {
    constructor() {
        this.el_container = getElement("div", "", "input-container input-pattern");

        this.el_labelName  = getElement("label");
        this.el_labelStart = getElement("label");
        this.el_labelEnd   = getElement("label");
        this.el_labelStep  = getElement("label");

        this.el_inputName  = getElement("input", "", "name");
        this.el_inputStart = getElement("input", "", "start");
        this.el_inputEnd   = getElement("input", "", "end");
        this.el_inputStep  = getElement("input", "", "step", '{ "value": 1 }');

        this.el_labelName.innerHTML  = "Name: ";
        this.el_labelStart.innerHTML = "Start: ";
        this.el_labelEnd.innerHTML   = "End: ";
        this.el_labelStep.innerHTML  = "Step: ";

        this.el_inputName.disabled  = true;
        this.el_inputStart.disabled = true;
        this.el_inputEnd.disabled   = true;
        this.el_inputStep.disabled  = true;

        this.el_container.appendChild(this.el_labelName);
        this.el_container.appendChild(this.el_inputName);
        this.el_container.appendChild(this.el_labelStart);
        this.el_container.appendChild(this.el_inputStart);
        this.el_container.appendChild(this.el_labelEnd);
        this.el_container.appendChild(this.el_inputEnd);
        this.el_container.appendChild(this.el_labelStep);
        this.el_container.appendChild(this.el_inputStep);
    }

    getContainer() {
        return this.el_container;
    }
}

class QuotaDefinition {
    constructor(id) {
        this.id = id;

        this.el_container = getElement("div", "", "definition");
        this.el_header = getElement("h3");

        this.el_divLabelWrapper = getElement("div", "", "input-container");
        this.el_labelLabel = getElement("label");
        this.el_inputLabel = getElement("input", "", "label");

        this.el_divCellCountWrapper = getElement("div", "", "input-container");
        this.el_labelCellCount = getElement("label");
        this.el_inputCellCount = getElement("input", "", "cellcount", '{ "value": 1 }');

        this.el_divRadioWrapper = getElement("div", "", "input-container radio-container");
        this.el_labelPredefined = getElement("label", "", "",  `{ "for": "type-${this.id}-1" }`);
        this.el_radioPredefined = getElement("input", `type-${this.id}-1`, "predefined-radio");
        this.el_labelPattern = getElement("label", "", "", `{ "for": "type-${this.id}-2" }`);
        this.el_radioPattern = getElement("input", `type-${this.id}-2`, "pattern-radio");

        this.el_divCellNamesWrapper = getElement("div", "", "input-container input-predefined");
        this.el_labelCellNames = getElement("label", "", "",  `{ "for": "type-${this.id}-1" }`);
        this.el_textareaCellNames = getElement("textarea", "", "marker-names");

        this.el_divPatternsWrapper = getElement("div");
        this.el_patterns = []
        this.el_patterns.push(new Pattern());
        this.el_btnPatternCreator = getElement("button", "", "add-pattern");
        this.el_btnPatternCreator2 = getElement("button", "", "add-pattern");

        this.el_divPatternsWrapper.appendChild(this.el_patterns[0].getContainer());

        this.el_divLabelWrapper.appendChild(this.el_labelLabel);
        this.el_divLabelWrapper.appendChild(this.el_inputLabel);

        this.el_divCellCountWrapper.appendChild(this.el_labelCellCount);
        this.el_divCellCountWrapper.appendChild(this.el_inputCellCount);

        this.el_divRadioWrapper.appendChild(this.el_labelPredefined);
        this.el_divRadioWrapper.appendChild(this.el_radioPredefined);
        this.el_divRadioWrapper.appendChild(getElement("br"));
        this.el_divRadioWrapper.appendChild(this.el_labelPattern);
        this.el_divRadioWrapper.appendChild(this.el_radioPattern);

        this.el_divCellNamesWrapper.appendChild(this.el_labelCellNames);
        this.el_divCellNamesWrapper.appendChild(this.el_textareaCellNames);

        this.el_header.innerHTML = `Quota ${this.id}`;
        this.el_textareaCellNames.disabled = true;

        this.el_labelLabel.innerHTML = "Label: ";
        this.el_inputLabel.type = "text";

        this.el_labelCellCount.innerHTML = "Cell count: ";
        this.el_inputCellCount.type = "number";

        this.el_radioPredefined.type = "radio";
        this.el_radioPredefined.name = `marker-type-${this.id}`;

        this.el_radioPattern.type = "radio";
        this.el_radioPattern.name = `marker-type-${this.id}`;

        this.el_labelPredefined.innerHTML = "Predefined";
        this.el_labelPattern.innerHTML = "Pattern";

        this.el_labelCellNames.innerHTML = "Cell names: ";

        this.el_btnPatternCreator.innerHTML = "add pattern";
        this.el_btnPatternCreator2.innerHTML = "add pattern";

        this.el_container.appendChild(this.el_header);
        this.el_container.appendChild(this.el_divLabelWrapper);
        this.el_container.appendChild(this.el_divCellCountWrapper);
        this.el_container.appendChild(this.el_divRadioWrapper);
        this.el_container.appendChild(this.el_divCellNamesWrapper);
        this.el_container.appendChild(this.el_btnPatternCreator);
        this.el_container.appendChild(this.el_divPatternsWrapper);
        this.el_container.appendChild(this.el_btnPatternCreator2);

        const elref_container = this.el_container;
        const elref_divPatternsWrapper = this.el_divPatternsWrapper;
        const elref_patterns = this.el_patterns;

        // this is the way that works, we can check why others didn't work later
        this.el_container.querySelector(".predefined-radio").addEventListener("change", function() {
            elref_container.querySelector(".input-predefined textarea").disabled = false;

            elref_container.querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
                el_input.disabled = true;
            });
        });

        this.el_container.querySelector(".pattern-radio").addEventListener("change", function() {
            elref_container.querySelector(".input-predefined textarea").disabled = true;

            elref_container.querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
                el_input.disabled = false;
            });
        });

        this.el_btnPatternCreator.addEventListener("click", function() {
            elref_patterns.push(new Pattern());
            elref_divPatternsWrapper.appendChild(elref_patterns.at(-1).getContainer());
        });

        this.el_btnPatternCreator2.addEventListener("click", function() {
            elref_patterns.push(new Pattern());
            elref_divPatternsWrapper.appendChild(elref_patterns.at(-1).getContainer());
        });
    }

    getContainer() {
        return this.el_container;
    }

    getQuotaTable() {

    }
}

let nDefinitions = 1;

let quota_json = JSON.parse('[{"name" : "gender x age quota", "cellcount": 1, "items": [{"gender": 2}, {"age" : [2, 8]}]}, {"name" : "region quota", "cellcount": 1, "items": [{"region" : 5}]}, {"name" : "country x csp x cell quota", "cellcount": 2, "items": [{"country": 4}, {"csp" : [0, 9, 3]}, {"cell": 5}]}]');

console.log(quota_json);

const quotas = document.querySelectorAll("#quota-definitions .definition");
const btn_generator = document.querySelectorAll(".quota-generator");

let test_string = [
    {
        "one": 1, 
        "two": 2,
        "items": [{"three": 2}, {"eight" : [2, 4]}]
    },
    {
        "one": 1, 
        "two": 2,
        "items": [{"three": 2}, {"eight" : [2, 4]}]
    }
];

console.log(test_string);
console.log(JSON.stringify(test_string));

btn_generator.forEach(function(btn_generate, index) {
    btn_generate.addEventListener("click", function() {
        console.log("generate");
    });
});

document.querySelectorAll(".add-definition").forEach(function(btn_add, index) { 
    btn_add.addEventListener("click", function () {
        let newdef = new QuotaDefinition(nDefinitions);
        document.querySelector("#quota-definitions").appendChild(newdef.getContainer());

        nDefinitions ++;
    });
});