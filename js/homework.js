const GrammarParser = require("./grammar");

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
    const parser = new GrammarParser();

    try {
        const grammar = parser.parse(input);
        return grammar;
    } catch (e) {
        let errorMessage = `\
Validation error:
        ${e.message}
at column ${e.startPos}:
        ${input}
        ${getArrowIndicator(e.startPos, e.length)}
        `;

        console.error(errorMessage);        
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
Temă Limbaje formale

Introduceți textul unei gramatici independente de context pentru a afișa mulțimile V_N, V_T, S și P aferente.

Regulile de introducere a datelor sunt următoarele:
  1.  Primul simbol din prima producție reprezintă axioma (simbolul de start);
  2.  Simbolul de separare dintre producții este \`$\`.
  3.  Simbolurile neterminale sunt scrise cu litere mari;
  4.  Simbolurile terminale sunt scrise cu litere mici;
  5.  Secvența vidă va fi \`@\`.
  6.  Simbolul care marchează sfârșitul gramaticii este \`&\`.

Exemplu:
  SAB$AaA$A@$Ba&
`
);

prompt([
   {
       name: "grammar",
       message: "Date gramatică:"
   } 
]).then((userData) => {
    display(userData.grammar);
});
