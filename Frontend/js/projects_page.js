/**
 * Classe che modella le informazioni essenziali di un progetto
 */
class Project {
    constructor(id, title, inputType) {
        this._id = id;
        this._title = title;
        this._inputType = inputType;
        this._timeStamp = new Date();
        // controllare che il valore inpuType sia solamente "text" o "image"
    }

    // getters/setters
    get id() { return this._id; }
    get title() { return this._title; }
    get inputType() { return this._inputType; }
    get timeStamp() { return this._timeStamp; }
}

/**
 * Funzione che riceve un id nel formato "card-content-<num>"
 * E restituisce <num> in formato numerico
 */
function extractId(card_content_id) {
    let id = card_content_id.replace("card-content-", "");
    let numeric_id = parseInt(id, 10);
    return numeric_id;
}

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

    // Creo N progetti di esempio, e li inserisco nel vettore dei progetti
    let N = 20;
    for(let i = 0; i < N; ++i) projects.push(new Project(i, "Title" + i, "text"));

    // Per ogni progetto, ne definisco la rispettiva card html
    for(let i = 0; i < projects.length; ++i) {
        let projectCardTemplate = document.querySelector('script#project-card-template');

        projectsDiv.innerHTML += projectCardTemplate.innerText; 
        
        // Modifico gli attributi del card template, per personalizzarli con quelli del progetto corrente
        let cardNode = document.getElementById("card-content");
        cardNode.setAttribute("id", cardNode.getAttribute("id") + "-" + i); // e.g.: card-content-0

        let cardNodeTitle = cardNode.querySelector('.project-title');
        cardNodeTitle.innerText = "Title-" + i;

        let cardNodeDescription = cardNode.querySelector('.project-description');
        cardNodeDescription.innerText = "Description-" + i;

        // Inserisco la nuova card nel div dei progetti
        projectsDiv.appendChild(cardNode);
    }
        
    // Aggiungo i listener necessari ai bottoni presenti nelle card
    for(let i = 0; i < projects.length; ++i) {
        // Identifico la card del progetto i-esimo, e ne estraggo l'id
        let cardNode = document.getElementById("card-content-"+i);
        let id = extractId(cardNode.getAttribute("id"));

        // Listener sul bottone di view del progetto
        let viewProjectBtn = cardNode.querySelector('.btn-view-project');
        viewProjectBtn.addEventListener("click", 
            function() {
                viewProject(id);
            }
        );

        // Listener sul bottone di eliminazione del progetto
        let deleteProjectBtn = cardNode.querySelector('.btn-delete-project');
        deleteProjectBtn.addEventListener("click", 
            function() {
                removeProject(id);
            }
        );
    }


}

function addProject(id) {
    console.log("Adding progect n. " + id); 
}

function viewProject(id) {
    console.log("Viewing project n. " + id);
    createViewProjectPage(id);
}

function removeProject(id){
    console.log("Removing project n. " + id);
    // Inserisco l'id del progetto nell'elemento span più interno della modal
    document.querySelector("#id-project-to-be-deleted").innerText = id;

    // Mostro la modal
    $('#deleteModal').modal('show');

    // TODO: Listener sul bottone "Yes, I'm sure", e conseguente eliminazione dal DB
}


