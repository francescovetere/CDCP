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


// Logica di creazione delle pagine
createLoginPage();