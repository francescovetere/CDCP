/**
 * Classe che modella le informazioni essenziali di un example
 */
class Example {
    constructor(idProject, idExample, inputType, inputValue, tags = []) {
        this._idProject = idProject;
        this._idExample = idExample;
        this._inputType = inputType;
        this._inputValue = inputValue;
        this._tags = tags;
        // Esempio di this._tags
        //
        // [
        //   {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
        //   {"tagName": "colors", "tagValues": ["brown", "black"]}
        // ]

        this.render();
        this.handleListeners();
    }

    // getters/setters
    get idProject() { return this._idProject; }
    get idExample() { return this._idExample; }
    get inputType() { return this._inputType; }
    get inputValue() { return this._inputValue; }
    
    get tags() { return this._tags; }
    set tags(tags) { this._tags = tags; }

    /**
     * Metodo che costruisce e restituisce la card html per l'example corrente
     */
    createExampleCard() {
        // Modifico alcuni opportuni elementi del template (già caricato nel documento HTML, ed avente id="example-content"),
        // per personalizzarli con quelli dell'example corrente

        // id
        let cardNode = document.getElementById("example-content");
        cardNode.setAttribute("id", "example-content-" + this._idExample); // e.g.: example-content-0

        // inputType
        let cardNodeInputType = cardNode.querySelector('.example-inputType');
        cardNodeInputType.innerText = this._inputType;

        // inputType
        let cardNodeInputValue = cardNode.querySelector('.example-inputValue');
        cardNodeInputValue.innerHTML = this._inputValue;
        
        // div che indica la fine del contenuto dell'example, e l'inizio dei tags
        let tagsDiv = cardNode.querySelector(".tags-div");

        // rendering di tagNames e rispettivi tagValues, se presenti
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
        // Salvo i campi dell'example per effettuare successivamente la closure, nei listener
        let idProject = this._idProject;
        let idExample = this._idExample;
        let inputType = this._inputType;
        let inputValue = this._inputValue;
        let tags = this._tags;

        /***  EXAMPLE ***/
        // Listener sul bottone di delete example
        $(document).on("click", "#example-content-"+idExample+ " .btn-delete-example", function(event) {
            event.stopImmediatePropagation();

            // Mostro la modal
            $('#delete-example-modal').modal('show');
            $('#modal-form-delete-example').on('submit', function(e) {
                e.preventDefault();
                let nickname = document.getElementById("NickLogged").textContent;
                let titleProject = document.querySelector(".project-title").textContent;

                $.ajax({
                    url: 'api/project/'+idProject+'/example/'+idExample,
                    type: 'DELETE',
                    data: {"nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                    success: function(result) {
                    $("#delete-example-modal").modal('hide');
                        console.log("Deleted example");
                        createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                    },
                    error: function(){alert("Something went wrong...");}
                });
            });
        });


        /***  TAGNAME ***/
        // Listener sul bottone di add tagName
        $(document).on("click", "#example-content-"+idExample+ " .btn-add-tagName", function(event) {
            event.stopImmediatePropagation();
            // Mostro la modal
            $('#add-tagName-modal').modal('show');

            $('#modal-form-add-tagName').on('submit', function(e) {
                e.preventDefault();
                let nickname = document.getElementById("NickLogged").textContent;
                let titleProject = document.querySelector(".project-title").textContent;
                let newTagName = $("#modal-form-add-tagName .modal-tagName").val();

                $.ajax({
                    url: 'api/project/'+idProject+'/example/'+idExample+'/tagName',
                    type: 'POST',
                    data: {"tagName": newTagName, "nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                    success: function(result) {
                    $("#add-tagName-modal").modal('hide');
                        console.log("Created tagName");
                        createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                    },
                    error: function(){alert("Something went wrong...");}
                });
            });
        
        });

        // Listener(s) sui bottoni di update tagName (in un example avrò molti di questi bottoni)
        $(document).on("click", "#example-content-"+idExample+ " .btn-update-tagName",
            function(event) {
                // Impedisco che l'evento venga propagato ad altri nodi
                event.stopImmediatePropagation();
                
                // Mostro la modal
                $('#update-tagName-modal').modal('show');

                $('#modal-form-update-tagName').on('submit', function(e) {
                    e.preventDefault();
                    let nickname = document.getElementById("NickLogged").textContent;
                    let titleProject = document.querySelector(".project-title").textContent;
    
                    // Individuo l'inputGroup HTML di cui fa parte il tagName
                    let inputGroup = event.target.parentNode.parentNode.parentNode.parentNode;
                    
                    // All'interno dell'inputGroup, inviduo lo span che identifica proprio il tagName in questione
                    let tagName = inputGroup.querySelector(".tagName");
                    let newTagName = $("#modal-form-update-tagName .modal-tagName").val();
    
                    console.log("Updating tagName "+ tagName.innerText + " with " + newTagName);

                    $.ajax({
                        url: 'api/project/'+idProject+'/example/'+idExample+'/tagName/'+tagName.innerText,
                        type: 'PUT',
                        data: {"tagName": newTagName, "nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                        success: function(response) {
                        $("#update-tagName-modal").modal('hide');
                            console.log("Updated tagName");
                            createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                        },
                        error: function(){alert("Something went wrong...");}
                    });
                });
            }
        );

        // Listener(s) sui bottoni di delete tagName (in un example avrò molti di questi bottoni)
        $(document).on("click", "#example-content-"+idExample+ " .btn-delete-tagName",
            function(event) {
                // Impedisco che l'evento venga propagato ad altri nodi
                event.stopImmediatePropagation();
                
                // Mostro la modal
                $('#delete-tagName-modal').modal('show');

                $('#modal-form-delete-tagName').on('submit', function(e) {
                    e.preventDefault();
                    let nickname = document.getElementById("NickLogged").textContent;
                    let titleProject = document.querySelector(".project-title").textContent;
    
                    // Individuo l'inputGroup HTML di cui fa parte il tagName
                    let inputGroup = event.target.parentNode.parentNode.parentNode.parentNode;
                    
                    // All'interno dell'inputGroup, inviduo lo span che identifica proprio il tagName in questione
                    let tagName = inputGroup.querySelector(".tagName");
    
                    console.log("Deleting tagName "+ tagName.innerText);

                    $.ajax({
                        url: 'api/project/'+idProject+'/example/'+idExample+'/tagName/'+tagName.innerText,
                        type: 'DELETE',
                        data: {"nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                        success: function(response) {
                        $("#delete-tagName-modal").modal('hide');
                            console.log("Deleted tagName");
                            createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                        },
                        error: function(){alert("Something went wrong...");}
                    });
                });
            }
        );



        /***  TAGVALUE ***/
        // Listener(s) sui bottoni di add tagValue (in un example avrò molti di questi bottoni)
        $(document).on("click", "#example-content-"+idExample+ " .btn-add-tagValue",
        function(event) {
            event.stopImmediatePropagation();

            // Mostro la modal
            $('#add-tagValue-modal').modal('show');

            $('#modal-form-add-tagValue').on('submit', function(e) {
                e.preventDefault();
                let nickname = document.getElementById("NickLogged").textContent;
                let titleProject = document.querySelector(".project-title").textContent;

                // Identifico l'elemento span del tagName corrispondente a questo tagValue
                let tagName = event.target.parentNode.parentNode.querySelector(".tagName");

                let newTagValue = $("#modal-form-add-tagValue .modal-tagValue").val();

                console.log(tagName);
                $.ajax({
                    url: 'api/project/'+idProject+'/example/'+idExample+'/tagName/'+tagName.innerText+"/tagValue",
                    type: 'POST',
                    data: {"tagValue": newTagValue, "nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                    success: function(response) {
                    $("#add-tagValue-modal").modal('hide');
                        console.log("Created tagValue");
                        createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                    },
                    error: function(){alert("Something went wrong...");}
                });
            });
        }
    );

        // Listener(s) sui bottoni di update tagValue (in un example avrò molti di questi bottoni)
        $(document).on("click", "#example-content-"+idExample+ " .btn-update-tagValue",
            function(event) {
                // Impedisco che l'evento venga propagato ad altri nodi
                event.stopImmediatePropagation();
                
                // Mostro la modal
                $('#update-tagName-modal').modal('show');

                $('#modal-form-update-tagName').on('submit', function(e) {
                    e.preventDefault();
                    let nickname = document.getElementById("NickLogged").textContent;
                    let titleProject = document.querySelector(".project-title").textContent;
                    
                    // Individuo il div del tagName corrispondente a questo tagValue
                    let tagName = event.target.parentNode.parentNode.parentNode;

                    // Individuo il cardText HTML di cui fa parte il tagValue
                    let cardText = event.target.parentNode;
                    // All'interno del cardText, inviduo lo span che identifica proprio il tagValue in questione
                    let tagValue = cardText.querySelector(".tagValue")
        
                    console.log("Updating tagValue " + tagValue.innerText);
                    console.log(tagName);

                    $.ajax({
                        url: 'api/project/'+idProject+'/example/'+idExample+'/tagName/'+tagName.innerText,
                        type: 'DELETE',
                        data: {"nickname": nickname}, // mando sempre il nickname, per la tabella Logs
                        success: function(response) {
                        $("#delete-tagName-modal").modal('hide');
                            console.log("Deleted tagName");
                            createExamplesPage(idProject, titleProject, inputType);  // serve per fare il refresh della pagina in modo completo
                        },
                        error: function(){alert("Something went wrong...");}
                    });
                });

                // Mostro la modal
                $('#update-tagValue-modal').modal('show');
    
                // TODO ...
            }
        );
        
        // Listener(s) sui bottoni di delete tagValue (in un example avrò molti di questi bottoni)
        $(document).on("click", "#example-content-"+idExample+ " .btn-delete-tagValue",
            function(event) {
                // Impedisco che l'evento venga propagato ad altri nodi
                event.stopImmediatePropagation();
    
                // Individuo il cardText HTML di cui fa parte il tagValue
                let cardText = event.target.parentNode;
                // All'interno del cardText, inviduo lo span che identifica proprio il tagValue in questione
                let tagValue = cardText.querySelector(".tagValue")
    
                console.log("Deleting tagValue " + tagValue.innerText);
    
                // Mostro la modal
                $('#delete-tagValue-modal').modal('show');
    
                // TODO ...
            }
        );
        


        
        // TODO: tutti gli altri listener per gli altri bottoni + 
        // il listener (esterno a questa funzione) per il bottone di aggiunta di un example
    }
}


/**
 * Creazione della pagina di vista di un progetto (con tutti i suoi examples)
 */
function createExamplesPage(projectId, projectTitle, projectInputType) {
    // Azzero il contenuto variabile della pagina
    variableContent.innerHTML = "";
    // // Azzero l'array dei progetti, che verranno presi con una get
    // examples.splice(0, examples.length);

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

    // Inserisce nel documento il codice per la modal di add example (testuale)
    let addExampleTxtModalHTML = document.querySelector('script#add-example-txt-modal-script').textContent;
    variableContent.innerHTML += addExampleTxtModalHTML;

    // Inserisce nel documento il codice per la modal di add example (immagine)
    let addExampleImgModalHTML = document.querySelector('script#add-example-img-modal-script').textContent;
    variableContent.innerHTML += addExampleImgModalHTML;

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

    
    // GET di tutti gli examples (implementata in modo che restituisca già anche tagName e tagValues, se presenti)
    $.get('api/project/'+projectId+'/examples',
    {},
    function(response) {
        for(let i = 0; i < response.total; ++i) {
            let exampleId = response.results[i].id;
            let projectId = response.results[i].projectId;
            let inputType = response.results[i].inputType;
            let inputValue = response.results[i].inputValue;
            let tags = response.results[i].tags;
            new Example(projectId, exampleId, inputType, inputValue, tags);
        }
    });
    
    // Listener gestito a parte sul bottone di aggiunta di un example
    let btnAddExample = document.getElementById("btn-add-example");
    btnAddExample.addEventListener("click", 
        function() {
            console.log("Creating example"); 
        
            // Mostro la modal (diversa in base al tipo di input del progetto)
            let currentModal;
            if(projectInputType === 'TEXT') 
                currentModal = '#add-example-txt-modal';
            else 
                currentModal = '#add-example-img-modal';

            $(currentModal).modal('show');

            $(currentModal + ' form').on('submit', function(e) {
                e.preventDefault();
                let inputValue;  // ************************* TODO: caso di input immagine 
                if(projectInputType === 'TEXT') inputValue = $(currentModal + ' input').val();
                else inputValue = "TODO";

                // console.log(inputValue);
                $.ajax({
                    url: 'api/project/'+projectId+'/example',
                    type: 'POST',
                        data: {"inputType": projectInputType, "inputValue": inputValue},
                        success: function(response) {
                            $(currentModal).modal('hide');
                            console.log("Created example");
                            // goToHome();
                            createExamplesPage(projectId, projectTitle, projectInputType);  // serve per fare il refresh della pagina in modo completo
                        },
                        error: function(){alert("Something went wrong...");}
                    });
            
            });
        });
}