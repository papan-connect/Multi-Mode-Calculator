class BasicCalculator {
    constructor(containerId = 'basic') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.previousOperandElement = document.getElementById('basic-previous');
        this.currentOperandElement = document.getElementById('basic-current');
        this.clear();
        this.setupEventListeners();
        this.setupKeyboardListeners();
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.container || !this.container.classList.contains('active')) return;

            if (e.key >= 0 && e.key <= 9) this.appendNumber(e.key);
            if (e.key === '.') this.appendNumber('.');
            if (e.key === '=' || e.key === 'Enter') {
                e.preventDefault();
                this.compute();
            }
            if (e.key === 'Backspace') this.delete();
            if (e.key === 'Escape') this.clear();
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
                this.chooseOperation(e.key);
            }
        });
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (operation === '%' && this.previousOperand !== '') {
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            
            // Logic for "100 * 18 %" -> Calculates 18% of 100
            this.currentOperand = ((prev * current) / 100).toString();
            
            this.previousOperand = '';
            this.operation = undefined;
            this.updateDisplay();
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Denominator should not be zero");
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev * current)/100;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    setupEventListeners() {
        const container = document.querySelector('.basic-keys');
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
    }
}
