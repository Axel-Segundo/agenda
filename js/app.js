const formularioContactos = document.querySelector('#contacto'),
      listadoContactos = document.querySelector('#listado-contacto tbody');

eventListener();

function eventListener() {
    // Cuando el formluario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar un boton
    listadoContactos.addEventListener('cilck', eliminarContacto);
}

function leerFormulario(e) {
    e.preventDefault();
    // Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
          empresa = document.querySelector('#empresa').value,
          telefono = document.querySelector('#telefono').value,
          accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    } else {
        // Pasa la validación, crear llamdo a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if(accion === 'crear'){
            // Crearemos un nuevo elemento
            insertarBD(infoContacto);
        } else{
            // Editar contacto
        }
    }
}
// Inserta en la base de datos via Ajax
function insertarBD(datos){
    // Llamado a Ajax

    // Crear el objeto
    const xhr = new XMLHttpRequest();
    // abrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-contacto.php', true);
    // pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse( xhr.responseText) );
            // Leemos la respuesta de php
            const respuesta = JSON.parse( xhr.responseText);

            console.log(respuesta);

            // Inserta un complemento
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // Crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // Crear el icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // Crear el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // Crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // Crear el boton  de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // Agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // Agregar al contacto
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el form
            document.querySelector('form').reset();
            // Mostrar la notificación
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');
        }
    }
    // enviar los datos
    xhr.send(datos)
}

// Eliminar el contacto
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar') ) {
        // Tomar el ID
        const id = e.target.parentElement.getAttribute('data-id');

        // Preguntar usuario
        const respuesta = confirm('¿Estás seguro (a) ?');

        if (respuesta) {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', `inc/modelos/modelos-contacto.php?id=${id}&accion=borrar`, true);

            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);

                    if (resultado.respuesta == 'correcto') {
                        e.target.parentElement.parentElement.parentElement.remove();
                        mostrarNotificacion('Contacto eliminado', 'correcto');
                    } else {
                        mostrarNotificacion('Hubo un error', 'error');
                    }
                }
            }

            xhr.send();
        }
    }
}

// Notificación en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase,'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y Mostrar la notificación
    setTimeout(()  => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');
            
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}