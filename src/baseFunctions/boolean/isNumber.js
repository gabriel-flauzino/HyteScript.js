module.exports = {
  description: "Checks if a string is any type of number.",
  usage: "string",
  parameters: [
    {
      name: "String",
      description: "The string to be checked.",
      optional: "false",
      defaultValue: "none",
    },
  ],
  run: async (d, string) => {
    if (string == undefined) return new d.error("required", d, "string");

    return !isNaN(string);
  },
};
