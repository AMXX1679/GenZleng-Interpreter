import { VariableHandler } from './VariableHandler.js';
import { ConstHandler } from './ConstHandler.js';
import { FunctionHandler } from './FunctionHandler.js';
import { ClassHandler } from './ClassHandler.js';
import { ConditionHandler } from './ConditionHandler.js';
import { LoopHandler } from './LoopHandler.js';
import { OutputHandler } from './OutputHandler.js';
import { FunctionOrMethodCallHandler } from './FunctionOrMethodCallHandler.js';

export class GenZInterpreter {
    constructor() {
        this.variables = {}; // Stores variable and constant values
        this.functions = {}; // Stores function definitions
        this.classes = {}; // Stores class definitions

        // Initialize handlers
        this.variableHandler = new VariableHandler(this);
        this.constHandler = new ConstHandler(this);
        this.functionHandler = new FunctionHandler(this);
        this.classHandler = new ClassHandler(this);
        this.conditionHandler = new ConditionHandler(this);
        this.loopHandler = new LoopHandler(this);
        this.outputHandler = new OutputHandler(this);
        this.functionOrMethodCallHandler = new FunctionOrMethodCallHandler(this);
    }

    // Main method to interpret the Gen Z code
    interpret(code) {
        const lines = code.split(/\r?\n/);
        this.executeLines(lines, {});
    }

    // Executes each line of the code
    executeLines(lines, localVars) {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === '' || line.startsWith('//')) continue; // Skip empty lines or comments

            // Handle variable assignment: set or gimme
            if (line.startsWith('set ') || line.startsWith('gimme ')) {
                this.variableHandler.handleVariableAssignment(line, localVars);
            }
            // Handle constant assignment: safe
            else if (line.startsWith('safe ')) {
                this.constHandler.handleConstAssignment(line, localVars);
            }
            // Handle class definition: class
            else if (line.startsWith('class ')) {
                i = this.classHandler.handleClassDefinition(line, lines, i);
            }
            // Handle function definition: make
            else if (line.startsWith('make ')) {
                i = this.functionHandler.handleFunctionDefinition(line, lines, i);
            }
            // Handle conditional statements: realTalk
            else if (line.startsWith('realTalk ')) {
                i = this.conditionHandler.handleCondition(line, lines, i, localVars);
            }
            // Handle loops: grind
            else if (line.startsWith('grind ')) {
                i = this.loopHandler.handleLoop(line, lines, i, localVars);
            }
            // Handle function calls, method calls, or output: say or function/method name
            else {
                if (line.startsWith('say(')) {
                    this.outputHandler.handleSay(line, localVars);
                } else {
                    this.functionOrMethodCallHandler.handleFunctionOrMethodCall(line, localVars);
                }
            }
        }
    }

    // Evaluates expressions
    evaluateExpression(expression, localVars) {
        // Simple evaluation: handles numbers, strings, variables, and expressions
        const trimmedExpr = expression.trim();

        // Handle string literals
        const stringMatch = trimmedExpr.match(/^"(.*)"$/);
        if (stringMatch) {
            return stringMatch[1];
        }

        // Handle new object instantiation
        const newMatch = trimmedExpr.match(/^new\s+(\w+)\s*\(([^)]*)\)$/);
        if (newMatch) {
            const className = newMatch[1];
            const argsStr = newMatch[2].trim();
            const args = argsStr === '' ? [] : argsStr.split(/\s*,\s*/).map(arg => this.evaluateExpression(arg, localVars));
            return this.classHandler.createClassInstance(className, args);
        }

        // Handle binary operations (+, -, *, /)
        const operators = ['+', '-', '*', '/'];
        for (const operator of operators) {
            const parts = trimmedExpr.split(operator);
            if (parts.length > 1) {
                const left = this.evaluateExpression(parts[0], localVars);
                const right = this.evaluateExpression(parts.slice(1).join(operator), localVars);
                switch (operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    default: return 0;
                }
            }
        }

        // Handle numeric values
        if (!isNaN(trimmedExpr)) {
            return Number(trimmedExpr);
        }

        // Handle variables
        if (localVars.hasOwnProperty(trimmedExpr)) {
            return localVars[trimmedExpr];
        }
        if (this.variables.hasOwnProperty(trimmedExpr)) {
            return this.variables[trimmedExpr];
        }

        return trimmedExpr; // Return as string if not matched
    }

    // Evaluates conditions for if statements and loops
    evaluateCondition(condition, localVars) {
        const match = condition.match(/(\w+)\s*(<|>|==|!=|<=|>=)\s*(.+)/);
        if (match) {
            const varName = match[1];
            const operator = match[2];
            const value = this.evaluateExpression(match[3], localVars);
            const left = this.variables[varName];
            return this.compare(left, operator, value);
        }
        return false;
    }

    // Compares two values based on the operator
    compare(left, operator, right) {
        switch (operator) {
            case '<': return left < right;
            case '>': return left > right;
            case '==': return left == right;
            case '!=': return left != right;
            case '<=': return left <= right;
            case '>=': return left >= right;
            default: return false;
        }
    }

    // Displays output in the GUI
    displayOutput(output) {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML += output + "<br>"; // Append output to the output div
    }
}
