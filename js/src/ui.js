const chalk = require("chalk");
const GrammarParser = require("./grammar");
const GrammarColorizer = require("./colorizer");

class GrammarInterpreterUI {
    constructor(config) {
        this.grammarDefinition = config.grammarDefinition;
        this.grammarColor = config.grammarColor;

        this.parser = new GrammarParser(this.grammarDefinition);
        this.colorizer = new GrammarColorizer(this.grammarDefinition, this.grammarColor);
    }

    display(input) {
        const grammar = this.parser.parse(input);
    
        if (grammar === null)
            return;
    
        let productionsOutput = grammar.productions
            .map((production) => `${production.initialSymbol} -> ${production.replacement || "lambda"}`)
            .join("; ");
    
        let nonterminalSymbolsOutput = 
            `V_N = ${ this._getSetString(grammar.nonterminalSymbols) }`;
    
        let terminalSymbolsOutput =
            `V_T = ${ this._getSetString(grammar.terminalSymbols) }`;
        
        console.log([
            productionsOutput,
            nonterminalSymbolsOutput,
            terminalSymbolsOutput ].join("\n"));
    }

    start() {
        const inquirer = require("inquirer");
        const prompt = inquirer.createPromptModule();
        const colorizer = this.colorizer;
        const parser = this.parser;

        console.log(this._getWelcomeMessage());

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
         
                         if (e.startPos !== undefined) {
                             const arrow = this._getArrowIndicator(e.startPos, e.length);
                             message.push(`\t${chalk.red.bold(arrow)}`);
                         }
         
                         return chalk.redBright(message.join("\n"));
                     }
         
                     return true;
                }
            } 
         ]).then((userData) => {
             this.display(userData.grammar);
         });
    }

    _getSetString(set) {
        return `{ ${ [...set]
            .map((symbol) => symbol !== null ? symbol : "lambda")
            .join(", ") } }`;
    }

    _getArrowIndicator(startPos, length) {
        return [
            " ".repeat(Math.max(0, startPos - 1)),
            "^",
            "~".repeat(length - 1)
        ].join("");
    }

    _getWelcomeMessage() {
        const colorizer = this.colorizer;

        return `\
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
    }
}

module.exports = GrammarInterpreterUI;