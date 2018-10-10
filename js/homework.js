const GrammarParser = require("./grammar");

const getSetString = (set) =>
    `{ ${ [...set].join(", ") } }`;

const getArrowIndicator = (startPos, length) =>
    [
        ".".repeat(Math.max(0, startPos - 1)),
        "^",
        "~".repeat(length - startPos)
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

display("SAB$AaA$A@$Ba&");
