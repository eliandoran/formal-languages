const fs = require("fs");
const chalk = require("chalk");
const GrammarParser = require("./grammar");
const GrammarColorizer = require("./colorizer");

class GrammarInterpreterUI {
    constructor(config) {
        this.exampleInput = "SAB$AaA$A@$Ba&";

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
            .map((production) => `${this._getPrintableSymbol(production.initialSymbol)} → ${this._getPrintableSymbol(production.replacement)}`)
            .join("; ");
    
        let nonterminalSymbolsOutput = 
            `Vₙ = ${ this._getSetString(grammar.nonterminalSymbols) }`;
    
        let terminalSymbolsOutput =
            `Vₜ = ${ this._getSetString(grammar.terminalSymbols) }`;
        
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

        prompt.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

        prompt([
            {
                type: "list",
                name: "inputMethod",
                message: "Selectați modul de introducere a datelor:",
                choices: [
                    {
                        name: "De la tastatură",
                        value: "keyboard"
                    },

                    {
                        name: "Dintr-un fișier",
                        value: "file"
                    }
                ]
            },

            {
                type: 'fuzzypath',
                name: 'file',
                pathFilter: (isDirectory) => !isDirectory,
                rootPath: './examples',
                message: "Selectați fișierul de intrare:",
                suggestOnly: false,
                when: (data) => data.inputMethod === "file"
            },

            {
                name: "keyboard",
                message: "Date gramatică:",
                default: this.exampleInput,
                transformer: (input) => colorizer.colorize(input),
                validate: (input) => {
                    try {
                        parser.parse(input);
                    } catch (e) {
                        return this._getPrintableValidationException(e, input);
                    }
        
                    return true;
                },
                when: (data) => data.inputMethod === "keyboard"
            }
        ]).then((userData) => {
            console.log();

            let grammar;
            if (userData.inputMethod === "file")
                grammar = fs.readFileSync(userData.file).toString();
            else
                grammar = userData.keyboard;

            grammar = grammar.trim();

            try {
                this.display(grammar);
            } catch (e) {
                console.log(this._getPrintableValidationException(e, grammar));
            }
        });
    }

    _getPrintableValidationException(e, input) {
        const message = [
            `${chalk.whiteBright(e.message)}`,
            `\t${this.colorizer.colorize(input)}`
        ];

        if (e.startPos !== undefined) {
            const arrow = this._getArrowIndicator(e.startPos, e.length);
            message.push(`\t${chalk.red.bold(arrow)}`);
        }

        return chalk.redBright(message.join("\n"));
    }

    _getPrintableSymbol(symbols) {
        if (symbols == null)
            return this.grammarColor.lambdaSymbol("λ");
        return this.colorizer.colorize(symbols);
    }

    _getSetString(set) {
        return `{ ${ [...set]
            .map((symbols) => this._getPrintableSymbol(symbols))
            .join(", ") } }`;
    }

    _getArrowIndicator(startPos, length) {
        return [
            " ".repeat(Math.max(0, startPos - 1)),
            "^",
            "~".repeat(Math.max(0, length - 1))
        ].join("");
    }

    _getWelcomeMessage() {
        const colorizer = this.colorizer;

        return `\
${chalk.yellow.bold("Temă Limbaje formale")}
${chalk.white.bold("Autor: Doran Adoris Elian, 10/2018")}

Introduceți textul unei gramatici independente de context pentru a afișa mulțimile \
${chalk.green("Vₙ")}, ${chalk.green("Vₜ")}, ${chalk.green("S")} și ${chalk.green("P")} aferente.

Regulile de introducere a datelor sunt următoarele:
  1.  Primul simbol din prima producție reprezintă axioma (simbolul de start);
  2.  Simbolul de separare dintre producții este ${colorizer.colorize("$")};
  3.  Simbolurile neterminale sunt scrise cu litere mari;
  4.  Simbolurile terminale sunt scrise cu litere mici;
  5.  Secvența vidă va fi ${colorizer.colorize("@")}.
  6.  Simbolul care marchează sfârșitul gramaticii este ${colorizer.colorize("&")}.

Exemplu:
  ${colorizer.colorize(this.exampleInput)}
`
    }
}

module.exports = GrammarInterpreterUI;
