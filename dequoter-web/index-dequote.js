class PredefinedMarker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "closed" });

        shadow.innerHTML = `
        <style>
          
        </style>

        <div>
            <label for="predef-markers">predefined markers</label><textarea id="predef-markers"></textarea>
        </div>`;
    }
}

customElements.define("predefined-marker", PredefinedMarker);

class PatternMarker extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "closed" });

        shadow.innerHTML = `
        <style>
          
        </style>

        <div>
            <label for="label">label</label><input type="text" id="label"/>
            <label for="start">start</label><input type="number" id="start"/>
            <label for="end">end</label><input type="number" id="end"/>
            <label for="step">step</label><input type="number" id="step" value="1" />
        </div>`;
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
        const shadow = this.attachShadow({ mode: "closed" });
        
        shadow.innerHTML = `
            <section>
                <h3 id="title">Quota #${this.sl_id}</h3>
                <div>
                    <label for="name">name</label>
                    <input type="text" id="name"/>
                </div>
                <div>
                    <label for="cell-no">cell number</label>
                    <input type="text" id="cell-no"/>
                </div>

                <button id="predefined-adder">add predefined</button>
                <button id="pattern-adder">add pattern</button>

                <div id="marker-container">
                </div>
            </section>
        `;

        shadow.querySelector("#pattern-adder").addEventListener("click", function() {
            shadow.querySelector("#marker-container").appendChild(document.createElement("pattern-marker"));
        });

        shadow.querySelector("#predefined-adder").addEventListener("click", function() {
            shadow.querySelector("#marker-container").appendChild(document.createElement("predefined-marker"));
        });
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