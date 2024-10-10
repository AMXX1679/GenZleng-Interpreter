export class FunctionOrMethodCallHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
        this.functionHandler = interpreter.functionHandler;
        this.classHandler = interpreter.classHandler;
    }

    handleFunctionOrMethodCall(line, localVars) {
        const funcMatch = line.match(/(\w+)\s*\(([^)]*)\)/);
        const methodMatch = line.match(/(\w+)\.(\w+)\s*\(([^)]*)\)/);
        const newMatch = line.match(/set\s+(\w+)\s*=\s*new\s+(\w+)\s*\(([^)]*)\)/);

        if (newMatch) {
            // Handle object instantiation: set obj = new ClassName(args)
            const varName = newMatch[1];
            const className = newMatch[2];
            const argsStr = newMatch[3].trim();
            const args = argsStr === '' ? [] : argsStr.split(/\s*,\s*/).map(arg => this.interpreter.evaluateExpression(arg, localVars));

            if (this.interpreter.classes.hasOwnProperty(className)) {
                const classInstance = this.classHandler.createClassInstance(className, args);
                this.interpreter.variables[varName] = classInstance;
            } else {
                console.error(`Class not defined: ${className}`);
            }
        } else if (methodMatch) {
            // Handle method calls: obj.method(args)
            const objName = methodMatch[1];
            const methodName = methodMatch[2];
            const argsStr = methodMatch[3].trim();
            const args = argsStr === '' ? [] : argsStr.split(/\s*,\s*/).map(arg => this.interpreter.evaluateExpression(arg, localVars));

            const obj = this.interpreter.variables[objName];
            if (obj && obj.methods && obj.methods[methodName]) {
                const method = obj.methods[methodName];
                this.interpreter.executeLines(method.body, obj.variables);
            } else {
                console.error(`Method not defined: ${methodName} in ${objName}`);
            }
        } else if (funcMatch) {
            // Handle function calls: functionName(args)
            const funcName = funcMatch[1];
            const argsStr = funcMatch[2].trim();
            const args = argsStr === '' ? [] : argsStr.split(/\s*,\s*/).map(arg => this.interpreter.evaluateExpression(arg, localVars));

            this.functionHandler.callFunction(funcName, args, localVars);
        } else {
            console.error("Undefined function or syntax error: " + line);
        }
    }
}
