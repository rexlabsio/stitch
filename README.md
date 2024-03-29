# Stitch

Stitch is a tool used to pull together definitions written in JSON with the main focus on simplicity.

- Stitch will base64 JavaScript files that are named appropriately (and reside in a `code` folder) and insert them 
into your resulting definition.
- Stitch will insert any `form` folder `definition.json` files into your result definition.

At its heart, it's a tool used to help write and maintain complex JSON files that would otherwise be incomprehensible.

## Installation

npm: `npm i rexlabs/stitch`

yarn: `yarn global add rexlabs/stitch`

## Requirements

For environment requirements, see the `package.json`.

## File structure

The folder that contains your `definition.json` is the entry point for `stitch` to work out of.

You *can* also have a `code` and `form` folder located in your entry point directory, this enables `stitch` to take 
advantage of advanced base64 encoding (JavaScript) and JSON file combining (forms).

```
definition-folder
|-- definition.json
|-- code
|   |-- my_step.js
|-- form
    |-- my_step.json
```

To take advantage of the base64 encoding component of `stitch`, you'll need to name your JavaScript files located inside 
your `code` folder the same as the step that they reside in, for example:

> definition.json
```json
{
      "name": "loop",
      "triggers": "check_loop",
      "description": "Loop until I say to stop",
      "label": "Loop step - do something",
      "type": "task",
      "function": {
        "format": "base64",
        "code": "",
        "modules": ["lodash"]
      }
}
``` 

> loop.js
```javascript
const _ = require("lodash");

/**
 * @param {Object} context
 * @returns {Object}
 */
module.exports = function(context) {
  return {
    should_loop: _.get(context, "state.meta.steps.loop.loop_index", 0) < 3
  };
};
```

## Commands

```sh
Usage: stitch [options] [command]
           
Options:
  -h, --help                  output usage information
                                                     
Commands:
  import <definition> <path>  Import an already exported definition to be expanded
  export [options] <dir>      Export a definition to be weaved together
```

#### Import

Expands an existing definition and writes to the `destination`

`stitch import "$(< file.json)" <destination>`


#### Export

Export a definition from the supplied `dir`

`stitch export <dir>`

---

### Examples

#### Export directory and print to file
`stitch export path/to/directory > result.json`

#### Export directory and copy to clipboard (macOS)
`stitch export path/to/directory | pbcopy`

#### Import file from input
`stitch import "$(< file.json)" <destination>`
