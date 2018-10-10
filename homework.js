const separatorSymbol = "$";
const endingSymbol = "&";

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

    return {
        productions
    }
}

function display(input) {
    var grammar = parseGrammar(input);

    let productionsOutput = "";
    for (const production of grammar.productions) {
        productionsOutput += `${production.initialSymbol} -> ${production.replacement}; `;
    }

    productionsOutput = productionsOutput.substring(0, productionsOutput.length - 2);

    console.log(productionsOutput);
}

display("SAB$AaA$A@$Ba&");