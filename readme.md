# Landfill
A customizable command-line scaffolding tool to speed up development for node and npm.

## Installation

Install globally for cli usage.
```bash
npm install -g landfill
```

Install local version as a dev dependency
```bash
npm install -D landfill
```

If saved as a npm package dependency (dev or normal), the version installed locally will be used if the cli version doesn't satisfy semantic version requirements. This makes the cli backwards and forwards compatible with local versions.

## Usage
```
Usage: land [options] [command]

Commands:

  list [options]             List all available templates by name
  fill [options] <template>  Begin using a template <template>

Options:

  -V, --version  output the version number

  Usage: list [options]

    Options:
      -h, --help  output usage information
      -a, --all  list all available information, Name, Config Dir, Template Dir


  Usage: fill [options] <template>

    Options:
      -h, --help                    output usage information
      -C, --chdir <path>            Change working directory
      -d, --debug                   Adds debuging, better source-mapping
      -s, --version-safe <version>  forces use of specified version, will error out if version doesn't match landfill instance version
```

## Using A Template

use app template in current directory
```bash
land fill app 
```

Change the directory the template is applied to.
```bash
land fill component -C src/javacsript
```

Currently templates can only be used if they are configured in a package.json ~~or .landfillrc~~ file somewhere in the ancestry of the current working directory.
#### Config
To use a template add the following to the package.json of the project you want to use.
```js
// contents of package.json
"landfill": {
  "{{template-name}}": {
    "template": "{{path/to/template/folder}}"
  }
}
…
// good practice to specify a Landfill version in dependencies
// so it will definitely work for other dev
"devDependencies": {
	"landfill": "1.0.0"
}
```

#### TODO:

You can also create a .landfillrc and use the same json (although there is no need for parent `landfill` property)

```js
// contents of .landfillrc
{
  "{{template-name}}": {
    "template": "{{path/to/template/folder}}"
  }
}
```
 
Its on the roadmap to allow the automatic look up of globally installed templates.

## Creating Templates
Checkout the [wiki] for the full API.

Here is an example template folder structure for a template called `component`:

```none
component/
│  landfill.js
│
├─ src/
│  │  component.js
│
└─ unit/
   │  <%=slugified%>.test.js

```

landfill.js should export a configuration object. It is `require`d by landfill before it starts tempting.  
The configuration api is detailed in the wiki, here is one that works for the above file structure example:

```js
// contents of landfill.js
var path = require('path')
module.exports =
  { prompts:
    [ { key: 'name'
      , message: 'What is the component name?'
      }
    ]
  , comps: 
    {  slugified: function (answers) { return slugify(answers.name) }
  , entry:
    { 'src': 
      { destination: (props) => {
          return path.join('component', 'src', props.slugified)
        }
    , 'unit': { destination: 'tests' }
    }
  }  
  
function slugify (string) {
  return string.replace(/\ /g, '-').toLowerCase()
}
```



## Ugh… Why?
Other similar projects are plugins for or wrappers around much larger task systems. Landfill is relatively lightweight in terms of dependencies.  
  
It also uses a configuration approach, unlike, for example, `Slush` which wraps gulp and requires each new template to implement itself using a whole bunch of other libraries. With Landfill, however, a lot can be achieved with just JSON and a directory of template files.


```js
// contents of template landfill.js
module.exports =
  { prompts:
    [ { key: 'AppName'
      , message: 'What is the name of your project?'
      , default: 'App Name'
      }
    , { key: 'appPath'
      , message: 'What is the path of the new app?'
      , default: 'path/of/output'
      }
    , { key: 'appendPoint'
      , message: 'Where does this app append'
      , default: '.wrapper'
      }
    ]
  , entry:
    { 'app': { destination: '/' } }
  }
```

Not only does this save having to repeat boilerplate template code for each new template (oh the irony), it should reduce the barrier of effort to write a new template.
## Roadmap
Landfill was created to fill a specific niche, and does that well. However, I hope that a few additional features would make Landfill a versatile tool.

In order of priority:

1. Testing 
* Support using globally installed templates
* More Event Hooks
* `fix` cwd config option (in a config file for a specific template, fix the cwd)
* Expose landfill & Prompter for js api
* Plugins 
