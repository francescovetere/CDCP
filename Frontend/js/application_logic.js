let variableContent = document.getElementById("variable-content");

function createLoginPage() {
    let loginHTML = document.querySelector('script#login-form-template').textContent;
    variableContent.innerHTML = loginHTML;

    // Se clicco su "New to CDCP? Sign in!", carico la pagina di login
    document.getElementById("sign-in-redirect").addEventListener("click", createRegistrationPage);
}

function createRegistrationPage() {
    let registrationHTML = document.querySelector('script#registration-form-template').textContent;
    variableContent.innerHTML = registrationHTML;
}

function createProjectsPage() {
    // Creo il div esterno che conterrà tutti i progetti
    let externalProjectDiv = document.createElement("div");
    externalProjectDiv.setAttribute("class", "row");
    externalProjectDiv.setAttribute("id", "cardContent");
    
    // Recupero l'HTML del template della project card
    let projectCardHTML = document.querySelector('script#project-card-template').textContent;
    
    // Inserisco nel div appena creato l'HTML di 9 project card di esempio
    for(let i = 0; i < 9; ++i)
        externalProjectDiv.innerHTML += projectCardHTML;

    // Appendo al div principale della pagina il nuovo div contenente tutti i progetti
    variableContent.appendChild(externalProjectDiv);
}

function createLogsPage() {
    //TODO
}

function createStatsPage() {
    //TODO
}

// Logica di creazione delle pagine
// createLoginPage();
createProjectsPage();