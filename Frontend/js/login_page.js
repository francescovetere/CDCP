'use strict';

function createLoginPage() {
    
    // Recupero l'HTML del template della form di login
    let loginHTML = document.querySelector('script#login-form-template').textContent;

    // Inserisco l'HTML recuperato nel div che rappresenta il contenuto variabile
    variableContent.innerHTML = loginHTML;
    
    // Cliccando su "New to CDCP? Sign in!", viene richiamata la funzione per la costruzione della pagina di registrazione
    document.getElementById("sign-in-redirect").addEventListener("click", createRegistrationPage);

    // Cliccando su "Login", viene fatta la chiamata AJAX al server (validando prima i campi)
    // Se il login va a buon fine, si viene redirezionati alla pagina dei progetti, che funge da home page per l'utente
    document.getElementById("btn-login-id").addEventListener("click",
        function() {

            let username = $("#id-nickname").val();
            let pwd = $("#id-password").val();

            // AJAX con JQuery per login
            let formData = {nickname : username, password: pwd};
            $.ajax({
                url: 'api/login',
                type: 'POST',
                data : JSON.stringify(formData),
                contentType: 'application/json',
                success: function(response){
                    
                    if ($('#RememberMe').prop('checked')) {
                        
                        // AJAX GET (JQuery) to retrieve TK from backend
                        $.post("api/tk",
                        {
                          nickname: username
                        },
                        function(data, status){
                            let cookieArguments = [username, data];
                            setCookie("tk_auth", JSON.stringify(cookieArguments), 30); // set cookie 30 days                      
                        });

                    }

                    setCookie("id_session", Math.random()); // cookie to keep session alive on refresh
                    createProjectsPage(username);
                    document.getElementById("NickLogged").innerHTML = username;
                    

                },
                error: function(error){
                    alert("Login failed!");
                }
            });

        }
    );
}
