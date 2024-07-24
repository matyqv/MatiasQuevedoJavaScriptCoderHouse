//================================================ Variables
class Users {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
let CuentasRegistradas = []
let username
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
let IndexEventoAEditar
//================================================= Datos de fechas
const today = new Date();
const year = today.getFullYear().toString(); // Año 
let mes = (today.getMonth());                // Mes (0-11, por eso se suma 1 un par de lineas mas abajo)
let day = today.getDate();                   // Día del mes (1-31)    
let fechaSeleccionada;  
//================================================= Segmentos modulares HTML
let Titulo = document.getElementById("titulo")
let calendario = document.getElementById("calendario")
let agenda_dia = document.getElementById("agenda-dia")
let formulario_log_in = document.getElementById("Log-In")
let formulario_evento = document.getElementById("agregar-evento-form")
//================================================= INPUTS
let inputFecha = document.getElementById("fecha")
let inputNombreEvento = document.getElementById("titulo-evento")
let inputDescripcion = document.getElementById("descripcion-evento")
let inputHoraInicio = document.getElementById("hora-de-inicio")
let inputHoraFinalizacion = document.getElementById("hora-de-finalizacion")
//================================================================================================================================================================
const Abrir_Cerrar_Segmentos = (a, b) => { a.classList.remove("oculto"); b.classList.add("oculto"); }
const escribir2Digitos = (a) => { if (a < 10) { return "0" + a } else { return a } }
{
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
    function AgregarEvento() {
        if (inputFecha.value != "" && inputNombreEvento.value != "" && inputHoraInicio.value != "") {
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
        }
        else {
            MostrarCartelEmergente("No se ha podido agendar","Debes completar Todos los campos para poder agendar el evento.")
        }
    }
    function EliminarEvento() {
        console.log(IndexEventoAEditar)
        let AgendaFiltrada = Agenda.filter((eventos) => eventos != Agenda[IndexEventoAEditar])
        console.log(AgendaFiltrada)
        Agenda = AgendaFiltrada
        GuardarAgenga()
    }
    //==================================    Cartel Emergente

    function MostrarCartelEmergente(titulo,contenido){
        let cartel_emergente=document.getElementById("cartel-emergente")
        cartel_emergente.classList.remove("oculto")

        let cartel_emergente_titulo=document.getElementById("titulo-cartel-emergente")
        let cartel_emergente_contenido=document.getElementById("contenido-cartel-emergente")

        cartel_emergente_titulo.innerText=titulo;
        cartel_emergente_contenido.innerText=contenido;

        
        let cartel_emergente_cerrar_btn=document.getElementById("cartel-emergente-cerrar-btn")
        cartel_emergente_cerrar_btn.onclick=()=>(cartel_emergente.classList.add("oculto"))
    }

    //==================================    formulario de Evento
    
    function rellenar_inputs_formularioEventos(fecha,Nombre,horaI,horaF,Descripci){
        inputFecha.value=fecha;
        inputHoraInicio.value=horaI;
        inputHoraFinalizacion.value=horaF;
        inputNombreEvento.value=Nombre;
        inputDescripcion.value=Descripci;
}

    function aux_abrirFormularioEvento(){
        formulario_evento.classList.remove("oculto"); 
        buttonAgregarEvento.classList.add("oculto")    
    }

    function abiriFormularioEvento() {
        aux_abrirFormularioEvento();
        rellenar_inputs_formularioEventos("","","","","")   //pedimos el contenido de los inputs fuese vacio
        inputFecha.value=fechaSeleccionada;                 //exceptuando el formulario que siempr pedimos que este con la fecha seleccionada
        buttonEliminarEvento.classList.add("oculto")
        buttonConfirmarEvento.innerText="Agregar";
    }

    function abiriFormularioEdicionEvento(a) {
        aux_abrirFormularioEvento();
        IndexEventoAEditar=Agenda.findIndex((el)=>el.fecha===a.fecha && el.horario_inicio===a.horario_inicio)   //obtemenos el index del evento que tenga la misma hora y fecha que buscamos

        rellenar_inputs_formularioEventos(fechaSeleccionada,a.nombre,a.horario_inicio,a.horario_finalizacion,a.descripcion)

        buttonConfirmarEvento.innerText="Modificar";                                                            //Cambiamos el texto del boton Agregar a Modificar
        buttonEliminarEvento.classList.remove("oculto");                                                        //volvemos visible el voton de Eliminar
    }

    function ButtonConfirmarEvento(){
        if(buttonConfirmarEvento.innerText==="Modificar"){    //Si el texto del TITULO de la app es igula al dia EJ(2024-07-09) entendera que se intenta modificar un elemento
            Agenda[IndexEventoAEditar].nombre=inputNombreEvento.value
            Agenda[IndexEventoAEditar].fecha=inputFecha.value
            Agenda[IndexEventoAEditar].horario_inicio=inputHoraInicio.value
            Agenda[IndexEventoAEditar].horario_finalizacion=inputHoraFinalizacion.value
            Agenda[IndexEventoAEditar].descripcion=inputDescripcion.value
            GuardarAgenga();
        }
        else{
            AgregarEvento();
            if(titulo.innerHTML=fechaSeleccionada){
                AbrirAgendaDiaria(fechaSeleccionada);
            }
        }
    }

    function cerrarFormularioEvento(){
        buttonAgregarEvento.classList.remove("oculto")  //volvemos visible el boton para "Agregar Evento"
        formulario_evento.classList.add("oculto")       //ocultamos el formulario
    }

        /// Botones en formulario evento
    let buttonAgregarEvento = document.getElementById("agregar-evento")                         //Abre el menu del formulario para los eventos
    buttonAgregarEvento.onclick = () => { abiriFormularioEvento();}

    let buttonConfirmarEvento = document.getElementById("agendar-evento-btn")                   //Confirma la Agenda o edicion de los eventos
    buttonConfirmarEvento.onclick = () => {ButtonConfirmarEvento();  cerrarFormularioEvento();  }
    
    let buttonEliminarEvento = document.getElementById("eliminar-evento-btn")                   //Elimina el evento de la agenda
    buttonEliminarEvento.onclick = () => {EliminarEvento(); AbrirAgendaDiaria(fechaSeleccionada); cerrarFormularioEvento(); }

    let buttonSalirFormularioEvento=document.getElementById("salir-evento-btn")              //Boton cerrar formulario evento
    buttonSalirFormularioEvento.onclick =()=>{cerrarFormularioEvento(); }
    //===============================   Interface Calendario

    function prepararCalendario() {
        const aux_primer_dia = new Date(year, mes, 1);               //cramos un newDate  con el primer dia del mes
        const dia_inicio_mes = aux_primer_dia.getDay() - 1;          // le pedimos que nos de que dia cae para de los 7 dias de la semana, y le restamos uno para que comience del valor 0
        const limite_dias_mes = new Date(year, mes, 0).getDate();

        let month
        month = mes + 1;                                             //agregamos +1 al mes para que deje de leerlo en formato (0-11) y podamos hacerlo cincidir con la notacion de la agenda (1-12)

        let listaDias = document.getElementById("calendario-cuerpo")

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

            let fecha_etiqueta = year + "-" + escribir2Digitos(month) + "-" + escribir2Digitos(aux_dia);    //creamos la etiqueta compilando la fecha
            NEWDIA.innerHTML = `<p id="${fecha_etiqueta}" ">${aux_dia}</p>`  // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
            NEWDIA.onclick = () => AbrirAgendaDiaria(fecha_etiqueta);
            listaDias.appendChild(NEWDIA)
        }


        Titulo.innerText = year + "-" + escribir2Digitos(month)
        MarcarEventosCalendario();

        buttonAgregarEvento.classList.remove("oculto")
    }
    let filtroXmes
    function MarcarEventosCalendario() {      
        const eventos_agendados_para_limpiar = document.querySelectorAll(".evento-agendado")
        console.log(eventos_agendados_para_limpiar)
        eventos_agendados_para_limpiar.forEach(element => {  element.classList.remove("evento-agendado") });


        let year_month = year.toString() + "-" + escribir2Digitos(mes + 1).toString() + "-";    // este choclo lo declaro como variable por separado porque crei que quedaba confuso
        filtroXmes = Agenda.filter((element) => element.fecha.toString().includes(year_month))  // pedimos que filtre con la fecha pedida EJ: (2024-08)

        filtroXmes.forEach(element => {                                                         //el foreach recorrera nuestra lista filtrada
            const dia = document.getElementById(element.fecha.toString())                       //buscara en el HTML los id 
            dia.classList.add("evento-agendado")                                                // al encontrarlos le añade la clase que deseamos
        });
    }
}
//================================  Agenda Diaria
function prepararAgendaDiaria(a){
    const filtroXdia = Agenda.filter((element) => element.fecha.toString().includes(a.toString())) //filtramos por fecha exacta para que solo nos parezcan las que coinciden con este dia

    let listaDia = []                       // creamos la lista para almacenar los horarios que queremos plasmar en el HTML
    for (let i = 0; i < 24; i++) {                 const hora = escribir2Digitos(i) + ":00";        listaDia.push(hora);    } //agregamos las horas del dia a una lista (0-23)

    filtroXdia.forEach((el) => listaDia.push(el.horario_inicio.toString()))     // Agregar los horarios de eventos del dia a la lista de horarios 
    const horasUnicas = [...new Set(listaDia)];                                 // filtramos las horas para que no se repitan
    horasUnicas.sort((a, b) => parseInt(a) - parseInt(b));                      // ordenamos la lista final de los horarios para que queden ordenados
    const listaAgenda = document.querySelector(".agenda-dia")

    horasUnicas.forEach(el => {
        const NEWHORA = document.createElement("li")
        NEWHORA.innerHTML = `<span>${el} - </span>`                             // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
        NEWHORA.id = el;

        filtroXdia.forEach(eventoFiltrado => {
            if (eventoFiltrado.horario_inicio.toString() === el) {
                NEWHORA.innerHTML = `<span>${el} - </span> <span>${eventoFiltrado.nombre}</span>`  // agregamos parte del codigo con la id= fecha_etiqueta y <p> con el dia
                NEWHORA.classList.add("evento-agendado")
                NEWHORA.onclick=()=>(abiriFormularioEdicionEvento(eventoFiltrado))                 // le damos el input para la edicion del evento al hacer click
            }
        })                                                                                         // Agregar los horarios de eventos del dia a la lista de horarios 
        listaAgenda.append(NEWHORA)
    });
    Titulo.innerText = a
    fechaSeleccionada=a
}
function AbrirAgendaDiaria(a) {
    
    const AGENDA_DIA_PREEXISTENTE= document.querySelector(".agenda-dia")    //buscamos si ya hay creada una agenda para este dia
    AGENDA_DIA_PREEXISTENTE.remove();                                       // la eliminamos

    let NEW_AGENDA_DIA=document.createElement("ul");                        //creamos una nueva
    NEW_AGENDA_DIA.classList.add("agenda-dia")                              
    let agenda_dia_padre=document.getElementById("agenda-dia")              //buscamos su objeto padre para luego instanciarla
    agenda_dia_padre.append(NEW_AGENDA_DIA)                                 //la instanciamos 
    Abrir_Cerrar_Segmentos(agenda_dia, calendario);                         //pedimos que se abra agenda diaria y que se cierre el calendario

    prepararAgendaDiaria(a);
}
function AbrirCalenderio() {
    InicializarAgenda();
    Abrir_Cerrar_Segmentos(calendario, formulario_log_in);
    prepararCalendario();
}
function cerrarAgendaDiaria(){
    Abrir_Cerrar_Segmentos(calendario,agenda_dia);      //ponemos visible el calendario y ocultamos la agenda diaria
    fechaSeleccionada="";                               //Ponemos la fecha seleccionada en "" para evitar que se autocomplete el input = fecha seleccionada
}

let buttonSalirAgendaDiaria=document.getElementById("salir-agenda-diaria-btn")              //Cerrar Agenda diaria
buttonSalirAgendaDiaria.onclick =()=>{cerrarAgendaDiaria()}
//================================================================================================================================================================
{
    function VerificarQueUsuarioExista(a) {                                     //Funcion para verificar si el usuario Existe    
        return CuentasRegistradas.some((element) => (element.username === a));  //le pedimos a la funcion .some que registre toda la array y nos confirme si el nombre se encuentra adentro
    }
    function VerificarPaswordCorrespondiente(user) {                            //Funcion para verificar las coincidencias de usuario y contraseña
        return CuentasRegistradas.some((element) => (element.username === user.username && element.password === user.password))//le pedimos a la funcion .some que registre toda la array y nos confirme que el usuario y contraseña coinciden con alguno ya registrado
    }
    function guardarRegistroDeCuenta(a, b) {
        CuentasRegistradas.push(new Users(a, b));                               //agraga el usuario nuevo a la variable local
        localStorage.setItem("userArrays", JSON.stringify(CuentasRegistradas))  // guardamos la variable global en el localStorage para recuperarla despues
    }
    function InicializarRegistroDeCuentas() {
        const userArrays = localStorage.getItem("userArrays")                   //intenta recuperar los datos user arrays       
        if (userArrays) {                                                       //si los user array existen 
            CuentasRegistradas = JSON.parse(userArrays);                        //convierte los userattays en objetos para agregarlos a la variable global
        }
    }
    const PedirUseryPassword = () => new Users(inputLogIn.value, inputPassword.value)    //Pedimos los datos de Log user y de user PassWord

    function CrearRegistro() {
        let this_user = PedirUseryPassword();                                              // pedimos que tome los datos de 2 imputs con este metodo
        console.log(this_user)
        if (VerificarQueUsuarioExista(this_user.username) || this_user.username === "") {
            MostrarCartelEmergente("Error","El nombre de usuario ya existe, por favor intenta con un nuevo.")//si el usuario existe se repite el proseso para que ponga un nuevo nombre de usuario
        }
        else {                                                                             //si el usuario no existe se pide que se coloque una contraseña para acceder con el username
            if (this_user.password === "") {
                MostrarCartelEmergente("Error","La contraseña debe contener al menos un caracter. Intentalo de nuevo.")//si la contraseña esta vacia se pedira que se ponga una contraseña que contenga al menos un caracter.
            } else {                                                                      //llamamos a guardar cuentas para almacenar los datos
                guardarRegistroDeCuenta(this_user.username, this_user.password);          //enviamos la orden de guardar el registro
            }
        }
    }
    function LogIn() {
        let this_user = PedirUseryPassword();        // pedimos que tome los datos de 2 imputs con este metodo
        console.log(this_user)
        if (VerificarPaswordCorrespondiente(this_user)) {
            username = this_user.username;           //luego usamos el user name para cargar la agenda que corresponda con el usuario
            AbrirCalenderio();

        } else {
            console.log("algun dato es incorrecto, prueba otra vez")
            MostrarCartelEmergente("Error","algun dato es incorrecto, prueba otra vez por favor.")
        }
    }
    InicializarRegistroDeCuentas();

    let inputLogIn=document.getElementById("Log-In-User")
    inputLogIn.onkeydown=(x)=>{if(x.key==="Enter"){console.log("funciona")}}

    let inputPassword=document.getElementById("Log-In-Password")
    inputPassword.onkeydown=(x)=>{if(x.key==="Enter"){console.log("funciona")}}

    let buttonLogIn = document.getElementById("Log-In-Btn")
    buttonLogIn.onclick = () => (LogIn())    

    let buttonLogInRegister = document.getElementById("Log-In-Register")
    buttonLogInRegister.onclick = () => (CrearRegistro())


}
