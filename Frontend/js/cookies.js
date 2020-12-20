'use strict';

/* Protitipi di funzione per cookies */ 

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

// Due check: prima controllo se esiste il cookie di autenticazione. Se esiste, procedo con la creazione della pagina dei progetti
// Se non esiste tale cookie, controllo se eventualmente esiste quello di sessione, e in caso positivo procedo sempre alla creazione della 
// pagina dei progetti, recuperando il nickname dal sessionStorage (settato in projects_page)
// Se non esiste nemmeno questo cookie, creo invece la pagina di login
function checkAuth(name) {
    let cookieValues = getCookie(name);
    let cookieSession = getCookie("id_session");

    if(cookieValues != "") { // check if cookie auth exist (Remember me checked)

        cookieValues = JSON.parse(cookieValues);

        if (cookieValues[0] != "" && cookieValues[1] != "") {
          /* Faccio il check nel db e se e' tutto corretto procedo */
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
          /* Che succede se il cookie e' in formato non valido? -> cancello/invalido */
          variableContent.innerHTML = "<h1>Server error</h1>";
          deleteCookie(name, "/", "cdcp");
          createLoginPage();
        }

    } 

    else { // if not exist, check session cookie
        if(cookieSession!="" && sessionStorage.getItem("nick_session")){
          // recupera il nickname dal local storage anziche' da una variabile globale 
          // per evitare la sovrascrittura ad ogni refresh
          createProjectsPage(sessionStorage.getItem("nick_session")); 
        }
        else
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