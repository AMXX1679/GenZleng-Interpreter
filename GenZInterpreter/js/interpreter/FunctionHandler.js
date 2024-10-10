export class FunctionHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleFunctionDefinition(line, lines, currentIndex) {
        const match = line.match(/make\s+(\w+)\s*\(([^)]*)\)\s*\{/);
        if (match) {
            const funcName = match[1];
            const paramsStr = match[2].trim();
            const params = paramsStr === '' ? [] : paramsStr.split(/\s*,\s*/);
            const body = [];
            let i = currentIndex + 1;
            let braceCount = 1;
            while (i < lines.length && braceCount > 0) {
                const currentLine = lines[i].trim();
                if (currentLine.includes('{')) braceCount++;
                if (currentLine.includes('}')) braceCount--;
                if (braceCount > 0) {
                    body.push(currentLine);
                }
                i++;
            }
            this.interpreter.functions[funcName] = { params, body };
            return i - 1;
        } else {
            console.error("Syntax error in function definition: " + line);
            return currentIndex;
        }
    }

    callFunction(funcName, args, callerVars) {
        const func = this.interpreter.functions[funcName];
        if (!func) {
            console.error("Function not defined: " + funcName);
            return;
        }

        if (args.length !== func.params.length) {
            console.error(`Incorrect number of arguments for function ${funcName}`);
            return;
        }

        const localFuncVars = {};
        for (let i = 0; i < args.length; i++) {
            const argValue = this.interpreter.evaluateExpression(args[i], callerVars);
            localFuncVars[func.params[i]] = argValue;
        }

        this.interpreter.executeLines(func.body, localFuncVars);
    }
}
