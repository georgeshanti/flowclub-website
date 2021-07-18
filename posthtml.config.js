var nerds = require("./nerds.json");

module.exports = {
    "plugins": {
        "posthtml-extend": { "root": "./src" },
        "posthtml-include": { "root": "./src" },
        "posthtml-expressions": {
            "strictMode": false,
            "locals": {
                "nerds": nerds
            }
        }
    }
}