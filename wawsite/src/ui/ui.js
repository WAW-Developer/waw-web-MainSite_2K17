"use strict";


/**
 * import config library
 * @ignore
 */
import * as config_mod from "../config/config.js";
import * as rss_mod from "../rss/rss.js";


let _ui = {
        
        
    '_waw_topic': null,
    
    '_components': {
      'header': null,
      'topic_detail': null,
      'topics_list': null,
      'blog_properties': null,
      'posts_list': null
    },
    
    '_current_topic': {
        'isMainTopic': false,
        'isRootTopic': true,
        'id': null,
        '_topic': null,
        '_parent': null
    },

    

    'get_wawTopic': function() {
      return _ui._waw_topic;  
    },
    
    'get_components': function() {
        return _ui._components;  
    },
    
    'get_current_topic': function() {
        return _ui._current_topic;  
    },
    
    
    '_initialize_wawTopic': function(_options) {
        
        if (_options === undefined) {
            _options = {};
        }
        
        let _loaded_config = config_mod.get_loaded_config();
        
        
        let _waw_topic = rss_mod.get_TopicbyID({
            'topics': _loaded_config.topics,
            'id': 'waw'
        }).topic;
        
        _ui._waw_topic = _waw_topic;
    },
        
    
    '_initialize_header': function(_options) {

        if (_options === undefined) {
            _options = {};
        }
        
        if (_options.component === undefined) {
            throw ('component option is required.');
        }
        let _component = _options.component;
        
        let _config = config_mod.get_current_config();
        if (_options.config !== undefined) {
            _config = _options.config;
        }
        
        let _JQ = _config.jquery_Lib;
        
        let _wawHeader = _JQ(_component)[0];
        _ui._components.header = _wawHeader;
        
        
        // Map event 'itemclicked'
        _JQ(_wawHeader).on('itemclicked', function(_event, _data) {
            
            let _event_detail = _event.originalEvent.detail;

            let _topic_id = _event_detail['data-target'];
            _ui.set_current_topic({
                'topic': _topic_id
            });
            
        });
        
        
        let _waw_topic = _ui.get_wawTopic();
        
        _wawHeader.set_topics({
            'topics': _waw_topic.subtopics
        });
        
    },
    
    
    
    '_initialize_topic_detail': function(_options) {

        if (_options === undefined) {
            _options = {};
        }
        
        if (_options.component === undefined) {
            throw ('component option is required.');
        }
        let _component = _options.component;
        
        let _config = config_mod.get_current_config();
        if (_options.config !== undefined) {
            _config = _options.config;
        }
        
        let _JQ = _config.jquery_Lib;
        
        let _element = _JQ(_component)[0];
        _ui._components.topic_detail = _element;
        
    },
    
        
    '_initialize_topics_list': function(_options) {

        if (_options === undefined) {
            _options = {};
        }
        
        if (_options.component === undefined) {
            throw ('component option is required.');
        }
        let _component = _options.component;
        
        /*
        let _config = config_mod.get_current_config();
        if (_options.config !== undefined) {
            _config = _options.config;
        }
        */
        let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
        
        let _JQ = _config.jquery_Lib;
        let _element = _JQ(_component)[0];
        
        // Map event 'itemclicked'
        _JQ(_element).on('itemclicked', function(_event, _data) {
            
            let _event_detail = _event.originalEvent.detail;

            let _topic_id = _event_detail['data-target'];
            let _isMainTopic = true;
            
            // Check if is a 'main topic'
            let _current_topic = _ui.get_current_topic();
            if (_current_topic._parent !== undefined && 
                    _current_topic._parent !== null) {
                _isMainTopic = false;
            }
            
            _ui.set_current_topic({
                'topic': _topic_id,
                'isMainTopic': _isMainTopic
            });
            
        });
        
        _ui._components.topics_list = _element;
        
    },  // EndOf _initialize_topics_list
    
    
    '_initialize_blog_properties': function(_options) {

        if (_options === undefined) {
            _options = {};
        }
        
        if (_options.component === undefined) {
            throw ('component option is required.');
        }
        let _component = _options.component;
        
        /*
        let _config = config_mod.get_current_config();
        if (_options.config !== undefined) {
            _config = _options.config;
        }
        */
        
        let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
        
        let _JQ = _config.jquery_Lib;
        
        let _element = _JQ(_component)[0];
        
        
        // Map event 'catepgoryclicked'
        _JQ(_element).on('catepgoryclicked', function(_event, _data) {
            
            let _event_detail = _event.originalEvent.detail;

            let _category = _event_detail['category'];
            
            _ui.get_components().posts_list.set_categories();
        });
        
        
        _ui._components.blog_properties = _element;
        
    },  // EndOf _initialize_blog_properties
    
    
    '_initialize_posts_list': function(_options) {

        if (_options === undefined) {
            _options = {};
        }
        
        if (_options.component === undefined) {
            throw ('component option is required.');
        }
        let _component = _options.component;
        
        let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
        
        let _JQ = _config.jquery_Lib;
        
        let _element = _JQ(_component)[0];
        
        // Map event 'selectedcategoriesreset'
        _JQ(_element).on('selectedcategoriesreset', function(_event, _data) {
            
            _ui.get_components().blog_properties.set_topic();
        });
        
        // Map event 'catepgoryclicked'
        _JQ(_element).on('catepgoryclicked', function(_event, _data) {
            
            _ui.get_components().blog_properties.set_topic();
        });
        
        
        _ui._components.posts_list = _element;
        
    },  // EndOf _initialize_posts_list

        
    'initialize_UI': function(_options) {
        
        if (_options === undefined) {
            _options = {};
        }

        let _config = config_mod.get_current_config();
        if (_options.config !== undefined) {
            _config = _options.config;
        }

        
        _ui._initialize_wawTopic();


        
        _ui._initialize_header({
            'config': _config,
            'component': 'waw-header'
        });
        
        _ui._initialize_topic_detail({
            'config': _config,
            'component': 'waw-topic-detail'
        });
        
        _ui._initialize_topics_list({
            'config': _config,
            'component': 'waw-topics-list'
        });
        
        _ui._initialize_blog_properties({
            'config': _config,
            'component': 'waw-blog-properties'
        });

        _ui._initialize_posts_list({
            'config': _config,
            'component': 'waw-posts-list'
        });
        
        _ui.set_current_topic({
            'isRootTopic': true,
            'topic': 'waw'
        });
        
    },
    
    
    'set_current_topic': function(_options) {
        
        if (_options === undefined) {
            _options = {};
        }

        let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
        
        if (_options.topic === undefined) {
            throw ('topic option is required.');
        }
        let _topic_id = _options.topic;

        let _isMainTopic = true;
//        let _parent = null;
        if (_options.isMainTopic !== undefined &&
                _options.isMainTopic === false) {
            _isMainTopic = false;
            
//            if (_options.parent === undefined) {
//                throw ('parent option is required.');
//            }
//            _parent = _options.parent;
        }
        
        let _isRootTopic = false;
        if (_options.isRootTopic !== undefined &&
                _options.isRootTopic === true) {
            _isRootTopic = true;
            _isMainTopic = false;   // override isMainTopic
        }
        
        
        let _topic = null;
        let _current_topic = _ui.get_current_topic();
        
        console.log('set_current_topic');     // TODO: REMOVE DEBUG LOG
        console.log(_options);     // TODO: REMOVE DEBUG LOG

        
        if (_isRootTopic === true) {
            
            _topic = _ui.get_wawTopic();
            _current_topic._parent = null;
            
        } else {
            
            let _subtopics_parent = null;
            
            if (_isMainTopic === true) {
                _current_topic._parent = _ui.get_wawTopic();
            } else {
                if (_current_topic._topic.subtopics !== undefined) {
                    _current_topic._parent = _current_topic._topic;
                }
            }
            
            _subtopics_parent = _current_topic._parent.subtopics;
            
            _topic = rss_mod.get_TopicbyID({
                'topics': _subtopics_parent,
                'id': _topic_id
            }).topic;
            
        }
        
        
        // Update 'current topic'
        _current_topic.id = _topic.id;
        _current_topic._topic = _topic;
        _current_topic.isMainTopic = _isMainTopic;
        _current_topic.isRootTopic = _isRootTopic;
        
        
        // Update components
        let _components = _ui.get_components();
        
        _components.topic_detail.set_topic({
            'topic': _topic
        });
        
        if (_isMainTopic === true) {
            _components.header.set_active_topic({
                'topic': _topic.id
            });
            
            _ui._manage_rss({
                'config': _config,
                'topic': _topic
            });
            
            _components.blog_properties.set_topic({
                'topic': _topic
            });
        }
        
        if (_topic.subtopics !== undefined) {
            _components.topics_list.set_topics({
                'topics': _topic.subtopics
            });
        }

        
    },  // EndOf set_current_topic
    
    
    '_manage_rss': function(_options) {
        
        if (_options === undefined) {
            _options = {};
        }

        let _config = (_options.config !== undefined) ? _options.config : config_mod.get_current_config();
        
        if (_options.topic === undefined) {
            throw ('topic option is required.');
        }
        let _topic = _options.topic;
        
        
        if (_topic.url_feed === undefined) {    // Feed URL is required
            return;
        }
        
        if (_topic._model._rss === undefined) {   
            _topic._model._rss = {};
            
        }
        
        
        if (_topic._model._rss.loaded === true ) {
            
            let _components = _ui.get_components();
            _components.posts_list.set_posts({
                'posts': _topic._model._rss.feed.entries
            });
            _components.posts_list.set_categories({
                'categories': _topic._model._rss.categories
            });

            
        } else {
            
            rss_mod.get_TopicBlogEntries({
                'topic': _topic
            }).then(
            function(_data){
                _topic._model._rss.loaded = true;
                _topic._model._rss.categories = _data.categories;
                _topic._model._rss.feed = _data.feed;
                
                let _components = _ui.get_components();
                _components.posts_list.set_posts({
                    'posts': _topic._model._rss.feed.entries
                });
                _components.posts_list.set_categories({
                    'categories': _topic._model._rss.categories
                });
                
                _components.blog_properties.set_topic({
                    'topic': _topic
                });

            }, 
            function(_error){
                _topic._model._rss.loaded = false;
                _topic._model._rss._error = _error;
                console.log(_error); // TODO: REMOVE DEBUG LOG
            });

        }

    }   // EndOf _manage_rss
    
        
};


module.exports = _ui;
