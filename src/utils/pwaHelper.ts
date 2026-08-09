/**
 * Register Service Worker for PWA Offline Capability
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Reelsnip AI Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    });
  }
}

/**
 * Handle BeforeInstallPrompt event for PWA Installation Banner
 */
export function setupPwaInstallListener(onInstallableAvailable: (deferredPrompt: unknown) => void) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    onInstallableAvailable(e);
  });
}
