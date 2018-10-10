const expand = require("expand-range");

const lambdaSymbol = "@";
const separatorSymbol = "$";
const endingSymbol = "&";
const terminalAlphabet = expand("a..z");
const nonterminalAlphabet = expand("A..Z");

class ValidationException {
    constructor(message, context) {
        this.message = message;
        this.startPos = context.startPos;
        this.length = context.length;
    }
}

class GrammarParser {
    parse(input) {
        this._validateInput(input);

        // Trim ending symbol
        input = input.substring(0, input.length - 1);
       
        let pos = 0;

        const productions = input
            .split(separatorSymbol)
            .map((production, index) => {
                const context = {
                    startPos: pos + 1
                };
                this._validateProduction(production, context);
                                
                const initialSymbol = production[0];
                const replacement = production.substring(1);

                this._validateProductionReplacement(replacement, {
                    startPos: pos + 2
                });

                pos += production.length + 1;

                return {
                    initialSymbol,
                    replacement
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

        const startingSymbol = nonterminalSymbols.values().next().value;
        nonterminalSymbols.delete(startingSymbol);
    
        return {
            productions,        
            terminalSymbols,
            nonterminalSymbols,
            startingSymbol
        }
    }

    _validateInput(input) {
        if (input[input.length - 1] != endingSymbol) {
            throw new ValidationException(`A grammar definition must end with ${endingSymbol}.`, {
                startPos: input.length
            });
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

    _validateProductionReplacement(productionReplacement, context) {
        if (productionReplacement.indexOf(lambdaSymbol) === -1)
            return;
        
        if (productionReplacement.length > 1)
            throw new ValidationException("The lambda symbol can be the only replacement in a production.", {
                startPos: context.startPos,
                length: productionReplacement.length
            });
    }
}

module.exports = GrammarParser;
