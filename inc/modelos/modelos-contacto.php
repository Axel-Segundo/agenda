<?php 
if ($_POST('accion') == 'crear') {
    //creara un nuevo registro
    require_once('../funciones/bd.php');

    //validar las entradas
    $nombre = filter_var($_POST('nombre'), FILTER_SANITIZE_STRING);
    $empresa = filter_var($_POST('empresa'), FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST('telefono'), FILTER_SANITIZE_STRING);

    try {
        $stmt = $conexion->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $empresa, $telefono);
        $stmt->execute();
        $respuesta = array(
            'respuesta' => 'correcto',
            'datos' => array(
                'nombre' => $nombre,
                'empresa' => $empresa,
                'telefono' => $telefono,
                'id_insertado' => $stmt->insert_id
            )
        );
        $stmt->close();
        $conexion->close();
    } catch (Exception $e) {
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}