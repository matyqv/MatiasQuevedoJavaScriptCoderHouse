//Luxon ============================================================luxon============
var DateTime = luxon.DateTime;
const now=DateTime.now();
//======================================= Funciones Universales
const Abrir_Cerrar_Segmentos = (a, b) => { a.classList.remove("oculto"); b.classList.add("oculto"); }
const escribir2Digitos = (a) => { if (a < 10) { return "0" + a } else { return a } }
//================================================= Datos de fechas
const today = new Date();
const year = now.year; // Año 
let mes = now.month;                // Mes (0-11, por eso se suma 1 un par de lineas mas abajo)
let day = now.day;                   // Día del mes (1-31)   
const hoy = year + "-" + escribir2Digitos(mes) + "-" + escribir2Digitos(day)    // Se utilizara para la referencia constante del dia
let fechaSeleccionada;   
//================================================ Variables
class Evento {
    constructor(fecha, nombre, descripcion, horario_inicio, horario_finalizacion, completa) {
        this.fecha = fecha;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.horario_inicio = horario_inicio;
        this.horario_finalizacion = horario_finalizacion;
        this.completa = completa;
    }
}
let Agenda = []
let IndexEventoAEditar                                                           // se utilizara para la referencia variable del dia que seleccionemos para inspeccionar
//================================================= Segmentos modulares HTML
let Titulo = document.getElementById("titulo")
let calendario = document.getElementById("calendario")
let agenda_dia = document.getElementById("agenda-dia")
let formulario_log_in = document.getElementById("Log-In")
let formulario_evento = document.getElementById("agregar-evento-form")
//==================================    Cartel Emergente
function MostrarCartelEmergente(titulo, contenido,advertencia) {
    Swal.fire({
        title: titulo,
        text: contenido,
        icon:advertencia,        
        color: "#000000",
        background: "#ffecc7",
        confirmButtonColor:"#ff8c00",        
        
    });
}
function NotificacionEmergente(text){
    Toastify({
        text: text,        
        duration: 3000,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`   
        style: { 
            background: "#e43b36",
        }       
        }).showToast();
}
//================================================================================================================================================================


    function InicializarAgenda() {
        const AgendaArrays = localStorage.getItem(username + "AgendaArray")   //intenta recuperar los datos user arrays
        if (AgendaArrays) {                                                   //si los user array existen 
            Agenda = JSON.parse(AgendaArrays);                                //convierte los userattays en objetos para agregarlos a la variable global
        }
    }
    function GuardarAgenga() {
        localStorage.setItem(username + "AgendaArray", JSON.stringify(Agenda))  // guardamos la variable global en el localStorage para recuperarla despues    
        MarcarEventosCalendario();
    }

    const HorarioDisponibe=()=>{
        const filtroXdia = Agenda.filter((element) => element.fecha.toString().includes(inputFecha.value.toString())) //filtramos por fecha exacta para que solo nos parezcan las que coinciden con este di
        return !filtroXdia.some(el => {
            if (
                (inputHoraFinalizacion.value > el.horario_inicio && inputHoraFinalizacion.value < el.horario_finalizacion) || 
                (inputHoraInicio.value > el.horario_inicio && inputHoraInicio.value < el.horario_finalizacion)
            ) {
                console.log("Horario no disponible");
                return true; // devolvemos el true para el !some (=false)
            }
            return false; // devolvemos el false para el !some (=true)
        });
    }

    function AgregarEvento() {    
        if (inputFecha.value != "" && inputNombreEvento.value != "" && inputHoraInicio.value != "") {
            if(HorarioDisponibe()){
                let EventoAAgregar = new Evento(
                    inputFecha.value,
                    inputNombreEvento.value,
                    inputDescripcion.value,
                    inputHoraInicio.value,
                    inputHoraFinalizacion.value,
                    false,
                );
                Agenda.push(EventoAAgregar)
                GuardarAgenga();
                NotificacionEmergente("Has agendado el evento!")
            }
            else{
                MostrarCartelEmergente("No puedes agendar en ese horario","Ya tienes cosas agendadas en ese horario","warning")
            }
        }
        else {
            MostrarCartelEmergente("No se ha podido agendar", "Debes completar Todos los campos para poder agendar el evento.","warning")
        }
    }
    function EliminarEvento() {
        console.log(IndexEventoAEditar)
        let AgendaFiltrada = Agenda.filter((eventos) => eventos != Agenda[IndexEventoAEditar])
        console.log(AgendaFiltrada)
        Agenda = AgendaFiltrada
        GuardarAgenga()
    }
    //===============================   Interface Calendario

    function prepararCalendario(y,m) {                 
        const aux_primer_dia = DateTime.local(y, m, 1); //cramos un newDate  con el primer dia del mes
         let dia_inicio_mes = aux_primer_dia.weekday-1; // le pedimos que nos de que dia cae para de los 7 dias de la semana, y le restamos uno para que comience del valor 0
        const limite_dias_mes = aux_primer_dia.daysInMonth;        

        let listaDias = document.getElementById("calendario-cuerpo")    //Aca se obtiene el objeto padre para instanciar los dias
        while (listaDias.firstChild) 
            {  listaDias.removeChild(listaDias.firstChild);        }    //Aca se borran los hijos del dia para mostrar otros meses


        const semana = ["L", "M", "X", "J", "V", "S", "D"]          // array con los dias de la semana para el calendario
        semana.forEach(element => {                                 //primero agregamos los dias de la semana arriba del calendario
            const NEWDIA = document.createElement("li")
            NEWDIA.innerHTML = `<p>${element}</p>`
            NEWDIA.classList.add("calendario-cabecera")
            listaDias.appendChild(NEWDIA)
        });

        for (let i = 1; i < 43; i++) {                              //damos 43 para que cree 42 slots en el calendario asi quedan 6 filas bien simetricas
            let aux_dia = i - dia_inicio_mes;                       //Damos un valor negativo a aux_dia para que opaque las casillas 
            const NEWDIA = document.createElement("li")

            if (aux_dia < 1 || aux_dia > limite_dias_mes) { aux_dia = ""; NEWDIA.classList.add("apagar-colores") } //cuando el numero auxiliar este fuera del rango de dias del mes se opacaran las cuadricuals
            if (aux_dia == day) { NEWDIA.classList.add("current-day") }    //cuando el auxiliar coincida con la fecha la cuadricula se marcara de color señalado

            let fecha_etiqueta = y + "-" + escribir2Digitos(mes) + "-" + escribir2Digitos(aux_dia);    //creamos la etiqueta compilando la fecha
            NEWDIA.innerHTML = `<p id="${fecha_etiqueta}" ">${aux_dia}</p>`  // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
            NEWDIA.onclick = () => AbrirAgendaDiaria(fecha_etiqueta);
            listaDias.appendChild(NEWDIA)
        }

        MarcarEventosCalendario();

        buttonAgregarEvento.classList.remove("oculto")
    }
    let filtroXmes
    function MarcarEventosCalendario() {
        const eventos_agendados_para_limpiar = document.querySelectorAll(".evento-agendado")

        eventos_agendados_para_limpiar.forEach(element => { element.classList.remove("evento-agendado") });
        let auxy=parseInt(year)+Modificador_Year   //  le agregamos el modificador de año para que al moverse la fecha se vea de manera correcta
        let auxm=escribir2Digitos(mes+Modificador_Mes)   //  le agregamos el modificador de año para que al moverse la fecha se vea de manera correcta
        Titulo.innerText = auxy + "-" +auxm

        filtroXmes = Agenda.filter((element) => element.fecha.toString().includes(Titulo.innerText))  // pedimos que filtre con la fecha pedida EJ: (2024-08)
        filtroXmes.forEach(element => {                                     //el foreach recorrera nuestra lista filtrada
            const dia = document.getElementById(element.fecha.toString())   //buscara en el HTML los id 
            dia.classList.add("evento-agendado")                            // al encontrarlos le añade la clase que deseamos
        });
    }
    
    let Modificador_Mes=0;      // Auxiliar para visualizar otros meses
    let Modificador_Year=0;     // Auxiliar para visualizar otros años
    
    function CambiarFechaCalendario(){
        let y=parseInt(now.year)+Modificador_Year   
        let m=mes+Modificador_Mes;
        AbrirCalenderio(y,m) 
    }
    
    let buttonMesSiguiente = document.getElementById("mes-siguiente-Btn")             //Cerrar Agenda diaria
    let buttonMesAnterior = document.getElementById("mes-anterior-Btn")               //Cerrar Agenda diaria
    let buttonMesActual = document.getElementById("mes-actual-Btn")                   //volver al mes actual
    
    buttonMesSiguiente.onclick = () => {     
        Modificador_Mes+=1;
        if(mes+Modificador_Mes>12)    {Modificador_Year+=1; Modificador_Mes=(mes*-1)+1;}    //Emparejamos el numero del mes por si nos excedemos
        CambiarFechaCalendario()}
    
    buttonMesAnterior.onclick = () => {     
        Modificador_Mes-=1;
        if(mes+Modificador_Mes<1)  {Modificador_Year-=1; Modificador_Mes=12-mes;}           //Emparejamos el numero del mes por si nos excedemos
        CambiarFechaCalendario()}
    
        buttonMesActual.onclick=()=>{Modificador_Mes=0; Modificador_Year=0; CambiarFechaCalendario();}

//================================  Agenda Diaria
const auxPintarHorasIntermedias=(a,b,c)=>{  //auxiliar para pintar casillas inter medias
    if(c>a&&a>b){return true}    else {return false}    //si "a" horario "b" hora inicio "c" hora final, cuando a este entre los parametros devolvera true
}

function prepararAgendaDiaria(a) {
    const filtroXdia = Agenda.filter((element) => element.fecha.toString().includes(a.toString())) //filtramos por fecha exacta para que solo nos parezcan las que coinciden con este dia

    let listaDia = []                       // creamos la lista para almacenar los horarios que queremos plasmar en el HTML
    for (let i = 0; i < 24; i++) { const hora = escribir2Digitos(i) + ":00"; listaDia.push(hora); } //agregamos las horas del dia a una lista (0-23)

    filtroXdia.forEach((el) => listaDia.push(el.horario_inicio.toString(),el.horario_finalizacion.toString()))     // Agregar los horarios de eventos del dia a la lista de horarios 
    const horasUnicas = [...new Set(listaDia)];                                 // filtramos las horas para que no se repitan
    horasUnicas.sort((a, b) => parseInt(a) - parseInt(b));                      // ordenamos la lista final de los horarios para que queden ordenados
    const listaAgenda = document.querySelector(".agenda-dia")

    horasUnicas.forEach(el => {
        const NEWHORA = document.createElement("li")
        NEWHORA.innerHTML = `<span>${el} - </span>`                             // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
        NEWHORA.id = el;

        filtroXdia.forEach(eventoFiltrado => {
            if (eventoFiltrado.horario_inicio.toString() === el) {
                NEWHORA.innerHTML = `<span>${el}</span> <span>${eventoFiltrado.nombre}</span>`  // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
                NEWHORA.classList.add("evento-agendado")
                NEWHORA.onclick = () => (abiriFormularioEdicionEvento(eventoFiltrado))                 // le damos el input para la edicion del evento al hacer click
            }
            if(auxPintarHorasIntermedias(el,eventoFiltrado.horario_inicio,eventoFiltrado.horario_finalizacion)){//pedimos que cuando el horario se encuentre entre las horas de inicio y fin del evento tambien se pinte para eso llamamos una funcion nueva
                NEWHORA.innerHTML = `<span>.</span> <span></span>`  
                NEWHORA.classList.add("evento-agendado")
                NEWHORA.onclick = () => (abiriFormularioEdicionEvento(eventoFiltrado))                 // le damos el input para la edicion del evento al hacer click
            }
            if (eventoFiltrado.horario_finalizacion.toString() === el &&
                eventoFiltrado.horario_finalizacion.toString()!=eventoFiltrado.horario_inicio.toString()) {
                NEWHORA.innerHTML = `<span>${eventoFiltrado.horario_finalizacion}</span>  <span></span>`  // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
                NEWHORA.classList.add("evento-agendado")
                NEWHORA.onclick = () => (abiriFormularioEdicionEvento(eventoFiltrado))                 // le damos el input para la edicion del evento al hacer click
            }

        })                                                                                         // Agregar los horarios de eventos del dia a la lista de horarios 
        listaAgenda.append(NEWHORA)
    });
    Titulo.innerText = a
    fechaSeleccionada = a
}
function AbrirAgendaDiaria(a) {
    const AGENDA_DIA_PREEXISTENTE = document.querySelector(".agenda-dia")    //buscamos si ya hay creada una agenda para este dia
    AGENDA_DIA_PREEXISTENTE.remove();                                       // la eliminamos

    let NEW_AGENDA_DIA = document.createElement("ul");                        //creamos una nueva
    NEW_AGENDA_DIA.classList.add("agenda-dia")
    let agenda_dia_padre = document.getElementById("agenda-dia")              //buscamos su objeto padre para luego instanciarla
    agenda_dia_padre.append(NEW_AGENDA_DIA)                                 //la instanciamos 
    Abrir_Cerrar_Segmentos(agenda_dia, calendario);                         //pedimos que se abra agenda diaria y que se cierre el calendario

    prepararAgendaDiaria(a);
}
function AbrirCalenderio(y,m) {
    InicializarAgenda();
    Abrir_Cerrar_Segmentos(calendario, formulario_log_in);
    prepararCalendario(y,m);
}
function cerrarAgendaDiaria() {
    Abrir_Cerrar_Segmentos(calendario, agenda_dia);      //ponemos visible el calendario y ocultamos la agenda diaria
    fechaSeleccionada = "";                               //Ponemos la fecha seleccionada en "" para evitar que se autocomplete el input = fecha seleccionada
    Titulo.innerText=year+"-"+escribir2Digitos(mes)
}

let buttonSalirAgendaDiaria = document.getElementById("salir-agenda-diaria-btn")  //Cerrar Agenda diaria
buttonSalirAgendaDiaria.onclick = () => { cerrarAgendaDiaria() }

