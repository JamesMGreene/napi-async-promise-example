#include <napi.h>


Napi::Promise SumAsyncPromise(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  //
  // IMPORTANT!
  // Node will process the fulfillment/conclusion of the Promise
  // in an asynchronous fashion (compared to "real-time" in JavaScript)
  // because the fulfillment is added to the event loop queue for
  // the next tick (or end-of-this-iteration, or start-of-next-iteration)
  // even when it is fulfilled synchronously in C++.
  //
  // If this ever becomes UNTRUE, then you would need to utilize an
  // AsyncWorker (or a similar concept) in order to ensure this
  // Promise is fulfilled asynchronously.
  //
  auto resolver = Napi::Promise::Resolver::New(env);

  if (info.Length() != 2) {
    resolver.Reject(
      Napi::TypeError::New(env, "Invalid argument count").Value()
    );
  }
  else if (!info[0].IsNumber() || !info[1].IsNumber()) {
    resolver.Reject(
      Napi::TypeError::New(env, "Invalid argument types").Value()
    );
  }
  else {
    double arg0 = info[0].As<Napi::Number>().DoubleValue();
    double arg1 = info[1].As<Napi::Number>().DoubleValue();
    Napi::Number num = Napi::Number::New(env, arg0 + arg1);

    resolver.Resolve(num);
  }

  return resolver.Promise();
}


Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "add"),
    Napi::Function::New(env, SumAsyncPromise)
  );
  return exports;
}


NODE_API_MODULE(addon, Init)
