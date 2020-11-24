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
    document.getElementById("btn-login-id").addEventListener("click",
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
    // Creo iinfatti un div esterno che conterrà tutte le card dei progetti
    let projectsDiv = document.createElement("div");
    projectsDiv.setAttribute("class", "row");
    projectsDiv.setAttribute("id", "external-project-div")
    
    // Inserisco nel div appena creato l'HTML di 9 project card di esempio
    for(let i = 0; i < 9; ++i)
        projectsDiv.innerHTML += projectCardHTML;

    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(projectsDiv);
}

function createLogsPage() {
    //TODO
}

function createStatsPage() {
    //TODO
}



/****************************************/
/****************************************/
/******** LOGICA DI NAVIGAZIONE *********/ 
/****************************************/
/****************************************/

// Per il momento, commentare e decommentare per effettuare i test sulle varie pagine

// createLoginPage();
createProjectsPage();