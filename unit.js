class UnitConverter {
    constructor() {
        this.categorySelect = document.getElementById('unit-category');
        this.fromValue = document.getElementById('unit-from-value');
        this.fromType = document.getElementById('unit-from-type');
        this.toValue = document.getElementById('unit-to-value');
        this.toType = document.getElementById('unit-to-type');

        this.units = {
            length: {
                meters: 1,
                kilometers: 1000,
                centimeters: 0.01,
                millimeters: 0.001,
                miles: 1609.34,
                yards: 0.9144,
                feet: 0.3048,
                inches: 0.0254
            },
            weight: {
                kilograms: 1,
                grams: 0.001,
                milligrams: 0.000001,
                pounds: 0.453592,
                ounces: 0.0283495
            },
            temperature: {
                celsius: 'C',
                fahrenheit: 'F',
                kelvin: 'K'
            },
            area: {
                squareMeters: 1,
                squareKilometers: 1000000,
                squareMiles: 2589988.11,
                squareYards: 0.836127,
                squareFeet: 0.092903,
                acres: 4046.86,
                hectares: 10000
            }
        };

        this.setupEventListeners();
        this.populateUnits();
    }

    setupEventListeners() {
        this.categorySelect.addEventListener('change', () => {
            this.populateUnits();
            this.convert();
        });

        this.fromValue.addEventListener('input', () => this.convert());
        this.fromType.addEventListener('change', () => this.convert());
        this.toType.addEventListener('change', () => this.convert());
    }

    populateUnits() {
        const category = this.categorySelect.value;
        const unitOptions = Object.keys(this.units[category]);

        this.fromType.innerHTML = '';
        this.toType.innerHTML = '';

        unitOptions.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.innerText = this.formatUnitName(unit);
            this.fromType.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = unit;
            option2.innerText = this.formatUnitName(unit);
            this.toType.appendChild(option2);
        });

        // Set default second option to be different if possible
        if (unitOptions.length > 1) {
            this.toType.selectedIndex = 1;
        }
    }

    formatUnitName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
    }

    convert() {
        const category = this.categorySelect.value;
        const fromUnit = this.fromType.value;
        const toUnit = this.toType.value;
        const value = parseFloat(this.fromValue.value);

        if (isNaN(value)) {
            this.toValue.value = '';
            return;
        }

        let result;

        if (category === 'temperature') {
            result = this.convertTemperature(value, fromUnit, toUnit);
        } else {
            // Standard conversion using base unit (e.g., meters, kg)
            const baseValue = value * this.units[category][fromUnit];
            result = baseValue / this.units[category][toUnit];
        }

        this.toValue.value = Number.isInteger(result) ? result : result.toFixed(4).replace(/\.?0+$/, '');
    }

    convertTemperature(value, from, to) {
        if (from === to) return value;

        let celsius;
        // Convert to Celsius first
        if (from === 'celsius') celsius = value;
        else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9;
        else if (from === 'kelvin') celsius = value - 273.15;

        // Convert from Celsius to target
        if (to === 'celsius') return celsius;
        else if (to === 'fahrenheit') return (celsius * 9 / 5) + 32;
        else if (to === 'kelvin') return celsius + 273.15;
    }
}
