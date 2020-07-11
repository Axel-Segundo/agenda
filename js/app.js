const formularioContactos = document.querySelector('#contacto');

eventListener();

function eventListener() {
    // Cuando el formluario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
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
            console.log(JSON.parse(xhr.responseText) );
            // Leemos la respuesta de php
            const respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta.empresa);
        }
    }
    // enviar los datos
    xhr.send(datos)
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