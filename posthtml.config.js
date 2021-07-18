var nerds = require("./nerds.json");

module.exports = {
    "plugins": {
        "posthtml-extend": { "root": "./src" },
        "posthtml-include": { "root": "./src" },
        "posthtml-expressions": {
            "locals": {
                "nerds": nerds
            }
        }
    }
}