function calendarPlacement() {
    let context = this;
    let calendarElement = context.containerElement.querySelector('.grid-container');
    // variables
    let calculated = {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        calendarWidth: calendarElement.getBoundingClientRect().width,
        calendarHeight: calendarElement.getBoundingClientRect().height,
        containerHeight: context.containerElement.getBoundingClientRect().height,
        containerWidth: context.containerElement.getBoundingClientRect().width,
        datepickerTop: context.containerElement.querySelector(".launch").getBoundingClientRect().top,
        datepickerBottom: context.containerElement.querySelector(".launch").getBoundingClientRect().bottom,
        datepickerRight: context.containerElement.querySelector(".launch").getBoundingClientRect().right,
        datepickerLeft: context.containerElement.querySelector(".launch").getBoundingClientRect().left,
        datepickerWidth: context.containerElement.querySelector(".launch").getBoundingClientRect().width,
        datepickerHeight: context.containerElement.querySelector(".launch").getBoundingClientRect().height,
        screenCenterX: window.outerWidth/2,
        screenCenterY: window.outerHeight/2,
    }
    // logs
    // console.table(calculated);
    let top;
    let left;
    // set position
    if (calculated.windowWidth > 750) {
        if (calculated.datepickerLeft <= calculated.calendarWidth) {
            left = 2 + calculated.datepickerWidth;
        } else {
            left = ( calculated.calendarWidth * (-1)) - 2;
        }
        // top:
        if (calculated.datepickerTop <= calculated.calendarHeight) {
            top = calculated.datepickerHeight + 2;
        } else {
            top = -1 * calculated.calendarHeight - 2;
        }
    } else if (window.outerWidth > 450) {
        top = 2;
        left = (calculated.screenCenterX - calculated.calendarWidth/2) > 0 ? (calculated.screenCenterX - calculated.calendarWidth/2) : calculated.datepickerLeft;
    } else {
        top = 2;
        left = -2;
    }
    calendarElement.style.position = "absolute";
    calendarElement.style.left = left + "px";
    calendarElement.style.top = top + "px";
    calendarElement.style.zIndex = 9999999 + "";
}