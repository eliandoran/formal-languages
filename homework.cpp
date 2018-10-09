#include <iostream>
#include <string>
#include <string.h>

using namespace std;

class Grammar {
    
};

class GrammarParser {
    private:
        const char productionSeparator = '$';
        const char nullSymbol = '@';
        const char endSymbol = '&';

        void parseProduction(char* prod) {
            cout<<prod<<endl;
        }

    public:
        Grammar parse(char* input) {
            int len = strlen(input);
            int startPos = 0;
            int curPos = 0;
            char prod[len];

            while (curPos <= len) {
                if (input[curPos] == productionSeparator ||
                    input[curPos] == endSymbol)
                {
                    int prodLength = (curPos - startPos);
                    
                    strncpy(prod, input + startPos, prodLength);
                    prod[prodLength] = '\0';
                    parseProduction(prod);

                    startPos = curPos + 1;
                }

                curPos++;
            }
        }
};

int main(int argc, char const *argv[])
{
    GrammarParser parser;
    parser.parse("SAB$AaA$A@$Ba&");

    return 0;
}

