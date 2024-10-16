const {
  clone,
  BaseFunctions,
  replaceLast,
  getDirFiles,
} = require("../../utils/BaseUtils");

module.exports = {
  description:
    "Executes the case which it's value matches to string. If no case matches to string, then default will be executed.",
  usage: "string | cases",
  parameters: [
    {
      name: "String",
      description: "The string to match with cases value.",
      optional: "false",
      defaultValue: "none",
    },
    {
      name: "Cases",
      description: "The cases to match with string. ",
      optional: "true",
      defaultValue: "1",
    },
  ],
  dontParse: [1],
  async run(d, string, cases) {
    if (string == undefined) return new d.error("required", d, "string");
    if (cases == undefined) return new d.error("required", d, "cases");

    let casesCode = {
      cases: [],
      default: null,
    };

    let casesData = clone(d);
    casesData.functions = new BaseFunctions(
      { replaceLast, clone, getDirFiles },
      casesData.functions,
    )
      .set("case", {
        dontParse: [1],
        async run(d, value, code) {
          if (value == undefined) return new d.error("required", d, "value");
          if (code == undefined) return new d.error("required", d, "code");

          casesCode.cases.push({ value, code });
        },
      })
      .set("default", {
        dontParse: [0],
        async run(d, code) {
          if (code == undefined) return new d.error("required", d, "code");

          casesCode.default = code;
        },
      });

    await cases.parse(casesData);
    d.err = casesData.err;
    if (d.err) return;
    d.data = casesData.data;

    let matchingCases = casesCode.cases.filter((x) => x.value == string);

    if (matchingCases[0] != undefined) {
      matchingCases.forEach(async (c) => {
        if (!d.err) await c.code.parse(d);
      });
    } else if (casesCode.default != null) {
      casesCode.default.parse(d);
    }
  },
};
