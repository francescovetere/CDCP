'use strict';

// Il contenuto variabile della pagina 
let variableContent = document.getElementById("variable-content");


// Logout
function logout() {
    let thisDomain = window.location.hostname;

    // Delete all cookies on logout
    deleteCookie("tk_auth", "/", thisDomain);
    deleteCookie("id_session", "/", thisDomain);
    sessionStorage.setItem("nick_session", "");

    // Rimuovo navbar (parte del nickname)
    let nickbarContent = document.getElementById("nickChip");
    nickbarContent.remove();

    createLoginPage();
}

// Apertura Stats
function viewStats() {

    // Clear della pagina 
    document.getElementById("variable-content").innerHTML = "";

    createStatsPage();
}

// Apertura Logs
function viewLogs() {

    // Clear della pagina
    document.getElementById("variable-content").innerHTML = "";

    createLogsPage();
}

// Creazione del bottone di "Back To Top" 
// (necessario inserirlo a livello globale, in quanto deve essere sempre visibile)
$(document).ready(function(){
    // inserimento del codice HTML relativo al bottone stesso
    $('body').append('<div id="toTop" class="btn btn-info" style="z-index: 6;"><span class="fas fa-arrow-up"></span> Back to Top</div>');

    // gestione dell'evento di scrolling sulla pagina
    $(window).scroll(function () { 
        if($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        }
        
        else {
            $('#toTop').fadeOut();
        }
    }); 

     // gestione dell'evento di click sul bottone di scroll to top
    $('#toTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});

/****************************************/
/****************************************/
/************* ENTRY POINT **************/ 
/****************************************/
/****************************************/

$(window).on('load', function() {
    // Gestione dei cookies (cookies.js)
    checkAuth("tk_auth");
});