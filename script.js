const API_BASE_URL = "http://localhost:3000";

const expressionDisplay = document.querySelector(".expression");
const resultDisplay = document.querySelector(".result");
const calculatorMessage = document.querySelector("#calculatorMessage");

const inputButtons = document.querySelectorAll(".input");
const clearButton = document.querySelector('[data-action="clear"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const copyResultButton = document.querySelector("#copyResult");

const historyList = document.querySelector("#historyList");
const historyStatus = document.querySelector("#historyStatus");
const clearHistoryButton = document.querySelector("#clearHistory");

let expression = "";
let currentResult = "0";
let justCalculated = false;

function showExpression() {
  expressionDisplay.textContent = expression || "0";
}

function isOperator(value) {
  return ["+", "-", "*", "/"].includes(value);
}

function appendValue(value) {
  calculatorMessage.textContent = "";

  if (justCalculated) {
    if (isOperator(value)) {
      expression = currentResult;
    } else {
      expression = "";
      currentResult = "0";
      resultDisplay.textContent = "0";
    }

    justCalculated = false;
  }

  if (expression.length >= 100) {
    calculatorMessage.textContent = "表达式不能超过 100 个字符";
    return;
  }

  const lastCharacter = expression.slice(-1);

  if (/[0-9]/.test(value) && lastCharacter === ")") {
    expression += "*";
  }

  if (value === "(" && /[0-9)]/.test(lastCharacter)) {
    expression += "*";
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/()]/).pop();

    if (currentNumber.includes(".")) {
      return;
    }

    if (currentNumber === "") {
      expression += "0";
    }
  }

  if (isOperator(value)) {
    if (expression === "") {
      if (value !== "+" && value !== "-") {
        return;
      }
    } else if (isOperator(lastCharacter)) {
      const unarySign =
        (value === "+" || value === "-") &&
        (lastCharacter === "*" || lastCharacter === "/");

      if (!unarySign) {
        expression = expression.slice(0, -1);
      }
    } else if (lastCharacter === "(" && value !== "+" && value !== "-") {
      return;
    }
  }

  if (value === ")") {
    const openingCount = (expression.match(/\(/g) || []).length;
    const closingCount = (expression.match(/\)/g) || []).length;

    if (
      openingCount <= closingCount ||
      expression === "" ||
      isOperator(lastCharacter) ||
      lastCharacter === "("
    ) {
      return;
    }
  }

  expression += value;
  showExpression();
}

function clearCalculator() {
  expression = "";
  currentResult = "0";
  justCalculated = false;

  expressionDisplay.textContent = "0";
  resultDisplay.textContent = "0";
  calculatorMessage.textContent = "";
}

function deleteLastCharacter() {
  if (justCalculated) {
    clearCalculator();
    return;
  }

  expression = expression.slice(0, -1);
  calculatorMessage.textContent = "";
  showExpression();
}

async function calculate() {
  if (expression.trim() === "") {
    return;
  }

  const submittedExpression = expression;

  calculatorMessage.textContent = "正在计算……";
  equalsButton.disabled = true;

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/calculate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          expression: submittedExpression
        })
      }
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "计算失败");
    }

    currentResult = body.data.result;
    resultDisplay.textContent = currentResult;
    expressionDisplay.textContent = `${submittedExpression} =`;

    expression = submittedExpression;
    justCalculated = true;
    calculatorMessage.textContent = "";

    await loadHistory();
  } catch (error) {
    resultDisplay.textContent = "Error";
    calculatorMessage.textContent =
      "无法连接后端，请检查后端服务器是否正在运行";
  } finally {
    equalsButton.disabled = false;
  }
}

async function copyCurrentResult() {
  if (resultDisplay.textContent === "Error") {
    calculatorMessage.textContent = "当前没有可以复制的结果";
    return;
  }

  try {
    await navigator.clipboard.writeText(currentResult);

    copyResultButton.textContent = "已复制";
    calculatorMessage.textContent = "";

    window.setTimeout(function () {
      copyResultButton.textContent = "复制结果";
    }, 1200);
  } catch (error) {
    calculatorMessage.textContent = "复制失败，请手动选择结果";
  }
}

function useHistoryExpression(savedExpression) {
  expression = savedExpression;
  currentResult = "0";
  justCalculated = false;

  expressionDisplay.textContent = expression;
  resultDisplay.textContent = "0";
  calculatorMessage.textContent = "已将历史表达式放回计算器";

  document.querySelector(".calculator").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function formatHistoryTime(value) {
  return new Date(value).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderHistory(records) {
  historyList.replaceChildren();
  clearHistoryButton.disabled = records.length === 0;

  if (records.length === 0) {
    const emptyItem = document.createElement("li");

    emptyItem.className = "empty-history";
    emptyItem.textContent = "暂无计算记录";
    historyList.appendChild(emptyItem);

    return;
  }

  records.forEach(function (record) {
    const listItem = document.createElement("li");
    listItem.className = "history-item";

    const content = document.createElement("div");
    content.className = "history-content";

    const expressionText = document.createElement("span");
    expressionText.className = "history-expression";
    expressionText.textContent = record.expression;

    const resultText = document.createElement("strong");
    resultText.className = "history-result";
    resultText.textContent = `= ${record.result}`;

    const timeText = document.createElement("time");
    timeText.className = "history-time";
    timeText.textContent = formatHistoryTime(record.createdAt);

    const actions = document.createElement("div");
    actions.className = "history-actions";

    const useButton = document.createElement("button");
    useButton.type = "button";
    useButton.className = "use-history";
    useButton.dataset.expression = record.expression;
    useButton.textContent = "使用";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-history";
    deleteButton.dataset.id = record.id;
    deleteButton.textContent = "删除";

    content.appendChild(expressionText);
    content.appendChild(resultText);
    content.appendChild(timeText);

    actions.appendChild(useButton);
    actions.appendChild(deleteButton);

    listItem.appendChild(content);
    listItem.appendChild(actions);

    historyList.appendChild(listItem);
  });
}

async function loadHistory() {
  historyStatus.textContent = "正在加载……";

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/history`
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "加载失败");
    }

    renderHistory(body.data);
    historyStatus.textContent = `共 ${body.data.length} 条记录`;
  } catch (error) {
    historyStatus.textContent = "无法连接后端服务器";
  }
}

async function deleteHistoryRecord(recordId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/history/${recordId}`,
      {
        method: "DELETE"
      }
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "删除失败");
    }

    await loadHistory();
  } catch (error) {
    historyStatus.textContent = "删除失败，请检查后端服务器";
  }
}

async function clearAllHistory() {
  const confirmed = window.confirm("确定要清空全部历史记录吗？");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/history`,
      {
        method: "DELETE"
      }
    );

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message || "清空失败");
    }

    await loadHistory();
  } catch (error) {
    historyStatus.textContent = "清空失败，请检查后端服务器";
  }
}

inputButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    appendValue(button.dataset.value);
  });
});

clearButton.addEventListener("click", clearCalculator);
deleteButton.addEventListener("click", deleteLastCharacter);
equalsButton.addEventListener("click", calculate);
copyResultButton.addEventListener("click", copyCurrentResult);
clearHistoryButton.addEventListener("click", clearAllHistory);

historyList.addEventListener("click", function (event) {
  const useButton = event.target.closest(".use-history");

  if (useButton) {
    useHistoryExpression(useButton.dataset.expression);
    return;
  }

  const deleteButton = event.target.closest(".delete-history");

  if (deleteButton) {
    deleteHistoryRecord(deleteButton.dataset.id);
  }
});

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    appendValue(key);
    return;
  }

  if (["+", "-", "*", "/", "(", ")"].includes(key)) {
    appendValue(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    deleteLastCharacter();
    return;
  }

  if (key === "Escape") {
    clearCalculator();
  }
});

loadHistory();