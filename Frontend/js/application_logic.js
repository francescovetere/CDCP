// Variabile globale che rappresenta il contenuto variabile della pagina 
// TODO: dovrà chiaramente diventare locale, lasciarla globale è cattivo stile
let variableContent = document.getElementById("variable-content");

function createLoginPage() {
    // Recupero l'HTML del template della form di login
    let loginHTML = document.querySelector('script#login-form-template').textContent;

    // Cliccando su "New to CDCP? Sign in!", viene richiamata la funzione per la costruzione della pagina di login
    document.getElementById("sign-in-redirect").addEventListener("click", createRegistrationPage);

    // Cliccando su "Login", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se il login va a buon fine, si viene redirezionati alla pagina dei progetti, che funge da home page per l'utente
    document.getElementById("btn-login-id").addEventListener("click",
        function() {
            // TODO
            // - validazione parametri
            // - chiamata AJAX al server
            // - se risposta positiva: createProjectsPage();
        }
    );

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = loginHTML;
}

function createRegistrationPage() {
    // Recupero l'HTML del template della form di registrazione
    let registrationHTML = document.querySelector('script#registration-form-template').textContent;

    // Cliccando su "Sign in", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se la registrazione va a buon fine, si viene redirezionati alla pagina di login
    document.getElementById("btn-registration-id").addEventListener("click",
        function() {
            // TODO
            // - validazione parametri
            // - chiamata AJAX al server
            // - se risposta positiva: createLoginPage();
        }
    );

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = registrationHTML;
}

function createProjectsPage() {
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
    let deleteModalHTML = document.querySelector('script#delete-card-Modal').textContent;
    projectsDiv.innerHTML += deleteModalHTML;
}

function createLogsPage() {
    //TODO
}

function createStatsPage() {
    //TODO
}

function removeProject(id){
    let ret_id = id.replace('delete-','');
    $(document).ready(function(){
        $(".deleteBody").html("Sei sicuro di voler eliminare il progetto #ID-"+ret_id+" ?");
      });
    $('#deleteModal').modal('show');
}

// Create Scroll to top in all page
$(document).ready(function(){
    $('body').append('<div id="toTop" class="btn btn-info"><span class="fas fa-arrow-up"></span> Back to Top</div>');
      $(window).scroll(function () {
          if ($(this).scrollTop() != 0) {
              $('#toTop').fadeIn();
          } else {
              $('#toTop').fadeOut();
          }
      }); 
  $('#toTop').click(function(){
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
  });
});

/****************************************/
/****************************************/
/******** LOGICA DI NAVIGAZIONE *********/ 
/****************************************/
/****************************************/

// Per il momento, commentare e decommentare per effettuare i test sulle varie pagine

// createLoginPage();
createProjectsPage();