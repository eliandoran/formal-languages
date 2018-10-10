class ValidationException {
    constructor(message, context) {
        this.message = message;
        this.startPos = context.startPos;
        this.length = context.length;
    }
}

class GrammarParser {
    constructor(grammarDefinition) {
        this.def = grammarDefinition;
    }

    parse(input) {
        this._validateInput(input);

        // Trim ending symbol
        input = input.substring(0, input.length - 1);
       
        let pos = 0;

        const productions = input
            .split(this.def.separatorSymbol)
            .map((production, index) => {
                const context = {
                    startPos: pos + 1
                };
                this._validateProduction(production, context);
                                
                const initialSymbol = production[0];
                let replacement = production.substring(1);

                this._validateProductionReplacement(replacement, {
                    startPos: pos + 2
                });

                if (replacement == this.def.lambdaSymbol)
                    replacement = null;

                pos += production.length + 1;

                return {
                    initialSymbol,
                    replacement
                }
            });
    
        const terminalSymbols = new Set(
            productions
                .map((production) => (production.replacement !== null ? production.replacement.split("") : null))
                .reduce((acc, symbols) => acc.concat(symbols), [])
                .filter((symbol) => (this.def.terminalAlphabet.indexOf(symbol) !== -1 || symbol === null))
        );
    
        const nonterminalSymbols = new Set(
            productions
                .map((production) => production.initialSymbol)
                .filter((symbol) => (this.def.nonterminalAlphabet.indexOf(symbol) !== -1 || symbol === null))
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
        if (input[input.length - 1] != this.def.endingSymbol) {
            throw new ValidationException(`A grammar definition must end with ${this.def.endingSymbol}.`, {
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
        if (productionReplacement.indexOf(this.def.lambdaSymbol) === -1)
            return;
        
        if (productionReplacement.length > 1)
            throw new ValidationException("The lambda symbol can be the only replacement in a production.", {
                startPos: context.startPos,
                length: productionReplacement.length
            });
    }
}

module.exports = GrammarParser;
