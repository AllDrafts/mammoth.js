exports.readMetadataXml = readMetadataXml;
exports.Metadata = Metadata;
exports.defaultMetadata = new Metadata({});

// properties are not nested and unnecessary, so ignore
var METADATA_TO_IGNORE = [
    "headingPairs",
    "titlesOfParts"
];

function Metadata(coreProperties) {
    return {
        findMetadataPropertyByName: function(name) {
            return coreProperties[name];
        },
        getMetadata: function() {
            return coreProperties;
        }
    };
}

function ensureCamelCase(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function cleanElementName(name, attributePrefixes) {
    var nameWithPrefixesRemoved = attributePrefixes.reduce(function(cleanName, prefix) {
        return cleanName.replace("{" + prefix + "}", '');
    }, name);
    return ensureCamelCase(nameWithPrefixesRemoved);
}


function getAttributePrefixes(attributes) {
    return Object.values(attributes);
}

function getCoreProperties(root) {
    var attributePrefixes = getAttributePrefixes(root.attributes);
    return root.children.reduce(function(properties, element) {
        var cleanName = cleanElementName(element.name, attributePrefixes);
        if (METADATA_TO_IGNORE.includes(cleanName)) {
            return properties;
        }
        properties[cleanName] = element.children && element.children[0] ? element.children[0].value : "";
        return properties;
    }, {});
}

function readMetadataXml(root) {
    var coreProperties = getCoreProperties(root);
    return new Metadata(coreProperties);
}
