/**
 * Módulo de Galería & Renderizado de Tarjetas con Scroll-Reveal
 */
import { icons } from './icons.js';
import { initSpotlightCards } from '../../herramientas/frontend_embellecedor/ui-pro-max/components/spotlight-card.js';

export class GalleryGrid {
    constructor(containerId, emptyId, onOpenPhoto, onToggleFav) {
        this.container = document.getElementById(containerId);
        this.emptyState = document.getElementById(emptyId);
        this.onOpenPhoto = onOpenPhoto;
        this.onToggleFav = onToggleFav;
        this.observer = null;

        this.initObserver();
    }

    initObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });
    }

    render(photos, favManager) {
        this.container.innerHTML = '';

        if (photos.length === 0) {
            if (this.emptyState) this.emptyState.style.display = 'block';
            return;
        } else {
            if (this.emptyState) this.emptyState.style.display = 'none';
        }

        photos.forEach((foto, index) => {
            const card = document.createElement('article');
            card.className = 'album-card pro-spotlight-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('data-tooltip', 'Ampliar fotografía');

            const isFav = favManager.has(foto.archivo);
            const catLabel = foto.categorias ? foto.categorias.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' • ') : 'Recuerdo';

            card.innerHTML = `
                <div class="album-card-image-wrap">
                    <span class="album-card-badge">${foto.categorias && foto.categorias[0] ? foto.categorias[0] : 'Dulce'}</span>
                    <button class="album-card-favorite-btn ${isFav ? 'active' : ''}" data-file="${foto.archivo}" aria-label="Favorito">
                        ${isFav ? icons.heart : icons.heartOutline}
                    </button>
                    <img class="album-card-img" loading="lazy" src="assets/images/${foto.archivo}" alt="${foto.descripcion}">
                </div>
                <div class="album-card-meta">
                    <div>
                        <h3 class="album-card-title">${foto.descripcion}</h3>
                        <span class="album-card-category-tag">${catLabel}</span>
                    </div>
                    <div class="album-card-btn-view" aria-label="Ver">
                        ${icons.arrowRight}
                    </div>
                </div>
            `;

            card.addEventListener('click', (e) => {
                const favBtn = e.target.closest('.album-card-favorite-btn');
                if (favBtn) {
                    const nuevoEstado = this.onToggleFav(foto.archivo);
                    favBtn.classList.toggle('active', nuevoEstado);
                    favBtn.innerHTML = nuevoEstado ? icons.heart : icons.heartOutline;
                    return;
                }
                this.onOpenPhoto(index);
            });

            this.container.appendChild(card);
            this.observer.observe(card);
        });

        initSpotlightCards('.album-card');
    }
}

