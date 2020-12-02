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

            let username = $("#id-nickname").val();
            let pwd = $("#id-password").val();

            // AJAX con JQuery
            let formData = {nickname : username, password: pwd};
            $.ajax({
                url: 'api/login',
                type: 'POST',
                data : JSON.stringify(formData),
                contentType: 'application/json',
                success: function(response){
                    variableContent.innerHTML = "";
                    createProjectsPage();
                    document.getElementById("NickLogged").innerHTML = username;
                },
                error: function(error){
                    alert("Hai inserito i dati sbagliati!"); // e' solo per debug attualmente, poi lo faremo piu' carino...
                }
            });

        }
    );
}