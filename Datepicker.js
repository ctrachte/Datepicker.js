
class clsDatepicker {
    constructor (options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        this.drawCalendar = this.drawCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.firstDayOfMonth = this.moment.startOf('month').format("dddd");
        this.lastDayOfMonth = this.moment.startOf('month').format("dddd");
        this.dates = [];
        this.drawCalendar();
        // console.log(this.startOfMonth, this.endOfMonth);
        console.log(this.moment.daysInMonth());
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
        let callbackSetDate = this.setDate;
        let daysInMonth = Array.from(Array(this.moment.daysInMonth()).keys())
        daysInMonth.forEach(function (day) {
            let dayCell = document.createElement('div');
            dayCell.classList.add("day-" + (parseInt(day)+1));
            dayCell.classList.add("day");
            dayCell.innerHTML = parseInt(day)+1;
            dayCell.value = day+1;
            dayCell.addEventListener('click', callbackSetDate.bind(this, dayCell));
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

    setDate(dayCell) {
        // reset or set the UI selected cell styling
        let days = this.containerElement.querySelectorAll('.day');
        if (this.dates.length === 2) {
            days.forEach(function(day) {
                day.classList.remove('active');
            });
        }
        if (dayCell.classList.contains('active')) {
            dayCell.classList.remove('active');
        } else {
            dayCell.classList.add('active');
        }
        // set the start/end date in both the UI and the state
        let dateString = moment(this.moment.format("MM") + "/" + dayCell.value + "/" + this.moment.format("YYYY")).format("MM/DD/YYYY hh:mm:ss a");
        console.log(dateString);
        if (this.dates.length === 2 || !this.dates.length) {
            this.dates = [];
            this.dates[0] = dateString;
            this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + dateString;
            this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: ";
        } else {
            if (this.dates[0] > dateString) {
                this.dates[1] = this.dates[0];
                this.dates[0] = dateString;
                this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: "  + this.dates[1];
            } else {
                this.dates[1] = dateString;
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + dateString;
            }
        }
    }

}
