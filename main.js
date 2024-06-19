import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");
const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(evt) {
  evt.preventDefault();

  if (document.querySelector(".error")) {
    return;
  }

  const startingAmount = Number(
    document.getElementById("starting-amount").value.replace(",", ".")
  );

  const additionalContribution = Number(
    document.getElementById("additional-contribution").value.replace(",", ".")
  );

  const timeAmount = Number(document.getElementById("time-amount").value);

  const timeAmountPeriod = document.getElementById("time-amount-period").value;

  const returnRate = Number(document.getElementById("return-rate").value);

  const returnRatePeriod = document.getElementById("evaluation-period").value;

  const taxRate = Number(
    document.getElementById("tax-rate").value.replace(",", ".")
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  new Chart(finalMoneyChart, {
    type: "doughnut",
    data: {
      labels: ["Total Investido", "Rendimento", "Imposto"],
      datasets: [
        {
          //label: "My First Dataset",
          data: [
            formatCurrency(finalInvestmentObject.investedAmount),
            formatCurrency(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrency(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            "rgb(255,99,132)",
            "rgb(54,162,235)",
            "rgb(255,205,86)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });
}

new Chart(progressionChart, {
  type: "bar",
  data: {
    labels: returnsArray.map((investmentObject) => formatCurrency(investmentObject.month)),
    datasets: [
      {
        label: "Total Investido",
        data: returnsArray.map(
          (investmentObject) => formatCurrency(investmentObject.investedAmount
        )),
        backgroundColor: "rgb(255,99,132)",
      },
      {
        label: "Retorno do Investimento",
        data: returnsArray.map(
          (investmentObject) => formatCurrency(investmentObject.interestReturns
        )),
        backgroundColor: "rgb(54,162,235)",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { stacked: true },
    },
    y: {
      stacked: true,
    },
  },
});

function clearForm() {
  form["starting-amount"].value = "";
  form["additional-contribution"].value = "";
  form["time-amount"].value = "";
  form["retunr-rate"].value = "";
  form["tax-rate"].value = "";

  const errorInputContainers = document.querySelectorAll(".error");

  for (const errorInputContainer of errorInputContainers) {
    errorInputContainer.classList.remove("error");
    errorInputContainer.parentElement.querySelector("p").remove();
  }
}

function validateInput(evt) {
  //console.log(evt.target)
  if (evt.target.value === "") {
    return;
  }

  const { parentElement } = evt.target;
  const grandParentElement = evt.target.parentElement;
  const inputValue = evt.target.value.replace(",", ".");

  if (
    !parentElement.classList.contains("error") &&
    (isNaN(inputValue) || Number(inputValue) <= 0)
  ) {
    const errorTextElement = document.createElement("p");
    errorTextElement.classList.add("text-red-500");
    errorTextElement.innerHTML = "Insira um valor númerico e maior que zero";

    parentElement.classList.add("error");

    grandParentElement.appendChild(errorTextElement);
  } else if (
    parentElement.classList.contains("error") &&
    !isNaN(inputValue) &&
    Number(inputValue) > 0
  ) {
    parentElement.classList.remove("error");
    grandParentElement.querySelector("p").remove();
  }
}

for (const formElement of form) {
  if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
    formElement.addEventListener("blur", validateInput);
  }
}

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
