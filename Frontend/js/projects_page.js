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

function createProjectsPage() {
    // Creo il bottone dell'utente nella navbar, in alto a destra
    let navbarContent = document.getElementById("id-navbar");
    let navbarNickHTML = document.querySelector("script#navbar-nickname").textContent;

    navbarContent.innerHTML += navbarNickHTML;
    document.getElementById("NickLogged").innerHTML = "Nickname"; // da sostituire con il nickname che viene passato in fase di login

    // La card non andrà inserita direttamente nel div variabile:
    // Creo infatti un div esterno che conterrà tutte le card dei progetti
    let projectsDiv = document.createElement("div");
    projectsDiv.setAttribute("class", "row");
    projectsDiv.setAttribute("id", "external-project-div");
    
    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(projectsDiv);
 
    // creo N projects di esempio
    let N = 20;
    let projects = [];

    for (let i = 0; i < N; ++i) projects.push(new Project(i, "Title" + i, "text"));

    for(let i = 0; i < N; ++i) {
        let projectCardTemplate = document.querySelector('script#project-card-template');

        projectsDiv.innerHTML += projectCardTemplate.innerText; 
        
        let cardNode = document.getElementById("card-content");
        cardNode.setAttribute("id", cardNode.getAttribute("id") + "-" + i); // e.g.: card-content-0

        projectsDiv.appendChild(cardNode);
    }

    for(let i = 0; i < N; ++i) {
        console.log(document.getElementById("card-content-"+i).id);
    }

    // Blocco gestito con JQuery ma da riadattare in altro modo. Questo è solo a scopo dimostrativo per prendere esempio
    // let idCount = 1;
    // $('#external-project-div .IDProjectTitle').each(function() {
    //     $(this).html("#ID-"+idCount);
    //     idCount++;
    // });

    // idCount = 1;
    // $('#external-project-div #delete-').each(function() {
    //     $(this).attr('id', 'delete-' + idCount);
    //     idCount++;
    // });

    // idCount = 1;
    // $('#external-project-div .IDProjectContent').each(function() {
    //     $(this).html("prova contenuto di #ID-"+idCount);
    //     idCount++;
    // });

    
    // Crea finestra modale per eliminazione
    let deleteModalHTML = document.querySelector('script#delete-card-modal').textContent;
    projectsDiv.innerHTML += deleteModalHTML;


    // Associo i listener
    // document.getElementById("id-btn-delete-project").addEventListener("click", 
    //     function() {
    //         removeProject(this.id)
    //     }
    
    // );
}

function addProject(id) {
    //TODO
}

function removeProject(id){
    let ret_id = id.replace('delete-','');
    $(document).ready(function(){
        $(".deleteBody").html("Sei sicuro di voler eliminare il progetto #ID-"+ret_id+" ?");
      });
    $('#deleteModal').modal('show');
}


