# Front-end Code Style

This project follows the Google JavaScript Style Guide with minor adjustments for a small course project. The same general principles are applied to the HTML and CSS files.

## General rules

- Source files use UTF-8 encoding.
- English is used for variable names, function names, and CSS class names.
- Two spaces are used for indentation.
- Tabs are not used for indentation.
- Each file ends with a newline.
- Unnecessary comments and unused code should be removed before submission.
- Comments should explain the reason for a decision rather than repeat the code.

## HTML

- HTML elements and attributes use lowercase letters.
- Attribute values are enclosed in double quotation marks.
- Semantic elements such as `main`, `section`, `button`, and `time` are preferred where appropriate.
- Each button specifies `type="button"` to prevent unintended form submission.
- Class names describe the role of an element rather than its visual position.
- Indentation reflects the nesting of elements.

Example:

    <button type="button" class="button operator" data-value="+">
      +
    </button>

## CSS

- Class names use lowercase words separated by hyphens, such as `history-panel`.
- One selector is placed on each line when several selectors share a rule.
- Related declarations are grouped together.
- Layout properties appear before colours and visual details where practical.
- Repeated colours and spacing values should remain consistent across the interface.
- Responsive rules are placed near the end of the file.
- `!important` should be avoided unless there is a specific reason to use it.

Example:

    .history-panel {
      padding: 24px;
      background-color: #ffffff;
      border-radius: 22px;
    }

## JavaScript

### Naming

Variables and functions use `camelCase`.

Examples:

    currentResult
    loadHistory
    deleteHistoryRecord

Constants that represent configuration values use uppercase words separated by underscores.

Example:

    const API_BASE_URL = "http://localhost:3000";

Names should describe their purpose. Short names such as `x`, `data1`, or `temp` are avoided unless their meaning is clear from a small local context.

### Declarations

- `const` is used when a variable is not reassigned.
- `let` is used when reassignment is required.
- `var` is not used.
- One variable is declared per statement when separate declarations improve readability.

### Strings

Double quotation marks are used for ordinary strings. Template literals are used when a string contains variables.

Example:

    historyStatus.textContent = `Total: ${records.length}`;

### Equality and conditions

Strict equality operators are used:

    value === "Error"
    recordId !== 0

Conditions should be kept readable. Complex checks may be divided across several lines.

### Functions

- A function should perform one main task.
- Function names begin with a verb where possible.
- Early returns are used to avoid unnecessary nesting.
- Repeated behaviour should be placed in a reusable function.
- Event listeners call named functions when the operation contains substantial logic.

### Asynchronous requests

Requests to the back end use `async` and `await`. Each request checks `response.ok` before using returned data.

Network requests are placed inside `try...catch` blocks so that connection failures can be shown to the user.

### DOM operations

Frequently used elements are selected once and stored in constants. Text received from the server is inserted with `textContent` instead of `innerHTML`.

Event delegation is used for history buttons because these buttons are created dynamically.

### Semicolons and spacing

- Statements end with semicolons.
- A space is placed after commas and around operators.
- A space is placed before the opening brace of a block.
- Empty lines separate distinct parts of a function, but excessive blank lines are avoided.

## File responsibilities

- `index.html` contains the page structure.
- `style.css` contains layout and presentation rules.
- `script.js` contains interaction logic and API requests.
- Mathematical calculation is not implemented in the front end.

## Final check

Before committing code:

1. Confirm that the browser console contains no unexpected errors.
2. Remove debugging statements that are no longer needed.
3. Check that names follow the conventions above.
4. Test the page with both the front end and back end running.
5. Stop the back end and confirm that the front end cannot produce a new result.