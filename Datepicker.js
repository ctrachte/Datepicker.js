
class clsDatepicker {
    constructor (options) {
        this.containerElement = options.containerElement;
        this.moment = moment(moment(), "DD MM YYY h:mm:ss", true);
        console.log(this.moment);
    }

}
