# Calculator Front End

Front-end implementation of the calculator developed for the Software Engineering course assignment.

**Student:** Chen Jiayuan  
**Student ID:** 832402203

## Overview

The project uses a front-end/back-end architecture. This repository contains only the user interface and browser-side interaction. Mathematical expressions are sent to the back end through HTTP requests, while calculation, validation, and history storage are handled by the server.

The interface is written in plain HTML, CSS, and JavaScript. No front-end framework is required.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, and division
- Decimal numbers
- Parentheses and operator precedence
- Unary positive and negative signs
- Error messages for invalid expressions and division by zero
- Calculation history retrieved from the back end
- Deletion of individual history records
- Removal of all history records
- Reuse of previous expressions
- Result copying
- Keyboard input
- Responsive layout

## Project structure

```text
832402203-calculator-frontend
├── index.html
├── style.css
├── script.js
├── README.md
├── codestyle.md
└── .gitignore
```

`index.html` defines the page structure.  
`style.css` controls the layout and appearance.  
`script.js` handles user input, interface updates, and communication with the back end.

## Requirements

- A recent version of Microsoft Edge, Google Chrome, or another modern browser
- Node.js 18 or later for running a local static server
- The calculator back end running on an accessible address

## Back-end configuration

The back-end address is defined at the beginning of `script.js`:

```js
const API_BASE_URL = "http://localhost:3000";
```

The value above is used for local development. When the back end is deployed, it should be replaced with the public server address.

## Running the project locally

Start the back end before opening the front end. In the back-end project directory, run:

```powershell
npm install
npm start
```

The local back end should then be available at:

```text
http://localhost:3000
```

Its status can be checked at:

```text
http://localhost:3000/api/status
```

Open another terminal and enter the front-end directory:

```powershell
cd C:\Users\hp\Desktop\MIEC\EE308\832402203-calculator-frontend
```

Start a local static server:

```powershell
npx serve . --listen 5500
```

Open the following address in a browser:

```text
http://localhost:5500
```

The front end and back end must remain running at the same time during local testing.

## API usage

The front end exchanges JSON data with the back end through the following endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/status` | Check the server status |
| `POST` | `/api/calculate` | Submit an expression for calculation |
| `GET` | `/api/history` | Retrieve calculation history |
| `DELETE` | `/api/history/:id` | Delete one history record |
| `DELETE` | `/api/history` | Delete all history records |

A calculation request contains the expression only:

```json
{
  "expression": "(2+3)*4"
}
```

The browser does not calculate the final result. It displays the value returned by the back end.

## Keyboard controls

| Key | Action |
| --- | --- |
| `0`–`9` | Enter a number |
| `+`, `-`, `*`, `/` | Enter an operator |
| `(`, `)` | Enter parentheses |
| `.` | Enter a decimal point |
| `Enter` or `=` | Submit the expression |
| `Backspace` | Remove the last character |
| `Esc` | Clear the current expression |

## Test cases

| Expression | Expected result |
| --- | --- |
| `12+8` | `20` |
| `2+3*4` | `14` |
| `(2+3)*4` | `20` |
| `5*-2` | `-10` |
| `0.1+0.2` | `0.3` |
| `8/0` | Division-by-zero error |

History records should remain available after the page is refreshed or the back-end service is restarted. If the back end is stopped, the interface may still accept input, but it cannot produce a new result.