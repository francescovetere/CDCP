function createRegistrationPage() {
    // Recupero l'HTML del template della form di registrazione
    let registrationHTML = document.querySelector('script#registration-form-template').textContent;

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = registrationHTML;
    
    // Cliccando su "Sign in", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se la registrazione va a buon fine, si viene redirezionati alla pagina di login
    document.getElementById("btn-registration-id").addEventListener("click",
        function() {
            // TODO
            // - validazione parametri
            // - chiamata AJAX al server 
            // (N.B.: E' una chiamata AJAX, quindi la funzione in cui viene chiamata (questa) dovrà essere essere async!!!)
            // - se risposta positiva: createLoginPage();
        }
    );
}