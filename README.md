# `napi-async-promise-example`

Node v8.x N-API asynchronous `Promise` example addon


## Implementation Note

**IMPORTANT!**

Node.js will process the fulfillment/conclusion of the `Promise` in an
asynchronous fashion (compared to "real-time" in JavaScript) because the
fulfillment is added to the event loop's "`Promise` fulfillment microtask
queue", which is processed immediately after the "`nextTick` microtask
queue", even when it is fulfilled synchronously in C++.

If this ever becomes UNTRUE, then you would need to utilize an
`AsyncWorker` (or a similar concept) in order to ensure this
`Promise` is fulfilled asynchronously.
