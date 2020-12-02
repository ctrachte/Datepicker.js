
class clsDatepicker {
    constructor(options) {
        // Validation
        if (!options || typeof options === undefined) {
            throw "Error: Datepicker.js options object must be defined, with at least options.containerElement.";
        }
        if (options.containerElement === undefined || !options.containerElement) {
            throw "Error: you must assign a container element in the Datepicker.js options object!";
        }

        // options
        this.options = options;
        this.containerElement = options.containerElement; // HTML element that will hold the datepicker
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true); // default date for calendar to initialize on
        this.timePicker = this.options.timePicker ? this.options.timePicker : true; // include time picker inputs
        this.presetMenu = this.options.presetMenu ? this.options.presetMenu : true; // include presets such as "this week, next week, etc."
        this.autoClose = this.options.autoClose ? this.options.autoClose : false; // whether or not the datepicker autocloses when selection is complete
        this.singleDate = this.options.singleDate ? this.options.singleDate : false; // whether the datepicker allows single date choice, or date range
        // methods
        this.drawCalendar = this.drawCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.lastMonth = this.lastMonth.bind(this);
        this.dates = [];
        this.drawCalendar();
        // test logs
        // console.log(this.startOfMonth, this.endOfMonth);
        // console.log(this.moment.daysInMonth());
    }

    drawCalendar() {
        // we need to first set the first and last of the month in the state
        this.firstDayOfMonth = this.moment.startOf('month').format("dddd");
        this.lastDayOfMonth = this.moment.startOf('month').format("dddd");
        // then set our callback methods so they have the proper context
        let callbackNextMonth = this.nextMonth;
        let callbackLastMonth = this.lastMonth;
        let callbackSetDate = this.setDate;
        // Calendar UI
        let calendar = document.createElement('div');
        // add day headers (mon, tues, wed, etc.)
        let monthHeader = document.createElement('div');
        monthHeader.setAttribute('style', 'grid-column-start: 2; grid-column-end: 7;')
        let monthText = document.createTextNode(this.moment._locale._months[this.moment.month()] + " - " + this.moment.format("YYYY"));
        // left/right arrows for adjusting month
        let leftArrow = document.createElement('div');
        leftArrow.classList.add("leftArrow");
        leftArrow.innerHTML = "&#8672;";
        leftArrow.addEventListener('click', callbackLastMonth.bind(this));
        let rightArrow = document.createElement('div');
        rightArrow.classList.add("rightArrow");
        rightArrow.innerHTML = "&#8674;"
        rightArrow.addEventListener('click', callbackNextMonth.bind(this));
        // month text eg. "November - 2020"
        monthHeader.appendChild(monthText);
        monthHeader.classList.add('monthHeader')
        calendar.classList.add('grid-container');
        // add all the UI elements to the calendar
        calendar.appendChild(leftArrow);
        calendar.appendChild(monthHeader);
        calendar.appendChild(rightArrow);
        //add day header elements: "mon, tues, wed etc."
        this.moment._locale._weekdaysShort.forEach(function (day) {
            let dayHeader = document.createElement('div');
            dayHeader.classList.add(day);
            dayHeader.classList.add('dayHeader');
            dayHeader.innerHTML = " " + day + " ";
            calendar.appendChild(dayHeader);
        });
        // add day elements (day cells) to calendar
        let daysInMonth = Array.from(Array(this.moment.daysInMonth()).keys());
        daysInMonth.forEach(function (day) {
            let dayCell = document.createElement('div');
            dayCell.classList.add("day-" + (parseInt(day) + 1));
            dayCell.classList.add("day");
            dayCell.innerHTML = parseInt(day) + 1;
            let dateString = moment(this.moment.format("MM") + "/" + parseInt(day + 1) + "/" + this.moment.format("YYYY")).format("MM/DD/YYYY hh:mm:ss a");
            dayCell.value = dateString;
            dayCell.addEventListener('click', callbackSetDate.bind(this, dayCell));
            calendar.appendChild(dayCell);
        }.bind(this));
        // set the first of the month to be positioned on calendar based on day of week
        let firstDayElement = calendar.querySelector('.day-1');
        let monthStartPos = 'grid-column-start: ' + (this.moment._locale._weekdays.indexOf(this.firstDayOfMonth) + 1) + ';';
        // console.log(monthStartPos, firstDayElement);
        firstDayElement.setAttribute('style', monthStartPos);
        // Footer elements, contains start/end dates selected
        let startDateElement = document.createElement('div');

        if (!this.singleDate) {
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
            startDateElement.classList.add('startDateElement')
            calendar.appendChild(startDateElement);
            let endDateElement = document.createElement('div');
            endDateElement.classList.add('endDateElement');
            endDateElement.setAttribute('style', 'grid-column-start: 4; grid-column-end: 8;');
            calendar.appendChild(endDateElement);
            // set calendar start/end dates in the UI
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
        } else {
            if (this.dates[0]) {
                startDateElement.innerHTML = "Date: " + this.dates[0];
            } else {
                startDateElement.innerHTML = "Date: ";
            }
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 8;')
            startDateElement.classList.add('startDateElement')
            calendar.appendChild(startDateElement);
        }
        // Finally, add calendar element to the containerElement assigned during initialization
        this.containerElement.appendChild(calendar);
    }
    // helper method to set start/end date on each calendar day click
    setDate(dayCell) {
        // reset or set the UI selected cell styling
        let days = this.containerElement.querySelectorAll('.day');
        if (this.dates.length === 2 || this.singleDate) {
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
        // set the start/end date in both the UI and the class's state
        if (!this.singleDate) {
            if (this.dates.length === 2 || !this.dates.length) {
                this.dates = [];
                this.dates[0] = dayCell.value;
                this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + dayCell.value;
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: ";
            } else {
                if (moment(this.dates[0]) > moment(dayCell.value)) {
                    this.dates[1] = this.dates[0];
                    this.dates[0] = dayCell.value;
                    this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
                    this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + this.dates[1];
                } else {
                    this.dates[1] = dayCell.value;
                    this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + dayCell.value;
                }
            }
        } else {
            this.dates = [];
            this.dates[0] = dayCell.value;
            this.containerElement.querySelector('.startDateElement').innerHTML = "Date: " + this.dates[0];
        }
        // adds calendar day highlighted styling
        if (this.dates.length === 2) {
            days.forEach(function (day) {
                let clickedDate = moment(day.value);
                let firstDate = moment(this.dates[0]);
                let secondDate = moment(this.dates[1]); 
                if (clickedDate > firstDate && clickedDate < secondDate) {
                    day.classList.add("highlighted");
                }
            }.bind(this));
        }
    }
    // advances the calendar by one month
    nextMonth() {
        this.containerElement.innerHTML = "";
        this.moment.add(1, 'months');
        this.drawCalendar();
    }
    // moves the calendar back one month
    lastMonth() {
        this.containerElement.innerHTML = "";
        this.moment.add(-1, 'months');
        this.drawCalendar();
    }
}
