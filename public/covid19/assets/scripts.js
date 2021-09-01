// Función con método fetch para generar la tabla de acuerdo a la data

const baseUrl = "http://localhost:3000/api"

const token = localStorage.getItem('jwt-token');

if (token) {
  hideShowNavBar(token);
}

const pathName = window.location.pathname;

if (pathName === '/covid19/index.html' || pathName === '/covid19/') {
  traerInformacion(`${baseUrl}/total`);
} else {
  informacionChile();
}

const btnLogout = document.getElementById('logout');

btnLogout.addEventListener('click', function(event){
  event.preventDefault();
  localStorage.removeItem('jwt-token');
  window.location.href = '/covid19/index.html';
});

$('#form-login').submit(async(event) => {
  event.preventDefault();
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;
  const JWT = await postData(email, password);
  hideShowNavBar(JWT);

  // informacionChile(`${baseUrl}/confirmed`, `${baseUrl}/deaths`, `${baseUrl}/recovered`)
});

//Enviar credenciales y obtener token
const postData = async(email, password) => {
  try {
    const response = await fetch('http://localhost:3000/api/login', 
    {
      method: 'POST',
      body: JSON.stringify({email:email, password:password})
    })
    const {token} = await response.json();
    localStorage.setItem('jwt-token', token);
    return token;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

//Ocultar botones de navBar
function hideShowNavBar(jwt) {
  try {
    if (jwt !== '') {
      $('#login').toggle();
      $('#situacion-chile').toggle();
      $('#logout').toggle();
      $('#login-modal').modal('hide');
    } else {
      console.log('no pasamos');
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

async function detalleInformacion(url){
  const response = await fetch (url);
  const { data } = await response.json();
  const divDetalleInfo = document.getElementById('detalleCovid');
  const tituloModal = document.getElementById('tituloCovid');
  tituloModal.innerHTML = `Detalle Covid en ${data.location}`;
  divDetalleInfo.innerHTML = `<p><strong>Casos confirmados:</strong> ${data.confirmed}</p><br>
                              <p><strong>Casos fallecidos:</strong> ${data.deaths}</p><br>
                              <p><strong>Casos recuperados:</strong> ${data.recovered === 0 ? 'Sin información' : data.recovered}</p><br>
                              <p><strong>Casos activos:</strong> ${data.active === 0 ? 'Sin información' : data.active}</p><br>`;
};

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
                <td> <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#covidModal" onclick="detalleInformacion('${baseUrl}/countries/${row.location}')">Ver detalle</button></td>
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
        backgroundColor: 'rgba(34, 139, 34)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0
      },
      {
        label: 'Casos Confirmados',
        data: covi.data.map(x => x.confirmed),
        backgroundColor: 'rgba(255, 140, 0)',
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0
      },
      {
        label: 'Casos Muertos',
        data: covi.data.map(x => x.deaths),
        backgroundColor: 'rgba(220, 20, 60)',
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



  //Grafico Chile
  const chartDataChile = {
    labels: filtro.map(x => x.location),
    datasets: [{
      label: 'Casos Confirmados',
      data: covi.data.map(x => Math.floor(Math.random() * 3000000)),
      fill: false,
      borderColor: 'rgb(255, 140, 0)',
      tension: 0.1
    },
    {
      label: 'Casos Muertos',
      data: covi.data.map(x => x.confirmed),
      fill: false,
      borderColor: 'rgb(220, 20, 60)',
      tension: 0.1
    },
    {
      label: 'Casos Activos',
      data: covi.data.map(x => x.deaths),
      fill: false,
      borderColor: 'rgb(34, 139, 34)',
      tension: 0.1
    }]
  };

  const configChile = {
    type: 'line',
    data: chartDataChile,
  };
  var myChartChile = new Chart(
      document.getElementById('myChartChile'),
      configChile
  );

}


async function informacionChile(){
  
  var jwt = localStorage.getItem('jwt-token')

//Informacion de confirmados//
  const getConfirmed = async (jwt) => {
      try {
        const response = await fetch('http://localhost:3000/api/confirmed',
    {
          method:'GET',
          headers: {
            Authorization: `Bearer ${jwt}`
          }
      })
        const {data} = await response.json()
        return data
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }

//informacion de muertos//
  const getDeaths = async (jwt) => {
      try {
        const response = await fetch('http://localhost:3000/api/deaths',
    {
          method:'GET',
          headers: {
            Authorization: `Bearer ${jwt}`
          }
      })
        const {data} = await response.json()
        return data
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }

//informacion de recuperados//
  const getRecovered = async (jwt) => {
      try {
        const response = await fetch('http://localhost:3000/api/recovered',
  {
          method:'GET',
          headers: {
            Authorization: `Bearer ${jwt}`
          }
      })
        const {data} = await response.json()
        return data
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }
  getConfirmed(jwt);
  getDeaths(jwt);
  getRecovered(jwt);
}
