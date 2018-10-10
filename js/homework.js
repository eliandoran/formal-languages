const GrammarParser = require("./grammar");

const getSetString = (set) =>
    `{ ${ [...set].join(", ") } }`;

function tryParse(input) {
    const parser = new GrammarParser();

    try {
        const grammar = parser.parse(input);
        return grammar;
    } catch (e) {
        let errorMessage = `Validation error:
        ${e.message}
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

display("SAB$Ax$A$Ba&");