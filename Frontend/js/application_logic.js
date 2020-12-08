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
    deleteCookie("tk_auth", "/", "localhost");

    // fare un clear della navbar (parte del nickname)
    let nickbarContent = document.getElementById("nickChip");
    nickbarContent.remove();

    createLoginPage();
}