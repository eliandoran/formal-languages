class ValidationException {
    constructor(message, context) {
        this.message = message;

        if (context !== undefined) {
            this.startPos = context.startPos;
            this.length = context.length;
        }
    }
}

class GrammarValidator {
    constructor(grammarDefinition) {
        this.def = grammarDefinition;
    }

    validateInput(input) {
        if (input.length < 2)
            throw new ValidationException("Gramatica nu poate fi vidă.");

        if (input[input.length - 1] != this.def.endingSymbol)
            throw new ValidationException(`Gramatica trebuie să conțină simbolul de sfârșit "${this.def.endingSymbol}".`, {
                startPos: input.length
            });

        let firstEndSymbolIndex = input.indexOf(this.def.endingSymbol);
        if (firstEndSymbolIndex !== input.length - 1)
            throw new ValidationException("Gramatica nu poate conține mai multe simboluri de sfârșit.", {
                startPos: firstEndSymbolIndex
            });
    }

    validateProduction(productionString, context) {
        if (productionString.length < 2)
            throw new ValidationException("O producție trebuie să aibă cel puțin două caractere.", {
                startPos: context.startPos,
                length: productionString.length
            });

        if (this.def.terminalAlphabet.includes(productionString[0]))
            throw new ValidationException("Primul simbol dintr-o producție nu poate fi un simbol terminal.", {
                startPos: context.startPos,
                length: 1
            });
    }

    validateProductionReplacement(productionReplacement, context) {
        if (!productionReplacement.includes(this.def.lambdaSymbol))
            return;
        
        if (productionReplacement.length > 1)
            throw new ValidationException("Lambda poate fi doar singurul simbol înlocuitor într-o producție.", {
                startPos: context.startPos,
                length: productionReplacement.length
            });
    }
}

module.exports = {
    GrammarValidator,
    ValidationException
};
