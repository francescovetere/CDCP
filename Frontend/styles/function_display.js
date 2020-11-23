function display_header(){
    const template = `
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="content-container">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <nav class="navbar bg-white shadow mb-4">
                   <h1>CDCP</h1>
                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid overflow-auto">`;

    document.querySelector(".customHeader").innerHTML = template;
}

function display_footer(){
    const template = `
            </div>
            <!-- /.container-fluid -->

        </div>
        <!-- End of Main Content -->

                <!-- Footer -->
                <footer class="sticky-footer shadow-lg bg-white mt-5">
                <div class="container my-auto">
                <div class="copyright text-center my-auto">
                <span>Copyright &copy; SpaghettiCode-Labs</span>
                </div>
                </div>
                </footer>
                <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->


        </div>
        <!-- End of Page Wrapper -->
`;

    document.querySelector(".customFooter").innerHTML = template;

}

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
display_header();
display_footer();