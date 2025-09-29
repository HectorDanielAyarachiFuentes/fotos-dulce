        document.addEventListener('DOMContentLoaded', () => {
            // --- ¡AQUÍ ESTÁ LA MAGIA! ---
            // 1. Genera tu archivo lista-de-fotos.txt con los pasos anteriores.
            // 2. Copia el contenido de ese archivo y pégalo aquí adentro de las comillas invertidas (`).
            const nombresDeFotosComoTexto = `Dulce-caminando.jpg
Dulce-chavo.png
Dulce-colorado.png
Dulce-corazones.jpg
Dulce-gif.gif
Dulce-gorrito.jpg
Dulce-gorro.jpg
Dulce-linda.jpg
Dulce-linda.png
Dulce-mala.jpeg
Dulce-mundo.jpg
Dulce-paraiso.png
Dulce-Psicodelica.jpg
Dulce-reina-2.jpg
Dulce-reina.jpg
Dulce-reina.png
Dulce-sprite-Sheet.png
Dulcetransparente.png
Dulce-conduce.png
Hector-fuma.jpg
Hector-luna.jpg
Hector-malo.jpg
Luna-mala.jpg`;

            const estante = document.getElementById('estante-fotos');
            
            // El código procesa el texto, elimina líneas vacías y crea la lista final.
            const listaDeFotos = nombresDeFotosComoTexto.trim().split('\n').filter(nombre => nombre.trim() !== '' && !nombre.startsWith('lista-de-fotos'));


            // Recorremos la lista y creamos un portafotos por cada imagen
            listaDeFotos.forEach((nombreFoto, index) => {
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

            console.log(`Se han cargado ${listaDeFotos.length} fotos dinámicamente.`);

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
        });
