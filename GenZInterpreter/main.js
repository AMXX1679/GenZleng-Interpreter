import { GenZInterpreter } from './interpreter/GenZInterpreter.js';

// Initialize the interpreter
const interpreter = new GenZInterpreter();

// Event listener for the Run Code button
document.getElementById('runButton').addEventListener('click', () => {
    // Clear previous output
    document.getElementById('output').innerHTML = '';
    const code = document.getElementById('editor').value;
    interpreter.interpret(code);
});
