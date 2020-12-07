/**
 * Classe che modella le informazioni essenziali di un example
 */
class Example {
    constructor(id, inputType, inputValue, tags = []) {
        this._id = id;
        this._inputType = inputType;
        this._inputValue = inputValue;
        // [
        //   {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
        //   {"tagName": "colors", "tagValues": ["brown", "black"]}
        // ]
        this._tags = tags;
        // for(let i = 0; i < tags.length; ++i)
        //     this._tags.push(tags[i]);

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
        
        // div che indica la fine del contenuto dell'example, e l'inizio dei tags
        let tagsDiv = cardNode.querySelector(".tags-div");

        // rendering di tagNames e rispettivi tagValues
        for(let i = 0; i < this._tags.length; ++i) {
            let tagNameNode = document.createElement("div"); // Da sistemare, vedi nella console
            tagNameNode.setAttribute("class", "card collection-card mb-3");
            tagNameNode.setAttribute("style", "width: 100%");
            tagNameNode.innerHTML = document.querySelector('script#tagName-template').innerText;
            tagsDiv.appendChild(tagNameNode);

            // Sostituisco il tagName del template con quello corrente
            tagNameNode.querySelector(".tagName").innerText = this._tags[i].tagName;

            // div che indica il contenuto del tagName, ossia i tagValues
            let tagValuesDiv = tagNameNode.querySelector(".tagValues-div");
            
            // Per il tagName corrente, renderizzo i suoi tagValues
            for(let j = 0; j < this._tags[i].tagValues.length; ++j) {
                let tagValueNode = document.createElement("div"); // Da sistemare, vedi nella console
                tagValueNode.setAttribute("class", "card-text TAGChip my-3 mr-3");
                tagValueNode.innerHTML = document.querySelector('script#tagValue-template').innerText;
                tagValuesDiv.appendChild(tagValueNode);

                // Sostituisco il tagName del template con quello corrente
                tagValueNode.querySelector(".tagValue").innerText = this._tags[i].tagValues[j];
            }
        }
        
        return cardNode;
    }

    /**
     * Rendering grafico di un example
     */
    render() {
        // Identifico il div esterno contenente tutti gli examples
        let examplesDiv = document.getElementById("external-examples-div");
        

        // let tagNameNode = document.createElement("div"); // Da sistemare, vedi nella console
        //     tagNameNode.setAttribute("class", "card collection-card mb-3");
        //     tagNameNode.setAttribute("style", "width: 100%");
        //     tagNameNode.innerHTML = document.querySelector('script#tagName-template').innerText;
        //     tagsDiv.appendChild(tagNameNode);

        // Identifico il template del generico example
        let exampleTemplate = document.querySelector('script#example-card-template');

        // Definisco la card html dell'example, e la inserisco nel div degli examples
        examplesDiv.innerHTML += exampleTemplate.innerText; 
        let cardNode = this.createExampleCard();
        // cardNode.setAttribute("class", "mb-3");
        examplesDiv.appendChild(cardNode);
    }
    
    /**
     * Gestione dei listeners associati ai bottoni della card dell'example
     */
    handleListeners() {
        // TODO
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



/**
 * Aggiunta di un example
 */
function addExample(id, inputType, inputValue, tags) {
    console.log("Adding example n. " + id);

    let currentExample = new Example(id, inputType, inputValue, tags);
    examples.push(currentExample);
}

/**
 * Rimozione di un progetto
 */
function deleteExample(id){
    // TODO
    // // Inserisco l'id del progetto nell'elemento span più interno della modal
    // document.querySelector("#id-project-to-be-deleted").innerText = id;

    // // Mostro la modal
    // $('#deleteModal').modal('show');

    // // TODO: Listener sul bottone "Yes, I'm sure", e conseguente eliminazione dal DB
}

/**
 * Creazione della pagina di vista di un progetto (con tutti i suoi examples)
 */
function createExamplesPage(projectId, projectTitle, projectInputType) {
    variableContent.innerHTML = "";

    /* CREAZIONE ELEMENT FISSI */
    // Non creo più la navbar, la lascio invariata! Così in tutte le pagine che non siano la projects page

    // Creo il jumbotron esterno del progetto attuale
    let jumbotronProject = document.createElement("div");
    jumbotronProject.setAttribute("class", "jumbotron jumbotron-fluid");
    jumbotronProject.innerHTML = document.querySelector("script#project-jumbotron-template").textContent;
    jumbotronProject.querySelector(".project-title").innerText = projectTitle;


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
    examplesDiv.setAttribute("id", "external-examples-div");
    
    // Inserisco il div degli examples subito dopo l'hr dell'header del jumbotron (JQuery per comodità)
    $(examplesDiv).insertAfter(document.getElementById("hr-jumbotron-template"));
    
    // Creo N examples di esempio di tipo testuale, e li inserisco nel div

    let N = 20;
    for(let i = 0; i < N; ++i) {
        let id = i;
        let inputType = projectInputType;
        let inputValue = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore blanditiis qui possimus, praesentium magni accusantium eveniet reiciendis aliquam et repudiandae dolores, esse debitis natus, provident itaque impedit inventore rem! Alias"; 
        let tags = 
        [
          {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
          {"tagName": "colors", "tagValues": ["brown", "black"]}
        ];

        addExample(id, inputType, inputValue, tags); 
    }
}