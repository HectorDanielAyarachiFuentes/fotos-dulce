document.addEventListener('DOMContentLoaded', () => {
    const estante = document.getElementById('estante-fotos');
    let pollingIntervalId = null; // Para controlar el intervalo de actualización automática

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

            // 4. Iniciar la vigilancia de cambios en el archivo JSON
            iniciarPollingDeFotos();

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
                const imgContainer = document.createElement('div');
                imgContainer.className = 'portafotos__imagen-container';

                const img = document.createElement('img');
                img.className = 'portafotos__imagen'; // Nueva clase para la imagen
                img.loading = 'lazy'; // <-- ¡AQUÍ ESTÁ LA CARGA PEREZOSA!
                img.src = `Fotos-Dulce/${nombreFoto}`; // Construimos la ruta a la imagen
                img.alt = `Foto de Dulce: ${nombreFoto}`; // Texto alternativo descriptivo

                // 3. Crear el texto (caption)
                const captionP = document.createElement('p');
                captionP.className = 'portafotos__caption'; // Nueva clase para el caption
                // Quitamos la extensión (.jpg, .png) para un título más limpio
                captionP.textContent = nombreFoto.split('.').slice(0, -1).join('.');

                // 4. Juntar todo y añadirlo al estante
                imgContainer.appendChild(img);
                portafotosDiv.appendChild(imgContainer);
                portafotosDiv.appendChild(captionP);
                estante.appendChild(portafotosDiv);

                // --- NUEVA FUNCIONALIDAD: Añadir evento de clic ---
                portafotosDiv.addEventListener('click', () => {
                    mostrarFotoEnGrande(index); // Pasamos el índice en lugar de la ruta
                });
        });

        console.log(`Se han cargado ${listaDeFotos.length} fotos dinámicamente desde fotos.json.`);

        // --- NUEVA FUNCIONALIDAD: Habilitar el drag-and-drop en el estante ---
        inicializarDragAndDrop();
    }

    // --- Lógica para el Lightbox (vista en grande) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnCerrar = document.getElementById('btn-cerrar-lightbox');
    const lightboxCaption = document.getElementById('lightbox-caption'); // <-- NUEVO: Referencia al título
    const lightboxCounter = document.getElementById('lightbox-counter'); // <-- NUEVO: Referencia al contador
    const btnDescargar = document.getElementById('btn-descargar'); // <-- NUEVO: Referencia al botón de descarga
    const btnCompartir = document.getElementById('btn-compartir'); // <-- NUEVO: Referencia al botón de compartir
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
        // Al cerrar, reactivamos la vigilancia por si estaba pausada
        if (!pollingIntervalId) iniciarPollingDeFotos();
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

    // --- NUEVA FUNCIONALIDAD: Pantalla completa con doble clic ---
    lightboxImg.addEventListener('dblclick', () => {
        // Detenemos la propagación para evitar que el doble clic en la imagen
        // también active el clic en el fondo y cierre el lightbox.
        event.stopPropagation();
        toggleFullScreen(lightbox); // Ponemos en pantalla completa todo el lightbox
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

    // --- NUEVA FUNCIONALIDAD: Compartir imagen ---
    btnCompartir.addEventListener('click', async (e) => {
        e.stopPropagation(); // Evitar que el clic cierre el lightbox
        const nombreFoto = listaDeFotosGlobal[indiceActual];
        const titulo = nombreFoto.split('.').slice(0, -1).join('.');

        // La Web Share API es la forma moderna de compartir
        if (navigator.share) {
            try {
                // 1. Obtenemos la imagen como un "blob" (un objeto de datos binarios)
                const response = await fetch(`Fotos-Dulce/${nombreFoto}`);
                const blob = await response.blob();
                // 2. Creamos un archivo virtual a partir del blob
                const file = new File([blob], nombreFoto, { type: blob.type });

                // 3. Usamos la API para compartir el archivo
                await navigator.share({
                    title: titulo,
                    text: `¡Mira esta foto de la galería de Dulce!`,
                    files: [file],
                });
                console.log('Foto compartida con éxito.');
            } catch (error) {
                console.error('Error al compartir:', error);
            }
        } else {
            // Fallback para navegadores que no soportan la Web Share API (ej. Chrome/Firefox en escritorio)
            alert('La función de compartir está disponible principalmente en dispositivos móviles o navegadores compatibles.');
        }
    });

    // --- NUEVA FUNCIÓN AUXILIAR: Para gestionar la pantalla completa ---
    function toggleFullScreen(element) {
        if (!document.fullscreenElement) {
            // Si no estamos en pantalla completa, la activamos
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
        } else {
            // Si ya estamos en pantalla completa, la desactivamos
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // --- NUEVA FUNCIONALIDAD: Inicializar la librería de Drag and Drop (SortableJS) ---
    function inicializarDragAndDrop() {
        const estanteElement = document.getElementById('estante-fotos');
        if (estanteElement) {
            new Sortable(estanteElement, {
                animation: 250, // Velocidad de la animación al mover elementos
                ghostClass: 'portafotos-ghost', // Clase para el espacio fantasma donde se soltará
                dragClass: 'portafotos-drag',   // Clase para el elemento que se está arrastrando
                onStart: function () {
                    // Pausamos la actualización automática para evitar que la galería se recargue mientras movemos algo
                    if (pollingIntervalId) {
                        clearInterval(pollingIntervalId);
                        pollingIntervalId = null;
                    }
                }
            });
        }
    }

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

    // --- NUEVA FUNCIONALIDAD: Actualización automática de la galería ---
    function iniciarPollingDeFotos() {
        // Si ya hay un intervalo, no creamos otro
        if (pollingIntervalId) return;

        pollingIntervalId = setInterval(async () => {
            // Pausamos la comprobación si el lightbox está abierto para no interrumpir al usuario
            if (lightbox.classList.contains('visible')) {
                return;
            }

            try {
                const respuesta = await fetch('fotos.json');
                const data = await respuesta.json();
                // Comparamos la nueva lista con la antigua (convirtiéndolas a texto)
                if (JSON.stringify(data.fotos) !== JSON.stringify(listaDeFotosGlobal)) {
                    console.log('Se detectaron cambios en fotos.json. Actualizando galería...');
                    listaDeFotosGlobal = data.fotos;
                    generarGaleria(listaDeFotosGlobal);
                }
            } catch (error) {
                console.error('Error durante el polling de fotos:', error);
            }
        }, 5000); // Comprueba cada 5 segundos
    }

    // Iniciar todo el proceso
    cargarYMostrarFotos();
});
