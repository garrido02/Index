// All available buttons
const buttonValues = [
    "AC", "+/-", "%", "÷",
    "7", "8", "9", "x",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", ".", "="
];

// All the operands
const operands = ["+", "-", "÷", "x", "="];

// All the function operands
const functions = ["AC", "+/-", "%"];

// Operation variables
let A = 0;
let operand = null;
let B = null;

// Catch display so we can show the results
let display = document.getElementById("display");
let previous = document.getElementById("previous");
display.value = "0";

// Loop to create all the buttons thus avoiding repeated code on the html
for (let i = 0; i < buttonValues.length; i += 1) {
    // Creating the buttons
    // Get the value of the button
    let value = buttonValues[i];
    // Create the button
    let button = document.createElement("button");
    // Set the button text to its value
    button.innerText = value;
    // Add event listener to each button
    button.addEventListener("click", () => operation(value))
    // Add the buttons to the calculator
    document.getElementById("buttons").appendChild(button);

    // Styling the buttons
    // Handle zero to be bigger
    if (value == "0") {
        button.style.width = "200px";
        button.style.gridColumn = "span 2";
    }

    // Assign colors to the appropriate buttons
    if (operands.includes(value)) {
        button.style.backgroundColor = "#FF9500";
    } else if (functions.includes(value)) {
        button.style.backgroundColor = "#D4D4D2";
        button.style.color = "#1C1C1C"
    }
}


// Function that handles the operations. Receives value as the button clicked
function operation(value) {
    // Handle the clicks of the various buttons
    if (operands.includes(value)) {
       if (value == "="){
            if (operand != null) {
                B = display.value;
                let numA = Number(A);
                let numB = Number(B);
                switch(operand){
                    case "÷":
                        if (numB === 0){
                            display.value = "Error";
                        } else {
                            display.value = numA / numB;
                        }
                        break;
                    case "+":
                        display.value = numA + numB;
                        break;
                    case "-":
                        display.value = numA - numB;
                        break;
                    case "x":
                        display.value = numA * numB;
                        break;
                }
                clearAll();
            }
       } else {
           operand = value;
           A = display.value;
           previous.value = A;
           display.value = "0";
       }
    } else if (functions.includes(value)) {
        switch (value) {
            case "+/-":
                if (display.value != "0") {
                    if (display.value[0] == "-") {
                        display.value = display.value.slice(1);
                    } else {
                        display.value = "-" + display.value;
                    }
                }
                break;
            case "AC":
                clearAll();
                display.value = "0";
                break;
            case "%":
                display.value = Number(display.value) / 100;
                break;
        }
    } else {
        // Handle decimal click
        if (value == "."){
            // Avoid multiple ".". Ex: 0...1
            if (!display.value.includes(".")) {
                display.value += value;
            }
        // Avoid double zeros on the beginning. Ex: 00001
        } else if (display.value == "0") {
            display.value = value;
        } else {
            display.value += value;
        }
    }
}

// Function that resets the calculator
function clearAll() {
    A = 0;
    operand = null;
    B = null;
    previous.value = "";
}