const Project = require("./Project");
const DBManager = require("./DBManager");

let projects = [];
let dbm = new DBManager();
const uuid = require('uuid').v4;

function sequencer() {
    let i = 1;
    return function () {
        const n = i;
        i++;
        return n;
    }
}

const seq = sequencer();

for (let i = 0; i < 5; i++) {
    let currentProject = new Project(i, "<title-"+i+">", "text");
    projects.push(currentProject);
}



function routes(app) {

    /******************
     * USERS ROUTES 
     ******************/

    app.post('/sign-up', async (req, resp) => {
        console.log("Inserting new user");

        let Nickname = "'"+req.body.nickname+"'";
        let Email = "'"+req.body.email+"'";
        let Password = "'"+req.body.password+"'"; // la password andra' cifrata con hash prima di essere inserita
        let RegistrationDate = "'"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"'";

        // Validazione campi body
        if(req.body.password == "" || req.body.nickname == "" || req.body.email == "") {
            console.log("User not inserted\n");

            resp.status(400);
            resp.json({error: "You have to pass all fields!"});
            return;
        }

        // Inserimento del nuovo utente
        let id = "'"+uuid()+"'";

        try {
            let sql = "INSERT INTO USERS (ID, Nickname, Email, Password, RegistrationDate) VALUES ("+id+","+Nickname+","+Email+","+Password+","+RegistrationDate+")";
            let result = await dbm.query(sql);
        }

        catch(err) {
            console.log(err);
        }

        console.log("User inserted correctly\n");
        resp.status(201);
        resp.json({success: "Registration successful\n'"});
        
    });

    app.post('/login', async (req, resp) => {
        console.log("Login Required...");

        let Nickname = "'"+req.body.nickname+"'";
        let Password = "'"+req.body.password+"'"; // la password andra' cifrata con hash prima di essere controllata
        
        try {
            let sql = "SELECT * FROM USERS WHERE BINARY "+Nickname+" = Nickname AND BINARY "+Password+"=Password";
            let result = await dbm.query(sql);

            if(Object.keys(result).length==1){
                console.log("User logged correctly\n");
                resp.status(200);
                resp.json({success: "Logged!\n'"});
            }
            else{
                console.log("Wrong input!\n");
                resp.status(401);
                resp.json({error: "Login failed, wrong input!'"});
            }
            
        }

        catch(err) {
            console.log(err);
        }
        
    });



    /******************
     * PROJECTS ROUTES 
     ******************/

    /**
     * Restituzione di tutti i progetti
     * Parametri: vuoto
     * Body: vuoto
     * Risposta: Tutti i progetti
     */
    app.get('/projects', async (req, resp) => {
        console.log("Retrieving all projects");
        
        // Recupero tutti i progetti
        let queryResult = [];
        try {
            let sql = 'SELECT * FROM Projects';
            queryResult = await dbm.simpleQuery(sql);
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
     * Risposta: il progetto appena inserito
     */
    app.post('/project', (req, resp) => {
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
        let id = seq();
        let project = new Project(id, title, inputType);

        projects.push(project);

        console.log("Project inserted correctly\n");

        resp.status(201);
        resp.json(project.toDTO());
        
    });

    /**
     * Aggiornamento di un progetto esistente
     * Parametri: id progetto
     * Body: title, inputType
     * Risposta: il progetto appena aggiornato
     */
    app.put('/project/:id', (req, resp) => {
        console.log("Updating project");

        let id = parseInt(req.params.id, 10);
        let title = req.body.title;
        let inputType = req.body.inputType;

        // Validazione campi body
        if(inputType != "text" && inputType != "image") {
            console.log("Project not updated\n");

            resp.status(400);
            resp.json({error: "inputType must be 'text' or 'image'"});
            return;
        }

        // Ricerca del progetto con l'id fornito nell'URL
        let projectIndex = projects.findIndex(p => p.id === id);
        if(projectIndex == -1) {
            console.log("Project not updated\n");

            resp.status(404);
            resp.json({error: "Project not found"});
            return;
        }
    
        // Se l'esecuzione arriva in questo punto l'id esiste, dunque viene aggiornato il progetto corrispondente
    
        // Se però l'utente cerca di modificare l'inputType sebbene il progetto non sia vuoto, viene restituito un errore
        if(inputType != projects[projectIndex].inputType && projects.length > 0) {
            console.log("Project not updated\n");
    
            resp.status(400);
            resp.json({error: "Cannot modify inputType if project not empty"});
            return;
        }
        
        // Altrimenti, procedo con l'aggiornamento del progetto
        projects[projectIndex].title = title;
        projects[projectIndex].inputType = inputType;

        console.log("Project updated correctly\n");

        resp.status(200);
        resp.json(projects[projectIndex].toDTO());
    });

    /**
     * Rimozione di un progetto esistente
     * Parametri: id progetto
     * Body: vuoto
     * Risposta: il progetto appena eliminato
     */
    app.delete('/project/:id', (req, resp) => {
        console.log("Deleting project");

        let id = parseInt(req.params.id, 10);

        // Ricerca del progetto con l'id fornito nell'URL
        let projectIndex = projects.findIndex(p => p.id === id);
        if(projectIndex == -1) {
            console.log("Project not deleted\n");

            resp.status(404);
            resp.json({error: "Project not found"});
            return;
        }

        // Se l'esecuzione arriva in questo punto l'id esiste, dunque viene eliminato il progetto corrispondente
        // splice ritorna gli elementi eliminati, in questo caso ne prendo il primo
        let deletedProject = projects.splice(projectIndex, 1)[0];

        console.log("Project deleted correctly\n");

        resp.status(200);
        resp.json(deletedProject.toDTO());
    });



    


    /*************************
     * PROJECT RECORDS ROUTES 
     *************************/

    /**
     * Restituzione di tutti i record di un progetto
     * Parametri: id progetto
     * Body: vuoto
     * Risposta: Tutti i record del progetto
     */
    app.get('/project/:projectId', (req, resp) => {
        // console.log(req.params.projectId + ", " + req.params.recordId);
        resp.status(418);
        resp.json("I'm a teapot");
    });

    /**
     * Inserimento di un nuovo record nel progetto
     * Parametri: id progetto
     * Body: TODO
     * Risposta: il record appena inserito
     */
    app.post('/project/:projectId', (req, resp) => {
        resp.status(418);
        resp.json("I'm a teapot");
    });

    /**
     * Aggiornamento di un record esistente nel progetto
     * Parametri: id progetto, id record
     * Body: TODO
     * Risposta: il record appena aggiornato
     */
    app.put('/project/:projectId/:recordId', (req, resp) => {
        resp.status(418);
        resp.json("I'm a teapot");
    });

    /**
     * Rimozione di un record esistente nel progetto
     * Parametri: id progetto, id record
     * Body: vuoto
     * Risposta: il record appena eliminato
     */
    app.delete('/project/:projectId/:recordId', (req, resp) => {
        resp.status(418);
        resp.json("I'm a teapot");
    });

    
}

module.exports = {routes};