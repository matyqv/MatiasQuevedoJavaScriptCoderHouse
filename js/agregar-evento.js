
let inputFecha = document.getElementById("fecha")
let inputNombreEvento = document.getElementById("titulo-evento")
let inputDescripcion = document.getElementById("descripcion-evento")
let inputHoraInicio = document.getElementById("hora-de-inicio")
let inputHoraFinalizacion = document.getElementById("hora-de-finalizacion")
//==================================    formulario de Evento

function rellenar_inputs_formularioEventos(fecha, Nombre, horaI, horaF, Descripci) {
    inputFecha.value = fecha;
    inputHoraInicio.value = horaI;
    inputHoraFinalizacion.value = horaF;
    inputNombreEvento.value = Nombre;
    inputDescripcion.value = Descripci;

    console.log(inputHoraInicio.value)
}

function aux_abrirFormularioEvento() {
    formulario_evento.classList.remove("oculto");
    buttonAgregarEvento.classList.add("oculto")
}

function abiriFormularioEvento() {
    aux_abrirFormularioEvento();
    rellenar_inputs_formularioEventos("", "", "", "", "")   //pedimos el contenido de los inputs fuese vacio
    inputFecha.value = fechaSeleccionada;                 //exceptuando el formulario que siempr pedimos que este con la fecha seleccionada
    buttonEliminarEvento.classList.add("oculto")
    buttonConfirmarEvento.innerText = "Agregar";
}

function abiriFormularioEdicionEvento(a) {
    aux_abrirFormularioEvento();
    IndexEventoAEditar = Agenda.findIndex((el) => el.fecha === a.fecha && el.horario_inicio === a.horario_inicio)   //obtemenos el index del evento que tenga la misma hora y fecha que buscamos

    rellenar_inputs_formularioEventos(fechaSeleccionada, a.nombre, a.horario_inicio, a.horario_finalizacion, a.descripcion)

    buttonConfirmarEvento.innerText = "Modificar";                                                            //Cambiamos el texto del boton Agregar a Modificar
    buttonEliminarEvento.classList.remove("oculto");                                                        //volvemos visible el voton de Eliminar
}

function ButtonConfirmarEvento() {
    if (buttonConfirmarEvento.innerText === "Modificar") {    //Si el texto del TITULO de la app es igula al dia EJ(2024-07-09) entendera que se intenta modificar un elemento
        Agenda[IndexEventoAEditar].nombre = inputNombreEvento.value
        Agenda[IndexEventoAEditar].fecha = inputFecha.value
        Agenda[IndexEventoAEditar].horario_inicio = inputHoraInicio.value
        Agenda[IndexEventoAEditar].horario_finalizacion = inputHoraFinalizacion.value
        Agenda[IndexEventoAEditar].descripcion = inputDescripcion.value
        GuardarAgenga();
    }
    else {
        AgregarEvento();
        if (titulo.innerHTML = fechaSeleccionada) {
            AbrirAgendaDiaria(fechaSeleccionada);
        }
    }
}

function cerrarFormularioEvento() {
    buttonAgregarEvento.classList.remove("oculto")  //volvemos visible el boton para "Agregar Evento"
    formulario_evento.classList.add("oculto")       //ocultamos el formulario
}

let auxiliar_escribir_sin_separaciones = (a, separador) => {
    let partes = a.split(separador); // dividimos la fecha o hora en partes segun que separador use (":") o ("-")     
    let fechaTransformada = partes.join("");// Unimos las partes sin los separadores        
    return (fechaTransformada);
}

function auxiliarRestringirFechaEvento() {
    let aux_fecha_input = auxiliar_escribir_sin_separaciones(inputFecha.value, "-")
    let aux_fecha_seleccionada = auxiliar_escribir_sin_separaciones(hoy, "-")

    console.log(aux_fecha_input)
    console.log(aux_fecha_seleccionada)

    if (aux_fecha_input < aux_fecha_seleccionada) {
        MostrarCartelEmergente("Cuidado","No puedes agendar eventos en fachas que ya pasaron. La fecha se ha progamado para el dia de hoy, puedes elegir solo fechas posteriores","warning")
        inputFecha.value = hoy;
    }
}

function auxiliarRestringirHorariosDeEventos(){
    if(inputHoraInicio.value>inputHoraFinalizacion.value && inputHoraInicio.value!="" && inputHoraFinalizacion.value!="") { 
        MostrarCartelEmergente("Cuidado","La hora de finalizacion del evento no puede ser anterior a la hora de inicio. la hora de finalizacion se seteara a la misma hora del inicio por default","warning")
        inputHoraFinalizacion.value=inputHoraInicio.value   }
}
/// Botones en formulario evento      

    inputFecha.onchange = () => { auxiliarRestringirFechaEvento() }
    inputHoraFinalizacion.onblur = () => { auxiliarRestringirHorariosDeEventos() }
    inputHoraInicio.onblur = () => { auxiliarRestringirHorariosDeEventos() }

    let buttonAgregarEvento = document.getElementById("agregar-evento")                         //Abre el menu del formulario para los eventos
    buttonAgregarEvento.onclick = () => { abiriFormularioEvento(); }

    let buttonConfirmarEvento = document.getElementById("agendar-evento-btn")                   //Confirma la Agenda o edicion de los eventos
    buttonConfirmarEvento.onclick = () => { ButtonConfirmarEvento(); cerrarFormularioEvento(); }

    let buttonEliminarEvento = document.getElementById("eliminar-evento-btn")                   //Elimina el evento de la agenda
    buttonEliminarEvento.onclick = () => { EliminarEvento(); AbrirAgendaDiaria(fechaSeleccionada); cerrarFormularioEvento(); }

    let buttonSalirFormularioEvento = document.getElementById("salir-evento-btn")              //Boton cerrar formulario evento
    buttonSalirFormularioEvento.onclick = () => { cerrarFormularioEvento(); }

