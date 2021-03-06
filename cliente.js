//Definición de variables
const url = 'http://localhost:8080/usuario/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalUsuario = new bootstrap.Modal(document.getElementById('modalUsuario'))
const formUsuario = document.querySelector('form')
const nombre = document.getElementById('nombre')
const email = document.getElementById('email')
const prioridad = document.getElementById('prioridad')
var opcion = ''

btnCrear.addEventListener('click', () => {
    nombre.value = ''
    email.value = ''
    prioridad.value = ''
    modalUsuario.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (usuarios) => {
    usuarios.forEach(usuario => {
        resultados += `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.prioridad}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `
    })
    contenedor.innerHTML = resultados

}

//Procedimiento Mostrar
fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))


const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",

        function () {
            fetch(url + id, {
                method: 'DELETE'

            })
                .then(res => {
                    res.json()
                })
                .then(() => location.reload())
            alertify.success('Ok')

        },
        function () {
            alertify.error('Cancel')
        })
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const emailForm = fila.children[2].innerHTML
    const prioridadForm = fila.children[3].innerHTML
    nombre.value = nombreForm
    email.value = emailForm
    prioridad.value = prioridadForm
    opcion = 'editar'
    modalUsuario.show()

})

//Procedimiento para Crear y Editar
formUsuario.addEventListener('submit', (e) => {
    e.preventDefault()
    if (opcion == 'crear') {
        //console.log('OPCION CREAR')
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre.value,
                email: email.value,
                prioridad: prioridad.value
            })
        })
            .then(response => response.json())
            .then(data => {
                const nuevoUsuario = []
                nuevoUsuario.push(data)
                mostrar(nuevoUsuario)
            })
    }
    if (opcion == 'editar') {
        //console.log('OPCION EDITAR')
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idForm,
                nombre: nombre.value,
                email: email.value,
                prioridad: prioridad.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())

    }
    modalUsuario.hide()
})


//metodo buscar por correo
function obtener(correo) {
    console.log(correo);
    fetch(url)
        .then(Response => Response.json())
        .then(datos => {
            resultados="";
            let resp= false;
            datos.forEach(usuario => {
                if (usuario.email == correo) {
                    resultados += `<tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.prioridad}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `
                    resp=true;
                }
                
            })
            if(resp!=true){
                    alert("no esta ingresado")
                    location.reload();
            }

            contenedor.innerHTML = resultados
        })

}

document.getElementById("button-addon2").addEventListener('click', (e) => {
    obtener(document.getElementById('input_correo').value)

})
//metodo eliminar por correo

document.addEventListener("click", async e => {
  
    if (e.target.matches("botonBorrar")) {
        let isDelete = confirm(`¿estas seguro de eliminar el id ${e.target.dataset.id}?`);
        if (isDelete) {
            //delete-Delete
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json;charset = utf-8"
                    },
                },
                    res = await fetch(`http://localhost:8080/usuario/${e.target.dataset.id}`, options),
                    json = await res.json();
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
                location.reload();
            } catch (err) {
                let message = xhr.statusText || "Ocurrio un error";
                alert(`Error ${err.status}:${message}`);
            }
        }
    }
})


