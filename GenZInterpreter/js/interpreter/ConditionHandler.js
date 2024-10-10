export class ConditionHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleCondition(line, lines, currentIndex, localVars) {
        const match = line.match(/realTalk\s*\((.+)\)\s*\{/);
        if (match) {
            const condition = match[1];
            const conditionTrue = this.interpreter.evaluateCondition(condition, localVars);

            const trueBranch = [];
            const falseBranch = [];
            let i = currentIndex + 1;
            let braceCount = 1;
            let elseEncountered = false;

            while (i < lines.length && braceCount > 0) {
                const currentLine = lines[i].trim();
                if (currentLine.includes('{')) braceCount++;
                if (currentLine.includes('}')) braceCount--;
                if (braceCount > 0) {
                    if (currentLine.startsWith('else {')) {
                        elseEncountered = true;
                        i++;
                        continue;
                    }
                    if (!elseEncountered) {
                        trueBranch.push(currentLine);
                    } else {
                        falseBranch.push(currentLine);
                    }
                }
                i++;
            }

            if (conditionTrue) {
                this.interpreter.executeLines(trueBranch, localVars);
            } else {
                this.interpreter.executeLines(falseBranch, localVars);
            }

            return i - 1;
        } else {
            console.error("Syntax error in condition: " + line);
            return currentIndex;
        }
    }
}
