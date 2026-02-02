const CACHE_NAME = 'textile-calc-v2'; // Update တင်တိုင်း ဒါလေးကို v3, v4 စသဖြင့် ပြောင်းပေးပါ
const ASSETS = [
  './',
  './index.html',
  'https://asmfabric.github.io/Textile-Calac-/'
];

// ၁။ Install - ဖိုင်တွေကို Cache ထဲ စသိမ်းမယ်
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Update ရှိရင် စောင့်မနေဘဲ ချက်ချင်း Install လုပ်ခိုင်းတာ
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS);
    })
  );
});

// ၂။ Activate - Version အဟောင်း Cache တွေကို ရှင်းပစ်မယ် (Live Update အတွက် အဓိက)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// ၃။ Fetch - Internet ရှိရင် Network ကယူ၊ မရှိရင် သိမ်းထားတဲ့ Cache ကပြ
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Network ရှိရင် Update ဖြစ်အောင် Cache ထဲ ထပ်သိမ်းပေးမယ်
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)) // Internet မရှိရင် Cache က ဖိုင်ကို သုံးမယ်
  );
});
