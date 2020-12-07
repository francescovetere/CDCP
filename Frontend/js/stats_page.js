function createStatsPage() {

    /* Questi oggetti di esempio richiedono unicamente dei dati, all'interno delle liste, 
        che verranno recuperati con delle chiamate ajax al server. 
        Nel server, vengono effettuate le query necessarie per fornire i dati. 
        In attesa dei risultati, i grafici potrebbero risultare vuoti (o non disegnati). 

        !!!!! IMPORTANTE !!!!!
        Qualora i dati non venissero inseriti dopo la chiamata ajax, è necessario fare un 
        update del chart: https://www.chartjs.org/docs/latest/developers/updates.html
        -> https://stackoverflow.com/questions/45386406/refresh-the-bar-char-in-chartjs-v2-6-0-using-ajax-correct-way
    */

    // Bar chart
    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
            {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [2478,5267,734,784,433]
            }
        ]
        },
        options: {
        legend: { display: false },
        title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
        }
        }
    });

    // Example for donutChart
    const doughnutCanvas = document.getElementById("doughnut-chart");

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;

    const doughnutChart = new Chart(doughnutCanvas, {
        type: 'doughnut',
        data: {
        labels: ["Text", "Image"],
        datasets: [
            {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2"],
            data: [2478,5267]
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Type of Projects'
        }
        }
    });

    // line chart
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
        labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
        datasets: [{ 
            data: [86,114,106,106,107,111,133,221,783,2478],
            label: "Africa",
            borderColor: "#3e95cd",
            fill: false
            }, { 
            data: [282,350,411,502,635,809,947,1402,3700,5267],
            label: "Asia",
            borderColor: "#8e5ea2",
            fill: false
            }, { 
            data: [168,170,178,190,203,276,408,547,675,734],
            label: "Europe",
            borderColor: "#3cba9f",
            fill: false
            }, { 
            data: [40,20,10,16,24,38,74,167,508,784],
            label: "Latin America",
            borderColor: "#e8c3b9",
            fill: false
            }, { 
            data: [6,3,2,2,7,26,82,172,312,433],
            label: "North America",
            borderColor: "#c45850",
            fill: false
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Examples timeline (last 30 days)'
        }
        }
    });


    // radar chart

    new Chart(document.getElementById("radar-chart"), {
        type: 'radar',
        data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
            {
            label: "1950",
            fill: true,
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(179,181,198,1)",
            data: [8.77,55.61,21.69,6.62,6.82]
            }, {
            label: "2050",
            fill: true,
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            data: [25.48,54.16,7.61,8.06,4.45]
            }
        ]
        },
        options: {
        title: {
            display: true,
            text: 'Distribution in num of most popular TagNames'
        }
        }
    });

}

createStatsPage(); // here only for debug