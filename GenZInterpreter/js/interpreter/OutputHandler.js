export class OutputHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleSay(line, localVars) {
        const match = line.match(/say\((.+)\)/);
        if (match) {
            const expression = match[1].trim();
            const value = this.interpreter.evaluateExpression(expression, localVars);
            console.log(value); // Output to console
            this.interpreter.displayOutput(value); // Output to GUI
        }
    }
}
