const expand = require("expand-range");

const separatorSymbol = "$";
const endingSymbol = "&";
const terminalAlphabet = expand("a..z");
const nonterminalAlphabet = expand("A..Z");

class ValidationException {
    constructor(message) {
        this.message = message;
    }
}

class GrammarParser {
    parse(input) {
        // Trim ending symbol
        const lastChar = input[input.length - 1];
        if (lastChar == endingSymbol) {
            input = input.substring(0, input.length - 1);
        }
       
        const productions = input
            .split(separatorSymbol)
            .map((production) => {
                this._validateProduction(production);

                return {
                    initialSymbol: production[0],
                    replacement: production.substring(1)
                }
            });
    
        const terminalSymbols = new Set(
            productions
                .map((production) => production.replacement.split(""))            
                .reduce((acc, symbols) => acc.concat(symbols), [])
                .filter((symbol) => terminalAlphabet.indexOf(symbol) !== -1)
        );
    
        const nonterminalSymbols = new Set(
            productions
                .map((production) => production.initialSymbol)
                .filter((symbol) => nonterminalAlphabet.indexOf(symbol) !== -1)
        );
    
        return {
            productions,        
            terminalSymbols,
            nonterminalSymbols
        }
    }

    _validateProduction(productionString) {
        if (productionString.length < 2) {
            throw new ValidationException("Production must contain at least two characters.");
        }
    }
}

module.exports = GrammarParser;