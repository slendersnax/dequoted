class Pattern {
    constructor() {
        this.el_container = document.createElement("div", { class: "pattern" });

        this.el_nameInput  = document.createElement("input", { type: "text", class: "name" });
        this.el_startInput = document.createElement("input", { type: "number", class: "start" });
        this.el_endInput   = document.createElement("input", { type: "number", class: "end" });
        this.el_stepInput  = document.createElement("input", { type: "number", class: "step" });

        this.el_nameInput.disabled = true;
        this.el_startInput.disabled = true;
        this.el_endInput.disabled = true;
        this.el_stepInput.disabled = true;

        this.el_container.classList.add("pattern");

        this.el_container.appendChild(this.el_nameInput);
        this.el_container.appendChild(this.el_startInput);
        this.el_container.appendChild(this.el_endInput);
        this.el_container.appendChild(this.el_stepInput);
    }

    getContainer() {
        return this.el_container;
    }
}

/*
                <h3>Quota 1</h3>

                <div class="input-container">
                    <label for="name-1">Label:</label>
                    <input type="text" id="name-1"/>
                </div>

                <div class="input-container">
                    <label for="cellcount-1">Cell count:</label>
                    <input type="number" id="cellcount-1"/>
                </div>
                
                <div class="input-container">
                    <label for="series-type-1-1">Predefined</label>
                    <input type="radio" name="series-type-1" id="series-type-1-1" class="predefined-radio">

                    <label for="series-type-1-2">Pattern</label>
                    <input type="radio" name="series-type-1" id="series-type-1-2" class="pattern-radio">
                </div>

                <div class="input-container input-predefined">
                    <label for="cell-names">Cell definitions (separated by space)</label>
                    <textarea id="cell-names" name="cell-names" disabled></textarea>
                </div>
*/

class QuotaDefinition {
    constructor(id) {
        this.id = id;

        this.el_container = document.createElement("div");

        this.el_header = document.createElement("h3");

        this.el_labelInput = document.createElement("input");
        this.el_cellCountInput = document.createElement("input");

        this.el_predefinedRadio = document.createElement("input", { type: "radio", class: "predefined-radio", name: `marker-type-${this.id}`, id: `type-${this.id}-1` });
        this.el_patternRadio = document.createElement("input", { type: "radio", class: "pattern-radio", name: `marker-type-${this.id}`, id: `type-${this.id}-2` });

        this.el_predefinedLabel = document.createElement("label", { for: `type-${this.id}-1` });
        this.el_patternLabel = document.createElement("label", { for: `type-${this.id}-2` });

        this.el_cellNamesTextarea = document.createElement("textarea", { class: "marker-names" });

        this.el_pattern = new Pattern();

        this.el_header.innerHTML = `Quota ${this.id}`;
        this.el_cellNamesTextarea.disabled = true;

        this.el_labelInput.type = "text";
        this.el_labelInput.className = "label";

        this.el_cellCountInput.type = "number";
        this.el_cellCountInput.className = "cellcount";

        this.el_predefinedRadio.type = "radio";
        this.el_predefinedRadio.className = "predefined-radio";
        this.el_predefinedRadio.name = `marker-type-${this.id}`;
        this.el_predefinedRadio.id = `type-${this.id}-1`;

        this.el_patternRadio.type = "radio";
        this.el_patternRadio.className = "pattern-radio";
        this.el_patternRadio.name = `marker-type-${this.id}`;
        this.el_patternRadio.id = `type-${this.id}-2`;

        this.el_predefinedLabel.innerHTML = "Predefined";
        this.el_predefinedLabel.setAttribute("for", `type-${this.id}-1`);
        this.el_patternLabel.innerHTML = "Pattern";
        this.el_patternLabel.setAttribute("for", `type-${this.id}-2`);

        this.el_container.appendChild(this.el_header);
        this.el_container.appendChild(this.el_labelInput);
        this.el_container.appendChild(this.el_cellCountInput);
        this.el_container.appendChild(this.el_predefinedLabel);
        this.el_container.appendChild(this.el_predefinedRadio);
        this.el_container.appendChild(this.el_patternLabel);
        this.el_container.appendChild(this.el_patternRadio);
        this.el_container.appendChild(this.el_cellNamesTextarea);
        this.el_container.appendChild(this.el_pattern.getContainer());
    }

    getContainer() {
        return this.el_container;
    }
}

let nDefinitions = 1;

let quota_json = JSON.parse('[{"name" : "gender x age quota", "cellcount": 1, "items": [{"gender": 2}, {"age" : [2, 8]}]}, {"name" : "region quota", "cellcount": 1, "items": [{"region" : 5}]}, {"name" : "country x csp x cell quota", "cellcount": 2, "items": [{"country": 4}, {"csp" : [0, 9, 3]}, {"cell": 5}]}]');

console.log(quota_json);

const quotas = document.querySelectorAll("#quota-definitions .definition");
const btn_generator = document.querySelector("#quota-generator");
let quota_definitions = document.querySelectorAll(".definition").length;

console.log(quota_definitions);

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

for (let i = 0; i < quotas.length; i ++) {
    // this only fires for radio buttons if they are selected, not unselected
    quotas[i].querySelector(".predefined-radio").addEventListener("change", function() {
        quotas[i].querySelector(".input-predefined textarea").disabled = false;

        quotas[i].querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
            el_input.disabled = true;
        });
    });

    quotas[i].querySelector(".pattern-radio").addEventListener("change", function() {
        quotas[i].querySelector(".input-predefined textarea").disabled = true;

        quotas[i].querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
            el_input.disabled = false;
        });
    });
}

// enables or disabled the predetermined / pattern inputs when page is loaded
window.addEventListener("load", function() {
    for (let i = 0; i < quotas.length; i ++) {
    
        if (quotas[i].querySelector(".predefined-radio").checked) {
            quotas[i].querySelector(".input-predefined textarea").disabled = false;

            quotas[i].querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
                el_input.disabled = true;
            });
        }

        else if (quotas[i].querySelector(".pattern-radio").checked) {
            quotas[i].querySelector(".input-predefined textarea").disabled = true;

            quotas[i].querySelectorAll(".input-pattern input").forEach(function(el_input, index) {
                el_input.disabled = false;
            });
        }
    }

    let el = document.createElement("div");
    el.classList.add("artificial");

    document.body.appendChild(el);

    let elkid = document.createElement("span");
    elkid.style.color = "red";
    elkid.innerHTML = "ARTIFICAL SPAN";

    el.appendChild(elkid);
});

btn_generator.addEventListener("click", function() {
    console.log("generate");
});

document.querySelector("#add-definition").addEventListener("click", function () {
    let newdef = new QuotaDefinition(nDefinitions);
    document.body.appendChild(newdef.getContainer());

    nDefinitions ++;
});