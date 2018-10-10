class ValidationException {
    constructor(message, context) {
        this.message = message;
        this.startPos = context.startPos;
        this.length = context.length;
    }
}

class GrammarValidator {
    constructor(grammarDefinition) {
        this.def = grammarDefinition;
    }

    validateInput(input) {
        if (input[input.length - 1] != this.def.endingSymbol) {
            throw new ValidationException(`Gramatica trebuie să conțină simbolul de sfârșit "${this.def.endingSymbol}".`, {
                startPos: input.length
            });
        }
    }

    validateProduction(productionString, context) {
        if (productionString.length < 2) {
            throw new ValidationException("O producție trebuie să aibă cel puțin două caractere.", {
                startPos: context.startPos,
                length: productionString.length
            });
        }
    }

    validateProductionReplacement(productionReplacement, context) {
        if (productionReplacement.indexOf(this.def.lambdaSymbol) === -1)
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
