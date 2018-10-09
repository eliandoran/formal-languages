# Temă

## Cerință

Să se citească o gramatică independentă de context sub formă de un șir de caractere. Citirea se face de la tastatură și din fișier. Se va construi un meniu corespunzător.

Regulile de citire se afișează înaintea citirii și sunt următoarele:

1.  Primul simbol din prima producție reprezintă axioma (simbolul de start);
2.  Simbolul de separare dintre producții este `$`.
3.  Simbolurile neterminale sunt scrise cu litere mari;
4.  Simbolurile terminale sunt scrise cu litere mici;
5.  Secvența vidă va fi `@`.
6.  Simbolul care marchează sfârșitul gramaticii este `&`.

Se cere afișarea mulțimilor `V_N`, `V_T`, `S`, `P`.

## Exemplu de șir
```
SAB$AaA$A@$Ba&

S ->  AB; A -> aA; A -> lambda; B -> a
V_N = { A, B }
V_T = { a, lambda }
```