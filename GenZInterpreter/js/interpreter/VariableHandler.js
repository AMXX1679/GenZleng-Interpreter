export class VariableHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleVariableAssignment(line, localVars) {
        const match = line.match(/(set|gimme)\s+(\w+)\s*=\s*(.+)/);
        if (match) {
            const varName = match[2];
            const expression = match[3];
            const value = this.interpreter.evaluateExpression(expression, localVars);
            localVars[varName] = value;
            this.interpreter.variables[varName] = value; // Update global variable
        } else {
            console.error("Syntax error in variable assignment: " + line);
        }
    }
}
