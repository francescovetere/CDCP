/* Protitipi di funzioni per cookies */ 

// Crea un cookie. Siccome non e' in https, non si puo' impostare il flag Secure. 
function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";SameSite=Lax";
}

// Legge un cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Validazione cookie di autenticazione
function checkAuth(name) {
    let cookieValues = getCookie(name);

    if(cookieValues!= "") { // check if cookie exist (Remember me checked)

        cookieValues = JSON.parse(cookieValues);

        if (cookieValues[0] != "" && cookieValues[1] != "") {
          /* Faccio il check nel db e se e' tutto giusto procedo */
          let cookieData = {nickname : cookieValues[0], tk: cookieValues[1]};
              $.ajax({
                url: 'api/auth',
                type: 'POST',
                data : JSON.stringify(cookieData),
                contentType: 'application/json',
                success: function(response){
                     createProjectsPage(cookieValues[0]);
                },
                error: function(error) {
                  variableContent.innerHTML = "<h1>Server error</h1><h2>Try to reload page</h2>";
                  deleteCookie(name, "/", "cdcp");
                }
            });

             
        }

        else {
          /* TODO: Che succede se il cookie e' in formato non valido? -> cancello/invalido */
          variableContent.innerHTML = "<h1>Server error</h1>";
          deleteCookie(name, "/", "cdcp");
          createLoginPage();
        }

    } 

    else { // if not exist, go to login page
        createLoginPage();
    }
}

// Cancella ("invalida") un cookie impostando la data di scadenza al minimo (comporta cancellazione dal browser)
function deleteCookie( name, path, domain ) {
  if( getCookie( name ) ) {
    document.cookie = name + "=" +
      ((path) ? ";path="+path:"")+
      ((domain)?";domain="+domain:"") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=Lax";
  }
}