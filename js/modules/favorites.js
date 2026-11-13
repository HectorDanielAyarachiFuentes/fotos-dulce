/**
 * Módulo de Gestión de Favoritos y Persistencia Local
 */
const STORAGE_KEY = 'dulce_favoritos';

export class FavoritesManager {
    constructor() {
        this.favoritos = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    }

    has(archivo) {
        return this.favoritos.has(archivo);
    }

    toggle(archivo) {
        const estado = this.favoritos.has(archivo);
        if (estado) {
            this.favoritos.delete(archivo);
        } else {
            this.favoritos.add(archivo);
            this.dispararEfecto();
        }
        this.guardar();
        return !estado;
    }

    count() {
        return this.favoritos.size;
    }

    guardar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.favoritos]));
    }

    dispararEfecto() {
        if (window.confetti) {
            window.confetti({
                particleCount: 45,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#f43f5e', '#f59e0b', '#fbbf24']
            });
        }
    }
}

