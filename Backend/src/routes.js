const DBManager = require("./DBManager");

let dbm = new DBManager();
const uuid = require('uuid').v4;


function routes(app) {

    /******************
     * LOGS ROUTES 
     ******************/

    /**
     * Restituzione di tutti i record della tabella Logs
     * Parametri: vuoto
     * Body: vuoto
     * Risposta positiva: Tutti i logs
     * Risposta negativa: nessuna
     * 
     * TODO: Aggiungere un record nella tabella Logs per (quasi) ogni API
     */
    app.get('/logs', async (req, resp) => {
        console.log("Retrieving all log records\n");
        
        let queryResult = [];
        try {
            let sql = 'SELECT * FROM Logs';
            queryResult = await dbm.execQuery(sql);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let logs = [];
        for(let i = 0; i < queryResult.length; ++i) {
            logs.push(queryResult[i]);
        }

        // Invio il numero totale dei record, e l'array dei record stessi
        resp.status(200);
        resp.json({
            total: logs.length,
            results: logs
        });

        console.log("Logs retrieved correctly\n");
    });

    

    /******************
     * STATS ROUTES 
     ******************/
    
     /**
     * Restituzione di tutte le statistiche desiderate
     * Parametri: vuoto
     * Body: vuoto
     * Risposta positiva: Tutti i record che soddisfano le statistiche richieste
     * Risposta negativa: nessuna
     * 
     * TODO: Scrivere la stirnga SQL per il recupero delle statistiche dalle varie tabelle esistenti
     */
    app.get('/stats', async (req, resp) => {
        console.log("Retrieving all stats\n");
        
        let queryResult = [];
        try {
            // TODO
            // let sql = '...';
            // queryResult = await dbm.execQuery(sql);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let stats = [];
        for(let i = 0; i < queryResult.length; ++i) {
            logs.push(queryResult[i]);
        }

        // Invio il numero totale dei record, e l'array dei record stessi
        resp.status(200);
        resp.json({
            total: stats.length,
            results: stats
        });

        console.log("Stats retrieved correctly\n");
    });




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
        console.log("Login in user");

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


    /**
    * Validazione cookie autenticazione
    * Parametri: vuoto
    * Body: nickname, 
    * Risposta positiva: success
    * Risposta negativa: error
    */

    app.post('/auth', async (req, resp) => {
        console.log("Auth token user");

        let nickname = req.body.nickname;
        let tk = req.body.tk;

        let currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let result;

       
        try {   
            let sql = "SELECT * FROM TokenAuth WHERE BINARY ? = nickname AND BINARY ? = token AND ? <= expirationDate AND expired = 0";
            let params = [nickname, tk, currentDate];
            result = await dbm.execQuery(sql, params);
        } 
        
        catch(err) {
            console.log(err);
        }
        
        if(result.length === 0) {
            console.log("Auth cookie failed\n");
            // Invalidiamo il cookie? (expired = 1)
            resp.status(401);
            resp.json({error: "Auth cookie failed"});
            return;
        }
        

        console.log("Cookie validated correctly\n");
        resp.status(200);
        resp.json({success: "auth successful"});
    });


    /**
     * Restituzione di token
     * Parametri: vuoto
     * Body: vuoto
     * Risposta positiva: token
     * Risposta negativa: nessuna
     */

    app.post('/tk', async (req, resp) => {
        console.log("Retrieving auth token");
        
        let tk = uuid();
        let nickname = req.body.nickname;

        // add 30 days to current day
        let d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        d.toISOString().slice(0, 19).replace('T', ' ');

        try {   
            let sql = "INSERT INTO TokenAuth(nickname, token, expired, expirationDate) VALUES(?,?,?,?)";
            let params = [nickname, tk, 0, d];
            result = await dbm.execQuery(sql, params);
        } 
        
        catch(err) {
            console.log(err);
        }

        resp.status(200);
        resp.json(tk);

        console.log("Token retrieved correctly\n");
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
     * PROJECT EXAMPLES ROUTES 
     **********************************/

    /**
     * Restituzione di tutti gli examples di un progetto
     * Parametri: id progetto
     * Body: vuoto
     * Risposta positiva: Tutti gli examples del progetto
     * Risposta negativa: error
     */
    app.get('/project/:projectId/examples', async (req, resp) => {tag
        let projectId = req.params.projectId;
        console.log("Retrieving examples");
        
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

        console.log("Examples retrieved correctly\n");
    });



    /**
     * Inserimento di un nuovo example nel progetto
     * Parametri: id progetto
     * Body: inputType, inputValue
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * TODO: verificare che inputType inserito sia uguale a quello del progetto
     */
    app.post('/project/:projectId/example', async (req, resp) => {
        let projectId = req.params.projectId;
        console.log("Inserting new example");

        let inputType = req.body.inputType;
        let inputValue = req.body.inputValue;
        // let tags;
        // if(req.body.tags) tags = JSON.parse(req.body.tags);

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
            let sql = 'INSERT INTO Examples(id, projectId, inputType, inputValue) VALUES (?, ?, ?, ?)'
            let params = [exampleId, projectId, inputType, inputValue];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // // Inserisco tagNames e tagValues presenti eventualmente presenti nel campo tags, nelle rispettive tabelle

        // // esempio di accesso: console.log(tags[0].tagValues[1]);
        // if(tags) {
        //     for(let i = 0; i < tags.length; ++i) {
        //         /*** inserisco ogni tagName nella tabella TagNames ***/
        //         let tagName = tags[i].tagName;
        //         // console.log(tagName);
                
        //         try {
        //             let sql = 'INSERT INTO TagNames(projectId, exampleId, tagName) VALUES (?, ?, ?)';
        //             let params = [projectId, exampleId, tagName];
        //             await dbm.execQuery(sql, params);
        //         }
        
        //         catch(err) {
        //             console.log(err);
        //             resp.status(400);
        //             resp.json({error: err});
        //             return;                
        //         }
                
        //         /*** per ogni tagValue associato al tagName corrente, effettuo un inserimento nella tabella TagValues ***/
        //         let tagValues = tags[i].tagValues;
        //         // console.log(tagValues);

        //         for(let j = 0; j < tagValues.length; ++j) {
        //             // console.log(tagValues[j]);
        //             try {
        //                 let sql = 'INSERT INTO TagValues(projectId, exampleId, tagName, tagValue) VALUES (?, ?, ?, ?)';
            
        //                 let params = [projectId, exampleId, tagName, tagValues[j]];
        //                 await dbm.execQuery(sql, params);
        //             }
            
        //             catch(err) {
        //                 console.log(err);
        //                 resp.status(400);
        //                 resp.json({error: err}); 
        //                 return; 
        //             }
        //         }
        //     }
        // }

        console.log("Example inserted correctly\n");

        resp.status(201);
        resp.json({success: "Example inserted correctly"});
    });



    /**
     * Aggiornamento di un example esistente nel progetto
     * Parametri: id progetto, id example
     * Body: inputType, inputValue
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * TODO: verificare che inputType inserito sia uguale a quello del progetto
     */
    app.put('/project/:projectId/example/:exampleId', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        console.log("Updating example");

        let inputType = req.body.inputType;
        let inputValue = req.body.inputValue;
        
        let queryResult;
        try {
            let sql = 'SELECT * FROM Examples WHERE id=?';
            let params = [exampleId];
            queryResult = await dbm.execQuery(sql, params);
        }
 
        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err});
            return;
        }

        // Se l'example non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("Example with id=" + exampleId + " not found\n");
            resp.status(404);
            resp.json({error: "Example with id=" + exampleId + " not found"});
            return;
        }

        // In caso l'example esista, lo aggiorno
        try {
            let sql = 'UPDATE Examples SET inputType=?, inputValue=? WHERE id=?'
            let params = [inputType, inputValue, exampleId];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err}); 
            return; 
        }

        // // Aggiorno tagNames e tagValues presenti eventualmente presenti nel campo tags, nelle rispettive tabelle
        // // esempio di accesso: console.log(tags[0].tagValues[1]);
        // if(tags) {
        //     for(let i = 0; i < tags.length; ++i) {
        //         /*** inserisco ogni tagName nella tabella TagNames ***/
        //         let tagName = tags[i].tagName;
        //         // console.log(tagName);
                
        //         try {
        //             let sql = 'UPDATE TagNames SET tagName=? WHERE exampleId=?';
        //             let params = [tagName, exampleId];
        //             await dbm.execQuery(sql, params);
        //         }
        
        //         catch(err) {
        //             console.log(err);
        //             resp.status(400);
        //             resp.json({error: err});
        //             return;                
        //         }
                
        //         /*** per ogni tagValue associato al tagName corrente, effettuo un inserimento nella tabella TagValues ***/
        //         let tagValues = tags[i].tagValues;
        //         // console.log(tagValues);

        //         if(tagValues) {
        //             for(let j = 0; j < tagValues.length; ++j) {
        //                 // console.log(tagValues[j]);
        //                 try {
        //                     let sql = 'UPDATE TagValues SET tagName=?, tagValue=? WHERE exampleId=?';
                
        //                     let params = [tagName, tagValues[j], exampleId];
        //                     await dbm.execQuery(sql, params);
        //                 }
                
        //                 catch(err) {
        //                     console.log(err);
        //                     resp.status(400);
        //                     resp.json({error: err}); 
        //                     return; 
        //                 }
        //             }
        //         }
        //     }
        // }

        console.log("Example updated correctly\n");

        resp.status(201);
        resp.json({success: "Example updated correctly"});
    });



    /**
     * Rimozione di un example esistente nel progetto
     * Parametri: id progetto, id example
     * Body: vuoto
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:projectId/example/:exampleId', async (req, resp) => {
        console.log("Deleting example");

        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;

        let result;
        try {
            let sql = 'DELETE FROM Examples WHERE id=?';
            let params = [exampleId];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Ricerca del progetto con l'id fornito nell'URL
        // il campo affectedRows mi permette di capire se il progetto esiste o meno
        if(result.affectedRows == "0") {
            console.log("Example not found\n");

            resp.status(404);
            resp.json({error: "Example not found"});
            return;
        }

        console.log("Example deleted correctly\n");

        resp.status(200);
        resp.json({success: "Example deleted correctly"});
    });

    

    /******************
     * TAGNAMES ROUTES 
     ******************/

    /**
     * Restituzione di tutti i tagNames di un example
     * Parametri: id progetto, id example
     * Body: vuoto
     * Risposta positiva: Tutti i tagNames dell'example
     * Risposta negativa: error
     */
    app.get('/project/:projectId/example/:exampleId/tagNames', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;

        console.log("Retrieving all tagNames of example with id=" + exampleId);
        
        // Verifico l'esistenza dell'example
        let queryResult;
        try {
            let sql = 'SELECT * FROM Examples WHERE id = ?';
            let params = [exampleId];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Se l'example non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("Example with id=" + projectId + " not found\n");
            resp.status(404);
            resp.json({error: "Example with id=" + projectId + " not found"});
            return;
        }

        // In caso l'example esista, recupero tutti i suoi tagNames
        try {
            let sql = 'SELECT * FROM TagNames WHERE exampleId = ?';
            let params = [exampleId];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let tagNames = [];
        for(let i = 0; i < queryResult.length; ++i) {
            tagNames.push(queryResult[i]);
        }

        // Invio il numero totale dei record, e l'array dei record stessi
        resp.status(200);
        resp.json({
            total: tagNames.length,
            results: tagNames
        });

        console.log("Examples of project with id="+ projectId + " retrieved correctly\n");
    });



    /**
     * Inserimento di un nuovo tagName nell'example
     * Parametri: id progetto, id example
     * Body: tagName
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * TODO: controllare di non inserire un tagName che esista già in quell'example
     */
    app.post('/project/:projectId/example/:exampleId/tagName', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;

        console.log("Inserting new tagName in example with id=" + exampleId);

        let tagName = req.body.tagName;

        // Verifico l'esistenza dell'example
        let queryResult;
        try {
            let sql = 'SELECT * FROM Examples WHERE id = ?';
            let params = [exampleId];
            queryResult = await dbm.execQuery(sql, params);
        }
 
        catch(err) {
            console.log(err);
        }

        // Se l'example non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("Example with id=" + projectId + " not found\n");
            resp.status(404);
            resp.json({error: "Example with id=" + projectId + " not found"});
            return;
        }

        // In caso l'example esista, inserisco il nuovo tagName
        try {
            let sql = 'INSERT INTO TagNames(projectId, exampleId, tagName) VALUES (?, ?, ?)'
            let params = [projectId, exampleId, tagName];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        console.log("TagName inserted correctly\n");

        resp.status(201);
        resp.json({success: "TagName inserted correctly"});
    });



    /**
     * Aggiornamento di un tagName esistente nell'example
     * Parametri: id progetto, id example, tagName
     * Body: tagName
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * TODO: controllare di non inserire un tagName che esista già in quell'example
     */
    app.put('/project/:projectId/example/:exampleId/tagName/:tagName', async (req, resp) => {
        console.log("Updating tagName");

        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;

        let newTagName = req.body.tagName;

        // Verifico l'esistenza del tagName
        let queryResult;
        try {
            let sql = 'SELECT * FROM TagNames WHERE projectId=? AND exampleId=? AND tagName=?';
            let params = [projectId, exampleId, tagName];
            queryResult = await dbm.execQuery(sql, params);
        }
 
        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err});
            return;
        }

        // Se il tagName non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("tagName not found\n");
            resp.status(404);
            resp.json({error: "tagName not found"});
            return;
        }

        // In caso il tagName esista, lo aggiorno
        try {
            let sql = 'UPDATE TagNames SET tagName=? WHERE exampleId=? AND tagName=?'
            let params = [newTagName, exampleId, tagName];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err}); 
            return; 
        }

        console.log("tagName updated correctly\n");

        resp.status(201);
        resp.json({success: "tagName updated correctly"});
    });



    /**
     * Rimozione di un tagName esistente nell'example
     * Parametri: id progetto, id example, tagName
     * Body: vuoto
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:projectId/example/:exampleId/tagName/:tagName', async (req, resp) => {
        console.log("Deleting tagName");

        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;

        let result;
        try {
            let sql = 'DELETE FROM TagNames WHERE exampleId=? AND tagName=?';
            let params = [exampleId, tagName];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        if(result.affectedRows == "0") {
            console.log("tagName not found\n");

            resp.status(404);
            resp.json({error: "tagName not found"});
            return;
        }

        console.log("tagName deleted correctly\n");

        resp.status(200);
        resp.json({success: "tagName deleted correctly"});
    });



    /******************
     * TAGVALUES ROUTES 
     ******************/

    /**
     * Restituzione di tutti i tagValues per un tagName di un example
     * Parametri: id progetto, id example, tagName
     * Body: vuoto
     * Risposta positiva: Tutti i tagValues per il tagName indicato, nell'example indicato
     * Risposta negativa: error
     */
    app.get('/project/:projectId/example/:exampleId/tagName/:tagName/tagValues', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;

        console.log("Retrieving all tagValues of tagName '" + tagName + "'");
        
        // Verifico l'esistenza del tagName
        let queryResult;
        try {
            let sql = 'SELECT * FROM TagNames WHERE projectId = ? AND exampleId = ? AND tagName = ?';
            let params = [projectId, exampleId, tagName];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Se il tagName non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("tagName '" + tagName + "' not found\n");
            resp.status(404);
            resp.json({error: "tagName '" + tagName + "' not found"});
            return;
        }

        // In caso il tagName esista, recupero tutti i suoi tagValues
        try {
            let sql = 'SELECT * FROM TagValues WHERE projectId = ? AND exampleId = ? AND tagName = ?';
            let params = [projectId, exampleId, tagName];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }
        
        // Ciclo sull'array risultato e costruisco l'array di risposta
        let tagValues = [];
        for(let i = 0; i < queryResult.length; ++i) {
            tagValues.push(queryResult[i]);
        }

        // Invio il numero totale dei record, e l'array dei record stessi
        resp.status(200);
        resp.json({
            total: tagValues.length,
            results: tagValues
        });

        console.log("tagValues of tagName '"+ tagName + "' retrieved correctly\n");
    });



    /**
     * Inserimento di un nuovo tagValue per un tagName dell'example
     * Parametri: id progetto, id example, tagName
     * Body: tagValue
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * 
     * TODO: controllare di non inserire un tagValue che esista già per quel tagName di quell'example
     */
    app.post('/project/:projectId/example/:exampleId/tagName/:tagName/tagValue', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;

        console.log("Inserting new tagValue in tagName '" + tagName + "'");

        let tagValue = req.body.tagValue;

        // Verifico l'esistenza del tagName
        let queryResult;
        try {
            let sql = 'SELECT * FROM TagNames WHERE projectId = ? AND exampleId = ? AND tagName = ?';
            let params = [projectId, exampleId, tagName];
            queryResult = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        // Se il tagName non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("tagName '" + tagName + "' not found\n");
            resp.status(404);
            resp.json({error: "tagName '" + tagName + "' not found"});
            return;
        }

        // In caso il tagName esista, inserisco il nuovo tagValue
        try {
            let sql = 'INSERT INTO TagValues(projectId, exampleId, tagName, tagValue) VALUES (?, ?, ?, ?)'
            let params = [projectId, exampleId, tagName, tagValue];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        console.log("tagValue inserted correctly\n");

        resp.status(201);
        resp.json({success: "tagValue inserted correctly"});
    });



    /**
     * Aggiornamento di un tagValue esistente per un tagValue dell'example
     * Parametri: id progetto, id example, tagName, tagValue
     * Body: nuovo tagValue
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * TODO: controllare di non inserire un tagValue che esista già per quel tagName di quell'example
     */
    app.put('/project/:projectId/example/:exampleId/tagName/:tagName/tagValue/:tagValue', async (req, resp) => {
        console.log("Updating tagValue");

        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;
        let tagValue = req.params.tagValue;

        let newTagValue = req.body.tagValue;

        // Verifico l'esistenza del tagValue
        let queryResult;
        try {
            let sql = 'SELECT * FROM TagValues WHERE exampleId=? AND tagName=? AND tagValue=?';
            let params = [exampleId, tagName, tagValue];
            queryResult = await dbm.execQuery(sql, params);
        }
 
        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err});
            return;
        }

        // Se il tagValue non esiste, viene restituito un errore
        if(queryResult.length === 0) {
            console.log("tagValue not found\n");
            resp.status(404);
            resp.json({error: "tagValue not found"});
            return;
        }

        // In caso il tagValue esista, lo aggiorno
        try {
            let sql = 'UPDATE TagValues SET tagValue=? WHERE exampleId=? AND tagName=? AND tagValue=?'
            let params = [newTagValue, exampleId, tagName, tagValue];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
            resp.status(400);
            resp.json({error: err}); 
            return; 
        }

        console.log("tagValue updated correctly\n");

        resp.status(201);
        resp.json({success: "tagValue updated correctly"});
    });



    /**
     * Rimozione di un tagValue esistente per un tag Value nell'example
     * Parametri: id progetto, id example, tagName, tagValue
     * Body: vuoto
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:projectId/example/:exampleId/tagName/:tagName/tagValue/:tagValue', async (req, resp) => {
        console.log("Deleting tagValue");

        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        let tagName = req.params.tagName;
        let tagValue = req.params.tagValue;

        let result;
        try {
            let sql = 'DELETE FROM TagValues WHERE exampleId=? AND tagName=? AND tagValue=?';
            let params = [exampleId, tagName, tagValue];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        if(result.affectedRows == "0") {
            console.log("tagValue not found\n");

            resp.status(404);
            resp.json({error: "tagValue not found"});
            return;
        }

        console.log("tagValue deleted correctly\n");

        resp.status(200);
        resp.json({success: "tagValue deleted correctly"});
    });
}

module.exports = {routes}; 