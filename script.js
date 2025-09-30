document.addEventListener('DOMContentLoaded', () => {
    const estante = document.getElementById('estante-fotos');
    let pollingIntervalId = null; // Para controlar el intervalo de actualización automática

    let fotosOriginalesDelJson = []; // <-- NUEVO: Para guardar el estado original del JSON
    // --- NUEVAS VARIABLES PARA NAVEGACIÓN ---
    let listaDeFotosGlobal = []; // Guardaremos la lista de fotos aquí para accederla globalmente
    let indiceActual = -1;       // Para saber qué foto se está mostrando en el lightbox
    let ultimoElementoActivo = null; // Para devolver el foco al cerrar el lightbox

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
            fotosOriginalesDelJson = data.fotos; // Guardamos la lista original

            // --- NUEVO: Comprobar si hay un orden guardado en localStorage ---
            const ordenGuardado = localStorage.getItem('photoOrder');
            if (ordenGuardado) {
                const listaGuardada = JSON.parse(ordenGuardado);
                // Sincronizamos la lista guardada con la del JSON para manejar fotos nuevas o eliminadas
                const mapaFotosOriginales = new Map(fotosOriginalesDelJson.map(foto => [foto.archivo, foto]));

                const fotosValidas = listaGuardada
                    .map(nombreArchivo => mapaFotosOriginales.get(nombreArchivo))
                    .filter(Boolean); // Filtramos por si alguna foto guardada ya no existe en el JSON

                const archivosEnListaValida = new Set(fotosValidas.map(foto => foto.archivo));
                const fotosNuevas = fotosOriginalesDelJson.filter(foto => !archivosEnListaValida.has(foto.archivo));

                listaDeFotosGlobal = [...fotosValidas, ...fotosNuevas];

                console.log('Se ha cargado el orden de fotos guardado.');
            } else {
                // Si no hay orden guardado, usamos el del archivo JSON
                listaDeFotosGlobal = fotosOriginalesDelJson;
            }

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
        listaDeFotos.forEach((fotoData, index) => {
            // Recorremos la lista y creamos un portafotos por cada imagen
                // 1. Crear el contenedor del portafotos
                const portafotosDiv = document.createElement('div');
                portafotosDiv.className = 'portafotos';
                // --- Accesibilidad: Hacer que el portafotos sea interactivo para el teclado ---
                portafotosDiv.setAttribute('role', 'button');
                portafotosDiv.setAttribute('tabindex', '0');
                portafotosDiv.setAttribute('data-tooltip', 'Ver en grande');


                // --- NUEVA FUNCIONALIDAD: Añadir retraso escalonado a la animación ---
                // Cada foto esperará 100ms más que la anterior para empezar su animación.
                portafotosDiv.style.animationDelay = `${index * 100}ms`;

                // 2. Crear la imagen
                const imgContainer = document.createElement('div');
                imgContainer.className = 'portafotos__imagen-container';

                const img = document.createElement('img');
                img.className = 'portafotos__imagen'; // Nueva clase para la imagen
                img.loading = 'lazy'; // <-- ¡AQUÍ ESTÁ LA CARGA PEREZOSA!
                img.src = `Fotos-Dulce/${fotoData.archivo}`; // Construimos la ruta a la imagen
                // --- Accesibilidad: Mejorar el texto alternativo ---
                img.alt = fotoData.descripcion;

                // 3. Crear el texto (caption)
                const captionP = document.createElement('p');
                captionP.className = 'portafotos__caption'; // Nueva clase para el caption
                // Quitamos la extensión (.jpg, .png) para un título más limpio
                captionP.textContent = fotoData.descripcion;

                // 4. Juntar todo y añadirlo al estante
                imgContainer.appendChild(img);
                portafotosDiv.appendChild(imgContainer);
                portafotosDiv.appendChild(captionP);
                estante.appendChild(portafotosDiv);

                // --- NUEVA FUNCIONALIDAD: Añadir evento de clic ---
                portafotosDiv.addEventListener('click', () => {
                    ultimoElementoActivo = document.activeElement; // Guardamos el elemento que tenía el foco
                    mostrarFotoEnGrande(index); // Pasamos el índice en lugar de la ruta
                });

                // --- Accesibilidad: Permitir activar con Enter/Espacio ---
                portafotosDiv.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        portafotosDiv.click();
                    }
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

    const lightboxBottomBar = document.querySelector('.lightbox-bottom-bar');

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
            // --- Accesibilidad: Mover el foco al lightbox (al botón de cerrar) ---
            btnCerrar.focus();
        }
    }

    // --- NUEVA FUNCIÓN AUXILIAR para no repetir código ---
    function actualizarContenidoLightbox(index) {
        if (index < 0 || index >= listaDeFotosGlobal.length) return;

        indiceActual = index; // Actualizamos el índice global
        const fotoData = listaDeFotosGlobal[indiceActual];
        lightboxImg.src = `Fotos-Dulce/${fotoData.archivo}`;
        // --- NUEVO: Actualizar el botón de descarga ---
        // --- Accesibilidad: Mejorar alt de la imagen del lightbox ---
        lightboxImg.alt = fotoData.descripcion;
        btnDescargar.href = `Fotos-Dulce/${fotoData.archivo}`;
        btnDescargar.download = fotoData.archivo; // Sugiere el nombre de archivo original
        // --- NUEVO: Actualizar el contador ---
        lightboxCounter.textContent = `${indiceActual + 1} / ${listaDeFotosGlobal.length}`;
        lightboxCaption.textContent = fotoData.descripcion; // Actualizamos el título
        // --- NUEVO: Precargar imágenes adyacentes ---
        precargarImagenesAdyacentes(index);
    }

    function cerrarLightbox() {
        lightbox.classList.remove('visible');
        // Al cerrar, reactivamos la vigilancia por si estaba pausada
        if (!pollingIntervalId) iniciarPollingDeFotos();
        // --- Accesibilidad: Devolver el foco al elemento que abrió el lightbox ---
        if (ultimoElementoActivo) {
            ultimoElementoActivo.focus();
        }
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

        // En móvil, ocultamos/mostramos la barra de acciones para una vista inmersiva
        if (window.innerWidth <= 768) {
            lightboxBottomBar.style.transform = document.fullscreenElement ? 'translateY(100%)' : 'translateY(0)';
        }
    });

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxBottomBar.style.transform = 'translateY(0)';
    })

    // --- NUEVA FUNCIONALIDAD: Navegación con teclado ---
    document.addEventListener('keydown', (e) => {
        // Si el lightbox no está visible, no hacemos nada
        if (!lightbox.classList.contains('visible')) return;

        // --- Accesibilidad: Atrapar el foco dentro del lightbox ---
        if (e.key === 'Tab') {
            trapFocus(e);
        }
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
        const fotoData = listaDeFotosGlobal[indiceActual];
        const { archivo, descripcion } = fotoData;

        // La Web Share API es la forma moderna de compartir
        if (navigator.share) {
            try {
                // 1. Obtenemos la imagen como un "blob" (un objeto de datos binarios)
                const response = await fetch(`Fotos-Dulce/${archivo}`);
                const blob = await response.blob();
                // 2. Creamos un archivo virtual a partir del blob
                const file = new File([blob], archivo, { type: blob.type });

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

    // --- Accesibilidad: Función para atrapar el foco dentro de un elemento ---
    function trapFocus(e) {
        const focusableElements = lightbox.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        // Si se presiona Shift + Tab
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus(); // Mover el foco al último elemento
                e.preventDefault();
            }
        } else { // Si se presiona Tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus(); // Mover el foco al primer elemento
                e.preventDefault();
            }
        }
    }




    // --- NUEVA FUNCIONALIDAD: Inicializar la librería de Drag and Drop (SortableJS) ---
    function inicializarDragAndDrop() {
        const estanteElement = document.getElementById('estante-fotos');
        if (estanteElement) {
            new Sortable(estanteElement, {
                animation: 150, // Animación más rápida para una sensación más instantánea
                ghostClass: 'portafotos-ghost', // Clase para el espacio fantasma donde se soltará
                dragClass: 'portafotos-drag',   // Clase para el elemento que se está arrastrando
                // --- NUEVO: Mejoras para la experiencia táctil ---
                delay: 200, // El usuario debe mantener presionado 200ms para iniciar el arrastre
                delayOnTouchOnly: true, // Este retraso solo se aplica en dispositivos táctiles
                onStart: () => {
                    // Pausamos la actualización automática para evitar que la galería se recargue mientras movemos algo
                    if (pollingIntervalId) {
                        clearInterval(pollingIntervalId);
                        pollingIntervalId = null;
                    }
                },
                onEnd: (evt) => {
                    // --- NUEVO: Guardar el nuevo orden cuando el usuario termina de arrastrar ---
                    const portafotosActualizados = Array.from(evt.to.children);
                    const nuevoOrden = portafotosActualizados.map(portafotos => {
                        const img = portafotos.querySelector('.portafotos__imagen');
                        // Extraemos el nombre del archivo desde la URL de la imagen
                        return img.src.split('/').pop();
                    });

                    // Guardamos el nuevo orden en localStorage
                    localStorage.setItem('photoOrder', JSON.stringify(nuevoOrden));
                    // Actualizamos la lista global para que la navegación del lightbox funcione correctamente
                    listaDeFotosGlobal = nuevoOrden;
                    console.log('Nuevo orden de fotos guardado.');
                    // --- NUEVO: Creamos el botón de reset JUSTO después de guardar un nuevo orden ---
                    crearBotonReset();

                    iniciarPollingDeFotos(); // Reanudamos la vigilancia de cambios
                }
            });
        }
    }

    // --- NUEVA FUNCIONALIDAD: Precarga de imágenes para una navegación más rápida ---
    function precargarImagenesAdyacentes(index) {
        // Precargar la siguiente imagen
        const siguienteIndice = (index + 1) % listaDeFotosGlobal.length;
        const imgSiguiente = new Image();
        imgSiguiente.src = `Fotos-Dulce/${listaDeFotosGlobal[siguienteIndice].archivo}`;

        // Precargar la imagen anterior
        const anteriorIndice = (index - 1 + listaDeFotosGlobal.length) % listaDeFotosGlobal.length;
        const imgAnterior = new Image();
        imgAnterior.src = `Fotos-Dulce/${listaDeFotosGlobal[anteriorIndice].archivo}`;
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
                const nuevasFotosData = data.fotos;

                // Comparamos si las fotos en el JSON son diferentes a las que cargamos originalmente.
                // Usamos Sets para una comparación eficiente que ignora el orden.
                const setOriginal = new Set(fotosOriginalesDelJson.map(f => f.archivo));
                const setNuevo = new Set(nuevasFotosData.map(f => f.archivo));

                const sonIguales = setOriginal.size === setNuevo.size && [...setOriginal].every(foto => setNuevo.has(foto));

                if (!sonIguales) {
                    console.log('Se detectaron cambios en fotos.json. Actualizando galería...');
                    // Forzamos una recarga completa para aplicar el nuevo orden desde el JSON
                    // y limpiar cualquier orden guardado que ya no sea válido.
                    localStorage.removeItem('photoOrder');
                    window.location.reload(); // Recargamos para obtener un estado limpio
                }
            } catch (error) {
                console.error('Error durante el polling de fotos:', error);
            }
        }, 5000); // Comprueba cada 5 segundos
    }

    // --- NUEVA FUNCIÓN: Crear un botón para resetear el orden ---
    function crearBotonReset() {
        // Solo creamos el botón si hay un orden guardado
        if (!localStorage.getItem('photoOrder')) return;

        let container = document.getElementById('reset-container');
        if (!container) {
            // 1. Creamos un contenedor para centrar el botón y darle espacio
            container = document.createElement('div');
            container.id = 'reset-container';
            Object.assign(container.style, {
                width: '100%',
                textAlign: 'center',
                marginTop: '1rem', // Espacio respecto al álbum
                marginBottom: '2rem' // Espacio respecto al final de la página
            });

            // 2. Creamos el botón como antes
            const botonReset = document.createElement('button');
            botonReset.id = 'btn-reset-order';
            botonReset.textContent = 'Restablecer Orden';
            botonReset.className = 'btn-lightbox'; // Reutilizamos el estilo de los botones
            botonReset.setAttribute('data-tooltip', 'Vuelve al orden original del álbum');

            botonReset.addEventListener('click', () => {
                // 1. ¡Lanzamos el confeti para una experiencia más gratificante!
                // Esta configuración crea una explosión amplia y festiva.
                const coloresDeLaWeb = ['#5d4037', '#7c513a', '#d3c4a8', '#ffffff', '#ab8e79'];

                confetti({
                    particleCount: 150, // Más partículas para un efecto más denso
                    spread: 180,        // Se esparcen por toda la pantalla
                    origin: { y: 0.6 }, // Empiezan un poco por debajo de la parte superior
                    colors: coloresDeLaWeb // ¡Usamos nuestra paleta de colores personalizada!
                });

                // 2. Eliminar el orden guardado en localStorage
                localStorage.removeItem('photoOrder');

                // 3. Actualizar la lista global de fotos al orden original del JSON
                listaDeFotosGlobal = [...fotosOriginalesDelJson];

                // 4. Regenerar la galería con el orden original
                generarGaleria(listaDeFotosGlobal);

                // 5. Eliminar el propio botón, ya que no es necesario hasta el próximo cambio
                container.remove();
            });

            // 3. Añadimos el botón al contenedor y el contenedor al body
            container.appendChild(botonReset);
            document.body.insertBefore(container, document.querySelector('script[src*="sortable"]'));
        }
    }

    // Iniciar todo el proceso
    cargarYMostrarFotos();
});
