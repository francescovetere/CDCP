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
    }

    // getters/setters
    get id() { return this._id; }
    get title() { return this._title; }
    get inputType() { return this._inputType; }
    get timeStamp() { return this._timeStamp; }

    // Data Transfer Object: oggetto adatto ad essere spedito in rete
    toDTO() {
        return {
            id: this._id,
            title: this._title,
            inputType: this._inputType,
            timeStamp: this._timeStamp
        };
    }

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
        // Card del progetto
        let cardNode = document.querySelector("#card-content-"+this._id);

        // Salvo l'id, title, inputType, per effettuare successivamente la closure, nei listener
        let id = this._id;
        let title = this._title;
        let inputType = this._inputType;
        
        // Listener sul bottone di view della card
        let btnViewProject = cardNode.querySelector(".btn-view-project");
        btnViewProject.addEventListener("click", 
            function() {
                console.log("Viewing project n. " + id); // closure
                createExamplesPage(id, title, inputType); // closure
            }
        );
        
        // Listener sul bottone di eliminazione di un progetto
        let btnDeleteProject = cardNode.querySelector(".btn-delete-project");
        btnDeleteProject.addEventListener("click", 
            function() {
                console.log("Deleting project n. " + id); // closure
                // deleteProject(id);
                // Inserisco l'id del progetto nell'elemento span più interno della modal
                document.querySelector("#id-project-to-be-deleted").innerText = id;

                // Mostro la modal
                $('#deleteModal').modal('show');

                // TODO: Listener sul bottone "Yes, I'm sure", e conseguente eliminazione dal DB
            }
        );
  
    }
}


/**
 * Creazione della pagina dei progetti
 */
function createProjectsPage(nickname) {
    variableContent.innerHTML = "";

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

    // Creo N progetti di esempio di tipo testuale/immagine, e li inserisco nel vettore dei progetti
    let N = 20;
    for(let i = 0; i < N; ++i) {
        let id = i;
        let title = "Title" + i;

        let inputType;
        if(i%2 == 0) inputType = "TEXT";
        else inputType = "IMAGE";

        //console.log("Adding project n. " + id);
        
        let currentProject = new Project(id, title, inputType);
        projects.push(currentProject);
    }

    // Aggiungo i listener su ciascun progetto
    for(let i = 0; i < N; ++i) {
        projects[i].handleListeners();
    }

    // Listener gestito a parte sul bottone di aggiunta di un progetto
    let btnAddProject = document.getElementById("btn-add-project");
    btnAddProject.addEventListener("click", 
        function() {
            console.log("Adding a project\n"); 
    
            // Mostro la modal
            $('#add-project-modal').modal('show');
    
            // TODO: Listener sul bottone "Yes, I'm sure", e conseguente aggiunta in db
            // In realta' usando un form direttamente, si può evitare di dover recuperare i dati cosi.
    
        }
    );     
    
}

