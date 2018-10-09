#include <iostream>
#include <string>
#include <vector>
#include <string.h>

using namespace std;

class ValidationError {
    public:
        const char* message;
        int position;

        ValidationError(const char* message, int position): message(message), position(position) {}
};

class Production {
    public:
        const char startingSymbol;
        const string replacement;

        Production(const char startingSymbol, const string replacement):
            startingSymbol(startingSymbol), replacement(replacement) {};
};

class Grammar {
    private:
        const vector<Production> productions;

    public:
        Grammar(vector<Production> productions): productions(productions) {

        }

        const vector<Production> getProductions() {
            return productions;
        }
};

class GrammarParser {
    private:
        const char productionSeparator = '$';
        const char nullSymbol = '@';
        const char endSymbol = '&';

        Production parseProduction(char* prod) {
            int len = strlen(prod);

            if (len < 2) {
                throw ValidationError("A production must have at least two characters", 5);
            }

            char startingSymbol = prod[0];
            string replacement = string(prod + 1);

            if (isNullSet(replacement))
                replacement = "";

            return Production(startingSymbol, replacement);
        }

        bool isNullSet(string symbol) {
            return (symbol.length() == 1 && symbol[0] == nullSymbol);
        }

    public:
        Grammar parse(char* input) {
            int len = strlen(input);
            int startPos = 0;
            int curPos = 0;
            char prod[len];

            vector<Production> productions;

            while (curPos <= len) {
                if (input[curPos] == productionSeparator ||
                    input[curPos] == endSymbol)
                {
                    int prodLength = (curPos - startPos);
                    
                    strncpy(prod, input + startPos, prodLength);
                    prod[prodLength] = '\0';
                    productions.push_back(parseProduction(prod));

                    startPos = curPos + 1;
                }

                curPos++;
            }

            return Grammar(productions);
        }
};

void printValidationError(const ValidationError& error, const char* inputData) {
    cout<<"Validation error: "<<endl
        <<"\t"<<error.message<<endl
        <<"at: "<<endl
        <<"\t"<<inputData<<endl;
}

int main(int argc, char const *argv[])
{
    GrammarParser parser;

    //Grammar resultingGrammar = parser.parse("SAB$AaA$A@$Ba&");
    char* inputData = "SAB$A$A@$Ba&";

    try {
        Grammar resultingGrammar = parser.parse(inputData);

        for (Production production : resultingGrammar.getProductions()) {
            string replacement = production.replacement;

            if (replacement.empty())
                replacement = "lambda";

            cout<<production.startingSymbol<<"->"<<replacement<<endl;
        }
    } catch (ValidationError error) {
        printValidationError(error, inputData);
    }        

    return 0;
}

