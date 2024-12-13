class LoadingManager {
    private loader: HTMLElement | null;

    constructor() {
        this.loader = document.querySelector('.loader');
    }

    show(): void {
        if (this.loader) {
            this.loader.style.display = 'block';
        }
    }

    hide(): void {
        if (this.loader) {
            this.loader.style.display = 'none';
        }
    }
}

// Esempio di utilizzo
const loadingManager = new LoadingManager();

// Per mostrare il loader
export function showLoader() {
    loadingManager.show();
}

// Per nascondere il loader
export function hideLoader() {
    loadingManager.hide();
}
