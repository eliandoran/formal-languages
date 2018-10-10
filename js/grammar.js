const expand = require("expand-range");

const separatorSymbol = "$";
const endingSymbol = "&";
const terminalAlphabet = expand("a..z");
const nonterminalAlphabet = expand("A..Z");

class ValidationException {
    constructor(message, context) {
        this.message = message;
        this.startPos = context.startPos;
    }
}

class GrammarParser {
    parse(input) {
        // Trim ending symbol
        const lastChar = input[input.length - 1];
        if (lastChar == endingSymbol) {
            input = input.substring(0, input.length - 1);
        }
       
        let pos = 0;

        const productions = input
            .split(separatorSymbol)
            .map((production, index) => {
                const context = {
                    startPos: pos + 1
                };
                this._validateProduction(production, context);
                
                pos += production.length + 1;

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

    _validateProduction(productionString, context) {
        if (productionString.length < 2) {
            throw new ValidationException("Production must contain at least two characters.", {
                startPos: context.startPos,
                length: productionString.length
            });
        }
    }
}

module.exports = GrammarParser;