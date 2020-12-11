/**
 * Classe che modella le informazioni essenziali di un progetto
 */
class Project {
    constructor(id, title, inputType) {
        this._id = id;
        this._title = title;
        this._inputType = inputType;
        this._timeStamp = new Date();
        
        this.render();
        this.handleListeners();
    }

    // getters/setters
    get id() { return this._id; }
    get title() { return this._title; }
    get inputType() { return this._inputType; }
    get timeStamp() { return this._timeStamp; }

    /**
     * Metodo che costruisce e restituisce la card html per il progetto corrente
     */
    createProjectCard() {
        // Modifico alcuni opportuni elementi del card template (già caricato nel documento HTML, ed avente id="card-content"),
        // per personalizzarli con quelli del progetto corrente

        // id
        let cardNode = document.getElementById("card-content");
        cardNode.setAttribute("id", "card-content" + "-" + this._id); // e.g.: card-content-0

        // title
        let cardNodeTitle = cardNode.querySelector('.project-title');
        cardNodeTitle.innerText = this._title;

        // inputType
        let cardNodeInputType = cardNode.querySelector('.project-inputType');
        cardNodeInputType.innerText = this._inputType;
        
        // Gestisco il colore della callout in base al tipo del progetto
        if(this._inputType === 'TEXT')
            cardNode.querySelector('.bs-callout').setAttribute('class', 'bs-callout bs-callout-success');
        else if(this._inputType === 'IMAGE')
            cardNode.querySelector('.bs-callout').setAttribute('class', 'bs-callout bs-callout-danger');
        
        return cardNode;
    }

    /**
     * Rendering grafico di un progetto
     */
    render() {
        // Identifico il div esterno contenente tutti i progetti
        let projectsDiv = document.getElementById("external-project-div");
        
        // Identifico il template del generico progetto
        let projectTemplate = document.querySelector('script#project-card-template');

        // Definisco la card html del progetto, e la inserisco nel div dei progetti
        projectsDiv.innerHTML += projectTemplate.innerText; 
        let cardNode = this.createProjectCard();
        projectsDiv.appendChild(cardNode);
    }
    
    /**
     * Gestione dei listeners associati ai bottoni della card del progetto
     */
    handleListeners() {
        // Salvo l'id, title, inputType, per effettuare successivamente la closure, nei listener
        let id = this._id;
        let title = this._title;
        let inputType = this._inputType;
        
        // Listener sul bottone di view della card 
        // (on() di JQuery mi permette di assegnare handler a oggetti non ancora nel DOM)
        $(document).on("click", "#card-content-"+id+ " .btn-view-project",
            function(event) {
                event.stopImmediatePropagation();
                console.log("Viewing project n. " + id); // closure
                createExamplesPage(id, title, inputType); // closure
            }
        );
        
        // Listener sul bottone di eliminazione di un progetto
        $(document).on("click", "#card-content-"+id+ " .btn-delete-project",
            function(event) {
                event.stopImmediatePropagation();

                // Mostro la modal
                $('#deleteModal').modal('show');

                // Alla conferma, eseguo la delete del progetto
                let nickname = document.getElementById("NickLogged").textContent;
                $('#modal-form-project-delete').on('submit', function(e) {
                    
                    // e.stopImmediatePropagation();
                    $.ajax({
                        url: '/api/project/'+id,
                        type: 'DELETE',
                        data: {projectTitle: title, "nickname": nickname},
                        success: function(result) {
                            $("#deleteModal").modal('hide');
                            console.log("Deleted project n. " + id); // closure
                            goToHome(); // serve per fare il refresh della pagina in modo completo
                        },
                        error: function(){alert("Something went wrong...");}
                    });
                });
            
        });
    }
}


/**
 * Creazione della pagina dei progetti
 */
function createProjectsPage(nickname) {
    // Azzero il contenuto variabile della pagina
    variableContent.innerHTML = "";
    // Azzero l'array dei progetti, che verranno presi con una get
    projects.splice(0, projects.length);

    /* CREAZIONE ELEMENT FISSI */
    // Creo il bottone dell'utente nella navbar, in alto a destra
    let navbarContent = document.getElementById("id-navbar");
    
    let navbarNickname = document.createElement("div");
    navbarNickname.setAttribute("id","nickChip");
    navbarNickname.innerHTML = document.querySelector("script#navbar-nickname").textContent;

    navbarContent.appendChild(navbarNickname);

    document.getElementById("NickLogged").innerHTML = nickname;

    // Inserisce nel documento il codice per il bottone di add project
    let addProjectHTML = document.querySelector('script#add-project-template').textContent;
    variableContent.innerHTML += addProjectHTML;

    // Inserisce nel documento il codice per la modal di eliminazione
    let deleteModalHTML = document.querySelector('script#delete-card-modal').textContent;
    variableContent.innerHTML += deleteModalHTML;

    // Inserisce nel documento il codice per la modal di aggiunta del progetto
    let addProjectModalHTML = document.querySelector('script#add-project-modal').textContent;
    variableContent.innerHTML += addProjectModalHTML;

    /* CREAZIONE ELEMENTI VARIABILI (CARD DEI PROGETTI) */
    // La card non andrà inserita direttamente nel div variabile:
    // Creo infatti un div esterno che conterrà tutte le card dei progetti
    let projectsDiv = document.createElement("div");
    projectsDiv.setAttribute("class", "row");
    projectsDiv.setAttribute("id", "external-project-div");
    
    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(projectsDiv);

    // Listener gestito a parte sul bottone di aggiunta di un progetto
    let btnAddProject = document.getElementById("btn-add-project");
    btnAddProject.addEventListener("click", 
        function() {
            console.log("Adding a project\n"); 
    
            // Mostro la modal
            $('#add-project-modal').modal('show');
                
            // POST di un progetto 
            $('#modal-form-add-project').on('submit', function(e) {
                e.preventDefault();
                let title =  $("#modal-project-title").val();
                let inputType = $("#modal-project-inputType option:selected").text();
                let formData = {"title" : title, "inputType": inputType, "nickname": nickname};
                $.post('api/project',
                    formData,
                    function(response) {
                        let p = new Project(response.result.id, title, inputType);
                        projects.push(p);
                        $('#add-project-modal').modal('hide');
                    });
            });
        }
    );
    
    // GET di tutti i progetti
    $.get('api/projects',
            {},
            function(response) {
                for(let i = 0; i < response.total; ++i)
                    projects.push(new Project(response.results[i].id, response.results[i].title, response.results[i].inputType));
            });
}

