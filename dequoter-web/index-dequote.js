// globa :)
let nCurrentQuotas = 0;

// custom elements

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
                align-items: center;
                grid-template-columns: 30% 70%;
                margin-bottom: 4px;
            }

            .predefined-container label {
                margin-right: 4px;
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

                grid-template-columns: 30% 70%;
            }

            .pattern-container > div {
                display: flex;
            }

            .pattern-container > div {
                margin-bottom: 4px;
            }

            div > input { 
                flex: 1;
                min-width: 0;
            }

            div > input:not(:last-child) {
                margin-right: 4px;
            }
        </style>

        <div class="pattern-container">
            <label>label, separator</label>
            <div>
                <input type="text" id="label"/>
                <input type="text" id="separator" value="_"/>
            </div>
            <label>start, end, step</label>
            <div>
                <input type="number" id="start"/>
                <input type="number" id="end"/>
                <input type="number" id="step" value="1" />
            </div>
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
                details {
                    border: 2px solid var(--theme-blue-border);
                    border-radius: 5px;
                    margin: 4px;
                }

                details > * {
                    padding: 5px 10px;
                }

                summary {
                    font-size: 1.3em;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                }

                summary span.caret {
                    font-size: 1.3em;
                    display: inline-block;
                    transform-origin: center 18px;
                }

                summary > span:first-child {
                    flex: 1;
                    text-align: left;
                    cursor: pointer;
                    user-select: none;
                }

                summary > span:last-child {
                    text-align: right;
                }

                details[open] summary {
                    border-bottom: 2px solid var(--theme-blue-border);
                }

                details[open] summary span.caret {
                    transform: rotate(90deg);
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

                button {
                    background-color: var(--theme-blue-button);
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    margin: 4px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                button:hover {
                    background-color: var(--theme-blue-button-hover);
                }

                button.delete {
                    background-color: red;
                }

                button.delete:hover {
                    background-color: rgba(150, 0, 0, 1);
                }

                input, select, textarea {
                    margin: 4px;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            </style>

            <details>
                <summary>
                    <span>
                        <span class="caret">&#9656;</span>
                        Quota #${this.sl_id}
                    </span>
                    <span id="btn-holder">
                        <button class="add-definition">add quota below</button>
                        <button class="delete">delete</button>
                    </span>
                </summary>
                <section>
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
            </details>
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

        shadow.querySelector(".add-definition").addEventListener("click", function() {
            const newDef = getNewDefinition();

            document.querySelector(`[sl_id='${host.sl_id}']`).after(newDef);
        });

        shadow.querySelector(".delete").addEventListener("click", function() {
            host.remove();
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

// main() kinda

function generateQuotasFromJSON() {
    document.querySelector("#quota-definitions").replaceChildren();
    nCurrentQuotas = 0;

    const quotaArr = JSON.parse(document.querySelector("#json-source").value);

    for(let i = 0; i < quotaArr.length; i ++) {
        const newDef = getNewDefinition();
        document.querySelector("#quota-definitions").append(newDef);
        newDef.fillQuota(quotaArr[i].name, quotaArr[i].cell_number, quotaArr[i].markers);
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

function getNewDefinition() {
    nCurrentQuotas ++;

    const newDef = document.createElement("quota-definiton");
    newDef.setAttribute("sl_id", `${nCurrentQuotas}`);

    return newDef;
}

document.querySelectorAll(".add-definition")[0].addEventListener("click", function () {
    const newDef = getNewDefinition();
    document.querySelector("#quota-definitions").prepend(newDef);
});

document.querySelector("#generate-from-json").addEventListener("click", generateQuotasFromJSON);
document.querySelector("#generate-to-json").addEventListener("click", generateJSONFromQuotas); 