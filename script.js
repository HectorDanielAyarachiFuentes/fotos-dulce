document.addEventListener('DOMContentLoaded', () => {
    const estante = document.getElementById('estante-fotos');

    // --- NUEVA FUNCIONALIDAD: Cargar fotos desde un JSON externo ---
    async function cargarYMostrarFotos() {
        try {
            // 1. Hacemos la petición para obtener el archivo JSON
            const respuesta = await fetch('fotos.json');
            if (!respuesta.ok) {
                throw new Error(`Error al cargar el archivo: ${respuesta.statusText}`);
            }
            // 2. Convertimos la respuesta a un objeto JavaScript
            const data = await respuesta.json();
            const listaDeFotos = data.fotos;

            // 3. Una vez que tenemos la lista, generamos la galería
            generarGaleria(listaDeFotos);

        } catch (error) {
            console.error("No se pudieron cargar las fotos:", error);
            estante.innerHTML = '<p>Lo sentimos, no se pudieron cargar las fotos en este momento.</p>';
        }
    }

    function generarGaleria(listaDeFotos) {
        // Limpiamos el estante por si acaso
        estante.innerHTML = '';
        
        // El resto del código es el mismo que ya tenías
        listaDeFotos.forEach((nombreFoto, index) => {
            // Recorremos la lista y creamos un portafotos por cada imagen
                // 1. Crear el contenedor del portafotos
                const portafotosDiv = document.createElement('div');
                portafotosDiv.className = 'portafotos';

                // --- NUEVA FUNCIONALIDAD: Añadir retraso escalonado a la animación ---
                // Cada foto esperará 100ms más que la anterior para empezar su animación.
                portafotosDiv.style.animationDelay = `${index * 100}ms`;

                // 2. Crear la imagen
                const img = document.createElement('img');
                img.loading = 'lazy'; // <-- ¡AQUÍ ESTÁ LA CARGA PEREZOSA!
                img.src = `Fotos-Dulce/${nombreFoto}`; // Construimos la ruta a la imagen
                img.alt = `Foto de Dulce: ${nombreFoto}`; // Texto alternativo descriptivo

                // 3. Crear el texto (caption)
                const captionP = document.createElement('p');
                captionP.className = 'caption';
                // Quitamos la extensión (.jpg, .png) para un título más limpio
                captionP.textContent = nombreFoto.split('.').slice(0, -1).join('.');

                // 4. Juntar todo y añadirlo al estante
                portafotosDiv.appendChild(img);
                portafotosDiv.appendChild(captionP);
                estante.appendChild(portafotosDiv);

                // --- NUEVA FUNCIONALIDAD: Añadir evento de clic ---
                portafotosDiv.addEventListener('click', () => {
                    mostrarFotoEnGrande(img.src);
                });
        });

        console.log(`Se han cargado ${listaDeFotos.length} fotos dinámicamente desde fotos.json.`);
    }

    // --- Lógica para el Lightbox (vista en grande) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnCerrar = document.getElementById('btn-cerrar-lightbox');

    function mostrarFotoEnGrande(rutaImagen) {
        lightboxImg.src = rutaImagen; // Actualizamos la imagen
        lightbox.classList.add('visible');
    }

    function cerrarLightbox() {
        lightbox.classList.remove('visible');
    }

    // Cerrar al hacer clic en el botón "Volver"
    btnCerrar.addEventListener('click', cerrarLightbox);

    // Opcional: Cerrar también al hacer clic en el fondo oscuro
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Si el clic fue en el fondo y no en la imagen o el botón
            cerrarLightbox();
        }
    });

    // Iniciar todo el proceso
    cargarYMostrarFotos();
});
