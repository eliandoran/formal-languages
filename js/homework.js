const chalk = require("chalk");

const GrammarParser = require("./src/grammar");
const GrammarColorizer = require("./src/colorizer");
const config = require("./config");

const parser = new GrammarParser(config.grammarDefinition);
const colorizer = new GrammarColorizer(config.grammarDefinition, config.grammarColor);

const getSetString = (set) =>
    `{ ${ [...set]
        .map((symbol) => symbol !== null ? symbol : "lambda")
        .join(", ") } }`;

const getArrowIndicator = (startPos, length) =>
    [
        " ".repeat(Math.max(0, startPos - 1)),
        "^",
        "~".repeat(length - 1)
    ].join("");

function tryParse(input) {
    try {
        const grammar = parser.parse(input);
        return grammar;
    } catch (e) {
        const message = [
            `\nEroare de validare:`,
            `\t${chalk.whiteBright(e.message)}`,
            `la coloana ${e.startPos}:`,
            `\t${colorizer.colorize(input)}`,
            `\t${chalk.red.bold(getArrowIndicator(e.startPos, e.length))}`
        ].join("\n");

        console.error(chalk.redBright(message));        
    }

    return null;
}

function display(input) {
    const grammar = tryParse(input);

    if (grammar === null)
        return;

    let productionsOutput = grammar.productions
        .map((production) => `${production.initialSymbol} -> ${production.replacement || "lambda"}`)
        .join("; ");

    let nonterminalSymbolsOutput = 
        `V_N = ${ getSetString(grammar.nonterminalSymbols) }`;

    let terminalSymbolsOutput =
        `V_T = ${ getSetString(grammar.terminalSymbols) }`;
    
    console.log([
        productionsOutput,
        nonterminalSymbolsOutput,
        terminalSymbolsOutput ].join("\n"));
}

// display("SAB$AaA$A@$Ba&");

const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

console.log(`\

${chalk.yellow.bold("Temă Limbaje formale")}
${chalk.white.bold("Autor: Doran Adoris Elian, 10/2018")}

Introduceți textul unei gramatici independente de context pentru a afișa mulțimile \
${chalk.green("V_N")}, ${chalk.green("V_T")}, ${chalk.green("S")} și ${chalk.green("P")} aferente.

Regulile de introducere a datelor sunt următoarele:
  1.  Primul simbol din prima producție reprezintă axioma (simbolul de start);
  2.  Simbolul de separare dintre producții este ${colorizer.colorize("$")};
  3.  Simbolurile neterminale sunt scrise cu litere mari;
  4.  Simbolurile terminale sunt scrise cu litere mici;
  5.  Secvența vidă va fi ${colorizer.colorize("@")}.
  6.  Simbolul care marchează sfârșitul gramaticii este ${colorizer.colorize("&")}.

Exemplu:
  ${colorizer.colorize("SAB$AaA$A@$Ba&")}
`
);

prompt([
   {
       name: "grammar",
       message: "Date gramatică:",
       transformer: (input) => colorizer.colorize(input),
       validate: (input) => {
            try {
                parser.parse(input);
            } catch (e) {
                const message = [
                    `${chalk.whiteBright(e.message)}`,
                    `\t${colorizer.colorize(input)}`
                ];

                if (e.startPos !== undefined)
                    message.push(`\t${chalk.red.bold(getArrowIndicator(e.startPos, e.length))}`);

                return chalk.redBright(message.join("\n"));
            }

            return true;
       }
   } 
]).then((userData) => {
    display(userData.grammar);
});
