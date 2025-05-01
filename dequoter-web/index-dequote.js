let nCurrentQuotas = 0;

class PredefinedMarker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
        <style>
            .predefined-container {
                display: grid;

                grid-template-columns: 25% 40%;
            }
        </style>

        <div class="predefined-container">
            <label for="predef-markers">predefined markers</label><textarea id="predef-markers"></textarea>
        </div>`;
    }

    set predefined(predefinedList) {
        const shadow = this.shadowRoot;

        shadow.querySelector("#predef-markers").value = predefinedList.join(" ");
    }

    get markerList() {
        const shadow = this.shadowRoot;

        return shadow.querySelector("#predef-markers").value.split(" ");
    }

    getObj() {
        const shadow = this.shadowRoot;

        return shadow.querySelector("#predef-markers").value.split(" ");
    }
}

customElements.define("predefined-marker", PredefinedMarker);

class PatternMarker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
        <style>
            .pattern-container {
                display: grid;

                grid-template-columns: 25% 40%;
            }
        </style>

        <div class="pattern-container">
            <label for="label">label</label><input type="text" id="label"/>
            <label for="separator">separator</label><input type="text" id="separator" value="_"/>
            <label for="start">start</label><input type="number" id="start"/>
            <label for="end">end</label><input type="number" id="end"/>
            <label for="step">step</label><input type="number" id="step" value="1" />
        </div>`;
    }

    set pattern(patternObj) {
        const shadow = this.shadowRoot;

        shadow.querySelector("#label").value     = patternObj.label;
        shadow.querySelector("#separator").value = patternObj.separator;
        shadow.querySelector("#start").value     = patternObj.start;
        shadow.querySelector("#end").value       = patternObj.end;
        shadow.querySelector("#step").value      = patternObj.step;
    }

    get markerList() {
        const shadow = this.shadowRoot;
        const markers = [];
        
        const markerName = shadow.querySelector("#label").value;
        const separator  = shadow.querySelector("#separator").value;
        const start = shadow.querySelector("#start").valueAsNumber;
        const end   = shadow.querySelector("#end").valueAsNumber;
        const step  = shadow.querySelector("#step").valueAsNumber;

        // TODO: TEST IF WORKS FROM BIG NUM -> SMALL NUM
        for(let i = start; i <= end; i += step) {
            markers.push(`${markerName}${separator}${i}`);
        }

        return markers;
    }

    getObj() {
        const shadow = this.shadowRoot;

        return {
            label: shadow.querySelector("#label").value,
            separator: shadow.querySelector("#separator").value,
            start: shadow.querySelector("#start").value,
            end: shadow.querySelector("#end").value,
            step: shadow.querySelector("#step").value
        };
    }
}

customElements.define("pattern-marker", PatternMarker);

class QuotaDefinition extends HTMLElement {
    constructor() {
        super();
        this.sl_id = 1;
        this.tableInner = "";
    }

    static get observedAttributes() {
        return ["sl_id"];
    }

    /*
    Called whenever an observed attribute is changed. 
    Those defined in HTML are passed immediately, but JavaScript can modify them. (via .setAttribute())
    The method may need to trigger a re-render when this occurs.
    */
    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[ property ] = newValue;
    }

    /*
    This function is called when the Web Component is appended to a Document Object Model. 
    It should run any required rendering.
    */
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        
        shadow.innerHTML = `
            <style>
                section {
                    border-bottom: 1px solid #000;
                }

                .quota-wrapper {
                    width: 100%;
                    
                    display: grid;
                    
                    grid-template-columns: 50% 50%;
                }

                .quota-wrapper > * {
                    max-height: 400px;
                    overflow: scroll;
                }

                .quota-attributes .title-attributes {
                    display: grid;

                    grid-template-columns: 25% 40%;
                }
            </style>

            <section>
                <h3 class="title">Quota #${this.sl_id}</h3>

                <div class="quota-wrapper">
                    <div class="quota-attributes">
                        <div class="title-attributes">
                            <label for="name">name</label><input type="text" id="name"/>

                            <label for="cell-no">cell number</label><input type="text" id="cell-no"/>
                        </div>

                        <button class="predefined-adder">add predefined</button>
                        <button class="pattern-adder">add pattern</button>
                        <button class="table-generator">generate quota table</button>

                        <div class="marker-container">
                        </div>
                    </div>
                    <div class="table-wrapper">
                        <table id="quota-table" border="1">
                        </table>
                    </div>
                </div>
            </section>
        `;

        const host = this;

        shadow.querySelector(".pattern-adder").addEventListener("click", function() {
            host.addNewPattern(null);
        });

        shadow.querySelector(".predefined-adder").addEventListener("click", function() {
            host.addNewPredefined(null);
        });

        shadow.querySelector(".table-generator").addEventListener("click", function() {
            host.generateTable();
        });
    }

    addNewPredefined(predefinedMarkers) {
        const shadow = this.shadowRoot;

        const newEl = document.createElement("predefined-marker");
        newEl.classList.add("marker");
            
        shadow.querySelector(".marker-container").appendChild(newEl);

        if (predefinedMarkers != null) {
            newEl.predefined = predefinedMarkers;
        }
    }

    addNewPattern(patternMarker) {
        const shadow = this.shadowRoot;

        const newEl = document.createElement("pattern-marker");
        newEl.classList.add("marker");

        shadow.querySelector(".marker-container").appendChild(newEl);

        if (patternMarker != null) {
            newEl.pattern = patternMarker;
        }
    }

    fillQuota(name, cell_number, markerArr) {
        const shadow = this.shadowRoot;
        const host = this;

        shadow.querySelector("#name").value = name;
        shadow.querySelector("#cell-no").value = cell_number;

        for(let i = 0; i < markerArr.length; i ++) {
            if (Array.isArray(markerArr[i])) {
                host.addNewPredefined(markerArr[i]);
            }
            else {
                host.addNewPattern(markerArr[i]);
            }
        }
    } 

    get markerList() {
        const shadow = this.shadowRoot;
        const markerElements = shadow.querySelectorAll(".marker");
        const markers = [];

        for (let i = 0; i < markerElements.length; i ++) {
            markers.push(markerElements[i].markerList);
        }

        return markers;
    }

    generateLines(quotaTable, arrays, currentArray, line) {
        const host = this;

        for(let i = 0; i < arrays[currentArray].length; i ++) {
            if (currentArray < arrays.length - 1) {
                host.generateLines(quotaTable, arrays, currentArray + 1, `${line}<td>${arrays[currentArray][i]}</td>`);
            }
            else {
                host.tableInner += `<tr>${line}<td>${arrays[currentArray][i]}</td><td>999</td></tr>`;
            }
        }
    }

    generateTable() {
        const shadow = this.shadowRoot;
        const quotaTable  = shadow.querySelector("#quota-table");
        const quotaName   = shadow.querySelector("#name").value;
        const quotaCellNo = shadow.querySelector("#cell-no").value;
        const markers = this.markerList;
        let headerRow = "";
        this.tableInner = "";

        quotaTable.replaceChildren();

        for (let i = 0; i < markers.length - 1; i ++) {
            headerRow += "<th>#</th>";
        }

        this.generateLines(quotaTable, markers, 0, "");

        quotaTable.innerHTML = `<tr><td># cells:${quotaCellNo} = ${quotaName}</td>${headerRow}<td></td></tr>${this.tableInner}`;
    }

    getObj() {
        const shadow = this.shadowRoot;

        const markerElements = shadow.querySelectorAll(".marker");
        const marker_arrs = [];

        for (let i = 0; i < markerElements.length; i ++) {
            marker_arrs.push(markerElements[i].getObj());
        }

        return {
            name: shadow.querySelector("#name").value,
            cell_number: shadow.querySelector("#cell-no").value,
            markers: marker_arrs
        };
    }
}

customElements.define("quota-definiton", QuotaDefinition);

function generateQuotasFromJSON() {
    document.querySelector("#quota-definitions").replaceChildren();

    const quotaArr = JSON.parse(document.querySelector("#json-source").value);

    for(let i = 0; i < quotaArr.length; i ++) {
        nCurrentQuotas ++;

        let newdef = document.createElement("quota-definiton");

        document.querySelector("#quota-definitions").appendChild(newdef);

        newdef.setAttribute("sl_id", `${nCurrentQuotas}`);
        newdef.fillQuota(quotaArr[i].name, quotaArr[i].cell_number, quotaArr[i].markers);
    }
}

function generateJSONFromQuotas() {
    const quotas = document.querySelector("#quota-definitions").children;
    const quotaArr = [];

    for(let i = 0; i < quotas.length; i ++) {
        quotaArr.push(quotas[i].getObj());
    }

    document.querySelector("#json-result").value = JSON.stringify(quotaArr);
}

document.querySelectorAll(".add-definition").forEach(function(btn_add, index) { 
    btn_add.addEventListener("click", function () {
        nCurrentQuotas ++;

        let newdef = document.createElement("quota-definiton");
        newdef.setAttribute("sl_id", `${nCurrentQuotas}`);
        document.querySelector("#quota-definitions").appendChild(newdef);
    });
});

document.querySelector("#generate-from-json").addEventListener("click", generateQuotasFromJSON);
document.querySelector("#generate-to-json").addEventListener("click", generateJSONFromQuotas); 