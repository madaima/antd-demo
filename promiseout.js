class PromiseOut {
  resolve;
  reject;
  promise = new Promise((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  })

}

let promise1 = new PromiseOut();
console.log(promise1)
