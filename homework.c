#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define GRAMMAR_VOID '@'
#define GRAMMAR_SEPARATOR '$'
#define GRAMMAR_END '&'

void parseProduction(char* production) {
    printf("Production: %s\n", production);
}

void parse(char* grammar) {
    int len = strlen(grammar);
    int startPos = 0;
    int curPos = 0;

    while (curPos <= len) {
        if (grammar[curPos] == GRAMMAR_SEPARATOR ||
            grammar[curPos] == GRAMMAR_END)
        {
            int prodLength = (curPos - startPos);
            char* prod = (char*)malloc(sizeof(char) * prodLength);
            strncpy(prod, grammar + startPos, prodLength);
            prod[prodLength] = '\0';
            parseProduction(prod);
            free(prod);
            startPos = curPos + 1;
        }

        curPos++;
    }
}

int main(int argc, char const *argv[])
{
    parse("SAB$AaA$A@$Ba&");

    return EXIT_SUCCESS;
}
