class GrammarColorizer {
    constructor(grammarDefinition, colorDefinition) {
        this.def = grammarDefinition;
        this.colors = colorDefinition;
    }

    colorize(grammarString) {
        return grammarString
            .split("")
            .map((ch) => {            
                for (var definition in this.def) {
                    if (this.def[definition].indexOf(ch) !== -1) {
                        return this.colors[definition](ch);
                    }
                }

                return `"${ch}"`;
            })
            .join("");
    }
}

module.exports = GrammarColorizer;
