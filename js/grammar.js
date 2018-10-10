const GrammarValidator = require("./validator").GrammarValidator;

class GrammarParser {
    constructor(grammarDefinition) {
        this.def = grammarDefinition;
        this.validator = new GrammarValidator(grammarDefinition);
    }

    parse(input) {
        this.validator.validateInput(input);

        // Trim ending symbol
        input = input.substring(0, input.length - 1);
       
        let pos = 0;

        const productions = input
            .split(this.def.separatorSymbol)
            .map((production, index) => {
                const context = {
                    startPos: pos + 1
                };
                this.validator.validateProduction(production, context);
                                
                const initialSymbol = production[0];
                let replacement = production.substring(1);

                this.validator.validateProductionReplacement(replacement, {
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
}

module.exports = GrammarParser;
