const { offlineFallback, warmStrategyCache } = require('workbox-recipes')
const { CacheFirst } = require('workbox-strategies')
const { registerRoute } = require('workbox-routing')
const { CacheableResponsePlugin } = require('workbox-cacheable-response')
const { ExpirationPlugin } = require('workbox-expiration')
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute')
const { StaleWhileRevalidate } = require('workbox-strategies')

precacheAndRoute(self.__WB_MANIFEST)

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
})

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
})

registerRoute(({ request }) => request.mode === 'navigate', pageCache)

// Implement asset caching
// Define array of request destinations that the service worker should manage
const requestDestinationsToHandle = ['style', 'script', 'worker']

// Register a route with the service worker
registerRoute(
  // First argument to registerRoute is a function that determines
  // whether a request should be handled by the service worker
  ({ request }) => {
    // Check if the destination of the request is in the array
    // of destinations to handle
    return requestDestinationsToHandle.includes(request.destination)
  },

  // Second argument to registerRoute is a Workbox strategy that
  // defines how to handle requests that meet the condition specified
  // in the first argument
  new StaleWhileRevalidate({
    // Define the name of the cache to use
    cacheName: 'inkflow-asset-cache',

    // Define plugins to use with the caching strategy
    plugins: [
      // Use the CacheableResponsePlugin to only cache responses
      // with certain status codes
      new CacheableResponsePlugin({
        statuses: [0, 200], // Cache responses with status code 0 or 200
      }),
      // Add the ExpirationPlugin
      new ExpirationPlugin({
        // Only cache requests for a month
        maxAgeSeconds: 30 * 24 * 60 * 60,
        // Only cache 100 entries
        maxEntries: 100,
      }),
    ],
  })
)
