'use strict';

const DBManager = require("./DBManager");   // managing queries
const uuid = require('uuid').v4;
const multer = require('multer');           // uploading files
const fs = require('fs')                    // deleting files
const path = require('path');
const bcrypt = require('bcryptjs');         // hashing psw

let dbm = new DBManager();

function formatDate() {
    let date = new Date();
    let formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace('T', ' ');

    return formattedDate;
}

/**
 * Inserimento Logs
 * Parametri: vuoto
 * Campi: userNick, projectId, exampleId, actionType, details 
 */
async function SaveLog(contentLog) {
    console.log("Inserting a new log...\n");

    let userNick = contentLog[0];
    let projectId = contentLog[1];
    let exampleId = contentLog[2];
    let actionType = contentLog[3];
    let details = contentLog[4];

    let params = [userNick, projectId, exampleId, actionType, details, formatDate()];

    try {   
        let sql = 'INSERT INTO Logs(userNick, projectId, exampleId, actionType, details, timeStamp) VALUES (?, ?, ?, ?, ?, ?)';
        await dbm.execQuery(sql, params);
    } 
        
    catch(err) {
        console.log(err);
    }

    console.log("Log inserted correctly");
}

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
     */
    app.get('/logs', async (req, resp) => {
        console.log("Retrieving all log records\n");
        
        let queryResult = [];
        try {
            let sql = 'SELECT * FROM Logs ORDER BY id DESC';
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
     */
    app.get('/stats', async (req, resp) => {
        console.log("Retrieving all stats\n");
        
        let statsResult = [];
        let stat_1_a, stat_1_b, stat_2, stat_3;
        let numText, numImage;
        let top5;

        try {

            let sqlStat_1_a = 'SELECT tagName FROM TagNames GROUP BY tagName HAVING COUNT(*) < 3;';
            stat_1_a = await dbm.execQuery(sqlStat_1_a);

            let sqlStat_1_b = 'SELECT tagValue FROM TagValues GROUP BY tagValue HAVING COUNT(*) < 3;';
            stat_1_b = await dbm.execQuery(sqlStat_1_b);

            let sqlStat_2 = 'SELECT COUNT(*) as NumExample FROM Examples';
            stat_2 = await dbm.execQuery(sqlStat_2);

            let sqlStat_3 = 'SELECT COUNT(*) AS NumExampleWOTags FROM Examples AS EX WHERE (SELECT COUNT(*) AS TAGS FROM TagNames WHERE EX.id = exampleId) = 0';
            stat_3 = await dbm.execQuery(sqlStat_3);

            let sqlStat_4_a = 'SELECT COUNT(*) AS NumText FROM Projects WHERE inputType = "TEXT" ';
            numText = await dbm.execQuery(sqlStat_4_a);

            let sqlStat_4_b = 'SELECT COUNT(*) AS NumImage FROM Projects WHERE inputType = "IMAGE" ';
            numImage = await dbm.execQuery(sqlStat_4_b);

            let sqlStat_5 = 'SELECT title, COUNT(*) as NExamples FROM Projects as P, Examples as E WHERE P.id = E.projectId GROUP BY title ORDER BY COUNT(*) DESC LIMIT 5';
            top5 = await dbm.execQuery(sqlStat_5);
        }

        catch(err) {
            console.log(err);
        }
        
        statsResult.push(stat_1_a);
        statsResult.push(stat_1_b);
        statsResult.push(stat_2);
        statsResult.push(stat_3);

        statsResult.push(numText);
        statsResult.push(numImage);

        statsResult.push(top5);

        resp.status(200);
        resp.json({statsResult});

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
        let password = bcrypt.hashSync(req.body.password, 10); // hash password and salt
        let registrationDate = formatDate(new Date());

        // Validazione campi body
        if(req.body.password == "" || req.body.nickname == "" || req.body.email == "") {
            console.log("User not inserted\n");

            resp.status(400);
            resp.json({error: "Some fields are missing"});
            return;
        }

        let result;

        try {
            let sql = "SELECT * FROM Users WHERE BINARY nickname = ?";
            let params = [nickname];
            result = await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        if(result.length != 0) {
            console.log("Nickname unavailable\n");
            resp.status(401);
            resp.json({error: "Nickname unavailable"});
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
        let password = req.body.password; // clear password
        let result;

        try {  // Load hash from DB
            let sql = "SELECT password FROM Users WHERE BINARY ? = nickname";
            let params = [nickname];
            result = await dbm.execQuery(sql, params);
        } 
        
        catch(err) {
            console.log(err);
        }
        
        let hashStored = "";
        if(result.length != 0) hashStored = JSON.stringify(result[0].password);

        if(result.length === 0 || !bcrypt.compareSync(password, JSON.parse(hashStored))) {
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
    * Body: nickname,  tk
    * Risposta positiva: success
    * Risposta negativa: error
    */

    app.post('/auth', async (req, resp) => {
        console.log("Auth token user");

        let nickname = req.body.nickname;
        let tk = req.body.tk;

        let currentDate = "'"+formatDate(new Date())+ "'";
        let result;

       
        try {   
            let sql = "SELECT * FROM TokenAuth WHERE BINARY ? = nickname AND BINARY ? = token AND ? <= expirationDate";
            let params = [nickname, tk, currentDate];
            result = await dbm.execQuery(sql, params);
        } 
        
        catch(err) {
            console.log(err);
        }
        
        if(result.length === 0) {
            console.log("Auth cookie failed\n");
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
        let result;

        // add 30 days to current day
        let d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        d = formatDate(d);

        try {   
            let sql = "INSERT INTO TokenAuth(nickname, token, expirationDate) VALUES (?,?,?)";
            let params = [nickname, tk, d];
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
            let sql = 'SELECT * FROM Projects ORDER BY title ASC;';
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
     * Body: title, inputType, nickname
     * Risposta positiva: il progetto appena inserito
     * Risposta negativa: error
     */
    app.post('/project', async (req, resp) => {
        
        let title = req.body.title;
        let inputType = req.body.inputType;
        let nickname = req.body.nickname;

        // Validazione campi body
        if(inputType != "TEXT" && inputType != "IMAGE") {
            console.log("Project not inserted\n");

            resp.status(400);
            resp.json({error: "inputType must be 'TEXT' or 'IMAGE'"});
            return;
        }

        // Inserimento del nuovo progetto
        let projectId = uuid();

        try {
            let sql = 'INSERT INTO Projects(id, title, inputType) VALUES (?, ?, ?)';
            let params = [projectId, title, inputType];
            await dbm.execQuery(sql, params);
        }

        catch(err) {
            console.log(err);
        }

        console.log("Project inserted correctly\n");

        resp.status(201);
        resp.json({result: {"id": projectId, "title": title, "inputType": inputType}});

        // Non metto await perch?? non mi interessa avere sincron??a
        SaveLog([nickname, projectId, "", "POST", "Project '"+ title +"' created."]);
        
    });



    /**
     * Aggiornamento di un progetto esistente
     * Parametri: id progetto
     * Body: title, inputType, nickname
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.put('/project/:id', async (req, resp) => {
        console.log("Updating project");

        let id = req.params.id;
        let title = req.body.title;
        let inputType = req.body.inputType;
        let nickname = req.body.nickname;

        // Validazione campi body
        if(inputType != "TEXT" && inputType != "IMAGE") {
            console.log("Project not updated\n");

            resp.status(400);
            resp.json({error: "inputType must be 'TEXT' or 'IMAGE'"});
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

        console.log("Project updated correctly");

        resp.status(200);
        resp.json({success: "Project updated correctly"});

        SaveLog([nickname, id, "", "PUT", "Project's title updated with '" + title + "'."])
    });



    /**
     * Rimozione di un progetto esistente
     * Parametri: id progetto
     * Body: inputValue, projectTitle, nickname
     * Risposta positiva: success
     * Risposta negativa: error
     */
    app.delete('/project/:id', async (req, resp) => {
        console.log("Deleting project");

        let id = req.params.id;
        let projectTitle = req.body.projectTitle;
        let nickname = req.body.nickname;

        let result;

        try {

            let params = [id];

            /* Recupera tutte le immagini da eliminare se il tipo e' IMAGE */
            let sqlRetrieveType = 'SELECT inputType FROM Projects WHERE id=?';
            let inputTypeResult = await dbm.execQuery(sqlRetrieveType, params);
            inputTypeResult = JSON.parse(JSON.stringify(inputTypeResult[0].inputType));

            if(inputTypeResult == "IMAGE"){
                console.log("Delete all images of project");
                let sqlImageToDelete = 'SELECT inputValue FROM Examples WHERE projectId=?';
                let imagesToDelete = await dbm.execQuery(sqlImageToDelete, params);
                imagesToDelete = JSON.parse(JSON.stringify(imagesToDelete));
                for(let i=0; i < imagesToDelete.length; ++i){
                    fs.unlink('./public/uploads/' + imagesToDelete[i].inputValue, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        //file removed
                    });
                }
            }

            let sql = 'DELETE FROM Projects WHERE id=?';
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

        SaveLog([nickname, id, "", "DELETE", "Project '"+ projectTitle +"' deleted."])
    });



    /**********************************
     * EXAMPLES ROUTES 
     **********************************/

    /**
     * Restituzione di tutti gli examples di un progetto
     * Parametri: id progetto
     * Body: vuoto
     * Risposta positiva: Tutti gli examples del progetto (CON TAGNAMES E TAGVALUES!)
     *                    Esempio di tags in una risposta:
     * 
     *                    [
     *                      {"tagName": "animals", "tagValues": ["mammals", "vertebrates"]},
     *                      {"tagName": "colors", "tagValues": ["brown", "black"]}
     *                    ]
     * Risposta negativa: error
     */
    app.get('/project/:projectId/examples', async (req, resp) => {
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
        } catch(err) {console.log(err);}
        
        // Ciclo sull'array risultato e costruisco l'array degli examples
        let examples = [];
        for(let i = 0; i < queryResult.length; ++i) {
            examples.push(queryResult[i]);
            examples[i].tags = [];
        }

        // Ora inserisco in ciascun example i suoi tagNames, se presenti
        for(let i = 0; i < examples.length; ++i) {
            try {
                let sql = 'SELECT * FROM TagNames WHERE exampleId = ?';
                let params = [examples[i].id];
                let tagNames = await dbm.execQuery(sql, params);
                if(tagNames.length > 0) {

                    // Ora inserisco in ciascun tagName dell'example corrente i suoi tagValues, se presenti
                    for(let j = 0; j < tagNames.length; ++j) {
                        // console.log("..." + tagNames[j].tagName);
                        examples[i].tags.push({"tagName": tagNames[j].tagName, "tagValues": []});
                        try {
                            let sql = 'SELECT * FROM TagValues WHERE projectId = ? AND exampleId = ? AND tagName = ?';
                            let params = [examples[i].projectId, examples[i].id, tagNames[j].tagName];
                            let tagValues = await dbm.execQuery(sql, params);
                            for(let k = 0; k < tagValues.length; ++k) {
                                // console.log("......" + tagValues[k].tagValue);
                                let tagVal = tagValues[k].tagValue;
                                examples[i].tags[j].tagValues.push(tagVal);
                                
                            }
                        } catch(err) {console.log(err);}
                        
                    }
                }
            } catch(err) {console.log(err);}
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
     * Restituzione dell'immagine associata ad un example di tipo immagine
     * Pensata per essere chiamata dal client nella fase di rendering dell'example ( nella funzione createExampleCard() )
     */
    app.get("/getImage/:image", async (req, res) => {
        //console.log("Required " + req.params.image);
        let pathImg = __dirname + "/../public/uploads/" + req.params.image;
        console.log(pathImg);
        
        let file = path.join(pathImg);
        await res.sendFile(file);
    });

    /**
     * Inserimento di un nuovo example nel progetto
     * Parametri: id progetto
     * Body: inputType, inputValue, nickname
     * Risposta positiva: success
     * Risposta negativa: error
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
        if(inputType != "TEXT" && inputType != "IMAGE") {
            console.log("inputType must be 'TEXT' or 'IMAGE'\n");
            resp.status(400);
            resp.json({error: "inputType must be 'TEXT' or 'IMAGE'"});
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

        console.log("Example inserted correctly\n");

        let nickname = req.body.nickname;

        // Visualizzazione anteprima inputValue nei log
        let K = 10;
        let previewText;
        if(inputValue.length > K)
            previewText = inputValue.substring(0, K) + "...";
        else previewText = inputValue;
        
        SaveLog([nickname, projectId, exampleId, "POST", "Example '" + previewText + "' created."]);

        resp.status(201);
        resp.json({success: "Example inserted correctly"});
    });

    /**
     * Inserimento di un nuovo example (di tipo immagine) nel progetto
     * Parametri: id progetto
     * Body: inputType, inputValue, nickname
     * Risposta positiva: success
     * Risposta negativa: error
     */

    // Non puo' essere asincrona se c'e' il file upload! (err_write_after_end)
    app.post('/project/:projectId/exampleImg', (req, resp) => {

        let storage = multer.diskStorage({
            destination: function (req, file, callback) {
              callback(null, './public/uploads');
            },
            filename: function (req, file, callback) {
              callback(null, file.originalname);
            }
          });
        
        let upload = multer({ storage : storage}).single('example_image');

        upload(req,resp,function(err) {
            if(err) {
                resp.end("Error uploading file.");
                return;
            }
            resp.end("File is uploaded");
        });

        console.log("Uploaded new img");

    });

    /**
     * Aggiornamento di un example esistente nel progetto
     * Parametri: id progetto, id example
     * Body: inputType, inputValue, nickname
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * N.B. Se inputType === 'IMAGE' ==> elimino la vecchia immagine dal file system!
     */
    app.put('/project/:projectId/example/:exampleId', async (req, resp) => {
        let projectId = req.params.projectId;
        let exampleId = req.params.exampleId;
        
        console.log("Updating example");

        let inputType = req.body.inputType;
        let inputValue = req.body.inputValue;
        let nickname = req.body.nickname;
        
        let queryResult;
        try {
            let sql = 'SELECT inputValue as PreValue FROM Examples WHERE id=?';
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

        console.log("Example updated correctly\n");

        resp.status(201);
        resp.json({success: "Example updated correctly"});
        
        // Visualizzazione anteprima inputValue nei log
        let K = 10;
        let previewText;
        if(inputValue.length > K)
            previewText = inputValue.substring(0, K) + "...";
        else previewText = inputValue;

        // Delete immagine precedente (PreValue)
        if(inputType === 'IMAGE') {
            let imageToDelete = JSON.stringify(queryResult[0].PreValue);
            imageToDelete = JSON.parse(imageToDelete);
            console.log("Delete '" + imageToDelete + "'.");

            fs.unlink('./public/uploads/' + imageToDelete, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                //file removed
            });
        }

        SaveLog([nickname, projectId, exampleId, "PUT", "Example updated with '" + previewText + "'."]);

    });



    /**
     * Rimozione di un example esistente nel progetto
     * Parametri: id progetto, id example
     * Body: inputValue, inputType, nickname
     * Risposta positiva: success
     * Risposta negativa: error
     * 
     * N.B. Se inputType === 'IMAGE' ==> elimino la vecchia immagine dal file system!
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

        //  N.B. Se inputType === 'IMAGE' ==> elimino la vecchia immagine dal file system!
        let nickname = req.body.nickname;
        let inputType = req.body.inputType;
        let inputValue = req.body.inputValue;

        if(inputType === 'IMAGE') {
            fs.unlink('./public/uploads/' + inputValue, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
                //file removed
            });
        }

        console.log("Example deleted correctly\n");

        // Visualizzazione anteprima inputValue nei log
        let K = 10;
        let previewText;
        if(inputValue.length > K)
            previewText = inputValue.substring(0, K) + "...";
        else previewText = inputValue;
                
        SaveLog([nickname, projectId, exampleId, "DELETE", "Example '" + previewText + "' deleted."]);

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
     * Body: tagName, nickname
     * Risposta positiva: success
     * Risposta negativa: error
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
            resp.status(404);
            resp.json({error: "TagName already exists"});
            console.log(err);
            return;
        }

        console.log("TagName inserted correctly\n");

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "POST", "TagName '"+ tagName +"' created."]);

        resp.status(201);
        resp.json({success: "TagName inserted correctly"});
    });



    /**
     * Aggiornamento di un tagName esistente nell'example
     * Parametri: id progetto, id example, tagName
     * Body: tagName, nickname
     * Risposta positiva: success
     * Risposta negativa: error
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

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "PUT", "TagName '"+ tagName +"' updated with '" + newTagName + "'."]);

        resp.status(201);
        resp.json({success: "tagName updated correctly"});
    });



    /**
     * Rimozione di un tagName esistente nell'example
     * Parametri: id progetto, id example, tagName
     * Body: nickname
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

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "DELETE", "TagName '"+ tagName +"' deleted."]);

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
     * Body: tagValue, nickname
     * Risposta positiva: success
     * Risposta negativa: error
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
            resp.status(404);
            resp.json({error: "TagValue already exists"});
            console.log(err);
            return;
        }

        console.log("tagValue inserted correctly\n");

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "POST", "TagValue '"+ tagValue +"' created."]);

        resp.status(201);
        resp.json({success: "tagValue inserted correctly"});
    });



    /**
     * Aggiornamento di un tagValue esistente per un tagValue dell'example
     * Parametri: id progetto, id example, tagName, tagValue
     * Body: nuovo tagValue, nickname
     * Risposta positiva: success
     * Risposta negativa: error
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

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "PUT", "TagValue '"+ tagValue +"' updated with '" + newTagValue + "'."]);

        resp.status(201);
        resp.json({success: "tagValue updated correctly"});
    });



    /**
     * Rimozione di un tagValue esistente per un tag Value nell'example
     * Parametri: id progetto, id example, tagName, tagValue
     * Body: nickname
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

        let nickname = req.body.nickname;
        SaveLog([nickname, projectId, exampleId, "DELETE", "TagValue '"+ tagValue +"' deleted."]);

        resp.status(200);
        resp.json({success: "tagValue deleted correctly"});
    });
}

module.exports = {routes}; 