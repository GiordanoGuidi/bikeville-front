import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})

class LoadingManager {
  private loader: HTMLElement | null;
  private biciImage: HTMLElement | null;
  private audio: HTMLAudioElement;
  private isPlaying: boolean;

  constructor() {
      this.loader = document.querySelector('.loader');
      this.biciImage = document.querySelector('.logo');
      this.audio = new Audio('suono bici.mp3');
      this.isPlaying = false;
      
      // Configurazione base dell'audio
      this.audio.loop = true;
      this.audio.volume = 1.0;
      
      // Aggiungi listener solo per il click sulla bici
      if (this.biciImage) {
          this.biciImage.addEventListener('click', (e: MouseEvent) => {
              e.stopPropagation();  // Previene la propagazione del click
              this.toggleAudio();
          });
      }
  }

  private toggleAudio(): void {
      if (this.audio) {
          if (this.isPlaying) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.isPlaying = false;
              console.log('Audio fermato');
          } else {
              this.audio.play()
                  .then(() => {
                      this.isPlaying = true;
                      console.log('Audio avviato con successo');
                  })
                  .catch((error: Error) => {
                      console.error('Errore audio:', error);
                  });
          }
      }
  }

  public show(): void {
      if (this.loader) {
          this.loader.style.display = 'block';
      }
  }

  public hide(): void {
      if (this.loader) {
          this.loader.style.display = 'none';
          // Ferma l'audio quando il loader viene nascosto
          if (this.audio && this.isPlaying) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.isPlaying = false;
              console.log('Audio fermato (loader nascosto)');
          }
      }
  }
}

// Creiamo una singola istanza
const loadingManager = new LoadingManager();

// Aggiungiamo i controlli alla finestra globale
window.loadingManager = loadingManager;
window.showLoader = (): void => loadingManager.show();
window.hideLoader = (): void => loadingManager.hide();

// Avviamo il loader quando la pagina è caricata
document.addEventListener('DOMContentLoaded', (): void => {
  loadingManager.show();
  console.log('Clicca sulla bici per attivare/disattivare l\'audio');
});

// Dichiariamo i tipi per window
declare global {
  interface Window {
      loadingManager: LoadingManager;
      showLoader: () => void;
      hideLoader: () => void;
  }
}

export {};
