class Calculator {
  constructor() {
    this.result = 0;
  }

  add(number) {
    this.result += number;
    return this;
  }

  subtract(number) {
    this.result -= number;
    return this;
  }

  multiply(number) {
    if (this.result === 0) {
      this.result = number;
    } else {
      this.result *= number;
    }
  }

  divide(number) {







  }

  getResult() {
    return this.result;

  }

  reset() {
    this.result = 0;
    return this;
  }
}
