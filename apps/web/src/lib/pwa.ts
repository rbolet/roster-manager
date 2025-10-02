import { Workbox } from 'workbox-window';

/**
 * Register service worker for PWA functionality
 * Provides offline support and caching
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('New service worker installed, reload to update');
        // Could show a toast notification here
      } else {
        console.log('Service worker installed for the first time');
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('New service worker waiting to activate');
      // Could prompt user to reload
    });

    wb.addEventListener('controlling', () => {
      console.log('Service worker is controlling the page');
      window.location.reload();
    });

    wb.register().catch((error: unknown) => {
      console.error('Service worker registration failed:', error);
    });
  }
}
