
class clsDatepicker {
    constructor (options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        this.drawCalendar = this.drawCalendar.bind(this);
        this.drawCalendar();
        console.log(this.moment);
    }

    drawCalendar () {
        let calendar = document.createElement('div');
        let monthHeader = document.createElement('div');
        monthHeader.setAttribute('style', 'grid-column-start: 1; grid-column-end: 8;')
        monthHeader.innerHTML = this.moment._locale._months[this.moment.month()];
        monthHeader.classList.add('monthHeader')
        calendar.classList.add('grid-container');
        calendar.appendChild(monthHeader);
        this.moment._locale._weekdaysShort.forEach(function (day) {
            let dayHeader = document.createElement('div');
            dayHeader.classList.add(day);
            dayHeader.classList.add('dayHeader');
            dayHeader.innerHTML = " " + day + " ";
            calendar.appendChild(dayHeader);
        });

        let daysInMonth = Array.from(Array(this.moment.daysInMonth()).keys())
        daysInMonth.forEach(function (day) {
            let dayHeader = document.createElement('div');
            dayHeader.classList.add(parseInt(day)+1);
            dayHeader.innerHTML = parseInt(day)+1;
            calendar.appendChild(dayHeader);
        });

        this.containerElement.appendChild(calendar);

    }

}
