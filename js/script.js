

function drawGraphic(inicial, primario, secundario){
google.charts.load("current", {packages:['corechart']})
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Alumnos", "Cantidad", { role: "style" } ],
    ["Inicial", inicial, "#fefee3"],
    ["Primario", primario, "#ffc9b9"],
    ["Secundario", secundario, "#d68c45"],
  ]);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1,
                   { calc: "stringify",
                     sourceColumn: 1,
                     type: "string",
                     role: "annotation" },
                   2]);

  var options = {
    title: "Cantidad de alumnos por nivel",
    width: 600,
    height: 400,
    bar: {groupWidth: "95%"},
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"))
  chart.draw(view, options);
}
}
let url = "https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1"
function getApiStudents() {
    return new Promise((resolve, reject) => {
        fetch(url).then(api => {
            if (!api.ok) {
                throw new Error('Error en la red');
            }
            return api.json();
        }).then(api => {
            resolve(api)
        }).catch(error => {
            reject(error)
        })
    })
}

getApiStudents()
    .then(apiStudents => {
        let  students = apiStudents.data
        let inicial = 0
        let primario = 0
        let secundario = 0
        students.forEach((element) => {
            if(element.nivel === 'Inicial') inicial++
            else if(element.nivel === 'Primario')  primario++
            else if(element.nivel === 'Secundario') secundario++
        });
        drawGraphic(inicial, primario, secundario)
    }).catch(error => {
        console.error(error)
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function drawChart(dataAttendance) {
google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(draw);

function draw(){
var data = new google.visualization.DataTable();
data.addColumn('number', 'Month');
data.addColumn('number', 'Attendance');
dataAttendance.forEach(element =>{
    data.addRows([
        [element.nro_mes,  element.asistencia],
      ]);
})


var options = {
  chart: {
    title: 'Asistecia general',
    subtitle: 'Marzo a Diciembre'
  },
  width: 900,
  height: 500
};

var chart = new google.charts.Line(document.getElementById('asisttance'));

chart.draw(data, google.charts.Line.convertOptions(options));
}
}





url = "https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1"
function getApiAttendance(){
    return new Promise((resolve, reject) => {
        fetch(url).then(api => {
            if (!api.ok) {
                throw new Error('Error en la red');
            }
            return api.json();
        }).then(api => {
            resolve(api)
        }).catch(error => {
            reject(error)
        })
    })
}
getApiAttendance().then(apiAttendance =>{
        console.log(apiAttendance)
        drawChart(apiAttendance.data)
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRandomColor() {
    let randomNumber = Math.floor(Math.random() * 16777215);
    let randomColor = "#" + randomNumber.toString(16).padStart(6, '0');
    return randomColor;
}

function drawCake(apiData){
    
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawCake2);
    function drawCake2() {

    
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Element'); // Columna 0: tipo string
        data.addColumn('number', 'Density'); // Columna 1: tipo number
        data.addColumn({type: 'string', role: 'style'});

        let nivel=""
        let pres = 0
        let aus = 0
        
        apiData.forEach(element =>{
            if (nivel == "") nivel = element.nivel
            if( nivel == element.nivel){
                pres += element.presentes
                aus += element.ausentes
                console.log(pres)
            }
            else {
                data.addRows([
                    [nivel, ((pres * 100) / (pres + aus)), getRandomColor()]
                ]);
                nivel = element.nivel
                pres = element.presentes
                aus = element.ausentes
            }
        })

        data.addRows([
            [nivel, ((pres * 100) / (pres + aus)), getRandomColor()]
        ]);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
                        { calc: "stringify",
                            sourceColumn: 1,
                            type: "string",
                            role: "annotation" },
                        2]);

        var options = {
            title: "Atendance Percentage",
            width: 600,
            height: 400,
            bar: {groupWidth: "95%"},
            legend: { position: "none" },
        };
        var chart = new google.visualization.BarChart(document.getElementById("circular_asisttance"));
        chart.draw(view, options);

        

    }
}
url = "https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1"
function getApiAttendanceComparison(){
    return new Promise((resolve, reject) => {
        fetch(url).then(api => {
            if (!api.ok) {
                throw new Error('Error en la red');
            }
            return api.json();
        }).then(api => {
            resolve(api)
        }).catch(error => {
            reject(error)
        })
    })
}

getApiAttendanceComparison().then(apiAttendanceComp =>{
    drawCake(apiAttendanceComp.data)
})