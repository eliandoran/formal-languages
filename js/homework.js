
const config = require("./config");

const GrammarInterpreterUI = require("./src/ui");
const ui = new GrammarInterpreterUI(config);
ui.start();
