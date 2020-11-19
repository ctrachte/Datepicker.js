
class clsDatepicker {
    constructor(options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        this.drawCalendar = this.drawCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.lastMonth = this.lastMonth.bind(this);
        this.dates = [];
        this.drawCalendar();
        // console.log(this.startOfMonth, this.endOfMonth);
        console.log(this.moment.daysInMonth());
    }

    drawCalendar() {
        this.firstDayOfMonth = this.moment.startOf('month').format("dddd");
        this.lastDayOfMonth = this.moment.startOf('month').format("dddd");
        let callbackNextMonth = this.nextMonth;
        let callbackLastMonth = this.lastMonth;
        let callbackSetDate = this.setDate;
        let calendar = document.createElement('div');
        // add day headers (mon, tues, wed, etc.)
        let monthHeader = document.createElement('div');
        monthHeader.setAttribute('style', 'grid-column-start: 2; grid-column-end: 7;')
        let monthText = document.createTextNode(this.moment._locale._months[this.moment.month()] + " - " + this.moment.format("YYYY"));
        let leftArrow = document.createElement('div');
        leftArrow.classList.add("leftArrow");
        leftArrow.innerHTML = "&#8672;";
        leftArrow.addEventListener('click', callbackLastMonth.bind(this));
        let rightArrow = document.createElement('div');
        rightArrow.classList.add("rightArrow");
        rightArrow.innerHTML = "&#8674;"
        rightArrow.addEventListener('click', callbackNextMonth.bind(this));
        monthHeader.appendChild(monthText);
        monthHeader.classList.add('monthHeader')
        calendar.classList.add('grid-container');
        calendar.appendChild(leftArrow);
        calendar.appendChild(monthHeader);
        calendar.appendChild(rightArrow);
        this.moment._locale._weekdaysShort.forEach(function (day) {
            let dayHeader = document.createElement('div');
            dayHeader.classList.add(day);
            dayHeader.classList.add('dayHeader');
            dayHeader.innerHTML = " " + day + " ";
            calendar.appendChild(dayHeader);
        });
        // add days to calendar
        let daysInMonth = Array.from(Array(this.moment.daysInMonth()).keys());
        daysInMonth.forEach(function (day) {
            let dayCell = document.createElement('div');
            dayCell.classList.add("day-" + (parseInt(day) + 1));
            dayCell.classList.add("day");
            dayCell.innerHTML = parseInt(day) + 1;
            let dateString = moment(this.moment.format("MM") + "/" + parseInt(day+1) + "/" + this.moment.format("YYYY")).format("MM/DD/YYYY hh:mm:ss a");
            dayCell.value = dateString;
            dayCell.addEventListener('click', callbackSetDate.bind(this, dayCell));
            calendar.appendChild(dayCell);
        }.bind(this));
        // set the first of the month to be askew based on day
        let firstDayElement = calendar.querySelector('.day-1');
        let monthStartPos = 'grid-column-start: ' + (this.moment._locale._weekdays.indexOf(this.firstDayOfMonth) + 1) + ';';
        console.log(monthStartPos, firstDayElement);
        firstDayElement.setAttribute('style', monthStartPos);
        //footer
        let startDateElement = document.createElement('div');
        startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
        startDateElement.classList.add('startDateElement')
        calendar.appendChild(startDateElement);
        let endDateElement = document.createElement('div');
        endDateElement.classList.add('endDateElement');
        endDateElement.setAttribute('style', 'grid-column-start: 4; grid-column-end: 8;');
        calendar.appendChild(endDateElement);
        if (this.dates[0]) {
            startDateElement.innerHTML = "Start Date: " + this.dates[0];
        } else {
            startDateElement.innerHTML = "Start Date: ";
        }
        if (this.dates[1]) {
            endDateElement.innerHTML = "Start Date: " + this.dates[1];
        } else {
            endDateElement.innerHTML = "End Date: ";
        }
        this.containerElement.appendChild(calendar);
    }

    setDate(dayCell) {
        // reset or set the UI selected cell styling
        let days = this.containerElement.querySelectorAll('.day');
        if (this.dates.length === 2) {
            days.forEach(function (day) {
                day.classList.remove('active');
                day.classList.remove("highlighted");
            });
        }
        if (dayCell.classList.contains('active')) {
            dayCell.classList.remove('active');
        } else {
            dayCell.classList.add('active');
        }
        // set the start/end date in both the UI and the state
        if (this.dates.length === 2 || !this.dates.length) {
            this.dates = [];
            this.dates[0] = dayCell.value;
            this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + dayCell.value;
            this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: ";
        } else {
            if (this.dates[0] > dayCell.value) {
                this.dates[1] = this.dates[0];
                this.dates[0] = dayCell.value;
                this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + this.dates[1];
            } else {
                this.dates[1] = dayCell.value;
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + dayCell.value;
            }
        }
        // adds calendar day highlighted styling
        if (this.dates.length === 2) {
            days.forEach(function (day) {
                if (day.value > this.dates[0] && day.value < this.dates[1]) {
                    day.classList.add("highlighted");
                }
            }.bind(this));
        }
    }
    nextMonth() {
        this.containerElement.innerHTML = "";
        this.moment.add(1, 'months');
        this.drawCalendar();
    }
    lastMonth(){
        this.containerElement.innerHTML = "";
        this.moment.add(-1, 'months');
        this.drawCalendar();
    }
}
