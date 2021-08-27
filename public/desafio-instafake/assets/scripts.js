$('#js-form').submit(async (event) => {
    event.preventDefault()
    const email = document.getElementById('js-input-email').value
    const password = document.getElementById('js-input-password').value
    const JWT = await postData(email,password)
    getPosts(JWT)
    getPhotos(JWT)
})

const postData = async (email, password) => {
    try {
        const response = await fetch('http://localhost:3000/api/login',
{
            method:'POST',
            body: JSON.stringify({email:email,password:password})
        })
        const {token} = await response.json()
        localStorage.setItem('jwt-token',token)
        return token
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}

//LLama a nuestra Api de Posts//
const getPosts = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/posts',
{
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {data} = await response.json()
        if (data) {
            toggleFormAndTable('js-form-wrapper','js-table-wrapper','js-button-wrapper')
        }
    } catch (err) {
        localStorage.clear()
        console.error(`Error: ${err}`)
    }
}

//oculta Div y muestra Div con js-table-wrapper
const toggleFormAndTable = (form,table, logout) => {
    $(`#${form}`).toggle()
    $(`#${table}`).toggle()
    $(`#${logout}`).toggle()
}

//Valida si hay un JWT//
const init = async () => {
    const token = localStorage.getItem('jwt-token')
    if(token) {
        getPosts(token)
    }
}

//Metodo que trae las fotos//
const getPhotos = async (jwt) => {
    try {
        const response = await fetch('http://localhost:3000/api/photos',
{
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        const {data} = await response.json()
        if (data) {
            let rows = "";
            $.each(data, (i, row) => {
                rows += `<tr>
                    <td> ${row.id} </td>
                    <td> <img src="${row.download_url}" width="600" height="600"></td>
                </td>`
            })
            $(`#js-table-photos tbody`).append(rows)
        }
    } catch (err) {
        console.error(`Error: ${err}`)
    }
}