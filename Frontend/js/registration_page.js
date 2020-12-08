function createRegistrationPage() {
    // Recupero l'HTML del template della form di registrazione
    let registrationHTML = document.querySelector('script#registration-form-template').textContent;

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = registrationHTML;
    
    // Cliccando su "Sign in", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se la registrazione va a buon fine, si viene redirezionati alla pagina di login
    document.getElementById("btn-registration-id").addEventListener("click",
        function() {

            let username = $("#id-nickname").val();
            let mail = $("#id-email").val();
            let pwd = $("#id-password").val();

            // AJAX con JQuery
            let formData = {nickname : username, email: mail, password: pwd};
            $.ajax({
                url: 'api/sign-up',
                type: 'POST',
                data : JSON.stringify(formData),
                contentType: 'application/json',
                success: function(response){
                    alert("Registrazione avvenuta con successo!"); // solo per debug adesso
                    variableContent.innerHTML = "";
                    createLoginPage();
                },
                error: function(error){
                    alert("Hai inserito i dati sbagliati!"); // e' solo per debug attualmente, poi lo faremo piu' carino...
                }
            });

        }
    );
}