/**
 * Classe che modella le informazioni essenziali di un example
 */
class Example {
    constructor(id, inputType, inputValue, tags = []) {
        this._id = id;
        this._inputType = inputType;
        this._inputValue = inputValue;
        this._tags = tags;

        this.render();
    }

    // getters/setters
    get id() { return this._id; }
    get inputType() { return this._inputType; }
    get inputValue() { return this._inputValue; }
    
    get tags() { return this._tags; }
    set tags(tags) { this._tags = tags; }

    // Data Transfer Object: oggetto adatto ad essere spedito in rete
    toDTO() {
        return {
            id: this._id,
            inputType: this._inputType,
            inputValue: this._inputValue,
            tags: this._tags
        };
    }

    /**
     * Metodo che costruisce e restituisce la card html per l'example corrente
     */
    createExampleCard() {
        // Modifico alcuni opportuni elementi del template (già caricato nel documento HTML, ed avente id="example-content"),
        // per personalizzarli con quelli dell'example corrente

        // id
        let cardNode = document.getElementById("example-content");
        cardNode.setAttribute("id", "example-content" + "-" + this._id); // e.g.: example-content-0

        // inputType
        let cardNodeInputType = cardNode.querySelector('.example-inputType');
        cardNodeInputType.innerText = this._inputType;

        // inputType
        let cardNodeInputValue = cardNode.querySelector('.example-inputValue');
        cardNodeInputValue.innerText = this._inputValue;
        
        return cardNode;
    }

    /**
     * Rendering grafico di un example
     */
    render() {
        // Identifico il div esterno contenente tutti gli examples
        let examplesDiv = document.getElementById("external-examples-div");
        
        // Identifico il template del generico example
        let exampleTemplate = document.querySelector('script#example-card-template');

        // Definisco la card html dell'example, e la inserisco nel div degli examples
        examplesDiv.innerHTML += exampleTemplate.innerText; 
        let cardNode = this.createExampleCard();
        examplesDiv.appendChild(cardNode);
    }
    
    /**
     * Gestione dei listeners associati ai bottoni della card dell'example
     */
    handleListeners() {
        // // Card del progetto
        // let cardNode = document.querySelector("#card-content-"+this._id);

        // let id = this._id; // Salvo l'id per effettuare successivamente la closure, nei listener
        
        // // Listener sul bottone di view della card
        // let btnViewProject = cardNode.querySelector(".btn-view-project");
        // btnViewProject.addEventListener("click", 
        //     function() {
        //         console.log("Viewing project n. " + id); // closure
        //         createViewProjectPage(id);
        //     }
        // );
        
        // // Listener sul bottone di eliminazione della card
        // let btnDeleteProject = cardNode.querySelector(".btn-delete-project");
        // btnDeleteProject.addEventListener("click", 
        //     function() {
        //         console.log("Deleting project n. " + id); // closure
        //         deleteProject(id);
        //     }
        // );
    }
}



// /**
//  * Classe che modella le informazioni essenziali di un tag
//  */
// class Tag {
//     constructor(tagName, tagValues = []) {
//         this._tagName = tagName;
//         this._tagValues = tagValues;
//         this.render();
//     }

//     // getters/setters
//     get id() { return this._id; }
//     get inputType() { return this._inputType; }
//     get inputValue() { return this._inputValue; }
    
//     get tags() { return this._tags; }
//     set tags(tags) { this._tags = tags; }

//     // Data Transfer Object: oggetto adatto ad essere spedito in rete
//     toDTO() {
//         return {
//             id: this._id,
//             inputType: this._inputType,
//             inputValue: this._inputValue,
//             tags: this._tags
//         };
//     }

//     /**
//      * Metodo che costruisce e restituisce la card html per l'example corrente
//      */
//     createExampleCard() {
//         // Modifico alcuni opportuni elementi del template (già caricato nel documento HTML, ed avente id="example-content"),
//         // per personalizzarli con quelli dell'example corrente

//         // id
//         let cardNode = document.getElementById("example-content");
//         cardNode.setAttribute("id", "example-content" + "-" + this._id); // e.g.: example-content-0

//         // inputType
//         let cardNodeInputType = cardNode.querySelector('.example-inputType');
//         cardNodeInputType.innerText = this._inputType;

//         // inputType
//         let cardNodeInputValue = cardNode.querySelector('.example-inputValue');
//         cardNodeInputValue.innerText = this._inputValue;
        
//         return cardNode;
//     }

//     /**
//      * Rendering grafico di un example
//      */
//     render() {
//         // Identifico il div esterno contenente tutti gli examples
//         let examplesDiv = document.getElementById("external-examples-div");
        
//         // Identifico il template del generico example
//         let exampleTemplate = document.querySelector('script#example-card-template');

//         // Definisco la card html dell'example, e la inserisco nel div degli examples
//         examplesDiv.innerHTML += exampleTemplate.innerText; 
//         let cardNode = this.createExampleCard();
//         examplesDiv.appendChild(cardNode);
//     }
    
//     /**
//      * Gestione dei listeners associati ai bottoni della card dell'example
//      */
//     handleListeners() {
//         // // Card del progetto
//         // let cardNode = document.querySelector("#card-content-"+this._id);

//         // let id = this._id; // Salvo l'id per effettuare successivamente la closure, nei listener
        
//         // // Listener sul bottone di view della card
//         // let btnViewProject = cardNode.querySelector(".btn-view-project");
//         // btnViewProject.addEventListener("click", 
//         //     function() {
//         //         console.log("Viewing project n. " + id); // closure
//         //         createViewProjectPage(id);
//         //     }
//         // );
        
//         // // Listener sul bottone di eliminazione della card
//         // let btnDeleteProject = cardNode.querySelector(".btn-delete-project");
//         // btnDeleteProject.addEventListener("click", 
//         //     function() {
//         //         console.log("Deleting project n. " + id); // closure
//         //         deleteProject(id);
//         //     }
//         // );
//     }
// }

/**
 * Aggiunta di un example
 */
function addExample(id, inputType, inputValue) {
    console.log("Adding example n. " + id);

    let currentExample = new Example(id, inputType, inputValue);
    examples.push(currentExample);
}

/**
 * Rimozione di un progetto
 */
function deleteExample(id){
    // Inserisco l'id del progetto nell'elemento span più interno della modal
    document.querySelector("#id-project-to-be-deleted").innerText = id;

    // Mostro la modal
    $('#deleteModal').modal('show');

    // TODO: Listener sul bottone "Yes, I'm sure", e conseguente eliminazione dal DB
}

/**
 * Creazione della pagina di vista di un progetto (con tutti i suoi examples)
 */
function createViewProjectPage(id) {
    /* CREAZIONE ELEMENT FISSI */
    // Creo il bottone dell'utente nella navbar, in alto a destra
    let navbarContent = document.getElementById("id-navbar");
    let navbarNickHTML = document.querySelector("script#navbar-nickname").textContent;

    navbarContent.innerHTML += navbarNickHTML;

    // Creo il jumbotron esterno del progetto attuale
    let jumbotronProject = document.createElement("div");
    jumbotronProject.setAttribute("class", "jumbotron jumbotron-fluid")
    jumbotronProject.innerHTML = document.querySelector("script#project-jumbotron-template").textContent;

    // Appendo al div principale della pagina il nuovo div contenente il jumbotron del progetto attuale
    variableContent.appendChild(jumbotronProject);
    // variableContent.innerHTML += jumbotronProject.innerHTML;

    // Creo la finestra modale per l'eliminazione dell'example
    let deleteExampleModalHTML = document.querySelector('script#delete-example-card-modal').innerText;
    variableContent.innerHTML += deleteExampleModalHTML;

    /* CREAZIONE ELEMENTI VARIABILI (CARD DEGLI EXAMPLE) */
    // La card non andrà inserita direttamente nel jumbotron:
    // Creo infatti un div esterno che conterrà tutte le card degli examples

    let examplesDiv = document.createElement("div");
    examplesDiv.setAttribute("class", "card collection-card");
    examplesDiv.setAttribute("style", "width: 100%")
    examplesDiv.setAttribute("id", "external-examples-div");
    
    // Inserisco il div degli examples subito dopo l'hr dell'header del jumbotron (JQuery per comodità)
    $(examplesDiv).insertAfter(document.getElementById("hr-jumbotron-template"));
    
    // Creo N examples di esempio di tipo testuale, e li inserisco nel div
    // let N = 20;
    // for(let i = 0; i < N; ++i) {
    //     let exampleCardTemplate = document.createElement("div");
    //     exampleCardTemplate.innerHTML = document.querySelector('script#example-card-template').innerText;
        
    //     examplesDiv.appendChild(exampleCardTemplate);
    //     console.log("ok");
    // }

    let N = 20;
    for(let i = 0; i < N; ++i) {
        let tags = 
        addExample(i, 
            "[TEXT]",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore blanditiis qui possimus, praesentium magni accusantium eveniet reiciendis aliquam et repudiandae dolores, esse debitis natus, provident itaque impedit inventore rem! Alias"
            
        );
    }
}