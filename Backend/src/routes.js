const Project = require("./Project");
const DBManager = require("./DBManager");

let dbm = new DBManager();
const uuid = require('uuid').v4;

// Esempio di chiamata POST per l'inserimento di un example in un progetto esistente
// > http POST localhost:8000/project/9deb6ee5-e401-4d8f-9796-feeae2d63d69 'inputType=text' 'inputValue=lorem ipsum' 
//  'tags=[
//          {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
//          {"tagName": "colors", "tagValues": ["white", "black"]}
//        ]'
function routes(app) {

    /******************
     * USERS ROUTES 
     ******************/
 

    /**
    * Registrazione utente
    * Parametri: vuoto
    * Body: nickname, email, password
    * Risposta positiva: success
    * Risposta negativa: error
    */
    app.post('/sign-up', async (req, resp) => {
        console.log("Registrating user");

        let nickname = req.body.nickname;
        let email = req.body.email;
        let password = req.body.password; // la password andra' cifrata con hash prima di essere inserita
        let registrationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Validazione campi body
        if(req.body.password == "" || req.body.nickname == "" || req.body.email == "") {
            console.log("User not inserted\n");

            resp.status(400);
            resp.json({error: "Some fields are missing"});
            return;
        }

        // Inserimento del nuovo utente
        let id = uuid();

        try {
            let sql = "INSERT INTO Users(id, nickname, email, password, registrationDate) VALUES (?, ?, ?, ?, ?)";
            let params = [id, nickname, email, password, registrationDate];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        console.log("User inserted correctly\n");
        resp.status(201);
        resp.json({success: "Registration successful"});
        
    });

    
    /**
    * Login utente
    * Parametri: vuoto
    * Body: nickname, password
    * Risposta positiva: success
    * Risposta negativa: error
    */
    app.post('/login', async (req, resp) => {
        console.log("Loggin in user");

        let nickname = req.body.nickname;
        let password = req.body.password; // la password andra' cifrata con hash prima di essere controllata
        
        let result;

        try {   
            let sql = "SELECT * FROM Users WHERE BINARY ? = nickname AND BINARY ? = password";
            let params = [nickname, password];
            result = await dbm.execQuery(sql, params);
        } 
        
        catch(err) {
            console.log(err);
        }
        
        if(result.length === 0) {
            console.log("Login failed\n");
            resp.status(401);
            resp.json({error: "Login failed"});
            return;
        }
        
        console.log("User logged correctly\n");
        resp.status(200);
        resp.json({success: "Login successful"});
    });



    /******************
     * PROJECTS ROUTES 
     ******************/

    /**
     * Restituzione di tutti i progetti
     * Parametri: vuoto
     * Body: vuoto
     * Risposta positiva: Tutti i progetti
     * Risposta negativa: nessuna
     */
    app.get('/projects', async (req, resp) => {
        console.log("Retrieving all projects");
        
        // Recupero tutti i progetti
        let queryResult = [];
        try {
            let sql = 'SELECT * FROM Projects;';
            queryResult = await dbm.execQuery(sql);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let projects = [];
        for(let i = 0; i < queryResult.length; ++i) {
            projects.push(queryResult[i]);
        }

        // Invio il numero totale dei progetti, e l'array dei progetti stessi
        resp.status(200);
        resp.json({
            total: projects.length,
            results: projects
        });

        console.log("Projects retrieved correctly\n");
    });
    
    /**
     * Inserimento di un nuovo progetto
     * Parametri: vuoto
     * Body: title, inputType
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.post('/project', async (req, resp) => {
        console.log("Inserting new project");

        let title = req.body.title;
        let inputType = req.body.inputType;

        // Validazione campi body
        if(inputType != "text" && inputType != "image") {
            console.log("Project not inserted\n");

            resp.status(400);
            resp.json({error: "inputType must be 'text' or 'image'"});
            return;
        }

        // Inserimento del nuovo progetto
        let id = uuid();

        try {
            let sql = 'INSERT INTO Projects(id, title, inputType) VALUES (?, ?, ?)';
            let params = [id, title, inputType];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        console.log("Project inserted correctly\n");

        resp.status(201);
        resp.json({success: "Project inserted correctly"});
        
    });

    /**
     * Aggiornamento di un progetto esistente
     * Parametri: id progetto
     * Body: title, inputType
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.put('/project/:id', async (req, resp) => {
        console.log("Updating project");

        let id = req.params.id;
        let title = req.body.title;
        let inputType = req.body.inputType;

        // Validazione campi body
        if(inputType != "text" && inputType != "image") {
            console.log("Project not updated\n");

            resp.status(400);
            resp.json({error: "inputType must be 'text' or 'image'"});
            return;
        }

        let result;
        try {
            let sql = 'UPDATE Projects SET title=?, inputType=? WHERE id=?';
            let params = [title, inputType, id];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Ricerca del progetto con l'id fornito nell'URL
        // il campo affectedRows mi permette di capire se il progetto esiste o meno
        if(result.affectedRows == "0") {
            console.log("Project not found\n");

            resp.status(404);
            resp.json({error: "Project not found"});
            return;
        }

        console.log("Project updated correctly\n");

        resp.status(200);
        resp.json({success: "Project updated correctly"});
    });

    /**
     * Rimozione di un progetto esistente
     * Parametri: id progetto
     * Body: vuoto
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:id', async (req, resp) => {
        console.log("Deleting project");

        let id = req.params.id;

        let result;
        try {
            let sql = 'DELETE FROM Projects WHERE id=?';
            let params = [id];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Ricerca del progetto con l'id fornito nell'URL
        // il campo affectedRows mi permette di capire se il progetto esiste o meno
        if(result.affectedRows == "0") {
            console.log("Project not found\n");

            resp.status(404);
            resp.json({error: "Project not found"});
            return;
        }

        console.log("Project deleted correctly\n");

        resp.status(200);
        resp.json({success: "Project deleted correctly"});
    });



    /**********************************
     * PROJECT RECORDS/EXAMPLES ROUTES 
     **********************************/

    /**
     * Restituzione di tutti i record di un progetto
     * Parametri: id progetto
     * Body: vuoto
     * Risposta positiva: Tutti gli examples del progetto
     * Risposta negativa: error
     */
    app.get('/project/:projectId', async (req, resp) => {
        let projectId = req.params.projectId;
        console.log("Retrieving all examples of project with id=" + projectId);
        
        // Verifico l'esistenza del progetto
        let queryResult;
        try {
            let sql = 'SELECT * FROM Projects WHERE id = ?';
            let params = [projectId];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Se il progetto non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("Project with id=" + projectId + " not found\n");
            resp.status(404);
            resp.json({error: "Project with id=" + projectId + " not found"});
            return;
        }

        // In caso il progetto esista, recupero tutti i suoi examples
        try {
            let sql = 'SELECT * FROM Examples WHERE projectId = ?';
            let params = [projectId];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let examples = [];
        for(let i = 0; i < queryResult.length; ++i) {
            examples.push(queryResult[i]);
        }

        // Invio il numero totale dei record, e l'array dei record stessi
        resp.status(200);
        resp.json({
            total: examples.length,
            results: examples
        });

        console.log("Examples of project with id="+ projectId + " retrieved correctly\n");
    });

    /**
     * Inserimento di un nuovo record nel progetto
     * Parametri: id progetto
     * Body: inputType, inputValue, tags
     * Nota bene: tags è un campo composto in questo modo
     * tags: [
     *          {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
     *          {"tagName": "colors", "tagValues": ["white", "black"]}
     *       ]
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.post('/project/:projectId', async (req, resp) => {
        let projectId = req.params.projectId;
        console.log("Inserting new example in project with id=" + projectId);

        let inputType = req.body.inputType;
        let inputValue = req.body.inputValue;
        let tags = JSON.parse(req.body.tags);

        // Validazione campi body
        // Controllo sull'inputType
        if(inputType != "text" && inputType != "image") {
            console.log("inputType must be 'text' or 'image'\n");

            resp.status(400);
            resp.json({error: "inputType must be 'text' or 'image'"});
            return;
        }

        // Verifico l'esistenza del progetto
        let queryResult;
        try {
            let sql = 'SELECT * FROM Projects WHERE id = ?';
            let params = [projectId];
            queryResult = await dbm.execQuery(sql, params);
        }
 
        catch(err) {
            console.log(err);
        }

        // Se il progetto non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("Project with id=" + projectId + " not found\n");
            resp.status(404);
            resp.json({error: "Project with id=" + projectId + " not found"});
            return;
        }

        // In caso il progetto esista, inserisco il nuovo example
        let exampleId = uuid();
        try {
            let sql = `INSERT INTO Examples(id, projectId, inputType, inputValue) VALUES (?, ?, ?, ?)`

            let params = [exampleId, projectId, inputType, inputValue];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Inserisco tagNames e tagValues presenti eventualmente presenti nel campo tags, nelle rispettive tabelle
        for(let i = 0; i < tags.length; ++i) {
            let tagName = tags[i].tagName;
            // console.log(tagName);
            
            try {
                let sql = `INSERT INTO Examples(id, projectId, inputType, inputValue) VALUES (?, ?, ?, ?)`
    
                let params = [exampleId, projectId, inputType, inputValue];
                await dbm.execQuery(sql, params);
            }
    
            catch(err) {
                console.log(err);
            }
        }


        // console.log(tags[0].tagValues[1]);
        console.log("Example inserted correctly\n");

        resp.status(201);
        resp.json({success: "Example inserted correctly"});
    });

    /**
     * Aggiornamento di un record esistente nel progetto
     * Parametri: id progetto, id record
     * Body: TODO
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.put('/project/:projectId/:recordId', (req, resp) => {
        resp.status(418);
        resp.json("I'm a teapot");
    });

    /**
     * Rimozione di un record esistente nel progetto
     * Parametri: id progetto, id record
     * Body: vuoto
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:projectId/:recordId', (req, resp) => {
        resp.status(418);
        resp.json("I'm a teapot");
    });

    
}

module.exports = {routes};