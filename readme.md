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

![DatepickerV1 0 0](https://github.com/ctrachte/Datepicker.js/blob/65613f45108fb9f3d29162b277064d9ef489f54c/Datepicker_V1.0.0.gif)

There are many great datepickers available on GitHub, however, I didn't find one that really suited my needs. The hardest thing to find is a datepicker that can do a specific combination of features.

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

1.) You will first need a recent version of Moment.js installed. 
 - You can use the one included in the helpers folder of this project *  _*RECOMMENDED*_ *
 -  or download the latest version from [their website](https://momentjs.com/).

2.) Download the add the Datepicker.js and Datepicker.css files to their appropriate directories in your project.
 - you will need to reference them in your project in a way that they are in scope to the code you are initializing the datepicker with.  

3.) Insert the following example code into wherever your Javascript lives for the component you want the Datepicker in:
```
    // be sure to change the options provided to meet your implementation's needs.
    const testDatepicker = new Datepicker({
        containerElement: document.querySelector('.DatepickerContainer'), // should be the HTML container element you want the datepicker to appear in. *REQUIRED*
        presetMenu: true, // preset date ranges to choose from
        singleDate: false, // single date picker or date range
        format: "MM/DD/YYYY hh:mm A" // moment formats only!
        autoClose: false, // calendar will close automatically after choosing dates
        timePicker: true, // whether or not the calendar UI will allow the user to choose start/end times
        clearDates:false, // whether or not the "X" button resets the calendar or closes it
        leadingTrailingDates: true, // whether or not the calendar will show leading and trailing dates for each month
        militaryTime: false, // 24hr or 12hr
        menuOptions: [{ title: 'Today', values: [new Date(), new Date()] }], // add custom preset menu options
        startDateLabel: "Event Start: ", // customize start date label
        endDateLabel: "Event End: ", // customize end date label
        // max: moment("08/14/2022"), // Optional - maximum date allowed for users to click, must be a moment date format
        // min: moment("08/14/2021"), // Optional - Minimum date allowed for users to click, must be a moment date format
        defaults: false, // Optional - array of start and end dates [new Date(), new Date()] that the datepicker will default to if no dates chosen.
        // event listeners:
        onChange: function () {
            console.log("onChange:", this.dates); // fires every time a date or time is changed
        },
        onSubmit: function () {
            console.log("onSubmit:", this.dates); // fires every time the user clicks the checkmark button on the calendar
        },
        onClose: function () {
            console.log("onClose:", this.dates); // fires every time the calendar UI is closed, with or without selection
        }
    });
```

4.) Adjust the options above to meet the needs of your project, or the project's component you are implementing the datepicker in. 

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
