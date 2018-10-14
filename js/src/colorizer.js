class GrammarColorizer {
    constructor(grammarDefinition, colorDefinition) {
        this.def = grammarDefinition;
        this.colors = colorDefinition;
    }

    colorize(grammarString) {
        return grammarString
            .split("")
            .map((ch) => {
                let colorWrapper = this.colors.invalidSymbol;

                for (var definition in this.def) {
                    if (this.def[definition].includes(ch)) {
                        colorWrapper = this.colors[definition];
                        break;
                    }
                }
                
                return colorWrapper(ch);
            })
            .join("");
    }
}

module.exports = GrammarColorizer;
