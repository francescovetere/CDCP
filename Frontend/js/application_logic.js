// Variabili globali
// ************  TODO: dovranno chiaramente diventare locali, lasciarle globali è cattivo stile

// Il contenuto variabile della pagina 
let variableContent = document.getElementById("variable-content");

// Array di projects
let projects = [];

// Create Scroll to Top in all page
// ************ TODO: Risolvere waning
$(document).ready(function(){
    $('body').append('<div id="toTop" class="btn btn-info"><span class="fas fa-arrow-up"></span> Back to Top</div>');

    // Warning: "This site appears to use a scroll-linked positioning effect. This may not work well with asynchronous panning;"
    // https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
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

// createLoginPage();
createProjectsPage();