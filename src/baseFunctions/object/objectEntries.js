const { clone } = require("../../utils/BaseUtils");

module.exports = {
    description: 'Returns an object entries.',
    usage: 'name | textToReturn | separator?',
    parameters: [
        {
            name: 'Name',
            description: 'The object name.',
            optional: 'false',
            defaultValue: 'none'
        },
        {
            name: 'Text to return',
            description: 'Text to be returned for each property. Use {objProperty} for get the property, and {objValue} for get it value.',
            optional: 'false',
            defaultValue: 'none'
        },
        {
            name: 'Separator',
            description: 'Characters to separate entries.',
            optional: 'true',
            defaultValue: ','
        }
    ],
    dontParse: [1],
    run: async (d, name, textToReturn, separator = ',') => {
        if (name == undefined) return new d.error("required", d, 'name')
        if (textToReturn == undefined) return new d.error("required", d, 'text to return')

        if (!d.data.objects[name]) return new d.error("invalid", d, 'object name', name);

        let entries = [];

        for (const [property, value] of Object.entries(d.data.objects[name])) {
            let entryData = clone(d);

            const placeholders = d.data.placeholders.slice(0)

            entryData.data.placeholders.push(
                { name: '{objProperty}', value: property },
                { name: '{objValue}', value }
            )

            let parsedText = await textToReturn.parse(entryData)
            d.err = entryData.err
            if (d.err) return;

            Object.assign(d.data, entryData.data)
            d.data.placeholders = placeholders

            entries.push(parsedText.result)
        }

        return entries.join(separator);
    }
};