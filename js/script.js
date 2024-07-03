
let NombreUsuario;

const Peliculas = ["ToyStory", "Terminator", "Godzila"];

const como_te_llamas = () => prompt("Como te llamas?");

function no_aceptar_espacios_vacios(a){
    if(a!=null){
        return /^\s*$/.test(a);    }
    else{
        return true;}
}

function ConsultarNombre() {
    NombreUsuario = como_te_llamas();

    if (no_aceptar_espacios_vacios(NombreUsuario)) {
        alert("Creo que olvidaste escribir por error");
        ConsultarNombre();
    }    
    else {
        console.log("Hola " + NombreUsuario + " espero te encuentres bien.");
        console.log("Me gustaria ver una pelicula, tengo algunas anotadas ");
    }
}
ConsultarNombre();

function EnumerarPeliculas()  {  for (const Peli of Peliculas)     console.log("* "+Peli);   }

EnumerarPeliculas();

const cual_deberia_ver = () => prompt("Cual deveria ver?");
let comparar_titulos = (a, b) => a.toLowerCase() === b.toLowerCase();

function CualCreesQueDeberiaVer() {

    let Sugerencia = cual_deberia_ver();
    let PeliculaNueva = true;

    if (no_aceptar_espacios_vacios(Sugerencia)) {
        alert("Creo que olvidaste escribir por error");
        CualCreesQueDeberiaVer();
    }    

    for (const peli of Peliculas) {
        if (comparar_titulos(peli,Sugerencia)) {
            PeliculaNueva = false;
            alert("De Acuerdo, '" + peli + "' esta en mi lista. Gracias por tu sugerencia!");
        }
    }

    if(PeliculaNueva){
        alert("'"+Sugerencia+"' no estaba en mi lista, tomare tu sugerencia y vere la primero");
        Peliculas.unshift(Sugerencia);
        console.log("Entonces mi nueva lista de peliculas sera :")
        EnumerarPeliculas();
    }

    let MeRecomendariasOtraPelicula=confirm("Me recomendarias otra pelicula?");
    if(MeRecomendariasOtraPelicula){
        CualCreesQueDeberiaVer();
    }
    
}
CualCreesQueDeberiaVer();

console.log("Muchas gracias "+NombreUsuario+". Espero tengas un bonito dia.")