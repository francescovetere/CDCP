
function createdonutChart(numText,numImage) {

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
            data: [numText,numImage]
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
}

function createBarChart(titles, nums){

    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
        labels: titles,
        datasets: [
            {
            label: "#Examples",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: nums
            }
        ]
        },
        options: {
            scales: {
                yAxes: [{
                   ticks: {
                      stepSize: 1
                   }
                }]
             },
        legend: { display: false },
        title: {
            display: true,
            text: 'Most popular Projects (Top 5)'
        }
        }
    });
}

function createStatsPage(){
    // Identifico il template dei grafici
    let statsTemplate = document.querySelector('script#stats-jumbotron-template');
    variableContent.innerHTML += statsTemplate.innerText; 

    // GET di tutte le stats
    $.get('api/stats',
            {},
        function(response) {

            // Retrieve tagNames with insuffient number of examples
             for(let i = 0; i < response.statsResult[0].length; ++i){
                document.getElementById("stats-a-TagName").innerHTML += response.statsResult[0][i].tagName + "; "
             }
             
            // Retrieve tagValues with insuffient number of examples
            for(let i = 0; i < response.statsResult[1].length; ++i){
                document.getElementById("stats-a-TaValue").innerHTML += response.statsResult[1][i].tagValue + "; "
            }

            // Retrieve num of example in the datasets
            document.getElementById("stats-b").innerHTML += response.statsResult[2][0].NumExample;
           
            // Retrieve Total number of examples w/o tags
            document.getElementById("stats-c").innerHTML += response.statsResult[3][0].NumExampleWOTags;
            
            // Fill donutChart with Num of Project with text and image type
            createdonutChart(response.statsResult[4][0].NumText, response.statsResult[5][0].NumImage);
            
            // Fill BarChart with labels and data
            let labels = [];
            let data = [];
            for(let i=0; i<response.statsResult[6].length; ++i){
                labels.push(response.statsResult[6][i].title);
                data.push(response.statsResult[6][i].NExamples);
            }

            createBarChart(labels,data);
        });



}