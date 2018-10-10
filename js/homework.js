const expand = require("expand-range");

const separatorSymbol = "$";
const endingSymbol = "&";
const terminalSymbols = expand("a..z");
const nonterminalSymbols = expand("A..Z");

function parseGrammar(input) {
    // Trim ending symbol
    const lastChar = input[input.length - 1];
    if (lastChar == endingSymbol) {
        input = input.substring(0, input.length - 1);
    }
   
    const productions = input
        .split(separatorSymbol)
        .map((production) => {
            return {
                initialSymbol: production[0],
                replacement: production.substring(1)
            }
        });

    const actualTerminalSymbols = new Set(
        productions
            .map((production) => production.replacement.split(""))            
            .reduce((acc, symbols) => acc.concat(symbols), [])
            .filter((symbol) => terminalSymbols.indexOf(symbol) !== -1)
    );

    const actualNonterminalSymbols = new Set(
        productions
            .map((production) => production.initialSymbol)
            .filter((symbol) => nonterminalSymbols.indexOf(symbol) !== -1)
    );

    return {
        productions,        
        terminalSymbols: actualTerminalSymbols,
        nonterminalSymbols: actualNonterminalSymbols
    }
}

const getSetString = (set) =>
    `{ ${ [...set].join(", ") } }`;

function display(input) {
    var grammar = parseGrammar(input);

    let productionsOutput = grammar.productions
        .map((production) => `${production.initialSymbol} -> ${production.replacement}`)
        .join("; ");

    let nonterminalSymbolsOutput = 
        `V_N = ${ getSetString(grammar.nonterminalSymbols) }`;

    let terminalSymbolsOutput =
        `V_T = ${ getSetString(grammar.terminalSymbols) }`;

    console.log(productionsOutput);
    console.log(nonterminalSymbolsOutput);
    console.log(terminalSymbolsOutput);
}

display("SAB$AaA$A@$Ba&");