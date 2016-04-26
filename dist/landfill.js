#!/usr/bin/env node
GLOBAL.require=require,GLOBAL.__dirname=__dirname,GLOBAL.version=require("../package.json").version,module.exports=function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var t={};return n.m=e,n.c=t,n.p="",n(0)}([function(e,n,t){t(1),e.exports=t(2)},function(e,n){e.exports=require("babel-polyfill")},function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}function i(){var e=d["default"].commands[0];(0,w.configLoader)().then(function(n){var t=[],r=function(e){var r=n.ancestry[e],o=Object.keys(r.templates).map(function(e){return(0,b.merge)({templateName:e,configDir:r.path},r.templates[e])});t=t.concat(o)};for(var o in n.ancestry)r(o);console.log("List of usable Landfill templates:\n"),t.forEach(function(n){e.all?console.log("  ",y["default"].magenta(n.templateName),y["default"].cyan(n.configDir),y["default"].gray(n.template)):console.log("  ",y["default"].magenta(n.templateName))}),console.log("")})}function a(e){var n=d["default"].commands[1];if(n.versionSafe&&!m["default"].satisfies(GLOBAL.version,n.versionSafe)){var t=y["default"].red((0,g["default"])(s,n.versionSafe,GLOBAL.__dirname,GLOBAL.version));console.log(t),process.exit(1)}n.debug&&u(),(0,w.configLoader)().then(function(t){var r=(0,w.matchTemplateAndVersion)(e,t);if((0,w.continueWithCorrectVersion)(r)){var o=l["default"].resolve(process.cwd());n.chdir&&(o=l["default"].resolve(o,n.chdir),GLOBAL.debug&&console.log("Changed cwd to "+o));var i={templateName:e,templateConfig:r.template,version:GLOBAL.version,configDir:r.configDir,cwd:o};console.log(i),(0,L["default"])(i)}})}function u(){console.log("debug mode"),GLOBAL.debug=!0,GLOBAL.require("source-map-support").install(),process.on("unhandledRejection",function(e){throw e})}var s=o(["\n      Expected landfill instance to be version ",".\n      (module found in ",")\n      Actual version loaded ","\n      Check package.json config, reinstall landfill"],["\n      Expected landfill instance to be version ",".\n      (module found in ",")\n      Actual version loaded ","\n      Check package.json config, reinstall landfill"]),f=t(3),l=r(f),c=t(4),d=r(c),p=t(5),m=r(p),v=t(6),y=r(v),h=t(7),g=r(h),b=t(8),w=t(9),O=t(13),L=r(O);d["default"].version(GLOBAL.version),d["default"].command("list").description("List all available templates by name").option("-a, --all","list all available information, Name, Config Dir, Template Dir").action(function(e,n){i()}),d["default"].command("fill <template>").description("Begin using a template <template>").option("-C, --chdir <path>","Change working directory").option("-d, --debug","Adds debuging, better source-mapping").option("-s, --version-safe <version>","forces use of specified version, will error out if version doesn't match landfill instance version").action(function(e){a(e)}),d["default"].parse(process.argv),process.argv.slice(2).length||d["default"].outputHelp()},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("commander")},function(e,n){e.exports=require("semver")},function(e,n){e.exports=require("chalk")},function(e,n){e.exports=require("dedent-js")},function(e,n){e.exports=require("lodash")},function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}function i(e){if(!e.version||L["default"].satisfies(GLOBAL.version,e.version))return GLOBAL.debug&&console.log("Using landfill -v",GLOBAL.version),GLOBAL.debug&&!e.version&&console.log("no version of landfill specified by template"),!0;var n=function(){var n="win32"===process.platform?";":":",t=process.env.NODE_PATH?process.env.NODE_PATH.split(n):[];return(0,j["default"])("landfill",{basedir:e.configDir,paths:t},function(n,r){if(n){var o=(0,P["default"])(m,A["default"].cyan(e.configDir));throw t.forEach(function(e){o+="	"+A["default"].yellow(e)+"\n"}),new Error(o)}if(GLOBAL.debug){var i=(0,P["default"])(v,A["default"].blue(GLOBAL.version),A["default"].blue(e.version),A["default"].cyan(h["default"].relative(e.configDir,r)));console.log(i)}var a=process.argv.slice(2);(0,x.spawn)("node",[r,"-s",e.version].concat(a),{cwd:h["default"].resolve(process.cwd()),stdio:"inherit"})}),{v:!1}}();return"object"===("undefined"==typeof n?"undefined":p(n))?n.v:void 0}function a(){for(var e={},n=h["default"].resolve(process.cwd()),t=h["default"].sep,r=0;r<d(n).length;r++)t=h["default"].join(t,d(n)[r]),e[d(n).length-r-1]={path:t};return Promise.all(Object.keys(e).map(function(n,t){var r=e[n];return l(r.path).then(function(t){t?r=(0,w.merge)(r,t):delete e[n]})})).then(function(){return{ancestry:e}})}function u(e,n){n.current=-1;for(var t={},r=!1;f(n);){var o=s(n);if(o.templates[e]){t.template=o.templates[e],t.configDir=o.path,r=!0;break}}do{var i=s(n);if(i.version){t.version=i.version;break}}while(f(n));return r?t:!1}function s(e){return e.ancestry[e.current]}function f(e){var n=Object.keys(e.ancestry).sort(),t=n.indexOf(e.current)+1;return t<n.length?(e.current=n[t],n[t]):!1}function l(e){var n={},t=!1;return Promise.all(Object.keys(q).map(function(r,o){var i=h["default"].join(e,r);return b["default"].exists(i).then(function(e){return e?(t=!0,q[r](i)):!1}).then(function(e){e&&(n=(0,w.merge)(n,e,c))})})).then(function(){return t?n:!1})}function c(e,n){return(0,w.isArray)(e)?e.concat(n):void 0}function d(e){return e.split(h["default"].sep)}Object.defineProperty(n,"__esModule",{value:!0});var p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},m=o(["\n          Landfill could not resolve a local version of itself\n          with basedir ","\n          using NODE_PATH(s):\n          "],["\n          Landfill could not resolve a local version of itself\n          with basedir ","\n          using NODE_PATH(s):\n          "]),v=o(["\n        Initialised version of landfill: "," does not satisfy requirement ","\n        Respawning with local package version at ",""],["\n        Initialised version of landfill: "," does not satisfy requirement ","\n        Respawning with local package version at ",""]);n.continueWithCorrectVersion=i,n.configLoader=a,n.matchTemplateAndVersion=u;var y=t(3),h=r(y),g=t(10),b=r(g),w=t(8),O=t(5),L=r(O),k=t(11),j=r(k),x=t(12),_=t(6),A=r(_),E=t(7),P=r(E),q={"package.json":function(e){return b["default"].readFile(e,"utf8").then(JSON.parse).then(function(e){var n=void 0;return e.landfill.templates?n={templates:e.landfill.templates,version:e.devDependencies.landfill||e.dependencies.landfill||!1}:e["landfill-templates"]&&(n={templates:e["landfill-templates"],version:e.devDependencies.landfill||e.dependencies.landfill||!1}),n})}}},function(e,n){e.exports=require("mz/fs")},function(e,n){e.exports=require("resolve")},function(e,n){e.exports=require("child_process")},function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,n){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(n)}}))}function i(e){function n(){if(e.templatePath)return l["default"].resolve(o,e.templatePath);if(e.configDir&&e.templateConfig&&e.templateConfig.src)return l["default"].resolve(e.configDir,e.templateConfig.src);throw new Error("Landfill config must contain a templatePath property.")}function t(e,n){var t=e;if(n)for(var r in n)t[r]=n[r](t,o);return t}function r(e,n){return Promise.all(Object.keys(n).map(function(t){var r=n[t],f=r.template||/(js|html)$/,c=r.encoding||"utf8",p=r.skip||!1;if(!(f instanceof RegExp||"string"==typeof f))throw new Error((0,y["default"])(a,t,v));if(!("function"==typeof p||p instanceof RegExp||p===!1))throw new Error((0,y["default"])(u,t,v));var h=void 0;if("function"==typeof r.destination&&(r.destination=r.destination(e,o)),"string"!=typeof r.destination)throw new Error((0,y["default"])(s,t,v));h=r.destination;var g=l["default"].resolve(i,t),b={props:e,template:f,skip:p,encoding:c};return(0,d.applyTemplate)(g,h,b).then(function(){console.log("Template "+m["default"].cyan(v+"/"+t)+", templated to "+m["default"].magenta(l["default"].relative(o,h)))}).then(function(){r.completed&&"function"==typeof r.completed&&r.completed(e,o,h)})}))}var o=e.cwd||l["default"].resolve(process.cwd()),i=n(),f=l["default"].join(i,"landfill.js"),p=GLOBAL.require(f),v=e.templateName,h=new c.Prompter;h.init(),h.promptArray(p.prompts).then(function(e){var n=t(e,p.comps);return r(n,p.entry)})["catch"](function(e){throw e})}Object.defineProperty(n,"__esModule",{value:!0});var a=o(["\n            entry.template must be a string or an instance of RegExp.\n            Entry ","\n            Template ","\n          "],["\n            entry.template must be a string or an instance of RegExp.\n            Entry ","\n            Template ","\n          "]),u=o(["\n            entry.skip must be a function, an instance of a RegExp, or false.\n            Entry ","\n            Template ","\n          "],["\n            entry.skip must be a function, an instance of a RegExp, or false.\n            Entry ","\n            Template ","\n          "]),s=o(["\n            entry.destination must be a string or a function that returns a string.\n            Entry ","\n            Template ","\n          "],["\n            entry.destination must be a string or a function that returns a string.\n            Entry ","\n            Template ","\n          "]);n["default"]=i;var f=t(3),l=r(f),c=t(14),d=t(16),p=t(6),m=r(p),v=t(7),y=r(v)},function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){return new Promise(function(t,r){e.question(n,function(e){t(e)})})}function a(e,n){var t=c["default"].green("? ")+c["default"].bold(e.trim())+" ";return n&&(t+=c["default"].gray("('"+n+"'): ")),t}Object.defineProperty(n,"__esModule",{value:!0}),n.Prompter=void 0;var u=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),s=t(15),f=r(s),l=t(6),c=r(l);n.Prompter=function(){function e(){o(this,e),this.promises=Promise.resolve(),this.answers={}}return u(e,[{key:"init",value:function(){return this.rl=f["default"].createInterface(process.stdin,process.stdout),this}},{key:"prompt",value:function(e,n,t){var r=this;return this.promises=this.promises.then(function(){var e=a(n,t);return i(r.rl,e)}).then(function(n){return""===n&&t&&(n=t),r.answers[e]=n,{answer:n,key:e}}),this}},{key:"promptArray",value:function(e){for(var n in e){var t=e[n],r=t.key,o=t.message,i=t["default"];this.prompt(r,o,i)}return this.getAnswers()}},{key:"wait",value:function(){return this.promises}},{key:"getAnswers",value:function(){var e=this;return this.promises.then(function(){return e.close(),e.answers})}},{key:"close",value:function(){this.rl.close()}}]),e}()},function(e,n){e.exports=require("readline")},function(e,n,t){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function i(e,n){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!n||"object"!=typeof n&&"function"!=typeof n?e:n}function a(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function, not "+typeof n);e.prototype=Object.create(n&&n.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),n&&(Object.setPrototypeOf?Object.setPrototypeOf(e,n):e.__proto__=n)}function u(e,n,t){return function(r,o){r.path.match(t)?r.pipe(new w(e,n)).pipe(o):r.pipe(o)}}function s(e,n,t){v["default"].limit=16;var r=t.props||{},o=t.encoding||"utf8",i=t.skip,a=t.template,s={transform:u(r,o,a),rename:function(e){return(0,g.template)(e)(r)}};return i&&(s.filter=i),p["default"].exists(n).then(function(e){return e?void 0:f(n)}).then(function(){return new Promise(function(t,r){(0,v["default"])(e,n,s,function(e){e&&r(e),t(!0)})})})}function f(e){return new Promise(function(n,t){(0,h["default"])(e,function(e){e&&t(e),n(!0)})})}Object.defineProperty(n,"__esModule",{value:!0});var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},c=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();n.applyTemplate=s;var d=t(10),p=r(d),m=t(17),v=r(m),y=t(18),h=r(y),g=t(8),b=t(19),w=function(e){function n(e,t){o(this,n);var r=i(this,Object.getPrototypeOf(n).call(this,{objectMode:!0}));return r.contents="",r.props=e,r.enc=t,r}return a(n,e),c(n,[{key:"_transform",value:function(e,n,t){var r=("undefined"==typeof e?"undefined":l(e))===l("string")?new Buffer(e,this.enc):e;this.contents+=r,t()}},{key:"_flush",value:function(e){var n=(0,g.template)(this.contents),t=n(this.props);this.push(t),e()}}]),n}(b.Transform)},function(e,n){"use strict";function t(e,n,i,a){function u(e){if(B++,x)if(x instanceof RegExp){if(!x.test(e))return w(!0)}else if("function"==typeof x&&!x(e))return w(!0);return s(e)}function s(e){var n=q?r.stat:r.lstat;return D>=S?setImmediate(function(){s(e)}):(D++,void n(e,function(n,t){var r={};return n?b(n):(r.name=e,r.mode=t.mode,r.mtime=t.mtime,r.atime=t.atime,t.isDirectory()?d(r):t.isFile()?f(r):t.isSymbolicLink()?v(e):void 0)}))}function f(e){var n=e.name.replace(k,j);_&&(n=_(n)),g(n,function(t){if(t)return l(e,n);if(E&&c(n,function(){l(e,n)}),!P)return w();var o=q?r.stat:r.lstat;o(n,function(t,r){return e.mtime.getTime()>r.mtime.getTime()?void l(e,n):w()})})}function l(e,n){var t=r.createReadStream(e.name),o=r.createWriteStream(n,{mode:e.mode});t.on("error",b),o.on("error",b),A?A(t,o,e):o.on("open",function(){t.pipe(o)}),o.once("finish",function(){P?(r.utimesSync(n,e.atime,e.mtime),w()):w()})}function c(e,n){r.unlink(e,function(e){return e?b(e):n()})}function d(e){var n=e.name.replace(k,j);_&&(n=_(n)),g(n,function(t){return t?p(e,n):void m(e.name)})}function p(e,n){r.mkdir(n,e.mode,function(n){return n?b(n):void m(e.name)})}function m(e){r.readdir(e,function(n,t){return n?b(n):(t.forEach(function(n){u(o.join(e,n))}),w())})}function v(e){var n=e.replace(k,j);r.readlink(e,function(e,t){return e?b(e):void y(t,n)})}function y(e,n){q&&(e=o.resolve(L,e)),g(n,function(t){return t?h(e,n):void r.readlink(n,function(t,r){return t?b(t):(q&&(r=o.resolve(L,r)),r===e?w():c(n,function(){h(e,n)}))})})}function h(e,n){r.symlink(e,n,function(e){return e?b(e):w()})}function g(e,n){r.lstat(e,function(e){return n(e?"ENOENT"===e.code?!0:!1:!1)})}function b(e){return i.stopOnError?O(e):(!T&&i.errs?T=r.createWriteStream(i.errs):T||(T=[]),"undefined"==typeof T.write?T.push(e):T.write(e.stack+"\n\n"),w())}function w(e){return e||D--,G++,B===G&&0===D&&void 0!==O?O(T?T:null):void 0}var O=a;a||(O=i,i={});var L=process.cwd(),k=o.resolve(L,e),j=o.resolve(L,n),x=i.filter,_=i.rename,A=i.transform,E=i.clobber!==!1,P=i.modified,q=i.dereference,T=null,B=0,G=0,D=0,S=i.limit||t.limit||16;S=1>S?1:S>512?512:S,u(k)}var r=GLOBAL.require("fs"),o=GLOBAL.require("path");e.exports=t,t.ncp=t},function(e,n){e.exports=require("mkdirp")},function(e,n){e.exports=require("stream")}]);
//# sourceMappingURL=landfill.js.map