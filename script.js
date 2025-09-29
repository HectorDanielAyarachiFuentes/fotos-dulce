document.addEventListener('DOMContentLoaded', () => {
    const estante = document.getElementById('estante-fotos');

    // --- NUEVAS VARIABLES PARA NAVEGACIÓN ---
    let listaDeFotosGlobal = []; // Guardaremos la lista de fotos aquí para accederla globalmente
    let indiceActual = -1;       // Para saber qué foto se está mostrando en el lightbox

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
            listaDeFotosGlobal = data.fotos; // Guardamos la lista en la variable global

            // 3. Una vez que tenemos la lista, generamos la galería
            generarGaleria(listaDeFotosGlobal);

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
                    mostrarFotoEnGrande(index); // Pasamos el índice en lugar de la ruta
                });
        });

        console.log(`Se han cargado ${listaDeFotos.length} fotos dinámicamente desde fotos.json.`);
    }

    // --- Lógica para el Lightbox (vista en grande) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnCerrar = document.getElementById('btn-cerrar-lightbox');
    const lightboxCaption = document.getElementById('lightbox-caption'); // <-- NUEVO: Referencia al título
    const lightboxCounter = document.getElementById('lightbox-counter'); // <-- NUEVO: Referencia al contador
    const btnDescargar = document.getElementById('btn-descargar'); // <-- NUEVO: Referencia al botón de descarga
    // --- NUEVO: Referencias a los botones de navegación ---
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');


    function mostrarFotoEnGrande(index) {
        // Si el lightbox ya está visible, aplicamos la transición de fade
        if (lightbox.classList.contains('visible')) {
            lightboxImg.style.opacity = 0; // 1. Desvanecer la imagen actual

            setTimeout(() => {
                actualizarContenidoLightbox(index); // 2. Cambiar contenido
                lightboxImg.style.opacity = 1;      // 3. Mostrar la nueva imagen
            }, 300); // Debe coincidir con la duración de la transición en CSS

        } else {
            // Si es la primera vez que se abre, simplemente mostramos el contenido
            actualizarContenidoLightbox(index);
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
        }
    }

    // --- NUEVA FUNCIÓN AUXILIAR para no repetir código ---
    function actualizarContenidoLightbox(index) {
        if (index < 0 || index >= listaDeFotosGlobal.length) return;

        indiceActual = index; // Actualizamos el índice global
        const nombreFoto = listaDeFotosGlobal[indiceActual];
        lightboxImg.src = `Fotos-Dulce/${nombreFoto}`;
        // --- NUEVO: Actualizar el botón de descarga ---
        btnDescargar.href = `Fotos-Dulce/${nombreFoto}`;
        btnDescargar.download = nombreFoto; // Sugiere el nombre de archivo original
        // --- NUEVO: Actualizar el contador ---
        lightboxCounter.textContent = `${indiceActual + 1} / ${listaDeFotosGlobal.length}`;
        lightboxCaption.textContent = nombreFoto.split('.').slice(0, -1).join('.'); // Actualizamos el título
        // --- NUEVO: Precargar imágenes adyacentes ---
        precargarImagenesAdyacentes(index);
    }

    function cerrarLightbox() {
        lightbox.classList.remove('visible');
        document.body.style.overflow = 'auto'; // Restaura el scroll
    }

    // Cerrar al hacer clic en el botón "Volver"
    btnCerrar.addEventListener('click', cerrarLightbox);

    // Opcional: Cerrar también al hacer clic en el fondo oscuro
    lightbox.addEventListener('click', (e) => {
        // Si el clic fue en el overlay y no en el contenido (imagen, botones)
        if (e.target === lightbox) {
            cerrarLightbox();
        }
    });

    // --- NUEVA FUNCIONALIDAD: Navegación con teclado ---
    document.addEventListener('keydown', (e) => {
        // Si el lightbox no está visible, no hacemos nada
        if (!lightbox.classList.contains('visible')) return;

        if (e.key === 'Escape') {
            cerrarLightbox();
        }

        if (e.key === 'ArrowRight') { mostrarSiguienteFoto(); }
        if (e.key === 'ArrowLeft') { mostrarFotoAnterior(); }
    });

    // --- NUEVO: Lógica de navegación con botones ---
    function mostrarSiguienteFoto() {
        // Calculamos el siguiente índice, volviendo al inicio si llegamos al final
        const siguienteIndice = (indiceActual + 1) % listaDeFotosGlobal.length;
        mostrarFotoEnGrande(siguienteIndice);
    }

    function mostrarFotoAnterior() {
        // Calculamos el índice anterior, yendo al final si estamos en el inicio
        const anteriorIndice = (indiceActual - 1 + listaDeFotosGlobal.length) % listaDeFotosGlobal.length;
        mostrarFotoEnGrande(anteriorIndice);
    }

    // Asignamos los eventos a los botones
    btnSiguiente.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al fondo y cierre el lightbox
        mostrarSiguienteFoto();
    });
    btnAnterior.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al fondo y cierre el lightbox
        mostrarFotoAnterior();
    });

    // --- NUEVA FUNCIONALIDAD: Precarga de imágenes para una navegación más rápida ---
    function precargarImagenesAdyacentes(index) {
        // Precargar la siguiente imagen
        const siguienteIndice = (index + 1) % listaDeFotosGlobal.length;
        const imgSiguiente = new Image();
        imgSiguiente.src = `Fotos-Dulce/${listaDeFotosGlobal[siguienteIndice]}`;

        // Precargar la imagen anterior
        const anteriorIndice = (index - 1 + listaDeFotosGlobal.length) % listaDeFotosGlobal.length;
        const imgAnterior = new Image();
        imgAnterior.src = `Fotos-Dulce/${listaDeFotosGlobal[anteriorIndice]}`;
    }


    // --- NUEVA FUNCIONALIDAD: Navegación con gestos táctiles (swipe) ---
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe

    lightbox.addEventListener('touchstart', (e) => {
        // Solo nos interesa el swipe sobre la imagen, no sobre los botones
        if (e.target !== lightboxImg) return;
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        if (e.target !== lightboxImg) return;
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;

        if (swipeDistance < -swipeThreshold) {
            // Swipe hacia la izquierda (dedo se mueve de derecha a izquierda) -> Siguiente foto
            mostrarSiguienteFoto();
        } else if (swipeDistance > swipeThreshold) {
            // Swipe hacia la derecha (dedo se mueve de izquierda a derecha) -> Foto anterior
            mostrarFotoAnterior();
        }
    }

    // Iniciar todo el proceso
    cargarYMostrarFotos();
});
