self.__precacheManifest = [].concat(self.__precacheManifest || []);

const { clientsClaim } = workbox.core;
const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;
const { CacheExpiration } = workbox.expiration;


clientsClaim();
self.skipWaiting();

registerRoute(
    new RegExp("https://dummyjson.com/products"),
    new StaleWhileRevalidate({
      cacheName: "products",
      plugins: [new CacheableResponse({ statuses: [200] })],
    })
  );


workbox.precaching.precacheAndRoute(self.__precacheManifest, {});