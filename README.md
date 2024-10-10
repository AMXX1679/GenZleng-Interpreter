
# Gen Z Interpreter

## Description

The Gen Z Interpreter is a lightweight programming language interpreter designed to help users write simple code using a syntax inspired by modern slang and casual language. It allows for basic variable assignments, functions, conditionals, and loops, making it a fun tool for learning programming concepts.

## Features

- **Variable Assignment**: Easily define variables with `set` and `gimme`.
- **Constants**: Define immutable variables using `safe`.
- **Functions**: Create reusable blocks of code with `make`.
- **Conditional Statements**: Use `realTalk` for if-else logic.
- **Loops**: Implement looping constructs with `grind`.
- **Output**: Display messages using `say()`.

| **Gen Z Command** | **Description**                      | **JavaScript Equivalent**      |
|-------------------|--------------------------------------|---------------------------------|
| `set`             | Assigns a value to a variable        | `let` or `var`                  |
| `gimme`           | Assigns a value to a variable        | `let` or `var`                  |
| `safe`            | Assigns an immutable constant value  | `const`                         |
| `make`            | Defines a function                    | `function` or arrow functions   |
| `realTalk`        | Initiates an `if` statement           | `if`                            |
| `else`            | Defines the `else` block              | `else`                          |
| `grind`           | Creates a loop                        | `for` or `while`                |
| `say`             | Outputs a message                     | `console.log()`                 |
| `class`           | Defines a class                        | `class`                         |


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AMXX1679/GenZleng
   cd gen-z-interpreter
   ```

2. Open the `index.html` file in your web browser.

## Usage

1. In the text area, write your code using the Gen Z syntax.
2. Click the "Run Code" button to execute the code.
3. The output will be displayed below the code editor.

### Example Code

```plaintext
// Define a constant
safe pi = 3.14

// Assign variables
set age = 16
gimme followers = 1200
set money = 0

// Define a function
make checkAge(whatAge) {
    realTalk (whatAge < 18) {
        say("Yo, you're still a baby.")
    } else {
        say("You're an adult now!")
    }
}

// Define a class
class Person {
    make constructor(name, age) {
        safe name = name
        safe age = age
    }

    make introduce() {
        say("Hi, I'm " + name + " and I'm " + age + " years old.")
    }
}

// Create an instance of the class
set alice = new Person("Alice", 30)

// Call a method on the instance
alice.introduce()

// Loop example
grind (i = 0; i < followers; i++) {
    set money = money + 10
    set i = i + 1 // Increment i
}

// Output results
checkAge(age)
say("You got " + money + " bucks!")
say("Value of pi is: " + pi)
```

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.
