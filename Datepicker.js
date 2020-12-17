
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
        /**
         * @type {object} options REQUIRED -  holds references to element objects that contain values that make up time
         * @property {HTML} options.containerElement REQUIRED - HTML element to instantiate the datepicker in
         * @property {Boolean} this.options.timePicker Optional - include time picker inputs - Defaults to false
         * @property {Boolean} this.options.presetMenu Optional - include presets such as "this week, next week, etc. - Defaults to false
         * @property {Boolean} this.options.autoClose Optional - whether or not the datepicker autocloses when selection is complete - Defaults to false
         * @property {Boolean} this.options.singleDate Optional - whether the datepicker allows single date choice, or date range - Defaults to false
         */
        this.options = options;
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "MM/DD/YYYY hh:mm A", true);
        this.timePicker = this.options.timePicker ? this.options.timePicker : true;
        this.presetMenu = this.options.presetMenu ? this.options.presetMenu : true;
        this.autoClose = this.options.autoClose ? this.options.autoClose : false;
        this.singleDate = this.options.singleDate ? this.options.singleDate : false;
        // methods
        this.drawCalendar = this.drawCalendar.bind(this);
        this.setDate = this.setDate.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.lastMonth = this.lastMonth.bind(this);
        this.highlightDates = this.highlightDates.bind(this);
        this.dates = [];
        /**
         * @type {object} timeElements holds references to element objects that contain values that make up time
         * @property {string} this.timeElements.startHourValueEl
         * @property {string} this.timeElements.startMinuteValueEl
         * @property {string} this.timeElements.startampm
         * @property {string} this.timeElements.endHourValueEl
         * @property {string} this.timeElements.endMinuteValueEl
         * @property {string} this.timeElements.endampm
         */
        this.timeElements = {};
        this.startHour = "09";
        this.startMinute = "00";
        // this.startAmPm = "AM";
        this.endHour = "10";
        this.endMinute = "00";
        // this.endAmPm = "AM";
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
        monthHeader.setAttribute('style', 'grid-column-start: 2; grid-column-end: 7; background-color: #222831;');
        let monthText = document.createTextNode(this.moment._locale._months[this.moment.month()] + " - " + this.moment.format("YYYY"));
        // left/right arrows for adjusting month
        let leftArrow = document.createElement('div');
        leftArrow.classList.add("leftArrow");
        leftArrow.setAttribute('style', 'background-color:transparent');
        leftArrow.setAttribute('aria-label', 'Previous Month Button');
        leftArrow.setAttribute('role', 'navigation');
        leftArrow.innerHTML = "&#8672;";
        leftArrow.addEventListener('click', callbackLastMonth.bind(this));
        let rightArrow = document.createElement('div');
        rightArrow.classList.add("rightArrow");
        rightArrow.setAttribute('style', 'background-color:transparent');
        rightArrow.setAttribute('aria-label', 'Next Month Button');
        rightArrow.setAttribute('role', 'navigation');
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
            // adding aria-label for each day
            switch (day) {
                case 'Sun':
                    dayHeader.setAttribute('aria-label', 'Sunday');
                    break;
                case 'Mon':
                    dayHeader.setAttribute('aria-label', 'Monday');
                    break;
                case 'Tue':
                    dayHeader.setAttribute('aria-label', 'Tuesday');
                    break;
                case 'Wed':
                    dayHeader.setAttribute('aria-label', 'Wednesday');
                    break;
                case 'Thu':
                    dayHeader.setAttribute('aria-label', 'Thursday');
                    break;
                case 'Fri':
                    dayHeader.setAttribute('aria-label', 'Friday');
                    break;
                case 'Sat':
                    dayHeader.setAttribute('aria-label', 'Saturday');
                    break;
            }
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
            let dateString = moment(this.moment.format("MM") + "/" + parseInt(day + 1) + "/" + this.moment.format("YYYY")).format("MM/DD/YYYY hh:mm A");
            dayCell.setAttribute('role', 'button');
            dayCell.setAttribute('aria-label', parseInt(day) + 1 + '');
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
        // start/end date elements based on singleDate options
        if (!this.singleDate) {
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
            startDateElement.classList.add('startDateElement')
            calendar.appendChild(startDateElement);
            let endDateElement = document.createElement('div');
            endDateElement.classList.add('endDateElement');
            endDateElement.setAttribute('style', 'grid-column-start: 4; grid-column-end: 8;');
            calendar.appendChild(endDateElement);
            // set calendar start/end dates in the UI
            startDateElement.innerHTML = "Start Date: ";
            endDateElement.innerHTML = "End Date: ";
        } else {
            startDateElement.innerHTML = "Date: ";
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 8;')
            startDateElement.classList.add('startDateElement')
            calendar.appendChild(startDateElement);
        }
        // timepicker init based on options
        if (this.timePicker) {

            let startTimeElement = document.createElement('div');
            startTimeElement.classList.add("startTimeElement");
            startTimeElement.style.gridColumnStart = 1;
            startTimeElement.style.gridColumnEnd = 4;

            let startHour = document.createElement("div");
            startHour.classList.add("hour");
            startHour.innerHTML = "<input type='number' value='" + this.startHour + "' />";
            startHour.style.gridColumn = "1 / span 2";

            let startHourValueEl = startHour.querySelector("input");
            startHourValueEl.setAttribute("ReadOnly", "true");
            startHourValueEl.classList.add("ReadOnly");
            this.timeElements.startHourValueEl = startHourValueEl;

            let startHourUpDown = document.createElement("span");
            startHourUpDown.classList.add("TimeUpDown");
            startHourUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";

            // Up Hour
            startHourUpDown.querySelectorAll("div")[0].onclick = function () {
                let newVal = parseInt(startHourValueEl.value) + 1;
                if (newVal > 23) {
                    newVal = 1;
                } else if (newVal < 1) {
                    newVal = 23;
                }
                startHourValueEl.value = newVal;
                this.setTime();
            }.bind(this);
            // Down Hour
            startHourUpDown.querySelectorAll("div")[1].onclick = function () {
                let newVal = parseInt(startHourValueEl.value) - 1;
                if (newVal > 23) {
                    newVal = 1;
                } else if (newVal < 1) {
                    newVal = 23;
                }
                startHourValueEl.value = newVal;
                this.setTime();
            }.bind(this);

            startHour.appendChild(startHourUpDown);

            startTimeElement.appendChild(startHour);

            let timeColon = document.createElement("div");
            timeColon.innerHTML = ":";
            timeColon.classList.add("timeColon");
            timeColon.style.gridColumn = "3 / span 1";
            startTimeElement.appendChild(timeColon);

            let startMinute = document.createElement("div");
            startMinute.classList.add("minute");
            startMinute.innerHTML = "<input type='number' value='" + this.startMinute + "' />";
            startMinute.style.gridColumn = "4 / span 2";

            let startMinuteValueEl = startMinute.querySelector("input");
            startMinuteValueEl.setAttribute("ReadOnly", "true");
            startMinuteValueEl.classList.add("ReadOnly");
            this.timeElements.startMinuteValueEl = startMinuteValueEl;

            let startMinuteUpDown = document.createElement("span");
            startMinuteUpDown.classList.add("TimeUpDown");
            startMinuteUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";

            // Up Minute
            startMinuteUpDown.querySelectorAll("div")[0].onclick = function () {
                let newVal = parseInt(startMinuteValueEl.value) + 1;
                if (newVal > 59) {
                    newVal = 0;
                } else if (newVal < 0) {
                    newVal = 59;
                }
                startMinuteValueEl.value = newVal;
                if (startMinuteValueEl.value.length < 2) {
                    startMinuteValueEl.value = "0" + startMinuteValueEl.value;
                }
                this.setTime();
            }.bind(this);
            // Down Minute
            startMinuteUpDown.querySelectorAll("div")[1].onclick = function () {
                let newVal = parseInt(startMinuteValueEl.value) - 1;
                if (newVal > 59) {
                    newVal = 0;
                } else if (newVal < 0) {
                    newVal = 59;
                }
                startMinuteValueEl.value = newVal;
                if (startMinuteValueEl.value.length < 2) {
                    startMinuteValueEl.value = "0" + startMinuteValueEl.value;
                }
                this.setTime();
            }.bind(this);

            startMinute.appendChild(startMinuteUpDown);

            startTimeElement.appendChild(startMinute);

            // let startampm = document.createElement("div");
            // startampm.classList.add("ampm");
            // startampm.innerHTML = "";
            // startampm.style.gridColumn = "6 / span 1";
            // this.timeElements.startampm = startampm;

            // let startam = document.createElement("div");
            // startam.classList.add("am");
            // startam.innerHTML = "AM";

            // startam.onclick = function () {
            //     this.startAmPm = "AM";
            //     startam.setAttribute("SELECTED", "true");
            //     startpm.removeAttribute("SELECTED");
            //     this.setTime();
            // }.bind(this);
            // startampm.appendChild(startam);

            // let startpm = document.createElement("div");
            // startpm.classList.add("pm");
            // startpm.innerHTML = "PM";

            // startpm.onclick = function () {
            //     this.startAmPm = "PM";
            //     startpm.setAttribute("SELECTED", "true");
            //     startam.removeAttribute("SELECTED");
            //     this.setTime();
            // }.bind(this);
            // if (this.startAmPm === "PM") {
            //     startpm.setAttribute("SELECTED", "true");
            //     startam.removeAttribute("SELECTED");
            // } else {
            //     startam.setAttribute("SELECTED", "true");
            //     startpm.removeAttribute("SELECTED");
            // }
            // startampm.appendChild(startpm);
            // startTimeElement.appendChild(startampm);
            calendar.appendChild(startTimeElement);

            if (!this.singleDate) {
                let endTimeElement = document.createElement('div');
                endTimeElement.classList.add("endTimeElement");
                endTimeElement.style.gridColumnStart = 4;
                endTimeElement.style.gridColumnEnd = 8;

                let endHour = document.createElement("div");
                endHour.classList.add("hour");
                endHour.innerHTML = "<input type='number' value='" + this.endHour + "' />";
                endHour.style.gridColumn = "1 / span 2";

                let endHourValueEl = endHour.querySelector("input");
                endHourValueEl.setAttribute("ReadOnly", "true");
                endHourValueEl.classList.add("ReadOnly");
                this.timeElements.endHourValueEl = endHourValueEl;

                let endHourUpDown = document.createElement("span");
                endHourUpDown.classList.add("TimeUpDown");
                endHourUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";

                // Up Hour
                endHourUpDown.querySelectorAll("div")[0].onclick = function () {
                    let newVal = parseInt(endHourValueEl.value) + 1;
                    if (newVal > 23) {
                        newVal = 1;
                    } else if (newVal < 1) {
                        newVal = 23;
                    }
                    endHourValueEl.value = newVal;
                    this.setTime();
                }.bind(this);
                // Down hour
                endHourUpDown.querySelectorAll("div")[1].onclick = function () {
                    let newVal = parseInt(endHourValueEl.value) - 1;
                    if (newVal > 23) {
                        newVal = 1;
                    } else if (newVal < 1) {
                        newVal = 23;
                    }
                    endHourValueEl.value = newVal;
                    this.setTime();
                }.bind(this);

                endHour.appendChild(endHourUpDown);
                endTimeElement.appendChild(endHour);

                let timeColon = document.createElement("div");
                timeColon.innerHTML = ":";
                timeColon.classList.add("timeColon");
                timeColon.style.gridColumn = "3 / span 1";
                endTimeElement.appendChild(timeColon);

                let endMinute = document.createElement("div");
                endMinute.classList.add("minute");
                endMinute.innerHTML = "<input type='number' value='" + this.endMinute + "' />";
                endMinute.style.gridColumn = "4 / span 2";

                let endMinuteValueEl = endMinute.querySelector("input");
                endMinuteValueEl.setAttribute("ReadOnly", "true");
                endMinuteValueEl.classList.add("ReadOnly");
                this.timeElements.endMinuteValueEl = endMinuteValueEl;

                let endMinuteUpDown = document.createElement("span");
                endMinuteUpDown.classList.add("TimeUpDown");
                endMinuteUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";

                // Up Minute
                endMinuteUpDown.querySelectorAll("div")[0].onclick = function () {
                    let newVal = parseInt(endMinuteValueEl.value) + 1;
                    if (newVal > 59) {
                        newVal = 0;
                    } else if (newVal < 0) {
                        newVal = 59;
                    }
                    endMinuteValueEl.value = newVal;
                    if (endMinuteValueEl.value.length < 2) {
                        endMinuteValueEl.value = "0" + endMinuteValueEl.value;
                    }
                    this.setTime();
                }.bind(this);
                // Down Minute
                endMinuteUpDown.querySelectorAll("div")[1].onclick = function () {
                    let newVal = parseInt(endMinuteValueEl.value) - 1;
                    if (newVal > 59) {
                        newVal = 0;
                    } else if (newVal < 0) {
                        newVal = 59;
                    }
                    endMinuteValueEl.value = newVal;
                    if (endMinuteValueEl.value.length < 2) {
                        endMinuteValueEl.value = "0" + endMinuteValueEl.value;
                    }
                    this.setTime();
                }.bind(this);
                endMinute.appendChild(endMinuteUpDown);
                endTimeElement.appendChild(endMinute);

                // let endampm = document.createElement("div");
                // endampm.classList.add("ampm");
                // endampm.innerHTML = "";
                // endampm.style.gridColumn = "6 / span 1";
                // this.timeElements.endampm = endampm;

                // let endam = document.createElement("div");
                // endam.classList.add("am");
                // endam.innerHTML = "AM";
                // endam.onclick = function () {
                //     this.endAmPm = "AM";
                //     endam.setAttribute("SELECTED", "true");
                //     endpm.removeAttribute("SELECTED");
                //     this.setTime();
                // }.bind(this);
                // endampm.appendChild(endam);

                // let endpm = document.createElement("div");
                // endpm.classList.add("pm");
                // endpm.innerHTML = "PM";
                // endpm.onclick = function () {
                //     this.endAmPm = "PM";
                //     endpm.setAttribute("SELECTED", "true");
                //     endam.removeAttribute("SELECTED");
                //     this.setTime();
                // }.bind(this);
                // if (this.endAmPm === "PM") {
                //     endpm.setAttribute("SELECTED", "true");
                //     endam.removeAttribute("SELECTED");
                // } else {
                //     endam.setAttribute("SELECTED", "true");
                //     endpm.removeAttribute("SELECTED");
                // }
                // endampm.appendChild(endpm);
                // endTimeElement.appendChild(endampm);

                calendar.appendChild(endTimeElement);
            }
        }
        // Finally, add calendar element to the containerElement assigned during initialization
        this.containerElement.appendChild(calendar);
    }
    // setTime function - a helper method to set start/end time. This function is a void.
    setTime() {
        this.startHour = this.timeElements.startHourValueEl.value;
        this.startMinute = this.timeElements.startMinuteValueEl.value;
        this.endHour = this.timeElements.endHourValueEl.value;
        this.endMinute = this.timeElements.endMinuteValueEl.value;
        let endDate = this.dates[1];
        let startDate = this.dates[0];
        this.dates = [];
        if (startDate) {
            this.dates[0] = moment(startDate).set({ h: this.startHour, m: this.startMinute }).format("MM/DD/YYYY hh:mm A");
            this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
        }
        if (endDate && !this.singleDate) {
            this.dates[1] = moment(endDate).set({ h: this.endHour, m: this.endMinute }).format("MM/DD/YYYY hh:mm A");
            this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + this.dates[1];
        }
    }
    // helper method to set start/end date on each calendar day click
    setDate(dayCell) {
        this.startHour = this.timeElements.startHourValueEl.value;
        this.startMinute = this.timeElements.startMinuteValueEl.value;
        this.endHour = this.timeElements.endHourValueEl.value;
        this.endMinute = this.timeElements.endMinuteValueEl.value;
        // set the start/end date in both the UI and the class's state
        if (!this.singleDate) {
            if (this.dates.length > 1 || this.dates.length < 1) {
                this.dates = [];
                this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format("MM/DD/YYYY hh:mm A");
                this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
                this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: ";
            } else {
                if (moment(this.dates[0]).format("MM/DD/YYYY") > moment(dayCell.value).format("MM/DD/YYYY")) {
                    let largerDate = this.dates[0];
                    this.dates = [];
                    this.dates[1] = moment(largerDate).set({ h: this.endHour, m: this.endMinute }).format("MM/DD/YYYY hh:mm A");
                    this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format("MM/DD/YYYY hh:mm A");
                    this.containerElement.querySelector('.startDateElement').innerHTML = "Start Date: " + this.dates[0];
                    this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + this.dates[1];
                } else {
                    this.dates[1] = moment(dayCell.value).set({ h: this.endHour, m: this.endMinute }).format("MM/DD/YYYY hh:mm A");
                    this.containerElement.querySelector('.endDateElement').innerHTML = "End Date: " + this.dates[1];
                }
            }
        } else {
            this.dates = [];
            this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format("MM/DD/YYYY hh:mm A");
            this.containerElement.querySelector('.startDateElement').innerHTML = "Date: " + this.dates[0];
        }
        // autoClose the calendar when a single date or date range is selected 
        if (!this.singleDate && this.dates.length === 2 && this.options.autoClose) {
            setTimeout(function () {
                this.containerElement.hideEl();
            }.bind(this), 400);
        } else if (this.singleDate && this.dates.length === 1 && this.options.autoClose) {
            setTimeout(function () {
                this.containerElement.hideEl();
            }.bind(this), 400); // setTimeout will need to be removed eventually
        }
        // conditional highlighting prompt
        this.highlightDates();

    }
    // advances the calendar by one month
    nextMonth() {
        this.containerElement.innerHTML = "";
        this.moment.add(1, 'months');
        this.drawCalendar();
        this.setTime();
        // draw highlighting if there are any dates selected:
        this.highlightDates();
    }
    // moves the calendar back one month
    lastMonth() {
        this.containerElement.innerHTML = "";
        this.moment.add(-1, 'months');
        this.drawCalendar();
        this.setTime();
        // draw highlighting if there are any dates selected:
        this.highlightDates();
    }
    // sets highlighted dates on calendar UI
    highlightDates() {
        let days = this.containerElement.querySelectorAll('.day');
        // adds calendar day highlighted styling
        if (this.dates.length > 0 && this.dates.length === 2) {
            days.forEach(function (day) {
                let indexDate = moment(day.value).format("MM/DD/YYYY");
                let firstDate = moment(this.dates[0]).format("MM/DD/YYYY");
                let secondDate = moment(this.dates[1]).format("MM/DD/YYYY");
                console.log(firstDate, secondDate, indexDate)
                if (firstDate === indexDate) {
                    day.classList.add('active');
                    day.setAttribute('aria-pressed', 'true');
                }
                if (secondDate === indexDate) {
                    day.classList.add('active');
                    day.setAttribute('aria-pressed', 'true');
                }
                if (indexDate > firstDate && indexDate < secondDate) {
                    day.classList.add("highlighted");
                }
            }.bind(this));
        } else {
            days.forEach(function (day) {
                let indexDate = moment(day.value).format("MM/DD/YYYY");
                let firstDate = moment(this.dates[0]).format("MM/DD/YYYY");
                if (firstDate === indexDate) {
                    day.classList.add('active');
                    day.setAttribute('aria-pressed', 'true');
                } else {
                    if (day.classList.contains('active')) {
                        day.classList.remove('active');
                        day.setAttribute('aria-pressed', 'false');
                    }
                    if (day.classList.contains('highlighted')) {
                        day.classList.remove("highlighted");
                    }
                }
            }.bind(this));
        }
    }
}
// html element prototypal inheritance of hide/show methods for UI elements
Element.prototype.hideEl = function () {
    this.style.display = 'none';
}
Element.prototype.showEl = function () {
    this.style.display = 'block';
}