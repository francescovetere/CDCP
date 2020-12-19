'use strict';

// Pagina dei logs

function createLogsPage() {
    // Identifico il template dei logs
    let logsTemplate = document.querySelector('script#logs-container-template');
    variableContent.innerHTML += logsTemplate.innerText; 

    let logsNode = document.querySelector(".logsBody");

    function customRow(type){
        let classRow;
        switch (type){
            case "POST":
                classRow = "table-success";
                break;
            case "DELETE":
                classRow = "table-danger";
                break;

            case "PUT":
                classRow = "table-warning";
                break;
        }
        return classRow;
    }


    // GET di tutti i logs
    $.get('api/logs',
        {},
        function(response) {
            for(let i = 0; i < response.total; ++i){
                
                let log = document.createElement("tr");
                log.setAttribute("class", customRow(response.results[i].actionType));

                let ActionType = document.createElement("td");
                let Nickname = document.createElement("td");
                let Details = document.createElement("td");
                let Date = document.createElement("td");

                ActionType.innerHTML = response.results[i].actionType;
                Nickname.innerHTML = response.results[i].userNick;
                Details.innerHTML = response.results[i].details;
                Date.innerHTML = response.results[i].timeStamp;

                log.appendChild(ActionType);
                log.appendChild(Nickname);
                log.appendChild(Details);
                log.appendChild(Date);

                logsNode.appendChild(log);
            }

        });

}
