export class ConstHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleConstAssignment(line, localVars) {
        const match = line.match(/safe\s+(\w+)\s*=\s*(.+)/);
        if (match) {
            const constName = match[1];
            const expression = match[2];
            const value = this.interpreter.evaluateExpression(expression, localVars);
            if (!this.interpreter.variables.hasOwnProperty(constName)) {
                this.interpreter.variables[constName] = value; // Store constant variable
            } else {
                console.error(`Constant variable ${constName} cannot be reassigned.`);
            }
        } else {
            console.error("Syntax error in constant assignment: " + line);
        }
    }
}
