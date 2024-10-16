const { OAuth2Scopes, PermissionsBitField } = require("discord.js");

module.exports = {
  description: "Generates a client invite.",
  usage: "permissions...",
  parameters: [
    {
      name: "Permissions",
      description: "The client invite required permissions.",
      optional: "true",
      defaultValue: "none",
    },
  ],
  run: async (d, ...permissions) => {
    let perms = [];

    for (let permission of permissions) {
      if (!(permission in PermissionsBitField.Flags))
        return new d.error("invalid", d, "permission", permissions);
      else perms.push(PermissionsBitField.Flags[permission]);
    }

    return await d.client.generateInvite({
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      permissions: perms,
    });
  },
};
