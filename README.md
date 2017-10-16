# `napi-async-promise-example`

Node v8.x N-API asynchronous `Promise` example addon


## Warning

This example addon is dependent on the currently unmerged C++ `Napi::Promise` implementation for the `node-addon-api` module: https://github.com/nodejs/node-addon-api/pull/137


### Implementation Note

**IMPORTANT!**

Node.js will process the fulfillment/conclusion of the `Napi::Promise` in an asynchronous fashion (compared to "real-time" in JavaScript) because the fulfillment is added to the event loop queue for the next tick (or end-of-this-iteration, or start-of-next-iteration, or whatever) even when it is being fulfilled synchronously in the C++ code.

If this ever becomes UNTRUE, then you would need to utilize an `AsyncWorker` (or a similar concept) in order to ensure this `Napi::Promise` is fulfilled asynchronously.
