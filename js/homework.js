const GrammarParser = require("./grammar");

const getSetString = (set) =>
    `{ ${ [...set].join(", ") } }`;

function display(input) {
    var parser = new GrammarParser();
    var grammar = parser.parse(input);

    let productionsOutput = grammar.productions
        .map((production) => `${production.initialSymbol} -> ${production.replacement}`)
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

display("SAB$A$A@$Ba&");