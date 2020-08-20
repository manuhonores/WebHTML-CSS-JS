document.addEventListener("DOMContentLoaded", inicio());

async function inicio() {

    let setInt = 0;

    try {
        let response = await fetch("indexPartial.html");
        if(response.ok) {
            let body = document.getElementsByTagName("body")[0];
            let t = await response.text();
            body.innerHTML = t;
        } else {
            console.log("Error");
        }
    }
    catch(response) {
        console.log(response);
    }

    let container = document.getElementById("contain");

    btnIndex = document.getElementsByClassName("item")[0].addEventListener("click", inicioIndex);
    
    async function inicioIndex() {
        try {
            console.log(container);
            container.innerHTML = "<h1> Loading... <h1>";
            
            let response = await fetch("indexPartialRender.html");
            if(response.ok) {
                let t = await response.text();
                container.innerHTML = t;
            } else {
                console.log("Error");
            }
        }
        catch(response) {
            console.log(response);
        }

        function parar() { //Limpio el setinterval, si no cuando cambio de pestaña, sigue actualizando la tabla que "no" existe
            clearInterval(setInt);
        }
    
        parar();
    }

    btnTarifas = document.getElementsByClassName("item")[1];
    
    btnTarifas.addEventListener("click", async function() {
        try {
            console.log(container);
            container.innerHTML = "<h1> Loading... <h1>";
            
            let response = await fetch("tarifasPartialRender.html");
            if(response.ok) {
                let t = await response.text();
                container.innerHTML = t;
            } else {
                console.log("Error");
            }
        }
        catch(response) {
            console.log(response);
        }
        
        cargaEventosRest();
    });
    
    let btnContacto = document.getElementsByClassName("item")[2];
    
    btnContacto.addEventListener("click", async function() {
        
        console.log("Captcha")
        try {
            console.log(container);
            let a = "Captcha";
            console.log(a)
            container.innerHTML = "<h1> Loading... <h1>";
    
            let response = await fetch("contactoPartial.html");
            if(response.ok) {
                let t = await response.text();
                container.innerHTML = t;
            } else {
                console.log("Error");
            }
        }
        catch(response) {
            console.log(response);
        }
        cargaCaptcha();
    });

    inicioIndex(); //Con esto termino de cargar los botones y muestro el index (asi no queda la pagina en blanco)


    function cargaCaptcha() {

    let captcha;

    document.addEventListener("DOMContentLoaded", generarCaptcha); //Generar captcha cuando carga la pagina

    let reset = document.getElementById("refresh");
    reset.addEventListener("click", generarCaptcha);

    function generarCaptcha() {
        event.preventDefault();
        let a = Math.floor(Math.random() * 10);
        let b = Math.floor(Math.random() * 10);
        let c = Math.floor(Math.random() * 10);
        let d = Math.floor(Math.random() * 10);

        captcha = a.toString() + b.toString() + c.toString() + d.toString();

        document.getElementById("captcha").value = captcha;
    };

    let btnenviar = document.getElementById("send");
    btnenviar.addEventListener("click", check);

    function check() {
        let entrada = document.getElementById("ingreso").value;

        if(entrada != captcha) {
            document.getElementById("error").innerHTML = "Error en captcha, vuelva a introducirlo";
            event.preventDefault();
        } 
    }

    function parar() {
        console.log("Ingreso a parar");
        clearInterval(setInt);
    }

    parar();

    }

    function cargaEventosRest() {

    get();
    
    //Metodo GET
    //Elimino la tabla del html para despues volver a escribir con todos los datos del get
    //Hago esto para poder guardar el id del nuevo dato que agrego, ya que hago el post y si agrego directo, no tengo el id
    //Entonces hago el post, y llamo al get. Borro la tabla antes de imprimir de nuevo porque si no me imprime n veces todo
    
    async function get() {
        let table = document.getElementById("datos");
        let rowCount = table.rows.length; //la cantidad de filas de la tabla generada, con id="datos"
    
        for(let i=1; i<rowCount; i++) {
            table.deleteRow(rowCount-i);
        }

        let url = "https://web-unicen.herokuapp.com/api/groups/Honores/tpespecial";

        let resp = await fetch(url);

        let json = await resp.json();

        for(const elem of json.tpespecial) {
            agregar(elem.thing.participantes, elem.thing.valor, elem.thing.descuento, elem._id);
        }
    }
    
    //Agrego los datos a la tabla

    function agregar(part, val, desc, id) {
        let tBody = document.getElementById("tabla");
    
        let tR = document.createElement("tr");
    
    
        let tD1 = document.createElement("td");
        let tD2 = document.createElement("td");
        let tD3 = document.createElement("td");
    
        let tD4 = document.createElement("button");
        tD4.innerHTML = "Eliminar"
        tD4.dataset.id = id;
        tD4.addEventListener("click", eliminarFila);
    
        let tD5 = document.createElement("button");
        tD5.innerHTML = "Modificar"
        tD5.dataset.id = id;
        tD5.setAttribute("class", "edit");
        tD5.addEventListener("click", modificarDatos);

        tD6 = document.createElement("button");
        tD6.innerHTML = "Guardar";
        tD6.dataset.id = id;
        tD6.setAttribute("class", "save");

    

        let nodo1 = document.createTextNode(part);
        let nodo2 = document.createTextNode("$" + val);

        if(desc > 0) {
            let nodo3 = document.createTextNode("$" + desc);
            tD1.appendChild(nodo1);
            tD2.appendChild(nodo2);
            tD3.appendChild(nodo3);
            tR.appendChild(tD1);
            tR.appendChild(tD2);
            tR.appendChild(tD3);
            tR.appendChild(tD4);
            tR.appendChild(tD5);
            tR.appendChild(tD6);
            tBody.appendChild(tR);
            tR.classList.add("fondo");
        } else {
            let nodo3 = document.createTextNode(desc);
            tD1.appendChild(nodo1);
            tD2.appendChild(nodo2);
            tD3.appendChild(nodo3);
            tR.appendChild(tD1);
            tR.appendChild(tD2);
            tR.appendChild(tD3);
            tR.appendChild(tD4);
            tR.appendChild(tD5);
            tR.appendChild(tD6);
            tBody.appendChild(tR);
        }
    };

    //Metodo DELETE

    async function eliminarFila(event){
    
    let url = "https://web-unicen.herokuapp.com/api/groups/Honores/tpespecial";

    let id = event.target.dataset.id;
    console.log(id);

    let table  = document.getElementById("tabla");

    
    try {
        await fetch(url + "/" + id, {
            "method" : "DELETE",
            "mode" : "cors",
            "headers" : {"Content-Type" : "application/json"}
        })
    }
    catch (e) {
        console.log(e);
    }
    
    let fila = this.parentNode.rowIndex -1;

    table.deleteRow(fila);
    }

    //Metodo PUT
    function modificarDatos(event) {
    
    let id = event.target.dataset.id;
    
    let table  = document.getElementById("datos");

    this.classList.remove("edit");

    this.classList.add("save");

    //Creo las cajas editables
    let fila = this.parentNode.rowIndex; //Obtengo numero de fila

    let btnGuardar = table.rows[fila].getElementsByClassName("save")[1];

    btnGuardar.classList.add("edit");

    let part = table.rows[fila].getElementsByTagName("td")[0]; //Primer celda

    let valor = table.rows[fila].getElementsByTagName("td")[1]; //Segunda celda

    let part_data = part.innerHTML; //Guardo lo que está en el HTML

    let valor_data = valor.innerHTML;

    let input1 = document.createElement("input");
    input1.setAttribute("id", "cant");
    input1.setAttribute("value", part_data);
    part.appendChild(input1);

    let input2 = document.createElement("input");
    input2.setAttribute("id", "tarifa");
    input2.setAttribute("value", valor_data);
    valor.appendChild(input2);

    btnGuardar.addEventListener("click", async function() {
        
        let data = {};
        let id = event.target.dataset.id;
    
        let cantidad = document.getElementById("cant").value;
        let tari = document.getElementById("tarifa").value;
        
        let str = tari;
        let arr = str.split("$");
       
        let tarifaSinSigno = parseInt(arr[1]);
        
        if(tarifaSinSigno == null || isNaN(tarifaSinSigno)) {
            tarifaSinSigno = parseInt(arr[0]);
        }
        
        table.rows[fila].getElementsByTagName("td")[0].innerHTML = cantidad;
        table.rows[fila].getElementsByTagName("td")[1].innerHTML = "$" + tarifaSinSigno;

        if(tarifaSinSigno > 1500) {
            table.rows[fila].getElementsByTagName("td")[2].innerHTML = "$" + tarifaSinSigno*0.8;
            table.rows[fila].classList.add("fondo");
            data = {
                "thing" : {
                    "participantes" : cantidad,
                    "valor" : tarifaSinSigno,
                    "descuento" : (tarifaSinSigno*0.8)
                }
            }
        } else {
            table.rows[fila].getElementsByTagName("td")[2].innerHTML = " ";
            table.rows[fila].classList.remove("fondo");
            data = {
                "thing" : {
                    "participantes" : cantidad,
                    "valor" : tarifaSinSigno,
                    "descuento" : " "
                }
            }
        }

        let url = "https://web-unicen.herokuapp.com/api/groups/Honores/tpespecial";

        try {
            await fetch(url + "/" + id, {
                "method" : "PUT",
                "mode" : 'cors',
                "headers" : {"Content-Type": "application/json"},
                "body": JSON.stringify(data)
            });
        }
        catch(e) {
            console.log(e);
        }

        btnGuardar.classList.remove("edit");
    })

    this.classList.remove("save");

    this.classList.add("edit");
    }
    
    //Metodo POST

    document.getElementById("add_sugerencia").addEventListener("click", async function() {
        
        let url = "https://web-unicen.herokuapp.com/api/groups/Honores/tpespecial";
        
        let cant_participantes = document.getElementById("cantidad_participantes").value;
        let precio = +document.getElementById("tarifa_sugerida").value;

        let data = {};

        if(!isNaN(precio)) { //Si el precio es un numero
            if(precio > 1500) { // Precio mayor a 1500 tiene descuento
                data = {
                    "thing" : {
                        "participantes" : cant_participantes,
                        "valor" : precio,
                        "descuento" : (precio*0.8)
                    }       
                }; 
            } else {
                data = {
                    "thing" : {
                        "participantes" : cant_participantes,
                        "valor" : precio,
                        "descuento" :  " "
                    }                                     
                };
            }
        }

        try {
            let r = await fetch(url, {
                "method" : "POST",
                "headers" : {
                    "Content-Type" : "application/json"
                },
                "mode" : "cors",
                "body" : JSON.stringify(data)
            });
        }
        catch(e) {
            console.log(e);
        }

        get();
    });


    //Adicionar 3
    document.getElementById("adicionar3").addEventListener("click", async function() {
        let data = {};

        let url = "https://web-unicen.herokuapp.com/api/groups/Honores/tpespecial";

        for(i=0; i<3; i++) {
            let cantidadPart = "10 Participantes";
            let tarif = 8000;
            data = {
                "thing" : {
                    "participantes" : cantidadPart,
                    "valor" : tarif,
                    "descuento" : (tarif*0.8)
                }
            }

            try {
                let r = await fetch(url, {
                    "method" : "POST",
                    "headers" : {
                        "Content-Type" : "application/json"
                    },
                    "mode" : "cors",
                    "body" : JSON.stringify(data)
                });
            }
            catch(e) {
                console.log(e);
            }
        }
        get();
    })
    
    document.getElementById("searchTerm").addEventListener("keyup", function () { //keyup: cada vez que presiono una tecla

        let tabla = document.getElementById('datos');
        let textoBuscado = document.getElementById('searchTerm').value.toLowerCase(); //El termino que ingresa para buscar, lo paso a minusculas para luego comparar
        let celdasDeFila = "";
        let encontrado = false;
        let comparar = "";
        // Recorremos todas las filas con contenido de la tabla
        for (let i = 1; i < tabla.rows.length; i++) {
            celdasDeFila = tabla.rows[i].getElementsByTagName('td'); //Voy a tomar todas las celdas de la fila, los <td>
            encontrado = false;
            // Recorremos todas las celdas
            for (let j = 0; j < celdasDeFila.length && !encontrado; j++) { //Va a aumentar el j hasta completar la cantidad de celdas o, sea encontrado el termino
                comparar = celdasDeFila[j].innerHTML.toLowerCase(); //Guardo lo que esta escrito en la tabla, para luego comparar con el termino buscado
                // Buscamos el texto en el contenido de la celda
                if ((comparar.indexOf(textoBuscado) > -1)) {//indexof devuelve la primer ocurrencia de lo que se busca o -1 si no esta //textoBuscado.length == 0 || 
                    encontrado = true;
                }
            }
            if(encontrado){
                tabla.rows[i].classList.remove("tablita-estilo-none"); //Tengo que hacerlo así porque si agrego una clase (else), debo removerla
            } else {
                tabla.rows[i].classList.add("tablita-estilo-none");
            }
        }
        
    }); 

    /*function setIntervalo() {
        clearInterval(setInt);
        setInt = setInterval(get, 5000); //Con esto creo el auto actualizado
    }

    setIntervalo();*/
    }
    
    function parar() {
        clearInterval(setInt);
    }

    parar();
}