module.exports = {
  description: "Assigns an object propert]ies to an object.",
  usage: "name | objects...",
  parameters: [
    {
      name: "Name",
      description: "The object name.",
      optional: "false",
      defaultValue: "none",
    },
    {
      name: "Objects",
      description: "The objects to be assigned.",
      optional: "false",
      defaultValue: "none",
    },
  ],
  run: async (d, name, ...objects) => {
    if (name == undefined) return new d.error("required", d, "name");
    if (objects[0] == undefined) return new d.error("required", d, "objects");

    if (!d.data.objects[name])
      return new d.error("invalid", d, "object name", name);

    for (const object of objects) {
      try {
        let parsed = JSON.parse(object);
        Object.assign(d.data.objects[name], parsed);
      } catch (e) {
        return new d.error("custom", d, e);
      }
    }
  },
};
