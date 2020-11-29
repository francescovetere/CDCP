function createProjectsPage() {
    // Creo il bottone dell'utente nella navbar, in alto a destra
    let navbarContent = document.getElementById("id-navbar");
    let navbarNickHTML = document.querySelector("script#navbar-nickname").textContent;

    navbarContent.innerHTML += navbarNickHTML;
    document.getElementById("NickLogged").innerHTML = "Nickname"; // da sostituire con il nickname che viene passato in fase di login
    
    // Recupero l'HTML del template della project card
    let projectCardHTML = document.querySelector('script#project-card-template').textContent;
    // TODO: Aggiungere all'elemento i vari listener dove servono

    // La card non andrà inserita direttamente nel div variabile:
    // Creo infatti un div esterno che conterrà tutte le card dei progetti
    let projectsDiv = document.createElement("div");
    projectsDiv.setAttribute("class", "row");
    projectsDiv.setAttribute("id", "external-project-div");
    
 
    // Inserisco nel div appena creato l'HTML di 9 project card di esempio
    for(let i = 0; i < 19; ++i){
        projectsDiv.innerHTML += projectCardHTML;
        //deleteProj[i].id = "prova-delete-" + i;
    }

    // Svuoto la pagina
    variableContent.innerHTML = "";
    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(projectsDiv);

    // Blocco gestito con JQuery ma da riadattare in altro modo. Questo è solo a scopo dimostrativo per prendere esempio
    let idCount = 1;
    $('#external-project-div .IDProjectTitle').each(function() {
        $(this).html("#ID-"+idCount);
        idCount++;
    });

    idCount = 1;
    $('#external-project-div #delete-').each(function() {
        $(this).attr('id', 'delete-' + idCount);
        idCount++;
    });

    idCount = 1;
    $('#external-project-div .IDProjectContent').each(function() {
        $(this).html("prova contenuto di #ID-"+idCount);
        idCount++;
    });

    
    // Crea finestra modale per eliminazione
    let deleteModalHTML = document.querySelector('script#delete-card-modal').textContent;
    projectsDiv.innerHTML += deleteModalHTML;


    // Associo i listener
    document.getElementById("id-btn-delete-project").addEventListener("click", 
        function() {
            removeProject(this.id)
        }
    
    );
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


