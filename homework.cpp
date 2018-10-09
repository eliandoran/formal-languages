#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <string.h>

using namespace std;

class ValidationError {
    public:
        const string message;
        const int position;

        ValidationError(string message, int position): message(message), position(position) {}
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

        Production parseProduction(char* prod, int startingPos) {
            int len = strlen(prod);

            if (len < 2) {
                throw ValidationError("A production must have at least two characters.", startingPos);
            }

            char startingSymbol = prod[0];
            string replacement = string(prod + 1);

            int nullSymbolPos = replacement.find_first_of(nullSymbol);
            if (nullSymbolPos != string::npos) {
                if (replacement.length() != 1) {
                    throw ValidationError("The null symbol cannot be used with other characters in a production.", startingPos + nullSymbolPos);
                }

                replacement = "";
            }

            return Production(startingSymbol, replacement);
        }

    public:
        Grammar parse(char* input) {
            int len = strlen(input);
            int startPos = 0;
            int curPos = 0;
            char prod[len];

            vector<Production> productions;

            if (input[len - 1] != endSymbol) {
                stringstream message;
                message<<"A grammar definition must end with `"<<endSymbol<<"`, not `"<<input[len - 1]<<"`.";
                throw ValidationError(message.str(), len - 1);
            }

            while (curPos <= len) {
                if (input[curPos] == productionSeparator ||
                    input[curPos] == endSymbol)
                {
                    int prodLength = (curPos - startPos);
                    
                    strncpy(prod, input + startPos, prodLength);
                    prod[prodLength] = '\0';
                    productions.push_back(parseProduction(prod, startPos + 1));

                    startPos = curPos + 1;
                }

                curPos++;
            }

            return Grammar(productions);
        }
};

string buildArrowIndicator(int pos) {
    stringstream arrowIndicator;

    for (int i=0; i<pos; i++) {
        arrowIndicator<<".";
    }

    arrowIndicator<<"^";
    return arrowIndicator.str();
}

void printValidationError(const ValidationError& error, const char* inputData) {    
    cout<<"Validation error: "<<endl
        <<"\t"<<error.message<<endl
        <<"at column "<<error.position<<":"<<endl
        <<"\t"<<inputData<<endl
        <<"\t"<<buildArrowIndicator(error.position)<<endl;    
}

int main(int argc, char const *argv[])
{
    GrammarParser parser;

    //Grammar resultingGrammar = parser.parse("SAB$AaA$A@$Ba&");
    char* inputData = "SAB$Azz$A@$Ba&";

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

