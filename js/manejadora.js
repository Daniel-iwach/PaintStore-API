
document.addEventListener("DOMContentLoaded", async () => {

    const body = document.body;
    const spinner=document.getElementById("spinner");
    const formulario = document.getElementById("frmFormulario");
    const inputID = document.getElementById("inputID");
    const inputMarca = document.getElementById("inputMarca");
    const inputPrecio = document.getElementById("inputPrecio");
    const inputColor = document.getElementById("inputColor");
    const inputCantidad = document.getElementById("inputCantidad");
    const marcaError = document.getElementById("error-marca");
    const precioError = document.getElementById("error-precio");
    const colorError = document.getElementById("error-color");
    const cantidadError = document.getElementById("error-cantidad");
    const divListado = document.getElementById("divListado");
    const btnModificar = document.getElementById("btnModificar");
    const btnLimpiar = document.getElementById("btnLimpiar");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnPromedio = document.getElementById("btnPromedio");
    const btnEstadisticas = document.getElementById("btnCalcularEstadisticas");
    const btnExportar = document.getElementById("btnExportarCSV");
    const inicioLink = document.getElementById("inicio-link");
    const altaLink = document.getElementById("alta-link");
    const listadoLink = document.getElementById("listado-link");
    const estadisticasLink = document.getElementById("estadisticas-link");

    const btnCambiarTema = document.getElementById("cambiar-tema");
    const temaIcon = document.getElementById("temaIcon");

    let id=null;

    let ordenAscendente = true;
    
    ocultarSpinner();
    MostrarTodasLasPinturas();
    mostrarId();

    btnEstadisticas.addEventListener("click", async function() {
        await mostrarTodasLasEstadisticas();
        await cargarMarcasEnSelect();
    });

    btnExportar.addEventListener("click", function() {
        exportarCSV();
    });

    inicioLink.addEventListener("click", function(event) {
        mostrarTab("inicio", event);
    });

    altaLink.addEventListener("click", function(event) {
        mostrarTab("alta", event);
    });

    listadoLink.addEventListener("click", function(event) {
        mostrarTab("listado", event);
    });

    estadisticasLink.addEventListener("click", async function(event) {
        mostrarTab("estadisticas", event);
    });

    btnCambiarTema.addEventListener("click", function() {
        cambiarTema();
    });

    divListado.addEventListener("click", async function(event) {
        const target = event.target;

        if (target.classList.contains("btn-warning")) {
            id = target.getAttribute("data-id");
            const pintura = await traerPintura(id);
            mostrarPintura(pintura);
        }

        if (target.classList.contains("btn-danger")) {
            id = target.getAttribute("data-id");
            if(confirm("Seguro que desea eliminar la pintura?")){await borrarPintura(id); await MostrarTodasLasPinturas();}
        }

        if (event.target.id === "thPrecio" || event.target.closest("#thPrecio")) {
            listaPinturas.sort((a, b) => {
                return ordenAscendente
                    ? a.precio - b.precio
                    : b.precio - a.precio;
            });

            ordenAscendente = !ordenAscendente;

            mostrarPinturas(listaPinturas);
        }
    });

    btnLimpiar.addEventListener("click", limpiarFormulario);

    btnModificar.addEventListener("click", async function() {
        let pintura = {
            marca: inputMarca.value,
            precio: inputPrecio.value,
            color: inputColor.value,
            cantidad: inputCantidad.value,
        };
        await modificarPintura(id,pintura);
        await MostrarTodasLasPinturas();
        limpiarFormulario();
    });

    btnFiltrar.addEventListener("click", mostrarFiltrados);

    btnPromedio.addEventListener("click", mostrarPromedio);

    formulario.addEventListener("submit", enviarFormulario);

    async function enviarFormulario(event){
        console.log("enviando formulario");
        event.preventDefault();
        let valido = validarFormulario();
        if (valido) {
            let pintura = {
                id: await generarId(),
                marca: inputMarca.value,
                precio: inputPrecio.value,
                color: inputColor.value,
                cantidad: inputCantidad.value,
            };
            await agregarPintura(pintura);
            await MostrarTodasLasPinturas();
            limpiarFormulario();
        }
    }

    function limpiarFormulario() {
        inputMarca.value = "";
        inputPrecio.value = "";
        inputCantidad.value = "";
        
        inputMarca.classList.remove('is-valid');
        inputPrecio.classList.remove('is-valid');
        inputColor.classList.remove('is-valid');
        inputCantidad.classList.remove('is-valid');
        
        marcaError.innerHTML = "";
        precioError.innerHTML = "";
        colorError.innerHTML = "";
        cantidadError.innerHTML = "";
        MostrarTodasLasPinturas();
        mostrarId();
    }

    function validarFormulario() {
        let valido=true;

        inputMarca.classList.remove('is-valid', 'is-invalid');
        inputPrecio.classList.remove('is-valid', 'is-invalid');
        inputColor.classList.remove('is-valid', 'is-invalid');
        inputCantidad.classList.remove('is-valid', 'is-invalid');

        if (inputMarca.value.trim () === '') {
            mostrarError(inputMarca, marcaError, 'Marca invalida');
            valido=false;
        }else {
            inputMarca.classList.add('is-valid');
            inputMarca.classList.remove('is-invalid');
        }

        if (inputPrecio.value.trim () === '' || inputPrecio.value < 50 || inputPrecio.value > 500) {
            mostrarError(inputPrecio, precioError, 'Precio invalido');
            valido=false;
        }else{
            inputPrecio.classList.add('is-valid');
            inputPrecio.classList.remove('is-invalid');
        }

        if (inputColor.value.trim () === '') {
            mostrarError(inputColor, colorError, 'Color invalido');
            valido=false;
        }else{
            inputColor.classList.add('is-valid');
            inputColor.classList.remove('is-invalid');
        }

        if (inputCantidad.value.trim () === '' || inputCantidad.value < 1 || inputCantidad.value > 400) {
            mostrarError(inputCantidad, cantidadError, 'Cantidad invalida');
            valido=false;
        }else{
            inputCantidad.classList.add('is-valid');
            inputCantidad.classList.remove('is-invalid');
        }
        return valido;
    }

    function mostrarTab(tabName,event) { 
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        event.target.classList.add('active');
        
        const tabButton = document.getElementById(tabName + '-tab');
        const tab = new bootstrap.Tab(tabButton);
        tab.show();
    }

    function cambiarTema() {
        if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                temaIcon.className = 'bi bi-sun-fill';
            } else {
                body.setAttribute('data-theme', 'dark');
                temaIcon.className = 'bi bi-moon-fill';
            }
    }

    function mostrarError(input, error, mensaje) {
        error.innerHTML = mensaje;
        error.style.display = 'block';
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    async function mostrarPinturas(listaPinturas){
        try {
            divListado.innerHTML = "";
            let listaPinturasHTML = `
            <div class="table-responsive ">
                <table class='table table-hover table-dark border border-dark'>
                <thead class="table-dark">
                    <tr class="table-dark">
                        <th scope='col'>ID</th>
                        <th scope='col'>Marca</th>
                        <th scope='col' id="thPrecio" style="cursor:pointer">
                            Precio <span id="flechaPrecio">${ordenAscendente ? "↑" : "↓"}</span>
                        </th>
                        <th scope='col'>Color</th>
                        <th scope='col'>Cantidad</th>
                        <th scope='col'>Acciones</th>
                    </tr>
                </thead>
            <tbody>`;
            for (const pintura of listaPinturas) {
                listaPinturasHTML += `
                <tr>
                    <td>${pintura.id}</td>
                    <td>${pintura.marca}</td>
                    <td>${pintura.precio}</td>
                    <td><input type="color" value="${pintura.color}" disabled></td>
                    <td>${pintura.cantidad}</td>
                    <td>
                        <button type="button" class="btn btn-warning" data-id="${pintura.id}">Modificar</button>
                        <button type="button" class="btn btn-danger" data-id="${pintura.id}">Eliminar</button>
                    </td>
                </tr>
                `;
            }
            listaPinturasHTML += "</tbody></table></div>";
            divListado.innerHTML = listaPinturasHTML;
        } catch (error) {
            console.log(error);
        }
    }

    async function MostrarTodasLasPinturas(){
        try {
            listaPinturas = await traerPinturas();
            mostrarPinturas(listaPinturas);
        } catch (error) {
            console.log(error);
        }
    }

    async function mostrarFiltrados(){
        try {
            listaPinturas = await traerPinturas();
            listaPinturas = listaPinturas.filter(pintura => pintura.marca === inputMarca.value);
            await mostrarPinturas(listaPinturas);
        } catch (error) {
            console.log(error);
        }
    }

    async function traerPinturas(){
        mostrarSpinner();
        try {
            const response = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas");
            const pinturas = await response.json();
            return pinturas;
        } catch (error) {
            console.log(error);
        }finally{
            ocultarSpinner();
        }
    }

    async function traerPintura(id){
        mostrarSpinner();
        try {
            const response = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`);
            const pinturaJson = await response.json();
            const pintura={
                id: pinturaJson.pintura.id,
                marca: pinturaJson.pintura.marca,
                precio: pinturaJson.pintura.precio,
                color: pinturaJson.pintura.color,
                cantidad: pinturaJson.pintura.cantidad
            };
            console.log(pinturaJson.pintura.id);
            return pintura;
        } catch (error) {
            console.log(error);
        }finally{
            ocultarSpinner();
        }
    }

    function mostrarPintura(pintura){
        inputID.value = pintura.id;
        inputMarca.value = pintura.marca;
        inputPrecio.value = pintura.precio;
        inputColor.value = pintura.color;
        inputCantidad.value = pintura.cantidad;
    }
    async function modificarPintura(id,datosActualizados){
        mostrarSpinner();
        try{
            response = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosActualizados)
            })
            pinturaModificada = await response.json();
            if(response.ok){
                alert("Pintura modificada");
                console.log(pinturaModificada.pintura);
            }else{
                alert("Pintura no modificada");
            }
        }catch(error){
            console.log(error);
        }finally{
            ocultarSpinner();
        }
    }

    async function borrarPintura(id){
        mostrarSpinner();
        try {
            const response = await fetch(`https://utnfra-api-pinturas.onrender.com/pinturas/${id}`, {
                method: "DELETE"
            });
            const pinturaBorrada = await response.json();
            if(response.ok){
                alert("Pintura borrada");
            }else{
                alert("Error al borrar la pintura");
            }
        } catch (error) {
            console.log(error);
        }finally{
            ocultarSpinner();
        }
    }

    async function agregarPintura(pintura){
        mostrarSpinner();
        try {
            const response = await fetch("https://utnfra-api-pinturas.onrender.com/pinturas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pintura)
            });
            const pinturaCreada = await response.json();
            if(response.ok){
                alert("Pintura creada");
            }else{
                alert("Error al crear la pintura");
            }
        } catch (error) {
            console.log(error);
        }finally{
            ocultarSpinner();
        }
    }

    function mostrarId(){
        inputID.value = "generando...";
    }

    async function generarId(){
        try {
            const lista= await traerPinturas();
            return lista.length + 1;
        } catch (error) {
            console.log(error);
        }
    }

    async function mostrarPromedio() {
        const promedio = await promedioGeneral();
        alert(`El promedio de las pinturas es: ${promedio.toFixed(2)}`);
    }

    function mostrarSpinner(){
        spinner.style.display = "flex";
    }

    function ocultarSpinner(){
        spinner.style.display = "none";
    }

    async function totalPinturas(){
        const listaPinturas = await traerPinturas();
        return listaPinturas.length;
    }

    async function marcaMasComun(){
        const listaPinturas = await traerPinturas();
        const marcas = new Map();
        for (const pintura of listaPinturas) {
            const marca = pintura.marca;
            marcas.set(marca, (marcas.get(marca) || 0) + 1);
        }
        const marcaMasRepetida = Array.from(marcas.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
        return marcaMasRepetida;
    }

    async function mayorPrecio(){
        const listaPinturas = await traerPinturas();
        listaValida = listaPinturas.filter(p => !isNaN(Number(p.precio)) && Number(p.precio) > 50 && Number(p.precio) < 500);
        const pinturaMasCara = listaValida.reduce((a, b) => (a.precio > b.precio ? a : b));
        return pinturaMasCara;
    }


    async function promedioGeneral(){
        listaPinturas = await traerPinturas();
        if (!listaPinturas || listaPinturas.length === 0) {
            alert("No hay pinturas para calcular el promedio.");
            return;
        }
        const listaValida = listaPinturas.filter(p => !isNaN(Number(p.precio)) && Number(p.precio) > 50 && Number(p.precio) < 500);

        const suma = listaValida.reduce((total, pintura) => total + Number(pintura.precio), 0);
        const promedio = suma / listaValida.length;

        return promedio;
    }

    async function exportarCSV() {
        try {
            
            if (!listaPinturas || listaPinturas.length === 0) {
                listaPinturas = await traerPinturas();
            }
            
            if (listaPinturas.length === 0) {
                alert('No hay datos para exportar');
                return;
            }
            const headers = ['ID', 'Marca', 'Precio (USD)', 'Color', 'Cantidad'];
            
            const rows = listaPinturas.map(pintura => [
                pintura.id,
                `"${pintura.marca}"`, 
                pintura.precio,
                pintura.color,
                pintura.cantidad
            ]);
            
            const csvContent = [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');
            
            
            const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `pinturas_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            
            const originalText = btnExportar.innerHTML;
            btnExportar.innerHTML = '<i class="bi bi-check-circle me-1"></i> Exportado!';
            
            setTimeout(() => {
                btnExportar.innerHTML = originalText;
            }, 2000);
            
        } catch (error) {
            console.error("Error al exportar CSV:", error);
            alert('Error al exportar los datos: ' + error.message);
        }
    }

    
    async function mostrarTodasLasEstadisticas() {
        try {
            mostrarSpinner();
            
            const total = await totalPinturas();
            const marcaComun = await marcaMasComun();
            const pinturaCara = await mayorPrecio();
            const promedio = await promedioGeneral();
            
            document.getElementById("totalPinturas").value = total;
            document.getElementById("marcaComun").value = marcaComun;
            document.getElementById("pinturaCara").value = `${pinturaCara.marca} - $${pinturaCara.precio}`;
            document.getElementById("precioPromedio").value = `$${promedio.toFixed(2)}`;
            
            alert("📊 Estadísticas generales calculadas correctamente");
            
        } catch (error) {
            console.error("Error al calcular estadísticas:", error);
            alert("Error al calcular las estadísticas generales");
        } finally {
            ocultarSpinner();
        }
    }

    async function cargarMarcasEnSelect() {
        try {
            const listaPinturas = await traerPinturas();
            const selectMarca = document.getElementById("selectMarca");
            
            selectMarca.innerHTML = '<option value="">-- Seleccionar marca --</option>';
        
            const marcasUnicas = [...new Set(listaPinturas.map(pintura => pintura.marca))];
            marcasUnicas.forEach(marca => {
                const option = document.createElement("option");
                option.value = marca;
                option.textContent = marca;
                selectMarca.appendChild(option);
            });
            
            selectMarca.addEventListener("change", async function() {
                await mostrarEstadisticasPorMarca(this.value);
            });
            
        } catch (error) {
            console.error("Error al cargar marcas:", error);
            alert("Error al cargar las marcas en el selector");
        }
    }

    async function mostrarEstadisticasPorMarca(marcaSeleccionada) {
        try {
            if (!marcaSeleccionada) {
                document.getElementById("cantidadPorMarca").value = "";
                document.getElementById("promedioPorMarca").value = "";
                return;
            }
            
            const listaPinturas = await traerPinturas();
            const pinturasPorMarca = listaPinturas.filter(p => p.marca === marcaSeleccionada);
            
            const pinturasValidas = pinturasPorMarca.filter(p => 
                !isNaN(Number(p.precio)) && Number(p.precio) >= 50 && Number(p.precio) <= 500
            );
            
            let promedioPrecio = 0;
            if (pinturasValidas.length > 0) {
                const suma = pinturasValidas.reduce((total, pintura) => total + Number(pintura.precio), 0);
                promedioPrecio = suma / pinturasValidas.length;
            }
            
            document.getElementById("cantidadPorMarca").value = pinturasPorMarca.length;
            document.getElementById("promedioPorMarca").value = promedioPrecio > 0 ? `$${promedioPrecio.toFixed(2)}` : "Sin datos válidos";
            
        } catch (error) {
            console.error("Error al calcular estadísticas por marca:", error);
            document.getElementById("cantidadPorMarca").value = "Error";
            document.getElementById("promedioPorMarca").value = "Error";
        }
    }

});