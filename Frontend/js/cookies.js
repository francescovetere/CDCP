/* Protitipi di funzioni per cookies */ 

// Crea un cookie
function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
    let pwd = $("#id-password").val();

    if(cookieValues!= ""){ // check if cookie exist

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
                error: function(error){
                   /* TODO: Che succede se il cookie non e' valido dal check nel db? -> cancello/invalido */
                }
            });

             
        }
        else{
          /* TODO: Che succede se il cookie e' in formato non valido? -> cancello/invalido */
          createLoginPage();
        }

    } else { // if not exist, go to login page
        createLoginPage();
    }
}

// Cancella un cookie impostando la data di scadenza al minimo (comporta cancellazione dal browser)
function deleteCookie( name, path, domain ) {
  if( getCookie( name ) ) {
    document.cookie = name + "=" +
      ((path) ? ";path="+path:"")+
      ((domain)?";domain="+domain:"") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}