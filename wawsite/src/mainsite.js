"use strict";

/**
 * 
 * WAW library
 * 
 * @namespace waw
 * 
 */


/**
 * 
 * Mainsite library
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


/**
 * import config library
 * @ignore
 */
import * as config_mod from "./config/config.js";


//import rss_mod from "rss/rss.js";

/**
 * import rss library
 * @ignore
 */
import * as rss_mod from "./rss/rss.js"; // recommended



/**
 * import rss library
 * @ignore
 */
import * as ui_mod from "./ui/ui.js"; // recommended


let waw = {};
waw.mainsite = {
    
    '_version': '0.0.1a',
    
    'config': config_mod,
    'rss': rss_mod,
    'ui': ui_mod
};



//let _lib = {
//      "st": st
//  };

module.exports = waw.mainsite;





