//=============================== Variables para LogIn ==============================
class Users {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
let CuentasRegistradas = []
let CuentasRegistradasLS = [];  //lo utilizaremos para cargar los usuarios que registre el usuario
let CuentasRegistradasJSON = [];//lo utilizamos para aplicar el la lectura de archivos con fetch
let username;
//========================================================================================

function VerificarQueUsuarioExista(a) {                                     //Funcion para verificar si el usuario Existe    
    return CuentasRegistradas.some((element) => (element.username === a));  //le pedimos a la funcion .some que registre toda la array y nos confirme si el nombre se encuentra adentro
}
function VerificarPaswordCorrespondiente(user) {                            //Funcion para verificar las coincidencias de usuario y contraseña
    return CuentasRegistradas.some((element) => (element.username === user.username && element.password === user.password))//le pedimos a la funcion .some que registre toda la array y nos confirme que el usuario y contraseña coinciden con alguno ya registrado
}
function guardarRegistroDeCuenta(a, b) {
    CuentasRegistradasLS.push(new Users(a, b));                               //agraga el usuario nuevo a la variable local
    console.log(CuentasRegistradasLS)
    localStorage.setItem("userArrays", JSON.stringify(CuentasRegistradasLS))  // guardamos la variable global en el localStorage para recuperarla despues

}

async function InicializarRegistroDeCuentas() {
    const userArrays = localStorage.getItem("userArrays")                   //intenta recuperar los datos user arrays       
    if (userArrays) {                                                       //si los user array existen 
        CuentasRegistradasLS = JSON.parse(userArrays);                        //convierte los userattays en objetos para agregarlos a la variable global
    }

    try {
        const response = await fetch("/db/db.json")
        const data = await response.json();
        CuentasRegistradas=CuentasRegistradasLS.concat(data.user)
    }
    catch (error) {
        console.error('Hubo un problema con la petición fetch:', error);
    };

    console.log(CuentasRegistradas)
}


const PedirUseryPassword = () => new Users(inputLogIn.value, inputPassword.value)    //Pedimos los datos de Log user y de user PassWord

function CrearRegistro() {
    let this_user = PedirUseryPassword();                                              // pedimos que tome los datos de 2 imputs con este metodo
    console.log(this_user)
    if (VerificarQueUsuarioExista(this_user.username) || this_user.username === "") {
        MostrarCartelEmergente("Error", "El nombre de usuario ya existe, por favor intenta con un nuevo.", "error")//si el usuario existe se repite el proseso para que ponga un nuevo nombre de usuario
    }
    else {                                                                             //si el usuario no existe se pide que se coloque una contraseña para acceder con el username
        if (this_user.password === "") {
            MostrarCartelEmergente("Error", "La contraseña debe contener al menos un caracter. Intentalo de nuevo.", "error")//si la contraseña esta vacia se pedira que se ponga una contraseña que contenga al menos un caracter.
        } else {                                                                      //llamamos a guardar cuentas para almacenar los datos
            guardarRegistroDeCuenta(this_user.username, this_user.password);          //enviamos la orden de guardar el registro
            NotificacionEmergente("Cuenta creada con exito!")
        }
    }
}
function LogIn() {
    let this_user = PedirUseryPassword();        // pedimos que tome los datos de 2 imputs con este metodo
    console.log(this_user)
    if (VerificarPaswordCorrespondiente(this_user)) {
        username = this_user.username;           //luego usamos el user name para cargar la agenda que corresponda con el usuario
        CambiarFechaCalendario();
        NotificacionEmergente("Accediste a tu cuenta!")

    } else {
        console.log("algun dato es incorrecto, prueba otra vez")
        MostrarCartelEmergente("Error", "algun dato es incorrecto, prueba otra vez por favor.", "error")
    }
}
InicializarRegistroDeCuentas();

let inputLogIn = document.getElementById("Log-In-User")
inputLogIn.onkeydown = (x) => { if (x.key === "Enter") { LogIn(); } }

let inputPassword = document.getElementById("Log-In-Password")
inputPassword.onkeydown = (x) => { if (x.key === "Enter") { LogIn(); } }

let buttonLogIn = document.getElementById("Log-In-Btn")
buttonLogIn.onclick = () => (LogIn())

let buttonLogInRegister = document.getElementById("Log-In-Register")
buttonLogInRegister.onclick = () => (CrearRegistro())

