class AdvancedCalculator extends BasicCalculator {
    constructor() {
        super('advanced');
        this.previousOperandElement = document.getElementById('adv-previous');
        this.currentOperandElement = document.getElementById('adv-current');
        // Re-bind event listeners for the advanced keypad
        this.setupAdvancedEventListeners();
    }

    // Override setupEventListeners to target advanced keys
    setupAdvancedEventListeners() {
        const container = document.querySelector('.advanced-keys');
        if (!container) return;

        container.querySelectorAll('.btn-num').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
            });
        });

        container.querySelectorAll('.btn-op').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
            });
        });

        container.querySelector('.btn-equals').addEventListener('click', () => {
            this.compute();
        });

        container.querySelector('.btn-clear').addEventListener('click', () => {
            this.clear();
        });

        container.querySelector('.btn-delete').addEventListener('click', () => {
            this.delete();
        });

        // Scientific functions
        container.querySelectorAll('.btn-func').forEach(button => {
            button.addEventListener('click', () => {
                this.handleScientific(button.innerText);
            });
        });
    }

    handleScientific(func) {
        let current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        let result;
        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180); // Degrees
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(current);
                break;
            case 'ln':
                result = Math.log(current);
                break;
            case '√':
                if (current < 0) {
                    alert("Invalid Input");
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'x²':
                result = Math.pow(current, 2);
                break;
            case 'x^y':
                this.chooseOperation('^');
                return;
            case 'π':
                this.currentOperand = Math.PI;
                this.updateDisplay();
                return;
            case '(':
            case ')':
                // Parentheses logic is complex for this simple implementation
                // For now, we'll just ignore or implement basic if needed
                // A full expression parser would be better for ()
                alert("Parentheses not fully supported in this version");
                return;
            default:
                return;
        }

        this.currentOperand = result;
        this.updateDisplay();
        this.previousOperand = ''; // Reset previous after immediate function
    }

    // Override compute to handle power
    compute() {
        if (this.operation === '^') {
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            this.currentOperand = Math.pow(prev, current);
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        } else {
            super.compute();
        }
    }
}
