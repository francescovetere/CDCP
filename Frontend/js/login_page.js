function createLoginPage() {
    // Recupero l'HTML del template della form di login
    let loginHTML = document.querySelector('script#login-form-template').textContent;

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = loginHTML;
    
    // Cliccando su "New to CDCP? Sign in!", viene richiamata la funzione per la costruzione della pagina di login
    document.getElementById("sign-in-redirect").addEventListener("click", createRegistrationPage);

    // Cliccando su "Login", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se il login va a buon fine, si viene redirezionati alla pagina dei progetti, che funge da home page per l'utente
    document.getElementById("btn-login-id").addEventListener("click",
        function() {
            // TODO
            // - validazione parametri
            // - chiamata AJAX al server
            // (N.B.: E' una chiamata AJAX, quindi la funzione in cui viene chiamata (questa) dovrà essere essere async!!!)
            // - se risposta positiva: createProjectsPage();

            createProjectsPage();
        }
    );
}