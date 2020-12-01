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

    // variabile statica (di classe) contente i soli due valori possibili per il tipo di input:
    // testo o immagine
    // esempio d'uso: Project.inputType.TEXT;
    static inputType = {
        TEXT: 0,
        IMAGE: 1
    };

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
        cardNode.setAttribute("id", cardNode.getAttribute("id") + "-" + this._id); // e.g.: card-content-0

        // title
        let cardNodeTitle = cardNode.querySelector('.project-title');
        cardNodeTitle.innerText = "Title-" + this._id;

        // description
        let cardNodeDescription = cardNode.querySelector('.project-description');
        cardNodeDescription.innerText = "Description-" + this._id;
        
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

        let id = this._id; // Salvo l'id per effettuare successivamente la closure, nei listener
        
        // Listener sul bottone di view della card
        let btnViewProject = cardNode.querySelector(".btn-view-project");
        btnViewProject.addEventListener("click", 
            function() {
                console.log("Viewing project n. " + id); // closure
                createViewProjectPage(id);
            }
        );
        
        // Listener sul bottone di eliminazione della card
        let btnDeleteProject = cardNode.querySelector(".btn-delete-project");
        btnDeleteProject.addEventListener("click", 
            function() {
                console.log("Deleting project n. " + id); // closure
                deleteProject(id);
            }
        );
    }
}

/**
 * Aggiunta di un progetto
 */
function addProject(id, title, inputType) {
    console.log("Adding project n. " + id);

    let currentProject = new Project(id, title, inputType);
    projects.push(currentProject);

    // currentProject.handleListeners();
}

/**
 * Rimozione di un progetto
 */
function deleteProject(id){
    // Inserisco l'id del progetto nell'elemento span più interno della modal
    document.querySelector("#id-project-to-be-deleted").innerText = id;

    // Mostro la modal
    $('#deleteModal').modal('show');

    // TODO: Listener sul bottone "Yes, I'm sure", e conseguente eliminazione dal DB
}


/**
 * Creazione della pagina dei progetti
 */
function createProjectsPage() {
    /* CREAZIONE ELEMENT FISSI */
    // Creo il bottone dell'utente nella navbar, in alto a destra
    let navbarContent = document.getElementById("id-navbar");
    let navbarNickHTML = document.querySelector("script#navbar-nickname").textContent;

    navbarContent.innerHTML += navbarNickHTML;
    document.getElementById("NickLogged").innerHTML = "Nickname"; // da sostituire con il nickname che viene passato in fase di login

    // Crea finestra modale per eliminazione
    let deleteModalHTML = document.querySelector('script#delete-card-modal').textContent;
    variableContent.innerHTML += deleteModalHTML;

    /* CREAZIONE ELEMENTI VARIABILI (CARD DEI PROGETTI) */
    // La card non andrà inserita direttamente nel div variabile:
    // Creo infatti un div esterno che conterrà tutte le card dei progetti
    let projectsDiv = document.createElement("div");
    projectsDiv.setAttribute("class", "row");
    projectsDiv.setAttribute("id", "external-project-div");
    
    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(projectsDiv);

    // Creo N progetti di esempio di tipo testuale, e li inserisco nel vettore dei progetti
    let N = 20;
    for(let i = 0; i < N; ++i) {
        addProject(i, "<title-"+i+">", Project.inputType.TEXT);
    }

    // Aggiungo i listener 
    for(let i = 0; i < N; ++i) {
        projects[i].handleListeners();
    }
}

