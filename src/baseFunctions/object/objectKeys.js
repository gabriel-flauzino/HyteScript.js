module.exports = {
    description: 'Returns an object keys.',
    usage: 'name | separator?',
    parameters: [
        {
            name: 'Name',
            description: 'The object name.',
            optional: 'false',
            defaultValue: 'none'
        },
        {
            name: 'Separator',
            description: 'Characters to separate object keys.',
            optional: 'true',
            defaultValue: ','
        }
    ],
    run: async (d, name, separator = ',') => {
        if (name == undefined) return new d.error("required", d, 'name')

        if (!d.data.objects[name]) return new d.error("invalid", d, 'object name', name);

        return Object.keys(d.data.objects[name]).join(separator);
    }
};