
class clsDatepicker {
    constructor (options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        this.drawCalendar = this.drawCalendar.bind(this);
        this.startDate = this.moment.startOf('month').format("MM/DD/YYYY hh:mm:ss a");
        this.endDate = this.moment.endOf('month').format('MM/DD/YYYY hh:mm:ss a');
        this.drawCalendar();

        console.log(this.startDate, this.endDate);
        // console.log(this.moment);
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
            let dayCell = document.createElement('div');
            dayCell.classList.add(parseInt(day)+1);
            dayCell.innerHTML = parseInt(day)+1;
            dayCell.value = day+1;
            dayCell.addEventListener('click', function () {
                console.log("you clicked " + this.value);
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                }
            });
            calendar.appendChild(dayCell);
        });
        let startDateElement = document.createElement('div');
        startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
        startDateElement.innerHTML = "Start Date: " + this.startDate;
        startDateElement.classList.add('startDateElement')
        calendar.appendChild(startDateElement);
        let endDateElement = document.createElement('div');
        endDateElement.setAttribute('style', 'grid-column-start: 4; grid-column-end: 8;')
        endDateElement.innerHTML = "End Date: " + this.endDate;
        endDateElement.classList.add('endDateElement')
        calendar.appendChild(endDateElement);
        this.containerElement.appendChild(calendar);

    }

}
