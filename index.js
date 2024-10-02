const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
const clear = () => {
  process.stdout.write('\u001b[2J');
  process.stdout.write('\u001b[1;1H');
};

clear();
const mood = prompt("How are you feeling? ");
prompt(`Why are you feeling "${mood}"? `);

console.log("\nInteresting...");
prompt("Just say anything when you are ready to begin. ");
clear();

console.log("Let's play a game...");
console.log("I'm going to try to guess your name in just three questions.\n");

const begin = prompt("What letter does your name begin with? ").toLowerCase();
const end = prompt("What letter does your name end with? ").toLowerCase();
let notNumber = true;
let length;
while (notNumber) {
  length = prompt("How many letters are in your name? ");
  if (!isNaN(length)) {
    notNumber = false;
    length = Number(length);
  } else {
    console.log("\nPlease enter a number.\n");
  }
}

let trainedNames;

try {
  const data = fs.readFileSync('./users.txt', 'utf8');
  trainedNames = JSON.parse(data);
} catch (err) {
  trainedNames = [];
}

// Guessing algorithm...
let guess;
let tnf = trainedNames.filter((el) => el.startsWith(begin) && el.endsWith(end) && el.length === length);
if (tnf.length) {
  if (tnf.length > 1) guess = tnf[Math.floor((Math.random() * tnf.length))];
  else guess = tnf[0];
}

let wrongAnswer = true;
while (wrongAnswer) {
  console.log("\n");
  if (guess) {
    var guessArr = guess.split("");
    guessArr[0] = guessArr[0].toUpperCase();
    guessArr = guessArr.join("");
  } else console.log("Uhhh...you stumped me.");
  
  const isAIRight = guess ? prompt(`Is your name ${guessArr}? `).toLowerCase() : false;

  wrongAnswer = false;

  if (isAIRight === "y" || isAIRight === "yes") {
    console.log("Lucky guess, huh.");
  } else if (isAIRight === "n" || isAIRight === "no" || !guess) {
    const name = prompt("What is your name then? ");
    console.log("Ohhh...I should have known that!");
    if (!trainedNames.includes(name)) {
      trainedNames.push(name.toLowerCase());
    }
  } else {
    console.log("Please enter the correct format. (n/no) or (y/yes)");
  }
}

try {
  fs.writeFileSync('./users.txt', `${JSON.stringify(trainedNames)}`);
  // file written successfully
} catch (err) {
  console.error(err);
}

