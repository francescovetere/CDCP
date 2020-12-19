'use strict';

function createRegistrationPage() {
    // Recupero l'HTML del template della form di registrazione
    let registrationHTML = document.querySelector('script#registration-form-template').textContent;

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = registrationHTML;

    // Cliccando su "Alredy have an account? Login!", viene richiamata la funzione per la costruzione della pagina di login
    document.getElementById("login-redirect").addEventListener("click", createLoginPage);
    

    // Reset password custom validity message
    let passValidity  = document.querySelector("#id-conf-password");
    passValidity.oninput = (event) => {
        event.target.setCustomValidity('');
    }

    // Cliccando su "Sign in", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se la registrazione va a buon fine, si viene redirezionati alla pagina di login
    document.getElementById("btn-registration-id").addEventListener("click",
        function() {

            let username = $("#id-nickname").val();
            let mail = $("#id-email").val();
            let pwd = $("#id-password").val();
            let confPwd = document.getElementById("id-conf-password");

            if(pwd != confPwd.value){
                confPwd.setCustomValidity("Password doesn't match!");
            }else{
                confPwd.setCustomValidity("");
                
                // AJAX con JQuery
                let formData = {nickname : username, email: mail, password: pwd};
                $.ajax({
                    url: 'api/sign-up',
                    type: 'POST',
                    data : JSON.stringify(formData),
                    contentType: 'application/json',
                    success: function(response){
                        alert("Registration completed!"); // solo per debug adesso
                        variableContent.innerHTML = "";
                        createLoginPage();
                    },
                    error: function(error){
                        alert("Nickname '" + username + "' is not available!");
                    }
                });
            }

        }
    );
}