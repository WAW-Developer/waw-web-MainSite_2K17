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

import rss_mod from "rss/rss.js";



let waw = {};
waw.mainsite = {
    
    '_version': '0.0.1a',
    
    'rss': rss_mod
};



//let _lib = {
//      "st": st
//  };

module.exports = waw.mainsite;





