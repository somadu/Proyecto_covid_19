// Función con método fetch para generar la tabla de acuerdo a la data

const baseUrl = "http://localhost:3000/api"

async function traerInformacion(url){
    const response = await fetch (url);
    var covi = await response.json();
    let rows = "";
    if (covi) {
        $.each(covi.data, (i, row) => {
            rows += `<tr>
                <td> ${row.location} </td>
                <td> ${row.confirmed} </td>
                <td> ${row.deaths} </td>
                <td> <a href="http://localhost:3000/api/countries/${row.location}"> Ver Detalle </a></td>
            </td>`
        })
        $(`#js-table-covid tbody`).append(rows)
    }
    const filtro = covi.data.filter(data => data.confirmed > 3000000)

    //Grafico
    const chartData = {
      labels: filtro.map(x => x.location),
      datasets: [{
        label: 'Casos Activos',
        data: covi.data.map(x => Math.floor(Math.random() * 3000000)),
        backgroundColor: 'rgba(34, 139, 34, 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0
      },
      {
        label: 'Casos Confirmados',
        data: covi.data.map(x => x.confirmed),
        backgroundColor: 'rgba(255, 140, 0, 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0
      },
      {
        label: 'Casos Muertos',
        data: covi.data.map(x => x.deaths),
        backgroundColor: 'rgba(220, 20, 60 0.2)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0
      }]
    };

    const config = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    };
    var myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
    }     

traerInformacion(baseUrl + `/total`)

