// globa :)
let nCurrentQuotas = 0;

// custom elements

class PredefinedMarker extends HTMLElement {
    constructor() {
        super();
        this.sl_id = 1;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        
            this.shadowRoot.innerHTML = `
            <style>
                section {
                    border-bottom: 1px solid var(--theme-blue-border);
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

                .title {
                    padding: 4px 0px;
                    display: flex;
                    align-items: center;
                }

                .title > span:first-child {
                    flex: 1;
                    text-align: left;
                }

                .title > span:last-child {
                    text-align: right;
                }

                .title button {
                    margin: 0px;
                }

                .predefined-container {
                    display: grid;
                    align-items: center;
                    grid-template-columns: 30% 70%;
                    margin-bottom: 4px;
                }

                .predefined-container label {
                    margin-right: 4px;
                }

                input, textarea {
                    margin: 4px;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                textarea {
                    margin-top: 0px;
                    margin-bottom: 0px;
                }
            </style>

            <section>
                <div class="title">
                    <span><b>markers ${this.sl_id}:</b> predefined</span>
                    <span id="btn-holder">
                        <button class="predefined-adder" title="add predefined marker list below">&#128221; below</button>
                        <button class="pattern-adder" title="add pattern marker list below">&#128291; below</button>
                        <button class="delete">delete</button>
                    </span>
                </div>
                <div class="predefined-container">
                    <label for="predef-markers">predefined markers</label>
                    <textarea id="predef-markers" placeholder="region_1 region_8 region49"></textarea>
                </div>
            </section>`;
        }
    }

    static get observedAttributes() {
        return ["sl_id"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[ property ] = newValue;

        this.update();
    }

    update() {
        this.shadowRoot.querySelector(".title > span:first-of-type").innerHTML = `<b>markers ${this.sl_id}:</b> predefined`;
    }

    connectedCallback() {
        // otherwise the this in this.remove() would refer to the element that was query selected :)
        const host = this;

        this.shadowRoot.querySelector(".delete").addEventListener("click", function() {
            host.remove();
        });

        this.shadowRoot.querySelector(".predefined-adder").addEventListener("click", function() {
            console.log("requested markers");

            const markerAddEvent = new CustomEvent("request-markers", {
                bubbles: true,
                detail: { type: "predefined", after: host.sl_id },
            });

            host.dispatchEvent(markerAddEvent);
        });

        this.shadowRoot.querySelector(".pattern-adder").addEventListener("click", function() {
            console.log("requested markers");

            const markerAddEvent = new CustomEvent("request-markers", {
                bubbles: true,
                detail: { type: "pattern", after: host.sl_id },
            });

            host.dispatchEvent(markerAddEvent);
        });
    }

    set predefined(predefinedList) {
        this.shadowRoot.querySelector("#predef-markers").value = predefinedList.join(" ");
    }

    get markerList() {
        return this.shadowRoot.querySelector("#predef-markers").value.split(" ");
    }

    getObj() {
        return this.shadowRoot.querySelector("#predef-markers").value.split(" ");
    }
}

customElements.define("sl-predefined-marker", PredefinedMarker);

class PatternMarker extends HTMLElement {
    constructor() {
        super();
        this.sl_id = 1;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });

            this.shadowRoot.innerHTML = `
            <style>
                section {
                    border-bottom: 1px solid var(--theme-blue-border);
                }

                .pattern-container {
                    display: grid;
                    grid-template-columns: 30% 70%;
                    align-items: center;
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

                .title {
                    padding: 4px 0px;
                    display: flex;
                    align-items: center;
                }

                .title > span:first-child {
                    flex: 1;
                    text-align: left;
                }

                .title > span:last-child {
                    text-align: right;
                }

                .title button {
                    margin: 0px;
                }

                .pattern-container > div {
                    display: flex;
                }

                .pattern-container > div:last-child {
                    margin-bottom: 4px;
                }

                div > input { 
                    flex: 1;
                    min-width: 0;
                }

                div > input:not(:last-child) {
                    margin-right: 4px;
                }

                input, textarea {
                    margin: 4px;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
            </style>

            <section>
                <div class="title">
                    <span><b>markers ${this.sl_id}:</b> pattern</span>
                    <span id="btn-holder">
                        <button class="predefined-adder" title="add predefined marker list below">&#128221; below</button>
                        <button class="pattern-adder" title="add pattern marker list below">&#128291; below</button>
                        <button class="delete">delete</button>
                    </span>
                </div>
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
                </div>
            </section>`;
        }
    }

    static get observedAttributes() {
        return ["sl_id"];
    }

    attributeChangedCallback(property, oldValue, newValue) {
        if (oldValue === newValue) {
            return;
        }

        this[ property ] = newValue;

        this.update();
    }

    update() {
        this.shadowRoot.querySelector(".title > span:first-of-type").innerHTML = `<b>markers ${this.sl_id}:</b> pattern`;
    }

    connectedCallback() {
        const host = this;

        this.shadowRoot.querySelector(".delete").addEventListener("click", function() {
            host.remove();
        });

        this.shadowRoot.querySelector(".predefined-adder").addEventListener("click", function() {
            console.log("requested markers");

            const markerAddEvent = new CustomEvent("request-markers", {
                bubbles: true,
                detail: { type: "predefined", after: host.sl_id },
            });

            host.dispatchEvent(markerAddEvent);
        });

        this.shadowRoot.querySelector(".pattern-adder").addEventListener("click", function() {
            console.log("requested markers");

            const markerAddEvent = new CustomEvent("request-markers", {
                bubbles: true,
                detail: { type: "pattern", after: host.sl_id },
            });

            host.dispatchEvent(markerAddEvent);
        });
    }

    set pattern(patternObj) {
        this.shadowRoot.querySelector("#label").value     = patternObj.label;
        this.shadowRoot.querySelector("#separator").value = patternObj.separator;
        this.shadowRoot.querySelector("#start").value     = patternObj.start;
        this.shadowRoot.querySelector("#end").value       = patternObj.end;
        this.shadowRoot.querySelector("#step").value      = patternObj.step;
    }

    get markerList() {
        const markers = [];
        
        const markerName = this.shadowRoot.querySelector("#label").value;
        const separator  = this.shadowRoot.querySelector("#separator").value;
        const start = this.shadowRoot.querySelector("#start").valueAsNumber;
        const end   = this.shadowRoot.querySelector("#end").valueAsNumber;
        const step  = this.shadowRoot.querySelector("#step").valueAsNumber;

        // TODO: TEST IF WORKS FROM BIG NUM -> SMALL NUM
        for(let i = start; i <= end; i += step) {
            markers.push(`${markerName}${separator}${i}`);
        }

        return markers;
    }

    getObj() {
        return {
            label: this.shadowRoot.querySelector("#label").value,
            separator: this.shadowRoot.querySelector("#separator").value,
            start: this.shadowRoot.querySelector("#start").value,
            end: this.shadowRoot.querySelector("#end").value,
            step: this.shadowRoot.querySelector("#step").value
        };
    }
}

customElements.define("sl-pattern-marker", PatternMarker);

class QuotaDefinition extends HTMLElement {
    #tableInner = "";
    #markerlists = 0;

    constructor() {
        super();
        this.sl_id = 1;
        this.#tableInner = "";
        this.#markerlists = 0;

        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        
            this.shadowRoot.innerHTML = `
                <style>
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

                    input, textarea {
                        margin: 4px;
                        padding: 6px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }

                    details {
                        background: rgba(50, 100, 205, 0.1);
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

                    summary button {
                        margin: 0px;
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

                    .quota-wrapper .quota-attributes {
                        overflow: hidden;
                    }

                    .quota-wrapper .table-wrapper {
                        max-height: 450px;
                        overflow: scroll;
                    }

                    .quota-wrapper .quota-attributes .title-attributes {
                        display: grid;

                        grid-template-columns: 30% 70%;
                        align-items: center;
                    }

                    .quota-wrapper .quota-attributes button:first-of-type {
                        margin-left: 0px;
                    }

                    .quota-wrapper .quota-attributes .marker-container {
                        overflow: scroll;
                        max-height: 250px;
                    }

                    .quota-wrapper .command-btns {
                        display: flex;    
                    }

                    .quota-wrapper .command-btns > * {
                        flex: 1;
                    }

                    .table-wrapper {
                        display: flex;
                        justify-content: space-around;
                    }

                    .table-wrapper table {
                        background-color: #fcfcfc;
                        border: 0.5px solid var(--theme-blue-border);
                        border-collapse: collapse;
                    }

                    .table-wrapper table * {
                        border: 0.5px solid var(--theme-blue-border);
                    }

                    table tr:nth-child(even) {
                        background-color: #f1f1f1;
                    }
                </style>

                <details>
                    <summary>
                        <span>
                            <span class="caret">&#9656;</span>
                            <span class="quota-title">Quota #${this.sl_id}</span>
                        </span>
                        <span class="btn-holder">
                            <button class="add-definition">add quota below</button>
                            <button class="delete">delete</button>
                        </span>
                    </summary>
                    <section>
                        <div class="quota-wrapper">
                            <div class="quota-attributes">
                                <div class="title-attributes">
                                    <label for="name">name</label>
                                    <input type="text" id="name"/>

                                    <label for="cell-no">cells</label>
                                    <input type="number" id="cell-no" value="1"/>

                                    <label for="limit">limit</label>
                                    <input type="text" id="limit" value="inf"/>
                                </div>

                                <div class="command-btns">
                                    <button class="table-generator">&#9881; generate table</button>
                                    <button class="table-copy-btn">copy quota table</button>
                                </div>

                                <div class="command-btns">
                                    <button class="predefined-adder" title="add predefined marker list at the start">+ &#128221; start</button>
                                    <button class="predefined-adder" title="add predefined marker list at the end">+ &#128221; end</button>
                                    <button class="pattern-adder" title="add pattern marker list at the start">+ &#128291; start</button>
                                    <button class="pattern-adder" title="add pattern marker list at the end">+ &#128291; end</button>
                                </div>

                                <div class="marker-container">
                                </div>
                            </div>
                            <div class="table-wrapper">
                                <table id="quota-table">
                                </table>
                            </div>
                        </div>
                    </section>
                </details>
            `;
        }
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

        this.update();
    }

    update() {
        this.shadowRoot.querySelector(".quota-title").innerHTML = `Quota #${this.sl_id}`;
    }

    /*
    This function is called when the Web Component is appended to a Document Object Model. 
    It should run any required rendering.
    */
    connectedCallback() {
        const host = this;

        this.shadowRoot.querySelectorAll(".pattern-adder")[0].addEventListener("click", function() {
            const newEl = host.getNewPattern(null);

            host.shadowRoot.querySelector(".marker-container").prepend(newEl);
        });

        this.shadowRoot.querySelectorAll(".pattern-adder")[1].addEventListener("click", function() {
            const newEl = host.getNewPattern(null);

            host.shadowRoot.querySelector(".marker-container").appendChild(newEl);
        });

        this.shadowRoot.querySelectorAll(".predefined-adder")[0].addEventListener("click", function() {
            const newEl = host.getNewPredefined(null);

            host.shadowRoot.querySelector(".marker-container").prepend(newEl);
        });

        this.shadowRoot.querySelectorAll(".predefined-adder")[1].addEventListener("click", function() {
            const newEl = host.getNewPredefined(null);

            host.shadowRoot.querySelector(".marker-container").appendChild(newEl);
        });

        this.shadowRoot.querySelector(".table-generator").addEventListener("click", function() {
            host.generateTable();
        });

        this.shadowRoot.querySelector(".table-copy-btn").addEventListener("click", function() {
            const quotaTable = host.shadowRoot.querySelector("#quota-table");
   
            let range = document.createRange();  
            range.selectNode(quotaTable);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);

            document.execCommand("copy");

            alert(`Table ${host.sl_id} has been copied to the clipboard.`);
        });

        this.shadowRoot.querySelector(".add-definition").addEventListener("click", function() {
            const newDef = getNewDefinition();

            document.querySelector(`[sl_id='${host.sl_id}']`).after(newDef);
        });

        this.shadowRoot.querySelector(".delete").addEventListener("click", function() {
            host.remove();
        });

        this.shadowRoot.addEventListener("request-markers", function(e) {
            let newEl;

            if (e.detail.type == "predefined") {
                newEl = host.getNewPredefined(null);
            }
            else {
                newEl = host.getNewPattern(null);
            }

            host.shadowRoot.querySelector(`[sl_id='${e.detail.after}']`).after(newEl);
        });
    }

    getNewPredefined(predefinedMarkers) {
        this.#markerlists ++;

        const newEl = document.createElement("sl-predefined-marker");
        newEl.classList.add("marker");
        newEl.setAttribute("sl_id", `${this.#markerlists}`);

        if (predefinedMarkers != null) {
            newEl.predefined = predefinedMarkers;
        }

        return newEl;
    }

    getNewPattern(patternMarker) {
        this.#markerlists ++;

        const newEl = document.createElement("sl-pattern-marker");
        newEl.classList.add("marker");
        newEl.setAttribute("sl_id", `${this.#markerlists}`);

        if (patternMarker != null) {
            newEl.pattern = patternMarker;
        }

        return newEl;
    }

    fillQuota(name, cells, limit, markerArr) {
        const host = this;

        this.shadowRoot.querySelector("#name").value = name;
        this.shadowRoot.querySelector("#cell-no").value = cells;
        this.shadowRoot.querySelector("#limit").value = limit;

        for(let i = 0; i < markerArr.length; i ++) {
            let newEl;

            if (Array.isArray(markerArr[i])) {
                newEl = this.getNewPredefined(markerArr[i]);
            }
            else {
                newEl = this.getNewPattern(markerArr[i]);
            }

            this.shadowRoot.querySelector(".marker-container").appendChild(newEl);
        }
    } 

    get markerList() {
        const markerElements = this.shadowRoot.querySelectorAll(".marker");
        const markers = [];

        for (let i = 0; i < markerElements.length; i ++) {
            markers.push(markerElements[i].markerList);
        }

        return markers;
    }

    generateLines(arrays, currentArray, line) {
        const host = this;

        for(let i = 0; i < arrays[currentArray].length; i ++) {
            if (currentArray < arrays.length - 1) {
                host.generateLines(arrays, currentArray + 1, `${line}<td>${arrays[currentArray][i]}</td>`);
            }
            else {
                host.#tableInner += `<tr>${line}<td>${arrays[currentArray][i]}</td><td>${host.shadowRoot.querySelector("#limit").value}</td></tr>`;
            }
        }
    }

    generateTable() {
        const quotaTable  = this.shadowRoot.querySelector("#quota-table");
        const quotaName   = this.shadowRoot.querySelector("#name").value;
        const quotaCellNo = this.shadowRoot.querySelector("#cell-no").value;
        const markers = this.markerList;
        let headerRow = "";
        this.#tableInner = "";

        // deletes current quota table
        quotaTable.replaceChildren();

        for (let i = 0; i < markers.length - 1; i ++) {
            headerRow += "<td>#</td>";
        }

        this.generateLines(markers, 0, "");

        quotaTable.innerHTML = `<tr><td># cells:${quotaCellNo} = ${quotaName}</td>${headerRow}<td></td></tr>${this.#tableInner}`;
    }

    getObj() {
        const host = this;

        const markerElements = this.shadowRoot.querySelectorAll(".marker");
        const marker_arrs = [];

        for (let i = 0; i < markerElements.length; i ++) {
            marker_arrs.push(markerElements[i].getObj());
        }

        return {
            name: this.shadowRoot.querySelector("#name").value,
            cells: this.shadowRoot.querySelector("#cell-no").value,
            limit: this.shadowRoot.querySelector("#limit").value,
            markers: marker_arrs
        };
    }
}

customElements.define("sl-quota-definiton", QuotaDefinition);

// main() kinda

function generateQuotasFromJSON() {
    document.querySelector("#quota-definitions").replaceChildren();
    nCurrentQuotas = 0;

    const quotaArr = JSON.parse(document.querySelector("#json-source").value);

    for(let i = 0; i < quotaArr.length; i ++) {
        const newDef = getNewDefinition();
        document.querySelector("#quota-definitions").append(newDef);
        newDef.fillQuota(quotaArr[i].name, quotaArr[i].cells, quotaArr[i].limit, quotaArr[i].markers);
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

    const newDef = document.createElement("sl-quota-definiton");
    newDef.setAttribute("sl_id", `${nCurrentQuotas}`);

    return newDef;
}

document.querySelector(".add-definition-start").addEventListener("click", function () {
    const newDef = getNewDefinition();
    document.querySelector("#quota-definitions").prepend(newDef);
});

document.querySelector(".add-definition-end").addEventListener("click", function () {
    const newDef = getNewDefinition();
    document.querySelector("#quota-definitions").appendChild(newDef);
});

document.querySelector("#generate-from-json").addEventListener("click", generateQuotasFromJSON);
document.querySelector("#generate-to-json").addEventListener("click", generateJSONFromQuotas); 