<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Dependencies](#Dependencies)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)


<!-- ABOUT THE PROJECT -->
## About The Project

![DatepickerV1 0 0](https://user-images.githubusercontent.com/33035056/110176220-94e68a80-7dc8-11eb-9bef-264845c457f6.gif)

There are many great datepickers available on GitHub, however, I didn't find one that really suited my needs. 

Here's why:
* I hate dependencies like jQuery
* I want the code to be as lightweight and portable as possible.
* I want programmable features that HTML5 `<input type="date"/>` doesn't offer 

Of course, no one datepicker will serve all projects since your needs may be different. So I'll be adding more to this API in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue.

### Dependencies

Since the goal of this project is to use only vanilla JavaScript and Moment.js, we have only one dependency:
* [Moment.js](https://www.momentjs.com/)

<!-- GETTING STARTED -->
## Getting Started
**If you do not plan to contribute your changes and just want to play around or implement this project:**
1. Clone the repo
```sh
git clone https://github.com/ctrachte/Datepicker.js
```
2. open `Datepicker.html` in your browser of choice to view and test behavior
3. Place the Datepicker.js and moment.js files in the appropriate directory in your project *(for many, that will be your bundled JS helpers or packages directory)*

5. Adjust the options as necessary for your needs, be sure to supply the Datepicker options with the appropriate container HTML element node.

<!-- USAGE EXAMPLES -->
## Usage

Insert the following example code into wherever your Javascript lives for the component you want the Datepicker in:
```
    // be sure to change the options provided to meet your implementation's needs.
    const testDatepicker = new Datepicker({
        containerElement: document.querySelector('.DatepickerContainer'), // should be the HTML container element you want the datepicker to appear in. *REQUIRED*
        presetMenu: true, // preset date ranges to choose from
        singleDate: false, // single date picker or date range
        autoClose: false, // calendar will close automatically after choosing dates
        timePicker: true, // whether or not the calendar UI will allow the user to choose start/end times
        clearDates:false, // whether or not the "X" button resets the calendar or closes it
        leadingTrailingDates: true, // whether or not the calendar will show leading and trailing dates for each month
        militaryTime: false, // 24hr or 12hr
        menuOptions: [{ title: 'Today', values: [new Date(), new Date()] }], // add custom preset menu options
        startDateLabel: "Event Start: ", // customize start date label
        endDateLabel: "Event End: ", // customize end date label
        // event listeners:
        onChange: function () {
            console.log("onChange:", this.dates); // fires every time a date or time is changed
        },
        onSubmit: function () {
            console.log("onSubmit:", this.dates); fires every time the user clicks the checkmark button on the calendar
        },
        onClose: function () {
            console.log("onClose:", this.dates); fires every time the calendar UI is closed, with or without selection
        }
    });
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are **greatly appreciated** towards the final goal of a perfect datepicker!

[Please visit this contribution guide for GitHub open source if you are unsure about any of these steps:](https://gist.github.com/Chaser324/ce0505fbed06b947d962)

1. Fork the Project (top right there should be a button)
2. Look through the [issues](https://github.com/ctrachte/Datepicker.js/issues), and choose one that is not in progress on the [project board](https://github.com/ctrachte/Datepicker.js/projects/1)
3. Comment on the issue and I will assign it to you.
4. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
5. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the Branch (`git push origin feature/AmazingFeature`)
7. Please track your progress on the [project board](https://github.com/ctrachte/Datepicker.js/projects/1)
8. Open a Pull Request 

*Code will be reviewed before being merged. If your code does not quite work or needs revision it may not be merged to the master.*


<!-- LICENSE -->
## License

Distributed under the MIT License. 


<!-- CONTACT -->
## Contact

Caleb Trachte - *contact info will not be posted here, if you know me, message me*

Project Link: [https://github.com/ctrachte/Datepicker.js/projects/1](https://github.com/ctrachte/Datepicker.js/projects/1)
