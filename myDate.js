class MyDate {
    constructor() {
        this.today = new Date();
    }

    get longDate() {
        return this.today.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }
}

module.exports = new MyDate();