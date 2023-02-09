self.__precacheManifest = [].concat(self.__precacheManifest || []);

const { clientsClaim } = workbox.core;


clientsClaim();
self.skipWaiting();



workbox.precaching.precacheAndRoute(self.__precacheManifest, {});