
class clsDatepicker {
    constructor (options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        this.drawCalendar = this.drawCalendar.bind(this);
        this.firstDayOfMonth = this.moment.startOf('month').format("dddd");
        this.lastDayOfMonth = this.moment.startOf('month').format("dddd");
        this.drawCalendar();
        // console.log(this.startOfMonth, this.endOfMonth);
        // console.log(this.moment);
    }

    drawCalendar () {
        let calendar = document.createElement('div');
        // add day headers (mon, tues, wed, etc.)
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
        // add days to calendar
        let daysInMonth = Array.from(Array(this.moment.daysInMonth()).keys())
        daysInMonth.forEach(function (day) {
            let dayCell = document.createElement('div');
            dayCell.classList.add("day-" + (parseInt(day)+1));
            dayCell.classList.add("day");
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
        // set the first of the month to be askew based on day
        let firstDayElement = calendar.querySelector('.day-1');
        let monthStartPos = 'grid-column-start: ' +  (this.moment._locale._weekdays.indexOf(this.firstDayOfMonth)+1) + ';';
        // console.log(monthStartPos, firstDayElement);
        firstDayElement.setAttribute('style', monthStartPos);
        //footer
        let startDateElement = document.createElement('div');
        startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
        startDateElement.innerHTML = "Start Date: ";
        startDateElement.classList.add('startDateElement')
        calendar.appendChild(startDateElement);
        let endDateElement = document.createElement('div');
        endDateElement.setAttribute('style', 'grid-column-start: 4; grid-column-end: 8;')
        endDateElement.innerHTML = "End Date: ";
        endDateElement.classList.add('endDateElement')
        calendar.appendChild(endDateElement);
        this.containerElement.appendChild(calendar);

    }

}
