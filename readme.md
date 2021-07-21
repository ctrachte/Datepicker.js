<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Dependencies](#Dependencies)
* [Getting Started](#getting-started)
  * [Git Clone](#Using-Git)
  * [NPM](#Using-NPM)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Browser Support](#Browser-Support)



<!-- ABOUT THE PROJECT -->
## About The Project

![DatepickerV1 0 0](https://github.com/ctrachte/Datepicker.js/blob/65613f45108fb9f3d29162b277064d9ef489f54c/Datepicker_V1.0.0.gif)

There are many great datepickers available on GitHub, however, I didn't find one that really suited my needs. The hardest thing to find is a datepicker that can do a specific combination of features.

Here's a few other reasons:
* I hate (unnecessary) dependencies like jQuery
* I want the code to be as lightweight and portable as possible.
* I want programmable features that HTML5 `<input type="date"/>` doesn't offer 

Of course, no one datepicker will serve all projects since your needs may be different. So I'll be adding more to this API in the near future. You may also suggest changes by forking this repo and creating a pull request or opening an issue.

I am the creator, and currently contribute and maintain this project almost entirely myself. I have reviewed and accepted some pull requests along the way however, and I am happy to review and merge any helpful PRs as soon as I find time. If you want to contribute checkout the [Contributing](#contributing) section!

### Dependencies

Since the goal of this project is to use only vanilla JavaScript and Moment.js, we have only one dependency:
* [Moment.js](https://www.momentjs.com/)

<!-- GETTING STARTED -->
## Getting Started
### Using Git
1. Clone the repo
```
git clone https://github.com/ctrachte/Datepicker.js
```
2. open `Datepicker.html` in your browser of choice to view and test behavior
3. Place the Datepicker.js and moment.js files in the appropriate directory in your project *(for many, that will be your bundled JS helpers or packages directory)*

5. Adjust the options as necessary for your needs, be sure to supply the Datepicker options with the appropriate container HTML element node.

### Using NPM
1. Install the npm package:
```
npm i --save moment-datepicker-js
```
2. open `Datepicker.html` in your browser of choice to view and test behavior
3. delete Datepicker.html after testing, you will not need this file. 
4. Scope the Datepicker.js, DatepickerSmall.css and moment.js files in the appropriate places in your project 
5. Adjust the options as necessary for your needs, be sure to supply the Datepicker options with the appropriate container HTML element node.

<!-- USAGE EXAMPLES -->
## Usage

1.) You will first need a recent version of Moment.js installed. 
 - You can use the one included in the helpers folder of this project *  _*RECOMMENDED*_ *
 -  or download the latest version from [their website](https://momentjs.com/).

2.) Download and add the Datepicker.js and Datepicker.css files to their appropriate directories in your project.
 - you will need to reference them in your project in a way that they are in scope to the code you are initializing the datepicker with.  

3.) Insert the following example code into wherever your Javascript lives for the component you want the Datepicker in:
```
    import Datepicker from "./Datepicker.js"
    // there should only be this one variable here to instantiate the class into the container element 
    const testDatepicker = new Datepicker({
        containerElement: document.querySelector('.DatepickerContainer'),
        presetMenu: true,
        singleDate: false,
        autoClose: false,
        timePicker: false,
        leadingTrailingDates: true,
        clearDates: true,
        defaults: false,
        // militaryTime: false,
        // max: moment("08/14/2022"),
        // min: new Date("08/14/2021"),
        // defaults: [new Date('08/14/2023'),new Date('08/14/2023')],
        menuOptions: [{ title: 'Today', values: [new Date(), new Date()] }],
        startDateLabel: "Reservation Start: ",
        endDateLabel: "Reservation End: ",
        // onChange: function () {
        //     console.log("onChange:", this.dates);
        // },
        // onSubmit: function () {
        //     console.log("onSubmit:", this.dates);
        // },
        // onClose: function () {
        //     console.log("onClose:", this.dates);
        // }
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

Caleb Trachte - *contact info available for close friends and associates only.*

Project Link: [https://github.com/ctrachte/Datepicker.js/projects/1](https://github.com/ctrachte/Datepicker.js/projects/1)

## Browser Support:
![Chrome](https://github.com/jepso-ci/browser-logos/blob/17f4f7fa25ec38901383fcd49312ca44843e55c5/images/chrome.svg) | ![Firefox](https://github.com/jepso-ci/browser-logos/blob/17f4f7fa25ec38901383fcd49312ca44843e55c5/images/firefox.svg) | ![IE](https://github.com/jepso-ci/browser-logos/blob/17f4f7fa25ec38901383fcd49312ca44843e55c5/images/ie.svg) | ![Opera](https://github.com/jepso-ci/browser-logos/blob/17f4f7fa25ec38901383fcd49312ca44843e55c5/images/opera.svg) | ![Safari](https://github.com/alrra/browser-logos/blob/7bfef89b8bc38373d5d062db3aa36d2939e9ab2b/src/safari/safari_128x128.png) | ![Edge](https://github.com/alrra/browser-logos/blob/7bfef89b8bc38373d5d062db3aa36d2939e9ab2b/src/edge/edge_128x128.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | *Not supported* ❌ | *Not tested* |  Latest ✔ |   Latest ✔ |
