const Project = require("./Project");
const DBManager = require("./DBManager");

let projects = [];
let dbm = new DBManager();

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


function routes(app, con) {

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
        
        /******************/
        // Esempio di query (notare i costrutti async e await)
        try {
            let sql = "SELECT * FROM testTable";
            let result = await dbm.query(sql);
            console.log(result[0].id); // l'id della prima riga
        }

        catch(err) {
            console.log(err);
        }
        /******************/
        
        // Recupero tutti i progetti, li trasformo in oggetti DTO e li inserisco in un nuovo array
        let objects = [];

        for(let i = 0; i < projects.length; ++i) {
            objects.push(projects[i].toDTO());
        }

        // Invio il numero totale dei progetti, e l'array dei progetti stessi
        resp.json({
            total: objects.length,
            results: objects
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
