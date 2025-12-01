class CurrencyConverter {
    constructor() {
        this.amountInput = document.getElementById('currency-amount');
        this.fromSelect = document.getElementById('currency-from');
        this.toSelect = document.getElementById('currency-to');
        this.resultDisplay = document.getElementById('currency-result');
        this.statusDisplay = document.getElementById('currency-status');
        this.lastUpdatedDisplay = document.getElementById('currency-last-updated');

        this.apiBase = 'https://api.exchangerate-api.com/v4/latest/USD';
        this.rates = {};

        this.setupEventListeners();
        this.fetchRates();
    }

    setupEventListeners() {
        this.amountInput.addEventListener('input', () => this.convert());
        this.fromSelect.addEventListener('change', () => this.convert());
        this.toSelect.addEventListener('change', () => this.convert());
    }

    async fetchRates() {
        try {
            this.statusDisplay.innerText = 'Fetching rates...';
            const response = await fetch(this.apiBase);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            this.rates = data.rates;
            this.populateSelects(Object.keys(this.rates));

            this.statusDisplay.innerText = '';
            this.lastUpdatedDisplay.innerText = `Rates updated: ${new Date(data.time_last_updated * 1000).toLocaleDateString()}`;

            // Set defaults
            this.fromSelect.value = 'USD';
            this.toSelect.value = 'EUR';

            this.convert();
        } catch (error) {
            console.error('Error fetching rates:', error);
            this.statusDisplay.innerText = 'Error loading rates. Using offline backup.';
            this.useBackupRates();
        }
    }

    useBackupRates() {
        // Fallback rates if API fails
        this.rates = {
            USD: 1,
            EUR: 0.85,
            GBP: 0.75,
            JPY: 110.0,
            INR: 74.5,
            AUD: 1.35,
            CAD: 1.25,
            CHF: 0.92,
            CNY: 6.45,
            NZD: 1.42
        };
        this.populateSelects(Object.keys(this.rates));
        this.convert();
    }

    populateSelects(currencies) {
        const createOptions = () => currencies.map(curr => `<option value="${curr}">${curr}</option>`).join('');
        this.fromSelect.innerHTML = createOptions();
        this.toSelect.innerHTML = createOptions();
    }

    convert() {
        const amount = parseFloat(this.amountInput.value);
        const from = this.fromSelect.value;
        const to = this.toSelect.value;

        if (isNaN(amount) || !this.rates[from] || !this.rates[to]) {
            this.resultDisplay.innerText = '---';
            return;
        }

        // Convert to USD first (base), then to target
        // Since base is USD in our API:
        // Rate(From -> USD) = 1 / Rate(USD -> From)
        // Rate(USD -> To) = Rate(USD -> To)
        // Result = Amount * (1 / Rate(USD -> From)) * Rate(USD -> To)

        const rateFrom = this.rates[from];
        const rateTo = this.rates[to];

        const result = (amount / rateFrom) * rateTo;

        this.resultDisplay.innerText = `${result.toFixed(2)} ${to}`;
    }
}
