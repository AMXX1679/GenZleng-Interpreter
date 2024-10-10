export class LoopHandler {
    constructor(interpreter) {
        this.interpreter = interpreter;
    }

    handleLoop(line, lines, currentIndex, localVars) {
        const match = line.match(/grind\s*\(([^;]+);([^;]+);([^\)]+)\)\s*\{/);
        if (match) {
            const init = match[1].trim();
            const condition = match[2].trim();
            const increment = match[3].trim();

            // Initialize loop variable
            this.interpreter.handleVariableAssignment([`set ${init}`], 0, localVars);

            const loopBody = [];
            let i = currentIndex + 1;
            let braceCount = 1;

            while (i < lines.length && braceCount > 0) {
                const currentLine = lines[i].trim();
                if (currentLine.includes('{')) braceCount++;
                if (currentLine.includes('}')) braceCount--;
                if (braceCount > 0) {
                    loopBody.push(currentLine);
                }
                i++;
            }

            // Evaluate loop condition
            const conditionMatch = condition.match(/(\w+)\s*(<|>|==|!=|<=|>=)\s*(.+)/);
            if (conditionMatch) {
                const varName = conditionMatch[1];
                const operator = conditionMatch[2];
                const value = this.interpreter.evaluateExpression(conditionMatch[3], localVars);

                while (this.interpreter.compare(this.interpreter.variables[varName], operator, value)) {
                    this.interpreter.executeLines(loopBody, localVars);
                    // Increment or decrement loop variable
                    this.interpreter.handleVariableAssignment([`set ${increment.replace('++', 'i = i + 1').replace('--', 'i = i - 1')}`], 0, localVars);
                }
            } else {
                console.error("Invalid loop condition: " + condition);
            }

            return i - 1;
        } else {
            console.error("Syntax error in loop: " + line);
            return currentIndex;
        }
    }
}
