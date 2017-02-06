"use strict";

/**
 * 
 * Config library
 * 
 * @namespace waw.mainsite.config
 * @memberof waw.mainsite
 * 
 * 
 */

let _config = {
  
    '_default_config': {
        'jquery_Lib': null,
        'config_file': 'config.json'
    },
    
    'current_config': null,
    'loaded_config': null,
    
    
    'get_current_config': function() {
        return _config.current_config;
    },
    
    
    'initialize': function(_options) {
        
        if (_options.config === undefined) {
            throw ('config option is required.');
        }
        
        
        let _configParam = _options.config;
        _config.current_config = {};
        let _currentConfig = _config.current_config;

        if (_configParam.jquery_Lib !== undefined) {
            _currentConfig.jquery_Lib = _configParam.jquery_Lib;
        }
        
        if (_configParam.config_file !== undefined) {
            _currentConfig.config_file = _configParam.config_file;
        }
    },
    
    
    'loadConfig': function(_options) {
        return new Promise(function(_resolve, _reject) {
            try {


                if (_options === undefined) {
                    _options = {};
                }
                
                
                if (_options.config === undefined) {
                    _options.config = _config.current_config;
                }
                
                let _configParam = _options.config;
                let _JQ = _configParam.jquery_Lib;
                let _config_file = _configParam.config_file;
        
                _JQ.getJSON( _config_file, function( _data ) {
                    _config.loaded_config = _data;
        //            _config.loaded_config = _JQ.extend(true, {}, _data);
                    _resolve(_data);
                });
                
            } catch (_e) {
                _reject(_e);
            }
        });
        
    }
        
};


module.exports = _config;