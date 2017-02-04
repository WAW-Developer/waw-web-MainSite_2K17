"use strict";

/**
 * 
 * SomeThings library
 * 
 * @namespace waw
 * 
 */

/**
 * 
 * SomeThings library for browser
 * 
 * @namespace waw.mainsite
 * @memberof waw
 * 
 * 
 */

/**
 * import Engines library
 * @ignore
 */
// let Engines_Lib = require('./engines/stEngines.js');

System.register(["rss/rss.js"], function (_export, _context) {
  "use strict";

  var rss_mod, waw;
  return {
    setters: [function (_rssRssJs) {
      rss_mod = _rssRssJs.default;
    }],
    execute: function () {
      waw = {};

      waw.mainsite = {

        '_version': '0.0.1a',

        'rss': rss_mod
      };

      //let _lib = {
      //      "st": st
      //  };

      module.exports = waw.mainsite;
    }
  };
});
//# sourceMappingURL=mainsite.js.map
