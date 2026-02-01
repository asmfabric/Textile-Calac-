const CACHE_NAME = 'textile-calc-v1';
const ASSETS = [
  './',
  './index.html'
];

// App ကို Install လုပ်ချိန်မှာ File တွေကို သိမ်းထားမယ်
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Internet မရှိရင် သိမ်းထားတဲ့ Cache ထဲကနေ ပြန်ထုတ်ပြမယ်
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
