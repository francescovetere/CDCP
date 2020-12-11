// Variabili globali
// ************  TODO: dovranno chiaramente diventare locali, lasciarle globali è cattivo stile

// Il contenuto variabile della pagina 
let variableContent = document.getElementById("variable-content");

// Array di projects
let projects = [];

// Array di projects
let examples = [];

// Create Scroll to Top in all page
// ************ TODO: Risolvere waning
$(document).ready(function(){
    $('body').append('<div id="toTop" class="btn btn-info" style="z-index: 6;"><span class="fas fa-arrow-up"></span> Back to Top</div>');

    // Warning: "This site appears to use a scroll-linked positioning effect. This may not work well with asynchronous panning;"
    // https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
    // https://stackoverflow.com/questions/50443959/what-is-the-alternative-to-scroll-linked-positioning-effect-to-prevent-perform
    
    $(window).scroll(function () { 
        if($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        }
        
        else {
            $('#toTop').fadeOut();
        }
    }); 

    $('#toTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
});


/****************************************/
/****************************************/
/******** LOGICA DI NAVIGAZIONE *********/ 
/****************************************/
/****************************************/

// Per il momento, commentare e decommentare per effettuare i test sulle varie pagine

// https://stackoverflow.com/questions/25962958/calling-a-javascript-function-in-another-js-file
$(window).on('load', function() {
    checkAuth("tk_auth");
});

// Logout (evita di doverlo fare in un file a parte e risolve l'errore se il bottone non esiste ancora)
function logout() {
    let thisDomain = window.location.hostname;
    deleteCookie("tk_auth", "/", thisDomain);

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

// Go to Home Logo 
function goToHome(){
    document.getElementById("variable-content").innerHTML = "";

    // devo salvarmi il nickname prima di eliminarlo
    let nickname = document.getElementById("NickLogged").textContent

    // Faccio un refresh navbar (parte del nickname)
    // Questo perche' abbiamo inserito la creazione di questa barra all'interno di createProjects..
    let nickbarContent = document.getElementById("nickChip");
    nickbarContent.remove();

    createProjectsPage(nickname);
}

/* SPERIMENTALE: Questa funzione impedisce ogni forma di refresh della pagina (anche dei form)
 Facendo cosi', dovremmo poi solo gestire il page back - page next! (guarda la funzione goToHome sopra)
 https://stackoverflow.com/questions/3527041/prevent-any-form-of-page-refresh-using-jquery-javascript 
P.S.: Se fai un refresh  con cookie salvato, ti fa rimanere nel sito. Se lo fai senza, ti riporta al login! 
Potrebbe aver senso, no? Il browser ti avvisa del reload (a modo suo) oppure dell'uscita dal sito (se fai il pageback dalla root)
 */
window.onbeforeunload = function() {
    return "Dude, are you sure you want to leave? Think of the kittens!"; // non viene mostrato però..
}