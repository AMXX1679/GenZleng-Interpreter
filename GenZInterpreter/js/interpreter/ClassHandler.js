export class ClassHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleClassDefinition(line, lines, currentIndex) {
        const match = line.match(/class\s+(\w+)\s*\{/);
        if (match) {
            const className = match[1];
            const classBody = [];
            let i = currentIndex + 1;
            let braceCount = 1;
            while (i < lines.length && braceCount > 0) {
                const currentLine = lines[i].trim();
                if (currentLine.includes('{')) braceCount++;
                if (currentLine.includes('}')) braceCount--;
                if (braceCount > 0) {
                    classBody.push(currentLine);
                }
                i++;
            }
            this.interpreter.classes[className] = classBody;
            return i - 1;
        } else {
            console.error("Syntax error in class definition: " + line);
            return currentIndex;
        }
    }

    createClassInstance(className, args) {
        const classBody = this.interpreter.classes[className];
        if (!classBody) {
            console.error(`Class not found: ${className}`);
            return null;
        }

        const instance = {
            variables: {},
            methods: {}
        };

        // Parse class body to find constructor and methods
        for (let i = 0; i < classBody.length; i++) {
            const line = classBody[i].trim();
            if (line.startsWith('make constructor')) {
                // Handle constructor
                const match = line.match(/make\s+constructor\s*\(([^)]*)\)\s*\{/);
                if (match) {
                    const paramsStr = match[1].trim();
                    const params = paramsStr === '' ? [] : paramsStr.split(/\s*,\s*/);
                    const body = [];
                    let braceCount = 1;
                    let j = i + 1;
                    while (j < classBody.length && braceCount > 0) {
                        const currentLine = classBody[j].trim();
                        if (currentLine.includes('{')) braceCount++;
                        if (currentLine.includes('}')) braceCount--;
                        if (braceCount > 0) {
                            body.push(currentLine);
                        }
                        j++;
                    }
                    // Assign constructor body
                    instance.constructor = { params, body };
                    i = j - 1;
                }
            } else if (line.startsWith('make ')) {
                // Handle methods
                const match = line.match(/make\s+(\w+)\s*\(([^)]*)\)\s*\{/);
                if (match) {
                    const methodName = match[1];
                    const paramsStr = match[2].trim();
                    const params = paramsStr === '' ? [] : paramsStr.split(/\s*,\s*/);
                    const body = [];
                    let braceCount = 1;
                    let j = i + 1;
                    while (j < classBody.length && braceCount > 0) {
                        const currentLine = classBody[j].trim();
                        if (currentLine.includes('{')) braceCount++;
                        if (currentLine.includes('}')) braceCount--;
                        if (braceCount > 0) {
                            body.push(currentLine);
                        }
                        j++;
                    }
                    instance.methods[methodName] = { params, body };
                    i = j - 1;
                }
            }
        }

        // Execute constructor if exists
        if (instance.constructor) {
            const constructor = instance.constructor;
            const localConstructorVars = {};
            for (let i = 0; i < constructor.params.length; i++) {
                const paramName = constructor.params[i];
                localConstructorVars[paramName] = args[i];
            }
            this.interpreter.executeLines(constructor.body, localConstructorVars);
            // Assign constructor variables to instance
            for (const [key, value] of Object.entries(localConstructorVars)) {
                instance.variables[key] = value;
            }
        }

        return instance;
    }

    handleMethodCall(obj, methodName, args) {
        if (obj && obj.methods && obj.methods[methodName]) {
            const method = obj.methods[methodName];
            this.interpreter.executeLines(method.body, obj.variables);
        } else {
            console.error(`Method not defined: ${methodName} in object`);
        }
    }
}
