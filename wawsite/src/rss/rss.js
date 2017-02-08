"use strict";


/**
 * import config library
 * @ignore
 */
import * as config_mod from "../config/config.js";




let _rss = {
  
    'load_feed': function(_options) {
        return new Promise(function(_resolve, _reject) { 
            try {
                
                if (_options === undefined) {
                    _options = {};
                }
                
                if (_options.url === undefined) {
                    throw ('url option is required.');
                }
                let _url = _options.url;
                
                let _config = config_mod.get_current_config();
                if (_options.config !== undefined) {
                    _config = _options.config;
                }
                
                let _JQ = _config.jquery_Lib;
                
//                _JQ.get(_url, function (_data) {
//                    _JQ(_data).find("entry").each(function (_item, _i) { // or "item" or whatever suits your feed
//                        
//                      console.log(_item);   // TODO: REMOVE DEBUG LOG
//
//                        var el = $(this);
//
//                        console.log("------------------------");
//                        console.log("title      : " + el.find("title").text());
//                        console.log("author     : " + el.find("author").text());
//                        console.log("description: " + el.find("description").text());
//                    });
//                    _resolve(_data);
//                });
                
                _JQ.ajax({
                    type: 'GET',
                    url: _url,
                    dataType: 'jsonp',
                    success: function (_data) {
                        
                        let _xml = _JQ(_data);
                        
                        _xml.find("entry").each(function (_item) {
                            
                            console.log(_item);   // TODO: REMOVE DEBUG LOG
                            let _this = _JQ(this);
                            console.log(_this);   // TODO: REMOVE DEBUG LOG

                            let _title = _JQ(_this).find("title").text();
                            console.log(_title);   // TODO: REMOVE DEBUG LOG
                            
                            let _content =_JQ(_this).find("content").text();
                            console.log(_content);   // TODO: REMOVE DEBUG LOG
                            
                            // published
                            let _published =_JQ(_this).find("published").text();
                            console.log(_published);   // TODO: REMOVE DEBUG LOG
                            
                            
                            
//                            var description = $(this).find("description").text();
//                            var linkUrl = $(this).find("link_url").text();
//                            var link = "<a href='" + linkUrl + "' target='_blank'>Read More<a>";
//                            $('#feedContainer').append('<article><h3>'+title+'</h3><p>'+description+link+'</p>');
                        });
                        
                        _resolve(_xml);

                    },
                    beforeSend: function(_xhr) {
                        _xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    }
                });
                
                
            } catch (_e) {
                _reject(_e);
            }
        });
    }
        
};


module.exports = _rss;