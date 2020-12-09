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
        cardNodeInputValue.innerHTML = this._inputValue;
        
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
        // Card dell'example
        let cardNode = document.querySelector("#example-content-"+this._id);

        let id = this._id; // Salvo i campi dell'example per effettuare successivamente la closure, nei listener
        // altri campi che serviranno nei listener...

        /***  EXAMPLE ***/
        // Listener sul bottone di delete example
        let btnDeleteExample = cardNode.querySelector(".btn-delete-example");
        btnDeleteExample.addEventListener("click", 
            function() {
                // TODO ...

                // Mostro la modal
                $('#delete-example-modal').modal('show');

                // TODO ...
            }
        );



        /***  TAGNAME ***/
        // Listener sul bottone di add tagName
        let btnAddTagName = cardNode.querySelector(".btn-add-tagName");
        btnAddTagName.addEventListener("click", 
            function() {
                // TODO ...

                // Mostro la modal
                $('#add-tagName-modal').modal('show');

                // TODO ...
            }
        );

        // Listener(s) sui bottoni di update tagName ---> Uso un querySelectorAll, perchè in un example avrò molti di questi bottoni
        let btnsUpdateTagName = cardNode.querySelectorAll(".btn-update-tagName");
        for(let i = 0; i < btnsUpdateTagName.length; ++i) {
            btnsUpdateTagName[i].addEventListener("click", 
                function() {
                    // TODO ...
                    console.log("Updating a tagName\n");

                    // Mostro la modal
                    $('#update-tagName-modal').modal('show');

                    // TODO ...
                }
            );
        }

        // Listener(s) sui bottoni di delete tagName ---> Uso un querySelectorAll, perchè in un example avrò molti di questi bottoni
        let btnsDeleteTagName = cardNode.querySelectorAll(".btn-delete-tagName");
        for(let i = 0; i < btnsDeleteTagName.length; ++i) {
            btnsDeleteTagName[i].addEventListener("click", 
                function() {
                    // TODO ...
                    console.log("Deleting a tagName\n");

                    // Mostro la modal
                    $('#delete-tagName-modal').modal('show');

                    // TODO ...
                }
            );
        }



        /***  TAGVALUE ***/
        // Listener(s) sui bottoni di add tagValue ---> Uso un querySelectorAll, perchè in un example avrò molti di questi bottoni
        let btnsAddTagValue = cardNode.querySelectorAll(".btn-add-tagValue");
        for(let i = 0; i < btnsAddTagValue.length; ++i) {
            btnsAddTagValue[i].addEventListener("click", 
                function() {
                    // TODO ...
                    console.log("Adding a tagValue\n");

                    // Mostro la modal
                    $('#add-tagValue-modal').modal('show');

                    // TODO ...
                }
            );
        }
        
        // Listener(s) sui bottoni di update tagValue ---> Uso un querySelectorAll, perchè in un example avrò molti di questi bottoni
        let btnsUpdateTagValue = cardNode.querySelectorAll(".btn-update-tagValue");
        for(let i = 0; i < btnsUpdateTagValue.length; ++i) {
            btnsUpdateTagValue[i].addEventListener("click", 
                function() {
                    // TODO ...
                    console.log("Updating a tagValue\n");

                    // Mostro la modal
                    $('#update-tagValue-modal').modal('show');

                    // TODO ...
                }
            );
        }

        // Listener(s) sui bottoni di delete tagValue ---> Uso un querySelectorAll, perchè in un example avrò molti di questi bottoni
        let btnsDeleteTagValue = cardNode.querySelectorAll(".btn-delete-tagValue");
        for(let i = 0; i < btnsDeleteTagValue.length; ++i) {
            btnsDeleteTagValue[i].addEventListener("click", 
                function() {
                    // TODO ...
                    console.log("Deleting a tagValue\n");

                    // Mostro la modal
                    $('#delete-tagValue-modal').modal('show');

                    // TODO ...
                }
            );
        }


        
        // TODO: tutti gli altri listener per gli altri bottoni + 
        // il listener (esterno a questa funzione) per il bottone di aggiunta di un example
    }
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

    // Inserisce nel documento il codice per la modal di add tagName
    let addTagNameModalHTML = document.querySelector('script#add-tagName-modal-script').textContent;
    variableContent.innerHTML += addTagNameModalHTML;

    // Inserisce nel documento il codice per la modal di update tagName
    let updateTagNameModalHTML = document.querySelector('script#update-tagName-modal-script').textContent;
    variableContent.innerHTML += updateTagNameModalHTML;

    // Inserisce nel documento il codice per la modal di delete tagName
    let deleteTagNameModalHTML = document.querySelector('script#delete-tagName-modal-script').textContent;
    variableContent.innerHTML += deleteTagNameModalHTML;

    // Inserisce nel documento il codice per la modal di add tagValue
    let addTagValueModalHTML = document.querySelector('script#add-tagValue-modal-script').textContent;
    variableContent.innerHTML += addTagValueModalHTML;

    // Inserisce nel documento il codice per la modal di update tagValue
    let updateTagValueModalHTML = document.querySelector('script#update-tagValue-modal-script').textContent;
    variableContent.innerHTML += updateTagValueModalHTML;

    // Inserisce nel documento il codice per la modal di delete tagValue
    let deleteTagValueModalHTML = document.querySelector('script#delete-tagValue-modal-script').textContent;
    variableContent.innerHTML += deleteTagValueModalHTML;

    // Inserisce nel documento il codice per la modal di add example
    let addExampleModalHTML = document.querySelector('script#add-example-modal-script').textContent;
    variableContent.innerHTML += addExampleModalHTML;

    // Inserisce nel documento il codice per la modal di delete example
    let deleteExampleModalHTML = document.querySelector('script#delete-example-modal-script').textContent;
    variableContent.innerHTML += deleteExampleModalHTML;

    /* CREAZIONE ELEMENTI VARIABILI (CARD DEGLI EXAMPLE) */
    // La card non andrà inserita direttamente nel jumbotron:
    // Creo infatti un div esterno che conterrà tutte le card degli examples

    let examplesDiv = document.createElement("div");
    examplesDiv.setAttribute("id", "external-examples-div");
    
    // Inserisco il div degli examples subito dopo l'hr dell'header del jumbotron (JQuery per comodità)
    $(examplesDiv).insertAfter(document.getElementById("hr-jumbotron-template"));
    
    console.log(projectInputType);

    // Creo N examples di esempio di tipo testuale, e li inserisco nel div
    let N = 20;
    for(let i = 0; i < N; ++i) {
        let id = i;
        let inputType = projectInputType;
        
        let inputValue;
        if(inputType === 'TEXT') inputValue = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore blanditiis qui possimus, praesentium magni accusantium eveniet reiciendis aliquam et repudiandae dolores, esse debitis natus, provident itaque impedit inventore rem! Alias"; 
        else if(inputType === 'IMAGE') inputValue = `<img src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17629da54ff%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17629da54ff%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.4296875%22%20y%3D%22104.5%22%3E200x200%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="..." class="img-thumbnail">`;
        let tags = 
        [
          {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
          {"tagName": "colors", "tagValues": ["brown", "black"]}
        ];

        //console.log("Adding example n. " + id);

        let currentExample = new Example(id, inputType, inputValue, tags);
        examples.push(currentExample);
    }

    // Aggiungo i listener su ciascun example
    for(let i = 0; i < N; ++i) {
        examples[i].handleListeners();
    }
    
    // Listener gestito a parte sul bottone di aggiunta di un example
    let btnAddExample = document.getElementById("btn-add-example");
    btnAddExample.addEventListener("click", 
        function() {
            console.log("Adding an example\n"); 
        
            // Mostro la modal
            $('#add-example-modal').modal('show');
        
            // TODO: Listener sul bottone "Yes, I'm sure", e conseguente aggiunta in db
            // In realta' usando un form direttamente, si può evitare di dover recuperare i dati cosi.
        
        }
    );
}