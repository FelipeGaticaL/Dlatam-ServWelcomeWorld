//Requerimientos modulos

const http = require('http');
const url = require('url');
const fs = require('fs');
const { arch } = require('os');

//variables temporales
let date = new Date();
let day = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
let month = `${date.getMonth() < 10 ? "0" : ""}${date.getMonth()}`;
let year = date.getFullYear();

let fulldate = `${day}-${month}-${year}`
console.log(fulldate)

//Creando servidor

const servidor = http.createServer((req, res) => {

    //Recibiendo parámetros a través URL action
    const query = url.parse(req.url, true).query

    // variables a manipular
    const archivo = query.archivo;
    const contenido = query.contenido;
    const nuevoNombre = query.nuevoNombre;

    if (req.url.startsWith("/crear")) {
        if (!archivo || !contenido) {
            res.write("Falta rellenar alguno de los campos obligatorios: nombre - contenido")
            res.end()
        } else {
            fs.writeFile(`${archivo}`, `${fulldate} - ${contenido}`, () => {
                res.write("El archivo se ha creado con exito")
                res.end()

            })
        }
    }

    if (req.url.startsWith("/leer")) {
        if (!archivo) {
            res.write("Se requiere el nombre del archivo")
            res.end()
        } else {
            fs.readFile(archivo, (err, data) => {
                if (err) {
                    res.write("El archivo no existe")
                } else {
                    res.write(`Archivo con nombre:  ${archivo}\n`);
                    res.write(`Tiene como contenido:\n ${data}`)
                }
                res.end()
            })
        }
    }

    if (req.url.startsWith("/renombrar")) {

        if(!archivo || !nuevoNombre){
            res.write("Falta el nombre del archivo a renombrar o falta el nuevo nombre del archivo")
            res.end()
        }else{
            fs.rename(archivo,nuevoNombre,(err)=>{
                if(err){
                    res.write("Archivo no existe");
                    res.end()
                }else{
                res.write("Archivo cambiado con exito")
                res.end()}
            })
        }
    }

    if(req.url.startsWith("/eliminar")){
        if(!archivo){
            res.write("Debe ingresar el nombre del archivo")
            res.end()
        }else{
            fs.unlink(archivo,(err)=>{
                if(err){
                    res.write("El archivo a eliminar no existe");
                    res.end()
                }else{
                    res.write("Se está eliminando el archivo");

                    setTimeout(() => {
                        res.write("Eliminación exitosa")
                        
                    }, 3000);                   
                    res.end()
                }
            })
        }

    }




});

servidor.listen(8080, () => console.log("El servidor está funcionando en el puerto 8080")
)