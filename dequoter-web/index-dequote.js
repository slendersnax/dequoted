class PredefinedMarker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        shadow.innerHTML = `
        <style>
          
        </style>

        <div>
            <label for="predef-markers">predefined markers</label><textarea id="predef-markers"></textarea>
        </div>`;
    }

    get markerList() {
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
                display: flex;
            }

            .pattern-container > * {
                flex: 1;
            }
        </style>

        <div class="pattern-container">
            <div>
                <label for="label">label</label><input type="text" id="label"/>
            </div>
            <div>
                <label for="start">start</label><input type="number" id="start"/>
            </div>
            <div>
                <label for="end">end</label><input type="number" id="end"/>
            </div>
            <div>
                <label for="step">step</label><input type="number" id="step" value="1" />
            </div>
        </div>`;
    }

    get markerList() {
        const shadow = this.shadowRoot;
        const markers = [];
        
        const markerName = shadow.querySelector("#label").value;
        const start = shadow.querySelector("#start").valueAsNumber;
        const end   = shadow.querySelector("#end").valueAsNumber;
        const step  = shadow.querySelector("#step").valueAsNumber;

        for(let i = start; i <= end; i += step) {
            markers.push(`${markerName}_${i}`);
        }

        return markers;
    }
}

customElements.define("pattern-marker", PatternMarker);

class QuotaDefinition extends HTMLElement {
    constructor() {
        super();
        this.sl_id = 1;
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
                    display: flex;
                }

                .quota-wrapper > * {
                    flex: 1;
                }
            </style>

            <section>
                <h3 class="title">Quota #${this.sl_id}</h3>

                <div class="quota-wrapper">
                    <div>
                        <div>
                            <label for="name">name</label>
                            <input type="text" id="name"/>
                        </div>
                        <div>
                            <label for="cell-no">cell number</label>
                            <input type="text" id="cell-no"/>
                        </div>

                        <button class="predefined-adder">add predefined</button>
                        <button class="pattern-adder">add pattern</button>
                        <button class="table-generator">generate quota table</button>

                        <div class="marker-container">
                        </div>
                    </div>
                    <table id="quota-table" border="1">
                    </table>
                </div>
            </section>
        `;

        shadow.querySelector(".pattern-adder").addEventListener("click", function() {
            const newEl = document.createElement("pattern-marker");
            newEl.classList.add("marker");

            shadow.querySelector(".marker-container").appendChild(newEl);
        });

        shadow.querySelector(".predefined-adder").addEventListener("click", function() {
            const newEl = document.createElement("predefined-marker");
            newEl.classList.add("marker");
            
            shadow.querySelector(".marker-container").appendChild(newEl);
        });

        const thisEl = this;

        shadow.querySelector(".table-generator").addEventListener("click", function() {
            thisEl.generateTable();
        });
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
                quotaTable.innerHTML += `<tr>${line}<td>${arrays[currentArray][i]}</td><td>999</td></tr>`;
            }
        }
    }

    generateTable() {
        const shadow = this.shadowRoot;
        const quotaTable  = shadow.querySelector("#quota-table");
        const quotaName   = shadow.querySelector("#name").value;
        const quotaCellNo = shadow.querySelector("#cell-no").value;
        const markers = this.markerList;
        let row = "";

        quotaTable.replaceChildren(); // deletes all children

        for (let i = 0; i < markers.length - 1; i ++) {
            row += "<th>#</th>";
        }

        quotaTable.innerHTML = `<thead><tr><th># cells:${quotaCellNo} = ${quotaName}</th>${row}<th></th></tr></thead>`;

        this.generateLines(quotaTable, markers, 0, "");
    }
}

customElements.define("quota-definiton", QuotaDefinition);

let nCurrentQuotas = 0;

document.querySelectorAll(".add-definition").forEach(function(btn_add, index) { 
    btn_add.addEventListener("click", function () {
        nCurrentQuotas ++;

        let newdef = document.createElement("quota-definiton");
        newdef.setAttribute("sl_id", `${nCurrentQuotas}`);
        document.querySelector("#quota-definitions").appendChild(newdef);
    });
});