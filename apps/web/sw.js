// gunnchOS3k MLV Arcade Service Worker
// Complete PWA with offline support and caching

const CACHE_NAME = 'mlv-arcade-v1';
const OFFLINE_CACHE = 'mlv-arcade-offline-v1';

// Critical resources for offline support
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/hub-mobile.png',
  '/screenshots/games-mobile.png',
  '/screenshots/multiplayer-mobile.png'
];

// Game-specific cache patterns
const GAME_CACHE_PATTERNS = [
  /anime-aggressors/,
  /3k-mlv/,
  /multiplayer/,
  /profile/,
  /social/
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🎮 MLV Arcade Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📱 Caching critical MLV Arcade resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('✅ MLV Arcade resources cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 MLV Arcade Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ MLV Arcade Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement MLV Arcade caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Game-specific requests - cache with network-first strategy
  if (GAME_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(handleGameRequest(request));
    return;
  }
  
  // Static assets - cache first strategy
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(handleStaticAsset(request));
    return;
  }
  
  // API requests - network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
  
  // Default - network first with cache fallback
  event.respondWith(handleDefaultRequest(request));
});

// Game request handler - network first for real-time game data
async function handleGameRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🎮 Game request failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline game info
    return new Response(JSON.stringify({
      message: 'MLV Arcade is offline',
      guidance: 'Basic game features available offline',
      games: [
        'Anime Aggressors - Offline mode',
        '3k MLV - Offline mode'
      ],
      multiplayer: [
        'NFC Tap-to-Connect - Offline',
        'Bluetooth Discovery - Offline',
        'Local Network - Offline',
        'QR Code - Offline'
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// API request handler - network first with cache fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 API request failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline API response
    return new Response(JSON.stringify({
      error: 'API not available offline',
      offline: true,
      message: 'MLV Arcade is working offline',
      features: [
        'Basic game launching',
        'Profile viewing',
        'Social feed (cached)',
        'Multiplayer discovery'
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Static asset handler - cache first
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('📱 Static asset not available offline:', request.url);
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Default request handler - network first with cache fallback
async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network request failed, trying cache...');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline MLV Arcade page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MLV Arcade - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a2e;
            color: #4ecdc4;
            text-align: center;
            padding: 2rem;
            margin: 0;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
          }
          h1 { color: #4ecdc4; }
          .offline-features {
            text-align: left;
            margin: 2rem 0;
          }
          .feature {
            padding: 0.5rem 0;
            border-bottom: 1px solid #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎮 MLV Arcade</h1>
          <p>You're currently offline, but your arcade is still here!</p>
          
          <div class="offline-features">
            <h3>Available Offline:</h3>
            <div class="feature">🎮 Game launcher</div>
            <div class="feature">👤 Profile management</div>
            <div class="feature">📱 Multiplayer discovery</div>
            <div class="feature">💬 Social feed (cached)</div>
            <div class="feature">🏠 Hub navigation</div>
          </div>
          
          <p><strong>Your gaming hub is always accessible!</strong></p>
        </div>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background sync for MLV Arcade data
self.addEventListener('sync', (event) => {
  if (event.tag === 'mlv-arcade-sync') {
    event.waitUntil(syncMLVArcadeData());
  }
});

// Sync MLV Arcade data when back online
async function syncMLVArcadeData() {
  console.log('🔄 Syncing MLV Arcade data...');
  
  try {
    // Sync any pending game data
    const pendingData = await getPendingMLVArcadeData();
    
    for (const data of pendingData) {
      await fetch('/api/mlv-arcade/sync', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ MLV Arcade data synced successfully');
  } catch (error) {
    console.log('❌ MLV Arcade data sync failed:', error);
  }
}

// Get pending MLV Arcade data from IndexedDB
async function getPendingMLVArcadeData() {
  // Implementation would depend on your data storage strategy
  return [];
}

// Push notifications for MLV Arcade updates
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'MLV Arcade update',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: [
        {
          action: 'view',
          title: 'View Arcade',
          icon: '/icons/view-96x96.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-96x96.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'MLV Arcade', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🎮 MLV Arcade Service Worker loaded successfully!');
