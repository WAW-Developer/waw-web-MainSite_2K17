"use strict";


/**
 * import config library
 * @ignore
 */
import * as config_mod from "../config/config.js";
import * as rss_data_mod from "./rss_data.js";



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
                
                // Check option config
                let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
                
                // Check option max_results
                let _max_results = (_options.max_results !== undefined) ? _options.max_results : 500;
                
                let _JQ = _config.jquery_Lib;
                
                let _feed = {
                    'url': _url,
                    'entries': []
                };
                
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
                
                let _url_Feed = _url + '?max-results=' + _max_results;
                
                _JQ.ajax({
                    type: 'GET',
                    url: _url_Feed,
                    dataType: 'jsonp',
                    success: function (_data) {
                        
                        let _xml = _JQ(_data);
                        
                        _xml.find("entry").each(function (_item) {
                            
                            let _this = _JQ(this);
                            
                            let _id = _JQ(_this).find("id").text();;
                            let _title = _JQ(_this).find("title").text();
                            let _content =_JQ(_this).find("content").text();
                            let _published =_JQ(_this).find("published").text();
                            let _link = _this.find("link[rel='alternate']").attr('href');
                            let _author = _this.find("author name").text();
                            
                            let _entry = {
                              'id': _id,
                              'title': _title,
                              'content': _content,
                              'published': _published,
                              'link': _link,
                              'author': _author,
                              
                              'categories': []
                            };
                            
                            _this.find("category").each(function () {
                                
                                let _category_xml = _JQ(this);
                                let _category_string_ = _JQ(_category_xml).attr('term');

                                _entry.categories.push(_category_string_);
                                
                            });

                            
                            _feed.entries.push(_entry);
                            
//                            var description = $(this).find("description").text();
//                            var linkUrl = $(this).find("link_url").text();
//                            var link = "<a href='" + linkUrl + "' target='_blank'>Read More<a>";
//                            $('#feedContainer').append('<article><h3>'+title+'</h3><p>'+description+link+'</p>');
                        });
                        
                        _resolve({
                            'xml': _xml,
                            'feed': _feed
                        });

                    },
                    beforeSend: function(_xhr) {
//                        _xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    }
                });
                
                
            } catch (_e) {
                _reject(_e);
            }
        });
    },
    
    
    'get_TopicbyID': function (_options) {
        
        var _topics = _options.topics;
        var _id = _options.id;
        var _topic = null;
        
        var _elementPos = _topics.map(function(_x) {return _x.id; }).indexOf(_id);
        
        if (_elementPos >= -1) {
            _topic = _topics[_elementPos];
        }
        
        var _response = {
            'topic': _topic,
            'position': _elementPos
        };
        
        return _response;
        
    },  // EndOf get_TopicbyID
    
    
    'get_detailForCategories': function(_options) {
        return new Promise(function(_resolve, _reject) {

            try {
                
                if (_options === undefined) {
                    _options = {};
                }
                
                if (_options.feed === undefined) {
                    throw ('feed option is required.');
                }
                let _feed = _options.feed;
                
                let _config = config_mod.get_current_config();
                if (_options.config !== undefined) {
                    _config = _options.config;
                }
                
                let _JQ = _config.jquery_Lib;
                
                let _categories_RAW = {};
                
                _feed.entries.forEach(function(_entry, _i_entry) {
                    _entry.categories.forEach(function(_category, _i_category) {
                        
                        if (_categories_RAW[_category] === undefined) {
                            _categories_RAW[_category] = {
                                    'posts': [],
                                    'count': 0
                            };
                        }
                        _categories_RAW[_category].posts.push(_entry);
                        _categories_RAW[_category].count++;
                        
                    });
                });

                let _categories = [];
                for (var _category in _categories_RAW) {
                    _categories.push({
                        'name': _category,
                        'posts': _categories_RAW[_category].posts,
                        'count': _categories_RAW[_category].count
                    });
                }
                
                
                _resolve({
                    'categories': _categories
                });
                
            } catch (_e) {
                _reject(_e);
            }
            
        });
    },   // EndOf get_detailForCategories
    
    
    'get_TopicBlogEntries': function(_options) {
        return new Promise(function(_resolve, _reject) {
           
            try {
                // Check options
                _options = (_options !== undefined) ? _options : {};
                
                if (_options.topic === undefined) {
                    throw ('topic option is required.');
                }
                let _topic = _options.topic;
                
                // Check option analize
                let _analize = (_options.analize !== undefined) ? _options.analize : false;
                
                let _config = config_mod.get_current_config();
                if (_options.config !== undefined) {
                    _config = _options.config;
                }
                
                let _JQ = _config.jquery_Lib;

                
                _rss.load_feed({
                    'url': _topic.url_feed
                }).then(
                    
                    function(_data_load_feed) {
                        
                        // Make changes for each entry of feed
                        let _feed = _data_load_feed.feed;
                        _feed.entries.forEach(function(_item, _i) {
                            _item.published_raw = _item.published;
                            _item.published = _item.published_raw.split('T')[0];
                        });
                        
                        _rss.get_detailForCategories({
                            'feed': _data_load_feed.feed
                        }).then(
                                
                            function(_data_categories) {

                                let _result = {
                                    'categories': _data_categories.categories,
                                    'feed': _data_load_feed.feed
                                };
                                
                                // Analize the data of the feed (optional)
                                if (_analize === true) {
                                    
                                    rss_data_mod.analize_feed({
                                        'categories': _data_categories.categories,
                                        'feed': _data_load_feed.feed
                                    }).then(function(_feed_DATA) {
                                        _result.feed_DATA = _feed_DATA;
                                        _resolve(_result);
                                    }, 
                                    function(_feed_DATA_error) {
                                        _reject(_feed_DATA_error);
                                    }); // EndOf analize_feed
                                    
                                } else {
                                    _resolve(_result);
                                }
                                
                            },
                            function(_error_categories) {
                                _reject(_error_categories);
                            }); // EndOf get_detailForCategories
                        
                    },
                    function(_error_load_feed) {
                        _reject(_error_load_feed);
                    }); // EndOf load_feed
                
            } catch (_e) {
                _reject(_e);
            }
            
        });
    }   // EndOf get_TopicBlogEntries
        
};


module.exports = _rss;
