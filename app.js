//fetch text from the csv file
async function getData(url=''){
    let response = await fetch(url);
    let result = csvToObj(await response.text());
    return result;
}

//convert csv txt to object with the fields arrays
function csvToObj(csv){
    const lines=csv.split("\n");
    const headers=lines[0].split(",");

    let result = {};
    for(let elem of headers){
        result[elem] = [];
    }

    for(let i=1;i<lines.length-1;i++){
        let separatedline=lines[i].split(",");
        for(let i=0;i<headers.length;i++){
            result[headers[i]].push(separatedline[i]);
        }
    }
    //console.log(headers)
    return result; 
}

//create Timestamp label
function createLabel(stats_ts, monitor_ts, server_ts){
    let min = Math.min(stats_ts[0], monitor_ts[0], server_ts[0])
    let max = Math.max(stats_ts[stats_ts.length-1], monitor_ts[monitor_ts.length-1], server_ts[server_ts.length-1])

    let label = []
    for(let i=min; i<=max; i++){
        label.push('' + i)
    }

    return label;
}

//create object of points {x,y}
function completeData(result, fieldY, fieldX='Timestamp'){
    let data = []
    for(let i=0;i<result[fieldX].length;i++){
        data.push({
            x: result[fieldX][i],
            y: result[fieldY][i]
        })
    }
    return data;
}

//results
const result_stats = await getData('src/log_stats_history.csv')
const result_monitor = await getData('src/log_monitor.csv')
const result_server = await getData('src/log_server.csv')
const result_users = await getData('src/log_stats.csv')

const n_user = result_users['Request Count'][0]

const xLabel = createLabel(result_stats.Timestamp, result_monitor.Timestamp, result_server.Timestamp); 

//colors
    const red = ['rgba(255, 99, 132, 1)'];
    const orange = ['rgba(255, 159, 64, 1)'];
    const yellow = ['rgba(255, 205, 86, 1)'];
    const blue = ['rgba(54, 162, 235, 1)'];
    const purple = ['rgba(153, 102, 255, 1)'];
    const green = ['rgba(75, 192, 192, 1)'];

const data = {
    labels: xLabel,
    datasets: [
        {
            label: 'ram mysql',
            data: completeData(result_monitor,'rammysql'),
            borderColor: yellow,
            borderDash: [2, 2],
            yAxisID: 'yram',
            hidden: true
        },
        {
            label: 'cpu mysql',
            data: completeData(result_monitor,'cpumysql'),
            borderColor: yellow,
            borderDash: [2, 2],
            yAxisID: 'ycpu',
            hidden: true
        },
        {
            label: 'ram 0',
            data: completeData(result_monitor,'ram0'),
            borderColor: blue,
            borderDash: [2, 2],
            yAxisID: 'yram'
        },
        {
            label: 'cpu 0',
            data: completeData(result_monitor,'cpu0'),
            borderColor: blue,
            borderDash: [2, 2],
            yAxisID: 'ycpu'
        },
        {
            label: 'ram 1',
            data: completeData(result_monitor,'ram1'),
            borderColor: purple,
            borderDash: [2, 2],
            yAxisID: 'yram'
        },
        {
            label: 'cpu 1',
            data: completeData(result_monitor,'cpu1'),
            borderColor: purple,
            borderDash: [2, 2],
            yAxisID: 'ycpu'
        },
        {
            label: 'ram 2',
            data: completeData(result_monitor,'ram2'),
            borderColor: green,
            borderDash: [2, 2],
            yAxisID: 'yram'
        },
        {
            label: 'cpu 2',
            data: completeData(result_monitor,'cpu2'),
            borderColor: green,
            borderDash: [2, 2],
            yAxisID: 'ycpu'
        },
        {
            label: 'Median Response Time',
            data: completeData(result_stats,'Total Median Response Time'),
            borderColor: red,
            yAxisID: 'yavgres'
        },
        {
            label: 'Average Response Time',
            data: completeData(result_stats,'Total Average Response Time'),
            borderColor: orange,
            yAxisID: 'yavgres'
        },
        {
            label: 'Min Response Time',
            data: completeData(result_stats,'Total Min Response Time'),
            borderColor: yellow,
            yAxisID: 'yavgres',
            hidden: true,
        },
        {
            label: 'Max Response Time',
            data: completeData(result_stats,'Total Max Response Time'),
            borderColor: blue,
            yAxisID: 'yavgres',
            hidden: true,
        },
        {
            label: 'Failures/s',
            data: completeData(result_stats,'Failures/s'),
            borderColor: green,
            fill: true,
            backgroundColor: green,
            yAxisID: 'ycurrent'
        },
        {
            label: 'Requests/s',
            data: completeData(result_stats,'Requests/s'),
            borderColor: yellow,
            fill: true,
            backgroundColor: yellow,
            yAxisID: 'ycurrent'
        },
        {
            label: 'Total Failure Count',
            data: completeData(result_stats,'Total Failure Count'),
            borderColor: blue,
            fill: true,
            backgroundColor: blue,
            yAxisID: 'ycount'
        },
        {
            label: 'Total Request Count',
            data: completeData(result_stats,'Total Request Count'),
            borderColor: orange,
            fill: true,
            backgroundColor: orange,
            yAxisID: 'ycount'
        },
        {
            label: 'n server',
            data: completeData(result_server,'Server Rimanenti'),
            borderColor: purple,
            stepped: true,
            fill: true,
            backgroundColor: purple,
            yAxisID: 'ynserver'
        },
    ]
}

const config = {
    type: 'line',
    data: data,
    options: {
        interaction: {
            intersect: false,
            mode: 'nearest',
            axis: 'x'      
        },
        plugins: {
            title: {
                display: true,
                text: 'N users: ' + n_user
            },
            //display time in tooltip in a nice format
            tooltip: {
                callbacks: {
                    title: function(obj){
                        let timestamp = obj[0].label;
                        let date = new Date(timestamp * 1000);

                        let hours = date.getHours();
                        let minutes = date.getMinutes();
                        let seconds = date.getSeconds();

                        let hoursStr = hours < 10 ? "0"+hours : ""+hours;
                        let minutesStr = minutes < 10 ? "0"+minutes : ""+minutes;
                        let secondsStr = seconds < 10 ? "0"+seconds : ""+seconds;
                        
                        return hoursStr + ":" + minutesStr + ":" + secondsStr;
                    },
                    label: function(obj){
                        let timestamp = obj.label;
                        let name = obj.dataset.label;
                        let value = obj.formattedValue;
                        let measure;
                        switch(name){
                            case "ram mysql":
                            case "ram 0":
                            case "ram 1":
                            case "ram 2":
                            case "cpu mysql":
                            case "cpu 0":
                            case "cpu 1":
                            case "cpu 2":
                                measure = "%";
                                break;
                            case "Median Response Time":
                            case "Average Response Time":
                            case "Min Response Time":
                            case "Max Response Time": 
                                measure = " ms";
                                break;
                            default:
                                measure = "";
                                break;
                        }
                        return name + ":\t" + value + measure;
                    }
                },
            }
        },
        pointRadius: 0,
        scales: {
            x : {
                ticks: {
                    callback: function(value, index) {
                        let timestamp = this.getLabelForValue(value);
                        let date = new Date(timestamp * 1000);

                        let hours = date.getHours();
                        let minutes = date.getMinutes();
                        let seconds = date.getSeconds();

                        let hoursStr = hours < 10 ? "0"+hours : ""+hours;
                        let minutesStr = minutes < 10 ? "0"+minutes : ""+minutes;
                        let secondsStr = seconds < 10 ? "0"+seconds : ""+seconds;

                        if(index % 10 == 0) return hoursStr + ":" + minutesStr// + ":" + secondsStr;
                        else return "";
                    }
                },
                type: 'category',
            },
            yram: {
                min: 0,
                stack: 'demo',
                title: {
                    text: "%ram",
                    display: true,
                },
            },
            ycpu: {
                min: 0,
                stack: 'demo',
                title: {
                    text: "%cpu",
                    display: true,
                },
            },
            yavgres: {
                stack: 'demo',
                stackWeight: 2,
                title: {
                    text: "response time (ms)",
                    display: true,
                },
            },
            ycurrent: {
                min: 0,
                stack: 'demo',
                title: {
                    text: "request/s",
                    display: true,
                },
            },
            ycount: {
                min: 0,
                stack: 'demo',
                title: {
                    text: "#request",
                    display: true,
                },
            },
            ynserver: {
                min: 0,
                //max: 4,
                stack: 'demo',
                title: {
                    text: "#server",
                    display: true,
                },
            },
        }
    }
}

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, config);