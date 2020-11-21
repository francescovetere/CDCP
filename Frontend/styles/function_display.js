function display_header(){
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "template/overall_header.html"); // debug: set async false
    ajax.send();
    document.body.innerHTML += ajax.responseText;
}

function display_footer(){
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "template/overall_footer.html");
    ajax.send();
    document.body.innerHTML += ajax.responseText;
}


/* Jquery version: 

$(function() {
    $('#content').load('/templates.html');
});

*/


/*
Access to Script at ' from origin 'null' has been blocked by CORS policy!
 -> file:// requests will not work, but you can run a local webserver
*/