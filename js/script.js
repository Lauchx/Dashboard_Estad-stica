

    // Código para dibujar los gráficos

function drawGraphic(inicial, primario, secundario) {
    google.charts.load("current", { packages: ['corechart'] })
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Alumnos", "Cantidad", { role: "style" }],
            ["Inicial", inicial, "#fefee3"],
            ["Primario", primario, "#ffc9b9"],
            ["Secundario", secundario, "#d68c45"],
        ]);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Composición del alumnado por nivel.",
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
            backgroundColor: {
                'fill': '#c4fff9',
                'opacity': 100
             },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("students_byLevel"))
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
        let students = apiStudents.data
        let inicial = 0
        let primario = 0
        let secundario = 0
        students.forEach((element) => {
            if (element.nivel === 'Inicial') inicial++
            else if (element.nivel === 'Primario') primario++
            else if (element.nivel === 'Secundario') secundario++
        });
        drawGraphic(inicial, primario, secundario)
    }).catch(error => {
        console.error(error)
    })
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




function drawChart(dataAttendance) {
    google.charts.load('current', { 'packages': ['line'] });
    google.charts.setOnLoadCallback(draw);

    function draw() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Month');
        data.addColumn('number', 'Attendance');
        dataAttendance.forEach(element => {
            data.addRows([
                [element.mes, element.asistencia],
            ]);
        })


        var options = {
            chart: {
                title: 'Evolución anual de nivel de asistencia por mes.',
                subtitle: 'De Marzo a Diciembre',
                backgroundColor: '#c4fff9',
            },
            backgroundColor: {
                'fill': '#c4fff9',
                'opacity': 100,
             },
        };

        var chart = new google.charts.Line(document.getElementById('Anual_attendance_byLevels'));

        chart.draw(data, google.charts.Line.convertOptions(options));
    }
}





url = "https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1"
function getApiAttendance() {
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
getApiAttendance().then(apiAttendance => {

    drawChart(apiAttendance.data)
    asistenciaGeneral(apiAttendance.data)
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getRandomColor() {
    let randomNumber = Math.floor(Math.random() * 16777215);
    let randomColor = "#" + randomNumber.toString(16).padStart(6, '0');
    return randomColor;
}

function drawCake(apiData) {

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawCake2);
    function drawCake2() {


        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Element'); // Columna 0: tipo string
        data.addColumn('number', 'Density'); // Columna 1: tipo number
        data.addColumn({ type: 'string', role: 'style' });

        let nivel = ""
        let pres = 0
        let aus = 0

        apiData.forEach(element => {
            if (nivel == "") nivel = element.nivel
            if (nivel == element.nivel) {
                pres += element.presentes
                aus += element.ausentes
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
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Porcentaje de asistencia por niveles.",
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
            backgroundColor: {
                'fill': '#c4fff9',
                'opacity': 100
             },
        };
        var chart = new google.visualization.BarChart(document.getElementById("Atendance_levels"));
        chart.draw(view, options);



    }
}
url = "https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1"
function getApiAttendanceComparison() {
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

getApiAttendanceComparison().then(apiAttendanceComp => {
    drawCake(apiAttendanceComp.data)
})

/////////////////////////////////////////////////

function drawPie(apiAttendanceComp) {

    let apro = 0
    let desa = 0
    let cont = 0
    apiAttendanceComp.forEach(element => {
        apro += element.aprobados
        desa += element.desaprobados
        cont++
    })

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChartPie);
    function drawChartPie() {
        var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Aprobados', (apro / cont)],
            ['Desaprobados', (desa / cont)]
        ]);

        var options = {
            title: 'Nivel general de calificaciones en la institución.',
            pieHole: 0.4,
            backgroundColor: {
                'fill': '#c4fff9',
                'opacity': 100
             },
        };

        var chart = new google.visualization.PieChart(document.getElementById('general_calcifications'));
        chart.draw(data, options);
    }
}
url = "https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1"
function getApiCalificatons() {
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

getApiCalificatons().then(apiRatings => {
    drawPie(apiRatings.data)
    drawChartLevel(apiRatings.data)
})
/////////////////////////////////////////
function drawChartLevel(apiRatings) {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChartLevel2);

    function drawChartLevel2() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Element'); // Columna 0: tipo string

        data.addColumn('number', 'Density'); // Columna 1: tipo number
        data.addColumn({ type: 'string', role: 'style' });
        
        apiRatings.forEach(element =>{
            data.addRow([(element.curso + " " + element.nivel),  element.aprobados, getRandomColor()])
        })
        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            title: "Comparativa de niveles de calificaciones por curso.",
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
            backgroundColor: {
                'fill': '#c4fff9',
                'opacity': 100
             },
        };
        var chart = new google.visualization.BarChart(document.getElementById("compare_ratings_byCourse"));
        chart.draw(view, options);
    }
}
//////////////////////////////////////
function asistenciaGeneral(api){
    google.charts.load('current', {'packages':['gauge']});
      google.charts.setOnLoadCallback(asistenciaGenneral2);

      function asistenciaGenneral2() {
        cont = 0
        let asis = 0
        api.forEach(element => {
            asis += element.asistencia
            cont++
        })
        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['Asistencia', (asis/cont)*100]
        ]);

        var options = {
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5,
          backgroundColor: {
            'fill': '#c4fff9',
            'opacity': 100
         },
        };
        

        var chart = new google.visualization.Gauge(document.getElementById('General_asisttance'));

        chart.draw(data, options);
      }
    }
/////////////////////////////////////
function drawEstado(api){
    google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawEstado2);
      function drawEstado2() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['Total', api[0].total],
          ['Error', api[0].error],
          ['Pendientes',  api[0].pendientes],
          ['Entregados', api[0].entregados],
        ]);

        var options = {
          title: 'Estado de comunicados.',
          is3D: true,
          backgroundColor: {
            'fill': '#c4fff9',
            'opacity': 100
         },
        };

        var chart = new google.visualization.PieChart(document.getElementById('status_communications'));
        chart.draw(data, options);
      }
    }
    url = "https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1"
    function getApiComunicados() {
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
    
    getApiComunicados().then(apiEstado => {
        drawEstado(apiEstado.data)
    })

