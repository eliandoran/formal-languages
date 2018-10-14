const expand = require("expand-range");
const chalk = require("chalk");

const grammarDefinition = {
    lambdaSymbol: "@",
    separatorSymbol: "$",
    endingSymbol: "&",
    terminalAlphabet: expand("a..z").join(""),
    nonterminalAlphabet: expand("A..Z").join("")
};

const grammarColor = {
    lambdaSymbol: chalk.green,
    separatorSymbol: chalk.gray,
    endingSymbol: chalk.green,
    terminalAlphabet: chalk.yellow.bold,
    nonterminalAlphabet: chalk.blue.bold,
    invalidSymbol: chalk.redBright.bold
};

module.exports = {
    grammarDefinition,
    grammarColor
};
