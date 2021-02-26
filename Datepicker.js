
class clsDatepicker {
    constructor(options) {
        // Validation
        if (!options || typeof options === undefined) {
            throw "Error: Datepicker.js options object must be defined, with at least options.containerElement.";
        }
        if (options.containerElement === undefined || !options.containerElement) {
            throw "Error: you must specify a container element in the Datepicker.js options object!";
        }
        // options
        /**
         * @type {object} options REQUIRED -  holds references to element objects that contain values that make up time
         * @property {HTML} options.containerElement REQUIRED - HTML element to instantiate the datepicker in
         * @property {Boolean} this.options.timePicker Optional - include time picker inputs - Defaults to false
         * @property {Boolean} this.options.presetMenu Optional - include presets such as "this week, next week, etc. - Defaults to false
         * @property {Boolean} this.options.autoClose Optional - whether or not the datepicker autocloses when selection is complete - Defaults to false
         * @property {Boolean} this.options.singleDate Optional - whether the datepicker allows single date choice, or date range - Defaults to false
         * @property {Boolean} this.options.leadingTrailingDates Optional - whether the datepicker shows leading/trailing dates on the calendar - Defaults to true
         * @property {Boolean} this.options.militaryTime Optional - 24h format for military time - Defaults to false (12h, am/pm)
         * @property {string} this.options.format Optional - Must be a Valid Moment.js format. defaults to "MM/DD/YYYY hh:mm A"
         * @property {Date} this.options.moment Optional - Date for the calendar to initialize on, defaults to today, this month, this year
         * @property {Array of objects} this.options.menuOptions Optional - array of preset menu options [{ title: 'This Week', values: [moment(date), moment(date)] }]
         */
        this.options = options;
        this.containerElement = options.containerElement;
        this.timePicker = this.options.timePicker !== undefined ? this.options.timePicker : true;
        this.presetMenu = this.options.presetMenu !== undefined ? this.options.presetMenu : true;
        this.menuOptions = this.options.menuOptions !== undefined ? this.options.menuOptions : [];
        this.autoClose = this.options.autoClose !== undefined ? this.options.autoClose : false;
        this.singleDate = this.options.singleDate !== undefined ? this.options.singleDate : false;
        this.leadingTrailingDates = this.options.leadingTrailingDates !== undefined ? this.options.leadingTrailingDates : true;
        this.militaryTime = this.options.militaryTime !== undefined ? this.options.militaryTime : false;
        this.format = this.militaryTime ? "MM/DD/YYYY HH:mm:ss" : "MM/DD/YYYY hh:mm A";
        this.moment = moment(moment(), this.format, true);
        // methods bound to state context
        this.drawCalendar = this.drawCalendar.bind(this);
        this.dayClick = this.dayClick.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.lastMonth = this.lastMonth.bind(this);
        this.highlightDates = this.highlightDates.bind(this);
        this.inputElement = document.createElement('div');
        this.drawInputElement = this.drawInputElement.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
        this.closeCalendar = this.closeCalendar.bind(this);
        this.openPresetMenu = this.openPresetMenu.bind(this);
        this.closePresetMenu = this.closePresetMenu.bind(this);
        this.resetCalendar = this.resetCalendar.bind(this);
        this.value = this.value.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);
        this.outsideCalendarClick = this.outsideCalendarClick.bind(this);
        this.isOutsideCalendar = this.isOutsideCalendar.bind(this);
        this.leadingTrailing = this.leadingTrailing.bind(this);
        this.drawPresetMenu = this.drawPresetMenu.bind(this);
        this.drawStartTimePicker = this.drawStartTimePicker.bind(this);
        this.drawEndTimePicker = this.drawEndTimePicker.bind(this);
        this.snapTo = this.snapTo.bind(this);
        this.toAmPm = this.toAmPm.bind(this);
        this.timeValid = this.timeValid.bind(this);
        // state values, not typically set programmatically.
        this.dates = [];
        this.timeElements = {};
        this.startHour = "12";
        this.startMinute = "00";
        this.startAmPm = "PM";
        this.endHour = "12";
        this.endMinute = "00";
        this.endAmPm = "PM";
        // initialization logic (constructor)
        this.drawCalendar();
        this.drawInputElement();
        if (this.presetMenu) { this.drawPresetMenu(); this.closePresetMenu(); };
        this.closeCalendar();
    }
    // draw input element displaying chosen dates/times
    drawInputElement() {
        this.inputElement.innerHTML = '';
        this.inputElement.setAttribute('class', 'launch');
        //This creates the heading elements for the start and end date titles
        let headingBlock = document.createElement('div');
        let startHead = document.createElement('div');
        let endHead = document.createElement('div');
        startHead.innerHTML = "Date:";
        if (!this.singleDate) {
            startHead.innerHTML = "Start Date:";
            endHead.innerHTML = "End Date:";
        }
        headingBlock.setAttribute("class", "headingBlock");
        startHead.setAttribute("class", "heading");
        endHead.setAttribute("class", "heading");
        headingBlock.appendChild(startHead);
        if (!this.singleDate) {
            headingBlock.appendChild(endHead);
        }
        this.inputElement.appendChild(headingBlock);
        //This creates a container for the time to reside
        let timeBlock = document.createElement('div');
        let startDate = document.createElement('div');
        timeBlock.appendChild(startDate);
        if (!this.singleDate) {
            let endDate = document.createElement('div');
            endDate.setAttribute("class", "date");
            timeBlock.appendChild(endDate);
        }
        startDate.innerHTML = this.dates[0];
        timeBlock.setAttribute("class", "timeBlock");
        startDate.setAttribute("class", "date");
        this.inputElement.appendChild(timeBlock);

        let launchButton = document.createElement('div');
        let launchText = document.createElement('div');
        launchText.innerHTML = 'CLICK TO SELECT &#128197;';
        launchButton.setAttribute('class', 'launchButton');
        launchText.setAttribute('class', 'launchText');
        launchButton.appendChild(launchText);
        this.inputElement.appendChild(launchButton);

        if (this.dates[0]) {
            startDate.innerHTML = this.dates[0];
        } else {
            startDate.innerHTML = " --/--/----  --:-- ";
        }
        if (!this.singleDate) {
            if (this.dates[1] && typeof this.dates[1] !== undefined) {
                endDate.innerHTML = this.dates[1];
            } else {
                endDate.innerHTML = " --/--/----  --:-- ";
            }
        }
        this.inputElement.addEventListener('click', function (event) {
            this.openCalendar();
        }.bind(this));
        this.containerElement.appendChild(this.inputElement);
    }
    // draws calendar element for selecting dates/times
    drawCalendar() {
        // we need to first set the first and last of the month in the state
        this.firstDayOfMonth = this.moment.startOf('month').format("dddd");
        this.lastDayOfMonth = this.moment.endOf('month').format("dddd");
        // then set our callback methods so they have the proper context
        let callbackNextMonth = this.nextMonth;
        let callbackLastMonth = this.lastMonth;
        let callbackSetDate = this.dayClick;
        // Calendar UI
        let calendar = document.createElement('div');
        // add day headers (mon, tues, wed, etc.)
        let monthHeader = document.createElement('div');
        monthHeader.setAttribute('style', 'grid-column-start: 3; grid-column-end: 6;');
        // month selector to pick month from dropdown
        let monthSelect = document.createElement('select');
        monthSelect.setAttribute("name", "months");
        monthSelect.setAttribute("class", "datepicker-month-select");
        monthSelect.setAttribute("aria-label", "datepicker-month-select");
        this.moment._locale._months.forEach(function (month, index) {
            let option = document.createElement('option');
            option.innerHTML = month;
            option.value = index + 1;
            if (month === this.moment._locale._months[this.moment.month()]) {
                option.selected = true;
            }
            monthSelect.appendChild(option);
        }.bind(this));
        monthSelect.addEventListener('change', function (e) {
            this.moment.month(monthSelect.value - 1);
            this.snapTo();
        }.bind(this));
        // year selector to type custom year
        let yearInput = document.createElement('input');
        yearInput.setAttribute("type", "number");
        yearInput.setAttribute("name", "year");
        yearInput.setAttribute("class", "datepicker-year-input");
        yearInput.setAttribute("aria-label", "datepicker-year-input");
        yearInput.value = this.moment.year();
        yearInput.addEventListener('change', function (e) {
            if (parseInt(yearInput.value) > parseInt(this.moment.year() + 20) || parseInt(yearInput.value) < parseInt(this.moment.year() - 20)) {
                yearInput.value = this.moment.year();
                return;
            }
            this.moment.year(yearInput.value);
            this.snapTo();
        }.bind(this));
        let yearUp = document.createElement('span');
        yearUp.innerHTML = "&#43;";
        yearUp.setAttribute('class', 'increase-year-button');
        yearUp.setAttribute('aria-label', 'Increase Year Button');
        yearUp.setAttribute('role', 'button');
        yearUp.addEventListener('click', function (e) {
            yearInput.stepUp();
            yearInput.dispatchEvent(new Event('change'));
        }.bind(this));
        let yearDown = document.createElement('span');
        yearDown.innerHTML = "&#x2212;";
        yearDown.setAttribute('class', 'decrease-year-button');
        yearDown.setAttribute('aria-label', 'Decrease Year Button');
        yearDown.setAttribute('role', 'button');
        yearDown.addEventListener('click', function (e) {
            yearInput.stepDown();
            yearInput.dispatchEvent(new Event('change'));
        }.bind(this));
        // hamburger menu icon
        this.menuIconContainer = document.createElement('div');
        this.menuIconContainer.setAttribute('style', 'grid-column-start: 1; grid-column-end: 2; background-color: transparent !important;');
        this.menuIconContainer.setAttribute('aria-label', 'Preset Menu Button');
        this.menuIconContainer.setAttribute('role', 'menu');
        if (this.presetMenu) {
            let menuIcon = document.createElement('span');
            menuIcon.setAttribute('class', 'calendarHamburger');
            this.menuIconContainer.addEventListener('click', function (event) {
                if (this.menuIconContainer.classList.contains('open')) {
                    this.closePresetMenu();
                    this.menuIconContainer.classList.remove('open');
                } else {
                    this.openPresetMenu();
                    this.menuIconContainer.classList.add('open');
                }
            }.bind(this));
            this.menuIconContainer.appendChild(menuIcon);
        }
        // left/right arrows for adjusting month
        let leftArrow = document.createElement('div');
        leftArrow.classList.add("leftArrow");
        leftArrow.setAttribute('style', 'grid-column-start: 2; grid-column-end: 3; background-color: transparent !important;');
        leftArrow.setAttribute('aria-label', 'Previous Month Button');
        leftArrow.setAttribute('role', 'navigation');
        leftArrow.innerHTML = "&#11164;";
        leftArrow.addEventListener('click', callbackLastMonth.bind(this));

        let rightArrow = document.createElement('div');
        rightArrow.classList.add("rightArrow");
        rightArrow.setAttribute('style', 'grid-column-start: 6; grid-column-end: 7; background-color: transparent !important;');
        rightArrow.setAttribute('aria-label', 'Next Month Button');
        rightArrow.setAttribute('role', 'navigation');
        rightArrow.innerHTML = "&#11166;"
        rightArrow.addEventListener('click', callbackNextMonth.bind(this));
        // month text eg. "November - 2020"
        monthHeader.appendChild(monthSelect);

        monthHeader.appendChild(yearDown);
        monthHeader.appendChild(yearInput);
        monthHeader.appendChild(yearUp);

        monthHeader.classList.add('monthHeader')
        calendar.classList.add('grid-container');
        // close calendar icon
        let closeCalendarIconContainer = document.createElement('div');
        closeCalendarIconContainer.setAttribute('style', 'grid-column-start: 7; grid-column-end: 8; background-color: transparent !important;');
        closeCalendarIconContainer.setAttribute('aria-label', 'Preset Menu Button');
        closeCalendarIconContainer.setAttribute('role', 'button');
        let closeCalendarIcon = document.createElement('span');
        closeCalendarIcon.innerHTML = "&#10006;";
        closeCalendarIcon.classList.add('close-calendar-button');
        closeCalendarIconContainer.addEventListener('click', function (event) {
            this.closeCalendar();
        }.bind(this));
        closeCalendarIconContainer.appendChild(closeCalendarIcon);
        // add all the UI elements to the calendar
        calendar.appendChild(this.menuIconContainer);
        calendar.appendChild(leftArrow);
        calendar.appendChild(monthHeader);
        calendar.appendChild(rightArrow);
        calendar.appendChild(closeCalendarIconContainer);
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
        let leadingTrailing = this.leadingTrailing();
        let firstDayPos = this.moment._locale._weekdays.indexOf(this.firstDayOfMonth) + 1;
        let lastDayPos = this.moment._locale._weekdays.indexOf(this.lastDayOfMonth) + 1;
        //add last months trailing days to calendar
        if (this.leadingTrailingDates) {
            for (let i = firstDayPos - 1; i > 0; i--) {
                let dayCell = document.createElement('div');
                dayCell.classList.add("prev-month-day-" + (parseInt(leadingTrailing.trailing[i] + 1)));
                dayCell.classList.add("leading-trailing-day");
                dayCell.innerHTML = (parseInt(leadingTrailing.trailing[i]) + 1);
                dayCell.setAttribute('aria-label', (parseInt(leadingTrailing.trailing[i] + 1)) + '');
                if (i === 0) {
                    dayCell.classList.add('grid-column-start:0;');
                }
                calendar.appendChild(dayCell);
            }
        }
        // add this months days to calendar
        daysInMonth.forEach(function (day) {
            let dayCell = document.createElement('div');
            dayCell.classList.add("day-" + (parseInt(day) + 1));
            dayCell.classList.add("day");
            dayCell.innerHTML = parseInt(day) + 1;
            let dateString = moment(this.moment.format("MM") + "/" + parseInt(day + 1) + "/" + this.moment.format("YYYY")).format(this.format);
            dayCell.setAttribute('role', 'button');
            dayCell.setAttribute('aria-label', 'day-' + parseInt(day) + 1 + '-previous-month');
            dayCell.value = dateString;
            dayCell.addEventListener('click', callbackSetDate.bind(this, dayCell));
            calendar.appendChild(dayCell);
        }.bind(this));
        // add next months leading days to calendar.
        if (this.leadingTrailingDates) {
            for (let i = 1; i < 8 - lastDayPos; i++) {
                let dayCell = document.createElement('div');
                dayCell.classList.add("next-month-day-" + i);
                dayCell.classList.add("leading-trailing-day");
                dayCell.innerHTML = i;
                dayCell.setAttribute('aria-label', 'day-' + i + '-next-month');
                if (i === 0) {
                    dayCell.classList.add('grid-column-start:' + lastDayPos + ';');
                }
                calendar.appendChild(dayCell);
            }
        }
        // set the first of the month to be positioned on calendar based on day of week
        let firstDayElement = calendar.querySelector('.day-1');
        let monthStartPos = 'grid-column-start: ' + firstDayPos + ';';
        // console.log(monthStartPos, firstDayElement);
        firstDayElement.setAttribute('style', monthStartPos);
        // Footer elements, contains start/end dates selected
        let startDateElement = document.createElement('div');
        // start/end date elements based on singleDate options
        if (!this.singleDate) {
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;')
            startDateElement.classList.add('startDateElement');
            calendar.appendChild(startDateElement);
            // set calendar start/end dates in the UI
            startDateElement.innerHTML = `<b>Start Date:  --/--/----  --:--  </b>`;
        } else {
            startDateElement.innerHTML = `<b>Date:  --/--/----  --:--  </b>`;
            startDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;');
            startDateElement.classList.add('startDateElement');
            calendar.appendChild(startDateElement);
        }
        this.calendarElement = calendar;
        // timepicker init based on options
        if (this.timePicker) {
            this.drawStartTimePicker();
            if (!this.singleDate) {
                this.drawEndTimePicker();
            }
        }
        // cancel dates button:
        let cancelButton = document.createElement('button');
        cancelButton.classList.add("cancelButton");
        cancelButton.innerHTML = "&#10006;";
        cancelButton.type = 'cancel';
        cancelButton.style.gridColumnStart = 1;
        cancelButton.style.gridColumnEnd = 3;
        cancelButton.addEventListener("click", function (event) {
            this.resetCalendar();
        }.bind(this));
        calendar.appendChild(cancelButton);
        // submit dates button:
        let submitButton = document.createElement('button');
        submitButton.classList.add("submitButton");
        submitButton.innerHTML = "&#10004;";
        submitButton.type = 'submit';
        submitButton.style.gridColumnStart = 3;
        submitButton.style.gridColumnEnd = 8;
        submitButton.addEventListener('click', function (event) {
            this.closeCalendar();
        }.bind(this));
        calendar.appendChild(submitButton);
        // Finally, add calendar element to the containerElement assigned during initialization
        this.containerElement.appendChild(calendar);
        // add the click off method to hide calendar when user clicks off:
        document.addEventListener('click', function (event) {
            this.outsideCalendarClick(event);
        }.bind(this));

    }
    // draws start time picker
    drawStartTimePicker() {
        let startTimeElement = document.createElement('div');
        startTimeElement.classList.add("startTimeElement");
        startTimeElement.style.gridColumnStart = 4;
        startTimeElement.style.gridColumnEnd = 8;
        if (!this.militaryTime) {
            this.startHour = this.toAmPm(parseInt(this.startHour));
        }
        let startHour = document.createElement("div");
        startHour.classList.add("hour");
        startHour.innerHTML = "<input id='startHour' type='number' min='1' max='23' value='" + this.startHour + "' />";
        startHour.style.gridColumn = "1 / span 2";

        let startHourValueEl = startHour.querySelector("#startHour");
        this.timeElements.startHourValueEl = startHourValueEl;

        let startHourChange = function (event) {
            let newVal = !this.militaryTime ? this.toMilitary(parseInt(this.timeElements.startHourValueEl.value)) : parseInt(this.timeElements.startHourValueEl.value);
            if (newVal > 23) {
                newVal = 0;
            } else if (newVal < 1) {
                newVal = 23;
            }
            if (newVal < 10 && this.militaryTime) {
                newVal = "0" + newVal;
            }
            this.timeElements.startHourValueEl.value = this.militaryTime ? newVal : this.toAmPm(newVal);
            this.setTime();
        }.bind(this);
        startHourValueEl.addEventListener('change', startHourChange);

        let startHourUpDown = document.createElement("span");
        startHourUpDown.classList.add("TimeUpDown");
        startHourUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";
        // Up Hour
        startHourUpDown.querySelectorAll("div")[0].onclick = () => {
            startHourValueEl.value++;
            if (this.timeValid()) {
                startHourValueEl.dispatchEvent(new Event('change'));
            } else {
                startHourValueEl.value--;
            }
        };
        // Down Hour
        startHourUpDown.querySelectorAll("div")[1].onclick = () => {
            startHourValueEl.value--;
            if (this.timeValid()) {
                startHourValueEl.dispatchEvent(new Event('change'));
            } else {
                startHourValueEl.value++;
            }
        };
        //input change
        startHour.appendChild(startHourUpDown);
        startTimeElement.appendChild(startHour);

        let timeColon = document.createElement("div");
        timeColon.innerHTML = ":";
        timeColon.classList.add("timeColon");
        timeColon.style.gridColumn = "3 / span 1";
        startTimeElement.appendChild(timeColon);
        if (parseInt(this.startMinute) < 10) {
            this.startMinute = "0" + parseInt(this.startMinute);
        }
        let startMinute = document.createElement("div");
        startMinute.classList.add("minute");
        startMinute.innerHTML = "<input type='number' min='1' max='59' value='" + this.startMinute + "' />";
        startMinute.style.gridColumn = "4 / span 2";

        let startMinuteValueEl = startMinute.querySelector("input");
        this.timeElements.startMinuteValueEl = startMinuteValueEl;
        let startMinuteChange = function (event) {
            let newVal = parseInt(this.timeElements.startMinuteValueEl.value);
            if (newVal > 59) {
                newVal = 0;
            } else if (newVal < 1) {
                newVal = 59;
            }
            if (newVal < 10) {
                newVal = "0" + newVal;
            }
            this.timeElements.startMinuteValueEl.value = newVal;
            this.setTime();
        }.bind(this);
        startMinuteValueEl.addEventListener('change', startMinuteChange);

        let startMinuteUpDown = document.createElement("span");
        startMinuteUpDown.classList.add("TimeUpDown");
        startMinuteUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";
        // Up Minute
        startMinuteUpDown.querySelectorAll("div")[0].onclick = () => {
            if (startMinuteValueEl.value % 15 === 0) {
                startMinuteValueEl.value = parseInt(startMinuteValueEl.value) + 15;
            } else {
                startMinuteValueEl.value = parseInt(startMinuteValueEl.value) + 1;
            }
            if (this.timeValid()) {
                startMinuteValueEl.dispatchEvent(new Event('change'));
            } else {
                if (startMinuteValueEl.value % 15 === 0) {
                    startMinuteValueEl.value = parseInt(startMinuteValueEl.value) - 15;
                } else {
                    startMinuteValueEl.value = parseInt(startMinuteValueEl.value) - 1;
                }
            }
        };
        // Down Minute
        startMinuteUpDown.querySelectorAll("div")[1].onclick = () => {

            if (startMinuteValueEl.value % 15 === 0) {
                startMinuteValueEl.value = parseInt(startMinuteValueEl.value) - 15;
            } else {
                startMinuteValueEl.value = parseInt(startMinuteValueEl.value) - 1;
            }
            if (this.timeValid()) {
                startMinuteValueEl.dispatchEvent(new Event('change'));
            } else {
                if (startMinuteValueEl.value % 15 === 0) {
                    startMinuteValueEl.value = parseInt(startMinuteValueEl.value) + 15;
                } else {
                    startMinuteValueEl.value = parseInt(startMinuteValueEl.value) + 1;
                }
            }
        };

        startMinute.appendChild(startMinuteUpDown);

        startTimeElement.appendChild(startMinute);
        // start am/pm elements if not military time
        if (!this.militaryTime) {
            let startampm = document.createElement("div");
            startampm.classList.add("ampm");
            startampm.innerHTML = "";
            startampm.style.gridColumn = "6 / span 1";
            this.timeElements.startampm = startampm;

            let startam = document.createElement("div");
            startam.classList.add("am");
            startam.innerHTML = "AM";

            startam.onclick = function () {
                this.startAmPm = "AM";
                if (this.timeValid()) {
                    startam.setAttribute("SELECTED", "true");
                    startpm.removeAttribute("SELECTED");
                    this.setTime();
                } else {
                    this.startAmPm = "PM";
                    this.setTime();
                }
            }.bind(this);
            startampm.appendChild(startam);

            let startpm = document.createElement("div");
            startpm.classList.add("pm");
            startpm.innerHTML = "PM";

            startpm.onclick = function () {
                this.startAmPm = "PM";
                if (this.timeValid()) {
                    startpm.setAttribute("SELECTED", "true");
                    startam.removeAttribute("SELECTED");
                    this.setTime();
                } else {
                    this.startAmPm = "AM";
                    this.setTime();
                }
            }.bind(this);
            if (this.startAmPm === "PM") {
                startpm.setAttribute("SELECTED", "true");
                startam.removeAttribute("SELECTED");
            } else {
                startam.setAttribute("SELECTED", "true");
                startpm.removeAttribute("SELECTED");
            }
            this.timeElements.startam = startam;
            this.timeElements.startpm = startpm;
            startampm.appendChild(startpm);
            startTimeElement.appendChild(startampm);
        }
        this.calendarElement.appendChild(startTimeElement);
    }
    // draws end time picker if allowed programmatically.
    drawEndTimePicker() {
        if (!this.singleDate) {
            let endDateElement = document.createElement('div');
            endDateElement.classList.add('endDateElement');
            endDateElement.setAttribute('style', 'grid-column-start: 1; grid-column-end: 4;');
            endDateElement.innerHTML = `<b>End Date: --/--/----  --:--  </b>`;
            this.calendarElement.appendChild(endDateElement);
            let endTimeElement = document.createElement('div');
            endTimeElement.classList.add("endTimeElement");
            endTimeElement.style.gridColumnStart = 4;
            endTimeElement.style.gridColumnEnd = 8;
            if (!this.militaryTime) {
                this.endHour = this.toAmPm(parseInt(this.endHour));
            }
            let endHour = document.createElement("div");
            endHour.classList.add("hour");
            endHour.innerHTML = "<input id='endHour' type='number' min='1' max='23' value='" + this.endHour + "' />";
            endHour.style.gridColumn = "1 / span 2";

            let endHourValueEl = endHour.querySelector("#endHour");
            this.timeElements.endHourValueEl = endHourValueEl;
            let endHourChange = function (event) {
                let newVal = !this.militaryTime ? this.toMilitary(parseInt(this.timeElements.endHourValueEl.value)) : parseInt(this.timeElements.endHourValueEl.value);
                if (newVal > 23) {
                    newVal = 0;
                } else if (newVal < 1) {
                    newVal = 23;
                }
                if (newVal < 10 && this.militaryTime) {
                    newVal = "0" + newVal;
                }
                this.timeElements.endHourValueEl.value = this.militaryTime ? newVal : this.toAmPm(newVal);
                this.setTime();
            }.bind(this);
            endHourValueEl.addEventListener('change', endHourChange);

            let endHourUpDown = document.createElement("span");
            endHourUpDown.classList.add("TimeUpDown");
            endHourUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";
            // Up Hour
            endHourUpDown.querySelectorAll("div")[0].onclick = () => {
                endHourValueEl.value++;
                if (this.timeValid()) {
                    endHourValueEl.dispatchEvent(new Event('change'));
                } else {
                    endHourValueEl.value--;
                }
            };
            // Down Hour
            endHourUpDown.querySelectorAll("div")[1].onclick = () => {
                endHourValueEl.value--;
                if (this.timeValid()) {
                    endHourValueEl.dispatchEvent(new Event('change'));
                } else {
                    endHourValueEl.value++;
                }
            };

            endHour.appendChild(endHourUpDown);
            endTimeElement.appendChild(endHour);

            let timeColon = document.createElement("div");
            timeColon.innerHTML = ":";
            timeColon.classList.add("timeColon");
            timeColon.style.gridColumn = "3 / span 1";
            endTimeElement.appendChild(timeColon);
            if (parseInt(this.endMinute) < 10) {
                this.endMinute = "0" + parseInt(this.endMinute);
            }
            let endMinute = document.createElement("div");
            endMinute.classList.add("minute");
            endMinute.innerHTML = "<input type='number' min='1' max='59' value='" + this.endMinute + "' />";
            endMinute.style.gridColumn = "4 / span 2";

            let endMinuteValueEl = endMinute.querySelector("input");
            this.timeElements.endMinuteValueEl = endMinuteValueEl;
            let endMinuteChange = function (event) {
                let newVal = parseInt(this.timeElements.endMinuteValueEl.value);
                if (newVal > 59) {
                    newVal = 0;
                } else if (newVal < 1) {
                    newVal = 59;
                }
                if (newVal < 10) {
                    newVal = "0" + newVal;
                }
                this.timeElements.endMinuteValueEl.value = newVal;
                this.setTime();
            }.bind(this);
            endMinuteValueEl.addEventListener('change', endMinuteChange);
            let endMinuteUpDown = document.createElement("span");
            endMinuteUpDown.classList.add("TimeUpDown");
            endMinuteUpDown.innerHTML = "<div>&#9650;</div><div>&#9660;</div>";
            // Up Minute
            endMinuteUpDown.querySelectorAll("div")[0].onclick = () => {
                if (endMinuteValueEl.value % 15 === 0) {
                    endMinuteValueEl.value = parseInt(endMinuteValueEl.value) + 15;
                } else {
                    endMinuteValueEl.value = parseInt(endMinuteValueEl.value) + 1;
                }
                if (this.timeValid()) {
                    endMinuteValueEl.dispatchEvent(new Event('change'));
                } else {
                    if (endMinuteValueEl.value % 15 === 0) {
                        endMinuteValueEl.value = parseInt(endMinuteValueEl.value) - 15;
                    } else {
                        endMinuteValueEl.value = parseInt(endMinuteValueEl.value) - 1;
                    }
                }
            };
            // Down Minute
            endMinuteUpDown.querySelectorAll("div")[1].onclick = () => {
                if (endMinuteValueEl.value % 15 === 0) {
                    endMinuteValueEl.value = parseInt(endMinuteValueEl.value) - 15;
                } else {
                    endMinuteValueEl.value = parseInt(endMinuteValueEl.value) - 1;
                }
                if (this.timeValid()) {
                    endMinuteValueEl.dispatchEvent(new Event('change'));
                } else {
                    if (endMinuteValueEl.value % 15 === 0) {
                        endMinuteValueEl.value = parseInt(endMinuteValueEl.value) + 15;
                    } else {
                        endMinuteValueEl.value = parseInt(endMinuteValueEl.value) + 1;
                    }
                }
            };
            endMinute.appendChild(endMinuteUpDown);
            endTimeElement.appendChild(endMinute);
            this.calendarElement.appendChild(endTimeElement);
            // am/pm elements if not military time
            if (!this.militaryTime) {
                let endampm = document.createElement("div");
                endampm.classList.add("ampm");
                endampm.innerHTML = "";
                endampm.style.gridColumn = "6 / span 1";
                this.timeElements.endampm = endampm;

                let endam = document.createElement("div");
                endam.classList.add("am");
                endam.innerHTML = "AM";
                endam.onclick = function () {
                    this.endAmPm = "AM";
                    if (this.timeValid()) {
                        endam.setAttribute("SELECTED", "true");
                        endpm.removeAttribute("SELECTED");
                        this.setTime();
                    } else {
                        this.endAmPm = "PM";
                        this.setTime();
                    }
                }.bind(this);
                endampm.appendChild(endam);

                let endpm = document.createElement("div");
                endpm.classList.add("pm");
                endpm.innerHTML = "PM";
                endpm.onclick = function () {
                    this.endAmPm = "PM";
                    if (this.timeValid()) {
                        endpm.setAttribute("SELECTED", "true");
                        endam.removeAttribute("SELECTED");
                        this.setTime();
                    } else {
                        this.endAmPm = "AM";
                        this.setTime();
                    }
                }.bind(this);
                if (this.endAmPm === "PM") {
                    endpm.setAttribute("SELECTED", "true");
                    endam.removeAttribute("SELECTED");
                } else {
                    endam.setAttribute("SELECTED", "true");
                    endpm.removeAttribute("SELECTED");
                }
                endampm.appendChild(endpm);
                endTimeElement.appendChild(endampm);
                this.timeElements.endam = endam;
                this.timeElements.endpm = endpm;
            }
        }
    }
    // draws preset menu and options if allowed programmatically.
    drawPresetMenu() {
        this.presetMenuContainer = document.createElement('div');
        this.presetMenuContainer.setAttribute('class', 'presetMenuContainer');
        let menuOptionsContainer = document.createElement('ul');
        let today = new Date();
        // default preset menu options
        let menuOptions = [
            { title: 'This Week', values: [moment(today).startOf('week'), moment(today).endOf('week')] },
            { title: 'Next Week', values: [moment(today).add(+1, 'week').startOf('week'), moment(today).add(+1, 'week').endOf('week')] },
            { title: 'Last Week', values: [moment(today).add(-1, 'week').startOf('week'), moment(today).add(-1, 'week').endOf('week')] },
            { title: 'This Month', values: [moment(today).startOf('month'), moment(today).endOf('month')] },
            { title: 'Next Month', values: [moment(today).add(+1, 'month').startOf('month'), moment(today).add(+1, 'month').endOf('month')] },
            { title: 'Last Month', values: [moment(today).add(-1, 'month').startOf('month'), moment(today).add(-1, 'month').endOf('month')] },
            { title: 'This Year', values: [moment(today).startOf('year'), moment(today).endOf('year')] },
            { title: 'Next Year', values: [moment(today).add(+1, 'year').startOf('year'), moment(today).add(+1, 'year').endOf('year')] },
            { title: 'Last Year', values: [moment(today).add(-1, 'year').startOf('year'), moment(today).add(-1, 'year').endOf('year')] },
        ];
        // adds any menu options passed into the class constructor options programmatically
        if (this.menuOptions !== undefined && this.menuOptions.length > 0) {
            for (let i = 0; i < this.menuOptions.length; i++) {
                menuOptions.push(this.menuOptions[i]);
            }
        }
        // adds all options to the UI
        for (let menuOption of menuOptions) {
            let menuListElement = document.createElement('li');
            menuListElement.setAttribute('class', menuOption.title + "-menu-option");
            menuListElement.innerHTML = menuOption.title;
            menuListElement.addEventListener('click', function (event) {
                this.dates.length = 0;
                this.highlightDates(true);
                this.dates[0] = (menuOption.values[0]);
                this.dates[1] = (menuOption.values[1]);
                // invoke highlighting fn to ensure calendar UI is updated
                this.highlightDates(true);
                this.setTime(true);
                this.drawInputElement();
                this.snapTo(this.dates[0]);
                this.closePresetMenu();
                this.menuIconContainer.classList.remove('open');
            }.bind(this));
            menuOptionsContainer.appendChild(menuListElement);
        }
        // close preset menu icon
        let closePresetIconContainer = document.createElement('div');
        closePresetIconContainer.setAttribute('style', 'background-color: transparent !important;');
        closePresetIconContainer.setAttribute('aria-label', 'Preset Menu Close Button');
        closePresetIconContainer.setAttribute('role', 'button');
        let closePresetIcon = document.createElement('span');
        closePresetIcon.innerHTML = "&#10006;";
        closePresetIcon.classList.add('close-preset-menu');
        closePresetIconContainer.addEventListener('click', function (event) {
            this.closePresetMenu();
            this.menuIconContainer.classList.remove('open');
        }.bind(this));
        closePresetIconContainer.appendChild(closePresetIcon);
        this.presetMenuContainer.appendChild(closePresetIconContainer);
        this.presetMenuContainer.appendChild(menuOptionsContainer);
        this.calendarElement.appendChild(this.presetMenuContainer);
    }
    timeValid() {
        if (this.dates.length === 2 && !this.singleDate) {
            this.startHour = parseInt(this.timeElements.startHourValueEl.value);
            this.startMinute = parseInt(this.timeElements.startMinuteValueEl.value);
            this.endHour = parseInt(this.timeElements.endHourValueEl.value);
            this.endMinute = parseInt(this.timeElements.endMinuteValueEl.value);
            if (!this.militaryTime) {
                if (this.startAmPm === "PM") {
                    this.startHour = this.toMilitary(this.timeElements.startHourValueEl.value)
                }
                if (this.endAmPm === "PM") {
                    this.endHour = this.toMilitary(this.timeElements.endHourValueEl.value)
                }
                if (parseInt(this.timeElements.startHourValueEl.value) === 12 && this.startAmPm === "AM") {
                    this.startHour = 0;
                }
                if (parseInt(this.timeElements.endHourValueEl.value) === 12 && this.endAmPm === "AM") {
                    this.endHour = 0;
                }
            }
            let sameDay = moment(this.dates[0]).day() === moment(this.dates[1]).day();
            let sameMonth = moment(this.dates[0]).month() === moment(this.dates[1]).month();
            let sameYear = moment(this.dates[0]).year() === moment(this.dates[1]).year();
            if (sameDay && sameMonth && sameYear) {
                let startDate = moment(this.dates[0]).hour(this.startHour).minute(this.startMinute);
                let endDate = moment(this.dates[1]).hour(this.endHour).minute(this.endMinute);
                // console.log(startDate, endDate)
                if (startDate > endDate) {
                    this.timeElements.startMinuteValueEl.classList.add('datepicker-error');
                    this.timeElements.startHourValueEl.classList.add('datepicker-error');
                    this.timeElements.startampm.classList.add('datepicker-error');
                    setTimeout(function () {
                        this.timeElements.startMinuteValueEl.classList.remove('datepicker-error');
                        this.timeElements.startHourValueEl.classList.remove('datepicker-error');
                        this.timeElements.startampm.classList.remove('datepicker-error')
                    }.bind(this), 1000);
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    // setTime function - a helper method to set start/end time. This function is a void.
    setTime(setProgrammatically = false) {
        this.startHour = parseInt(this.timeElements.startHourValueEl.value);
        this.startMinute = parseInt(this.timeElements.startMinuteValueEl.value);
        if (!this.singleDate) {
            this.endHour = parseInt(this.timeElements.endHourValueEl.value);
            this.endMinute = parseInt(this.timeElements.endMinuteValueEl.value);
        }
        // Sanitizes the UI and the state if .value() was used to set dates/times
        if (setProgrammatically) {
            let startHour = this.dates[0] ? (this.militaryTime ? moment(this.dates[0]).hours() : this.toAmPm(moment(this.dates[0]).hours())) : this.timeElements.startHourValueEl.value;
            if (!startHour) {
                startHour = 12;
            }
            if (!this.singleDate) {
                let endHour = this.dates[1] ? (this.militaryTime ? moment(this.dates[1]).hours() : this.toAmPm(moment(this.dates[1]).hours())) : this.timeElements.endHourValueEl.value;
                if (!endHour) {
                    endHour = 12;
                }
            }
            this.timeElements.startHourValueEl.value = startHour;
            this.timeElements.startMinuteValueEl.value = this.dates[0] ? (moment(this.dates[0]).minutes() < 10 ? moment(this.dates[0]).minutes() + "0" : moment(this.dates[0]).minutes()) : this.timeElements.startMinuteValueEl.value;
            if (!this.singleDate) {
                this.timeElements.endHourValueEl.value = endHour;
                this.timeElements.endMinuteValueEl.value = this.dates[1] ? (moment(this.dates[1]).minutes() < 10 ? moment(this.dates[1]).minutes() + "0" : moment(this.dates[1]).minutes()) : this.timeElements.endMinuteValueEl.value;
                this.endHour = parseInt(this.timeElements.endHourValueEl.value);
                this.endMinute = parseInt(this.timeElements.endMinuteValueEl.value);
            }
            this.startHour = parseInt(this.timeElements.startHourValueEl.value);
            this.startMinute = parseInt(this.timeElements.startMinuteValueEl.value);
            if (!this.militaryTime) {
                if (!this.singleDate) {
                    this.endAmPm = this.toMilitary(this.endHour) > 12 ? "PM" : "AM";
                    if (this.endAmPm === "PM") {
                        this.timeElements.endpm.click();
                    } else {
                        this.timeElements.endam.click();
                    }
                }
                this.startAmPm = this.toMilitary(this.startHour) > 12 ? "PM" : "AM";
                if (this.startAmPm === "PM") {
                    this.timeElements.startpm.click();
                } else {
                    this.timeElements.startam.click();
                }
            }
        }
        // adjustments for 12h time since Moment only acccepts 24h
        if (!this.militaryTime) {
            if (this.startAmPm === "PM") {
                this.startHour = this.toMilitary(this.timeElements.startHourValueEl.value)
            }
            if (!this.singleDate && this.endAmPm === "PM") {
                this.endHour = this.toMilitary(this.timeElements.endHourValueEl.value)
            }
            if (parseInt(this.timeElements.startHourValueEl.value) === 12 && this.startAmPm === "AM") {
                this.startHour = 0;
            }
            if (!this.singleDate && parseInt(this.timeElements.endHourValueEl.value) === 12 && this.endAmPm === "AM") {
                this.endHour = 0;
            }
        }
        // Set sanitized and formatted dates:
        let endDate = "";
        if (!this.singleDate) {
            endDate = this.dates[1];
        }
        let startDate = this.dates[0];
        this.dates = [];
        if (startDate) {
            this.dates[0] = moment(startDate).hour(this.startHour).minute(this.startMinute).format(this.format);
            // update the UI based on the state
            if (!this.singleDate) {
                this.containerElement.querySelector('.startDateElement').innerHTML = `<b>Start Date: </b> ${this.dates[0]}`;
            } else {
                this.containerElement.querySelector('.startDateElement').innerHTML = `<b>Date: </b> ${this.dates[0]}`;
            }
        }
        if (endDate && !this.singleDate) {
            this.dates[1] = moment(endDate).hour(this.endHour).minute(this.endMinute).format(this.format);
            // update the UI based on the state
            this.containerElement.querySelector('.endDateElement').innerHTML = `<b>End Date: </b> ${this.dates[1]}`;
        }
    }
    // helper method to set dates if provided, return dates if not.
    value(dates, format = this.format) {
        if (typeof dates === "object") {
            if (dates[0]) {
                this.dates[0] = moment(dates[0], format)._i;
            }
            if (dates[1]) {
                this.dates[1] = moment(dates[1], format)._i;
            }
            if (!dates[0] && !dates[1] && typeof dates === "object") {
                if (!this.singleDate) {
                    console.warn("Datepicker.js - WARNING: Use Datepicker.startDate(value) or Datepicker.endDate(value) to set single values. Your date will be set as the start date by default. ");
                }
                this.dates[1] = moment(dates, format)._i;
                this.dates[0] = moment(this.dates[0], format)._i;
            }
            // ensure calendar UI is updated
            if (this.dates.length === 2 && moment(this.dates[0]) > moment(this.dates[1])) {
                let dates = [];
                console.warn("Datepicker.js - WARNING: Tried to set a startDate greater than endDate, your dates were swapped to be chronologically correct.");
                dates[0] = this.dates[1];
                dates[1] = this.dates[0];
                this.dates = dates;
            }
            this.snapTo(this.dates[0]);
        } else if (!dates || typeof dates === undefined || !this.dates.length) {
            // no date supplied, return the dates from the Datepicker state
            if (this.dates[0]) {
                this.dates[0] = moment(this.dates[0]).format(format);
            }
            if (this.dates[1]) {
                this.dates[1] = moment(this.dates[1]).format(format);
            }
            if (this.singleDate) {
                return new Date(this.dates[0])
            } else {
                let dates = [];
                dates[0] = new Date(this.dates[0]);
                dates[1] = new Date(this.dates[1]);
                return dates;
            }
        } else if (typeof dates === "string" || typeof dates === "number") {
            if (!this.singleDate) {
                console.warn("Datepicker.js - WARNING: Use Datepicker.startDate(value) or Datepicker.endDate(value) to set single values. Your date will be set as the start date by default. ");
            }
            this.dates[0] = moment(dates, format)._i;
            // ensure calendar UI is updated
            if (this.dates.length === 2 && moment(this.dates[0]) > moment(this.dates[1])) {
                let dates = [];
                console.warn("Datepicker.js - WARNING: Tried to set a startDate greater than endDate, your dates were swapped to be chronologically correct.");
                dates[0] = this.dates[1];
                dates[1] = this.dates[0];
                this.dates = dates;
            }
            this.snapTo(this.dates[0]);
        }
        if (!dates[0] || !(new Date(dates[0]))) {
            console.error("Datepicker.js - ERROR: Tried to set start date with invalid format or null value!");
        }
        if ((!dates[1] || !(new Date(dates[1]))) && !this.singleDate) {
            console.error("Datepicker.js - ERROR: Tried to set end date with invalid format or null value!");
        }
    }
    // returns start date only
    startDate(value) {
        if (value !== undefined && value !== null && value) {
            this.value([value, (this.dates[1] || new Date())]);
        } else {
            console.error("Datepicker.js - ERROR: Tried to set start date with invalid format or null value!");
        }
        return new Date(this.dates[0]);
    }
    endDate(value) {
        if (value !== undefined && value !== null && value) {
            this.value([(this.dates[0] || new Date()), value]);
        } else {
            console.error("Datepicker.js - ERROR: Tried to set end date with invalid format or null value!");
        }
        return new Date(this.dates[1]);
    }
    // helpers to hide calendar when clicked off.
    isVisible(elem) {
        return !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) && (elem.style.display === 'grid' || elem.style.display === 'block' || elem.style.visibility === "");
    }
    // to test clicks outside calendar element to close it
    isOutsideCalendar(event) {
        return (
            !this.calendarElement.contains(event.target)
            && this.isVisible(this.calendarElement)
            && !this.inputElement.contains(event.target)
            && !event.target.classList.contains('leftArrow')
            && !event.target.classList.contains("rightArrow")
            && !event.target.classList.contains("decrease-year-button")
            && !event.target.classList.contains("increase-year-button")
        );
    }
    // closes calendar if clicks are outside boundaries
    outsideCalendarClick(event) {
        if (this.isOutsideCalendar(event)) {
            this.closeCalendar();
            this.drawInputElement();
        }
    }
    // helper method to set start/end date on each calendar day click
    dayClick(dayCell) {
        this.startHour = parseInt(this.timeElements.startHourValueEl.value);
        this.startMinute = parseInt(this.timeElements.startMinuteValueEl.value);
        if (!this.singleDate) {
            this.endHour = parseInt(this.timeElements.endHourValueEl.value);
            this.endMinute = parseInt(this.timeElements.endMinuteValueEl.value);
        }
        // adjustments for 12h time since Moment only acccepts 24h
        if (!this.militaryTime) {
            if (this.startAmPm === "PM") {
                this.startHour = this.toMilitary(this.timeElements.startHourValueEl.value)
            }
            if (this.endAmPm === "PM" && !this.singleDate) {
                this.endHour = this.toMilitary(this.timeElements.endHourValueEl.value)
            }
            if (parseInt(this.timeElements.startHourValueEl.value) === 12 && this.startAmPm === "AM") {
                this.startHour = 0;
            }
            if (this.endAmPm === "AM" && !this.singleDate && parseInt(this.timeElements.endHourValueEl.value) === 12) {
                this.endHour = 0;
            }
        }
        // set the start/end date in both the UI and the class's state
        if (!this.singleDate) {
            if (this.dates.length > 1 || this.dates.length < 1) {
                this.dates = [];
                this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format(this.format);
                this.containerElement.querySelector('.startDateElement').innerHTML = `<b>Start Date: </b> ${this.dates[0]}`;
                this.containerElement.querySelector('.endDateElement').innerHTML = `<b>End Date: --/--/----  --:--  </b>`;
            } else {
                let startDate = moment(this.dates[0]).set({ h: this.startHour, m: this.startMinute }).unix();
                let clickedDate = moment(dayCell.value).hour(this.endHour).minute(this.endMinute).unix();
                if (startDate > clickedDate) {
                    let largerDate = this.dates[0];
                    this.dates = [];
                    this.dates[1] = moment(largerDate).set({ h: this.endHour, m: this.endMinute }).format(this.format);
                    this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format(this.format);
                    this.containerElement.querySelector('.startDateElement').innerHTML = `<b>Start Date: </b> ${this.dates[0]}`;
                    this.containerElement.querySelector('.endDateElement').innerHTML = `<b>End Date: </b> ${this.dates[1]}`;
                } else {
                    this.dates[1] = moment(dayCell.value).set({ h: this.endHour, m: this.endMinute }).format(this.format);
                    this.containerElement.querySelector('.endDateElement').innerHTML = `<b>End Date: </b> ${this.dates[1]}`;
                }
            }
        } else {
            this.dates = [];
            this.dates[0] = moment(dayCell.value).set({ h: this.startHour, m: this.startMinute }).format(this.format);
            this.containerElement.querySelector('.startDateElement').innerHTML = `<b>Date: </b> ${this.dates[0]}`;
        }
        if (!this.timeValid()) {
            this.startHour = parseInt(this.timeElements.endHourValueEl.value);
            this.startMinute = parseInt(this.timeElements.endMinuteValueEl.value);
            let startMinute = this.endMinute;
            let startHour = this.endHour;
            this.timeElements.startMinuteValueEl.value = startMinute < 10 ? startMinute + "0" : startMinute;
            this.timeElements.startHourValueEl.value = startHour;
            this.setTime();
        }
        // autoClose the calendar when a single date or date range is selected 
        if (!this.singleDate && this.dates.length === 2 && this.options.autoClose) {
            setTimeout(function () {
                this.closeCalendar();
            }.bind(this), 400);
        } else if (this.singleDate && this.dates.length === 1 && this.options.autoClose) {
            setTimeout(function () {
                this.closeCalendar();
            }.bind(this), 400); // setTimeout will need to be removed eventually
        }
        // conditional highlighting prompt
        this.highlightDates();
        this.drawInputElement();
        if ((this.dates.length === 2 || this.singleDate) && this.options.autoClose) {
            setTimeout(function () {
                this.closeCalendar();
            }.bind(this), 700);
        }
    }
    // helper methods to open/close calendar UI
    openCalendar() {
        this.calendarElement.showCalendar();
        this.inputElement.hideEl();
    }
    closeCalendar() {
        this.calendarElement.hideCalendar();
        this.drawInputElement();
        this.inputElement.showEl();
    }
    // helper methods to open/close preset menu UI
    openPresetMenu() {
        this.presetMenuContainer.showPresetMenu();
    }
    closePresetMenu() {
        this.presetMenuContainer.hidePresetMenu();
    }
    // advances the calendar by one month
    nextMonth(event, positiveValue = 1) {
        this.containerElement.innerHTML = "";
        this.moment.add(positiveValue, 'months');
        this.drawCalendar();
        this.drawPresetMenu();
        this.highlightDates();
        this.setTime();
        this.openCalendar();
        this.closePresetMenu();
    }
    // moves the calendar back one month
    lastMonth(event, negativeValue = -1) {
        this.containerElement.innerHTML = "";
        this.moment.add(negativeValue, 'months');
        this.drawCalendar();
        this.drawPresetMenu();
        this.highlightDates();
        this.setTime();
        this.openCalendar();
        this.closePresetMenu();
    }
    // gets leading/trailing dates for calendar UI
    leadingTrailing() {
        let month = parseInt(this.moment.month()) === 1 || parseInt(this.moment.month()) === 0 ? 12 : parseInt(this.moment.month());
        let year = parseInt(this.moment.month()) === 1 || parseInt(this.moment.month()) === 0 ? parseInt(this.moment.year()) - 1 : parseInt(this.moment.year());
        // console.log(this.moment.month(), this.moment.year(), month, year)
        let prevMonth = year + "-" + month;
        let daysInPrevMonth = parseInt(moment(prevMonth, "YYYY-MM").daysInMonth());
        let leading = [];
        let trailing = [];
        for (let i = 1; i < 8; i++) {
            trailing.push(daysInPrevMonth);
            daysInPrevMonth--;
            leading.push(i);
        }
        return new Object({ leading: leading, trailing: trailing });
    }
    // sets highlighted dates on calendar UI
    highlightDates(setProgrammatically = false) {
        let days = this.containerElement.querySelectorAll('.day');
        // adds calendar day highlighted styling
        if (this.dates.length > 0 && this.dates.length === 2) {
            days.forEach(function (day) {
                let indexDate = moment(day.value).format("MM/DD/YYYY");
                let firstDate = moment(this.dates[0]).format("MM/DD/YYYY");
                let secondDate = moment(this.dates[1]).format("MM/DD/YYYY");
                let indexDateX = moment(day.value).format("X");
                let firstDateX = moment(this.dates[0]).format("X");
                let secondDateX = moment(this.dates[1]).format("X");
                if (firstDate === indexDate) {
                    day.classList.add('active');
                    day.setAttribute('aria-pressed', 'true');
                }
                if (secondDate === indexDate) {
                    day.classList.add('active');
                    day.setAttribute('aria-pressed', 'true');
                }
                if (indexDateX > firstDateX && indexDateX < secondDateX) {
                    day.classList.add("highlighted");
                }
            }.bind(this));
        } else {
            days.forEach(function (day) {
                let indexDate = moment(day.value).format("MM/DD/YYYY");
                let firstDate = moment(this.dates[0]).format("MM/DD/YYYY");
                if (firstDate === indexDate && !setProgrammatically) {
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
    // resets Calendar and Input element to their default state with no Date/Times selected
    resetCalendar() {
        this.dates = [];
        this.containerElement.innerHTML = '';
        this.drawCalendar();
        this.drawInputElement();
        this.drawPresetMenu();
        this.closePresetMenu();
    }
    // helper that snaps the calendar UI to a given date
    snapTo(date = this.moment, isVisible) {
        this.moment = moment(date);
        if (this.isVisible(this.calendarElement) || isVisible) {
            this.containerElement.innerHTML = '';
            this.drawCalendar();
            this.drawInputElement();
            this.drawPresetMenu();
            this.closePresetMenu();
            this.setTime(true);
            this.highlightDates(true);
            this.calendarElement.showCalendar();
        } else {
            this.containerElement.innerHTML = '';
            this.drawCalendar();
            this.drawInputElement();
            this.drawPresetMenu();
            this.closePresetMenu();
            this.setTime(true);
            this.highlightDates(true);
            this.closeCalendar();
        }
    }
    // helpers to convert times 12h to 24h and reverse
    toAmPm(hour) {
        hour = parseInt(hour);
        if (hour === 12) {
            return hour;
        } else if (hour === 0) {
            return 0;
        } else {
            return hour > 11 ? hour - 12 : hour;
        }
    }
    toMilitary(hour) {
        hour = parseInt(hour);
        hour = hour === 12 ? hour = 0 : hour;
        return hour < 12 ? hour + 12 : hour;
    }
}
// html element prototypal inheritance of hide/show methods for UI elements
Element.prototype.hideEl = function () {
    this.style.visibility = 'hidden';
}
Element.prototype.showEl = function () {
    this.style.visibility = '';
}
// these hide/show methods specifically tailored to the elements they hide/show
Element.prototype.hideContainer = function () {
    this.style.display = 'none';
}
Element.prototype.showContainer = function () {
    this.style.display = 'block';
}
Element.prototype.hideCalendar = function () {
    this.style.display = 'none';
}
Element.prototype.showCalendar = function () {
    this.style.display = 'grid';
}
Element.prototype.hidePresetMenu = function () {
    this.style.display = 'none';
}
Element.prototype.showPresetMenu = function () {
    this.style.display = 'flex';
}