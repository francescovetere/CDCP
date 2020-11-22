function init_vendors(){
    const vendors = `
    <!-- Fonts -->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">

    <!-- Bootstrap CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
  
    <!-- Custom CSS -->
    <link href="css/custom.css" rel="stylesheet"> 
    
    <!-- JQuery -->
    <script src="vendor/jquery/jquery.min.js" type="text/javascript"></script> 
  
    <!-- Bootstrap core JavaScript-->
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js" type="text/javascript"></script> 
`;

    document.getElementById("vendors").innerHTML = vendors;

}

init_vendors();