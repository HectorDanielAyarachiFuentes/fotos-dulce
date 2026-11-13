/**
 * Módulo del Visor Lightbox Editorial
 */
import { icons } from './icons.js';

export class LightboxGallery {
    constructor() {
        this.lightbox = document.getElementById('album-lightbox');
        this.img = document.getElementById('lightbox-img');
        this.title = document.getElementById('lightbox-title');
        this.counter = document.getElementById('lightbox-counter');
        this.downloadBtn = document.getElementById('lightbox-download');
        this.closeBtn = document.getElementById('lightbox-close');
        this.prevBtn = document.getElementById('lightbox-prev');
        this.nextBtn = document.getElementById('lightbox-next');

        this.items = [];
        this.currentIndex = -1;

        this.init();
    }

    init() {
        if (this.closeBtn) this.closeBtn.innerHTML = `${icons.close} <span>Cerrar</span>`;
        if (this.prevBtn) this.prevBtn.innerHTML = icons.arrowLeft;
        if (this.nextBtn) this.nextBtn.innerHTML = icons.arrowRight;
        if (this.downloadBtn) this.downloadBtn.innerHTML = `${icons.download} <span>Descargar</span>`;

        this.closeBtn?.addEventListener('click', () => this.close());
        this.prevBtn?.addEventListener('click', () => this.navigate(-1));
        this.nextBtn?.addEventListener('click', () => this.navigate(1));

        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('album-lightbox-main')) {
                this.close();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (!this.lightbox?.classList.contains('visible')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }

    setItems(items) {
        this.items = items;
    }

    open(index) {
        this.currentIndex = index;
        const foto = this.items[this.currentIndex];
        if (!foto) return;

        this.img.src = `assets/images/${foto.archivo}`;
        this.title.textContent = foto.descripcion;
        this.counter.textContent = `${this.currentIndex + 1} de ${this.items.length}`;

        if (this.downloadBtn) {
            this.downloadBtn.href = `assets/images/${foto.archivo}`;
            this.downloadBtn.download = foto.archivo;
        }

        this.lightbox.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('visible');
        document.body.style.overflow = '';
    }

    navigate(direction) {
        let next = this.currentIndex + direction;
        if (next < 0) next = this.items.length - 1;
        if (next >= this.items.length) next = 0;
        this.open(next);
    }
}

