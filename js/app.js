/**
 * Controlador Principal del Álbum Dulce & Hector
 * Arquitectura modular y limpia
 */
import { icons } from './modules/icons.js';
import { initAmbientParticles } from './modules/particles.js';
import { FavoritesManager } from './modules/favorites.js';
import { LightboxGallery } from './modules/lightbox.js';
import { GalleryGrid } from './modules/gallery.js';
import { initTooltips } from '../herramientas/frontend_embellecedor/impecable/components/tooltip.js';

class DulceAlbumApp {
    constructor() {
        this.todasLasFotos = [];
        this.fotosFiltradas = [];
        this.categoriaActiva = 'todas';
        this.busquedaActual = '';

        this.favManager = new FavoritesManager();
        this.lightbox = new LightboxGallery();
        this.gallery = new GalleryGrid(
            'album-grid',
            'album-empty',
            (idx) => this.lightbox.open(idx),
            (file) => {
                const res = this.favManager.toggle(file);
                this.actualizarContadoresFiltros();
                return res;
            }
        );

        this.init();
    }

    async init() {
        this.inyectarIconosUI();
        this.initTheme();
        initAmbientParticles('particles-canvas');

        try {
            const res = await fetch('fotos.json');
            const data = await res.json();
            this.todasLasFotos = data.fotos;
            this.fotosFiltradas = [...this.todasLasFotos];

            this.actualizarHeroStack();
            this.actualizarContadoresFiltros();
            this.filtrarYRederizar();
            this.setupEventListeners();
            initTooltips('[data-tooltip]');
        } catch (err) {
            console.error("Error al cargar fotos:", err);
        }
    }

    inyectarIconosUI() {
        // Marca
        const brandHeart = document.querySelector('.album-brand-heart');
        if (brandHeart) brandHeart.innerHTML = icons.heart;

        // Búsqueda
        const searchWrap = document.querySelector('.album-search-icon-wrap');
        if (searchWrap) searchWrap.innerHTML = icons.search;

        const clearBtn = document.getElementById('clear-search-btn');
        if (clearBtn) clearBtn.innerHTML = icons.close;

        // Botones navbar
        const musicIconWrap = document.querySelector('.music-icon-wrap');
        if (musicIconWrap) musicIconWrap.innerHTML = icons.music;

        const randomBtn = document.getElementById('album-btn-random');
        if (randomBtn) randomBtn.innerHTML = `${icons.sparkles} <span>Sorpresa</span>`;

        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) themeBtn.innerHTML = icons.moon;

        // Filtros Categorías con SVG
        const filterIcons = {
            todas: icons.grid,
            favoritos: icons.heart,
            dulce: icons.dog,
            juntos: icons.users,
            artisticas: icons.palette,
            hector: icons.user,
            luna: icons.moonStars
        };

        document.querySelectorAll('.album-filter-btn').forEach(btn => {
            const cat = btn.dataset.category;
            const iconSvg = filterIcons[cat] || icons.sparkles;
            const label = btn.querySelector('.label-text')?.textContent || cat;
            const count = btn.querySelector('.count')?.textContent || '(0)';
            btn.innerHTML = `${iconSvg} <span class="label-text">${label}</span> <span class="count">${count}</span>`;
        });
    }

    actualizarHeroStack() {
        const p1 = document.getElementById('hero-p1');
        const p2 = document.getElementById('hero-p2');
        const p3 = document.getElementById('hero-p3');

        if (this.todasLasFotos.length >= 3) {
            if (p1) p1.querySelector('img').src = `assets/images/${this.todasLasFotos[0].archivo}`;
            if (p2) p2.querySelector('img').src = `assets/images/${this.todasLasFotos[23]?.archivo || this.todasLasFotos[1].archivo}`;
            if (p3) p3.querySelector('img').src = `assets/images/${this.todasLasFotos[3]?.archivo || this.todasLasFotos[2].archivo}`;
        }

        const totalBadge = document.getElementById('total-photos-count');
        if (totalBadge) totalBadge.textContent = `${this.todasLasFotos.length} Fotos`;
    }

    filtrarYRederizar() {
        this.fotosFiltradas = this.todasLasFotos.filter(foto => {
            const matchCat = (this.categoriaActiva === 'todas') 
                ? true 
                : (this.categoriaActiva === 'favoritos')
                    ? this.favManager.has(foto.archivo)
                    : foto.categorias && foto.categorias.includes(this.categoriaActiva);

            const matchQuery = this.busquedaActual === '' 
                || foto.descripcion.toLowerCase().includes(this.busquedaActual.toLowerCase())
                || (foto.categorias && foto.categorias.some(c => c.toLowerCase().includes(this.busquedaActual.toLowerCase())));

            return matchCat && matchQuery;
        });

        this.lightbox.setItems(this.fotosFiltradas);
        this.gallery.render(this.fotosFiltradas, this.favManager);
    }

    actualizarContadoresFiltros() {
        const counts = { todas: this.todasLasFotos.length, favoritos: this.favManager.count() };
        this.todasLasFotos.forEach(f => {
            if (f.categorias) {
                f.categorias.forEach(cat => counts[cat] = (counts[cat] || 0) + 1);
            }
        });

        document.querySelectorAll('.album-filter-btn').forEach(btn => {
            const cat = btn.dataset.category;
            const countSpan = btn.querySelector('.count');
            if (countSpan && counts[cat] !== undefined) {
                countSpan.textContent = `(${counts[cat]})`;
            }
        });
    }

    setupEventListeners() {
        // Filtros
        document.querySelectorAll('.album-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.album-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.categoriaActiva = btn.dataset.category;
                this.filtrarYRederizar();
            });
        });

        // Búsqueda
        const searchInput = document.getElementById('album-search');
        const clearBtn = document.getElementById('clear-search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.busquedaActual = e.target.value.trim();
                clearBtn?.classList.toggle('visible', this.busquedaActual.length > 0);
                this.filtrarYRederizar();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.busquedaActual = '';
                    clearBtn.classList.remove('visible');
                    this.filtrarYRederizar();
                    searchInput.focus();
                }
            });
        }

        // Música ambiental de recuerdos
        const musicBtn = document.getElementById('music-toggle-btn');
        const audio = document.getElementById('album-audio');
        let playingMusic = false;

        if (musicBtn && audio) {
            musicBtn.addEventListener('click', () => {
                const iconWrap = musicBtn.querySelector('.music-icon-wrap');
                const label = musicBtn.querySelector('.music-label');

                if (!playingMusic) {
                    audio.play().then(() => {
                        playingMusic = true;
                        musicBtn.classList.add('active');
                        if (iconWrap) iconWrap.innerHTML = icons.volume2;
                        if (label) label.textContent = 'Sonando';
                    }).catch(e => console.log('Audio error:', e));
                } else {
                    audio.pause();
                    playingMusic = false;
                    musicBtn.classList.remove('active');
                    if (iconWrap) iconWrap.innerHTML = icons.music;
                    if (label) label.textContent = 'Música';
                }
            });
        }

        // Sorpresa
        document.getElementById('album-btn-random')?.addEventListener('click', () => {
            if (this.fotosFiltradas.length === 0) return;
            const azar = Math.floor(Math.random() * this.fotosFiltradas.length);
            this.lightbox.open(azar);
            this.favManager.dispararEfecto();
        });

        // Tema
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('dulce_theme', next);
                themeBtn.innerHTML = next === 'dark' ? icons.moon : icons.sun;
            });
        }
    }

    initTheme() {
        const saved = localStorage.getItem('dulce_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.innerHTML = saved === 'dark' ? icons.moon : icons.sun;
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    new DulceAlbumApp();
});

