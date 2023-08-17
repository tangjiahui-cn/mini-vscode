const { CMD } = require("./utils");

CMD.exec("vite");
CMD.exec("cross-env mode=development electron .");
// CMD.exec("node ./mockServer");
