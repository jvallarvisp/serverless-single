'use strict';

/**
 * Serverless Plugin Boilerplate
 * - Useful example/starter code for writing a plugin for the Serverless Framework.
 * - In a plugin, you can:
 *    - Manipulate Serverless classes
 *    - Create a Custom Action that can be called via the CLI or programmatically via a function handler.
 *    - Overwrite a Core Action that is included by default in the Serverless Framework.
 *    - Add a hook that fires before or after a Core Action or a Custom Action
 *    - All of the above at the same time :)
 *
 * - Setup:
 *    - Make a Serverless Project dedicated for plugin development, or use an existing Serverless Project
 *    - Make a "plugins" folder in the root of your Project and copy this codebase into it. Title it your custom plugin name with the suffix "-dev", like "myplugin-dev"
 *
 */

const path  = require('path'),
  fs        = require('fs'),
    fse          = require('fs-extra'),
  BbPromise = require('bluebird'); // Serverless uses Bluebird Promises and we recommend you do to because they provide more than your average Promise :)

module.exports = function(S) { // Always pass in the ServerlessPlugin Class

  /**
   * Adding/Manipulating Serverless classes
   * - You can add or manipulate Serverless classes like this
   */

  S.classes.Project.newStaticMethod     = function() { console.log("A new method!"); };
  S.classes.Project.prototype.newMethod = function() { S.classes.Project.newStaticMethod(); };

  /**
   * Extending the Plugin Class
   * - Here is how you can add custom Actions and Hooks to Serverless.
   * - This class is only required if you want to add Actions and Hooks.
   */

  class PluginBoilerplate extends S.classes.Plugin {

    /**
     * Constructor
     * - Keep this and don't touch it unless you know what you're doing.
     */

    constructor() {
      super();
      this.name = 'myPlugin'; // Define your plugin's name
    }

    /**
     * Register Hooks
     * - If you would like to register hooks (i.e., functions) that fire before or after a core Serverless Action or your Custom Action, include this function.
     * - Make sure to identify the Action you want to add a hook for and put either "pre" or "post" to describe when it should happen.
     */

    registerHooks() {

      S.addHook(this._hookPre.bind(this), {
        action: 'codePackageLambda',
        event:  'post'
      });

      return BbPromise.resolve();
    }

    /**
     * Your Custom PRE Hook
     * - Here is an example of a Custom PRE Hook.  Include this and modify it if you would like to write your a hook that fires BEFORE an Action.
     * - Be sure to ALWAYS accept and return the "evt" object, or you will break the entire flow.
     * - The "evt" object contains Action-specific data.  You can add custom data to it, but if you change any data it will affect subsequent Actions and Hooks.
     * - You can also access other Project-specific data @ this.S Again, if you mess with data on this object, it could break everything, so make sure you know what you're doing ;)
     */

    _hookPre(evt) {

      let _this = this;
      let func    = S.getProject().getFunction(evt.options.name),
          singlize;

      if (func.getRuntime().getName() === 'nodejs') {
        singlize = new SinglizeNodejs(S, evt, func);
        return singlize.singlize()
            .then(function(evt) {
              return evt;
            });
      }
      return BbPromise.resolve(evt);

    }
  }

  class SinglizeNodejs{

    constructor(S, evt, func) {
      this.evt        = evt;
      this.function   = func;
    }

    singlize() {
      let _this = this;

      return new BbPromise(function(resolve, reject) {

        if(!_this.function.custom.single){
          resolve( _this.evt);
        }
        let includeFolder = _this.function.custom.single.include;
        var allowRemoveFolder = function(name) {
          var allow=true;
          includeFolder.forEach(function (folder) {
            if (name.startsWith(folder)) {
              allow = false;
            }
          });
          return allow;
        };

        fse.walk(_this.evt.data.pathDist)
            .on('data', function (item) {
              if (item.stats.isFile()) {
                let name = path.relative(_this.evt.data.pathDist, item.path);

                var allow = allowRemoveFolder(name);
                if(allow && !name.startsWith(_this.function.name)){
                  fse.removeSync(item.path);
                }
              }
            })
            .on('end', function () {
              fse.walk(_this.evt.data.pathDist)
                  .on('data', function (item) {
                    if (!item.stats.isFile()) {
                      let name=path.relative(_this.evt.data.pathDist, item.path);
                      var allow = allowRemoveFolder(name);
                      if(allow && !name.startsWith(_this.function.name)){
                        if(name){
                          fse.remove(item.path);
                        }
                      }
                    }
                  })
                  .on('end', function () {
                    resolve( _this.evt);
                  });
            });


      });
    }
  }

  return PluginBoilerplate;

};