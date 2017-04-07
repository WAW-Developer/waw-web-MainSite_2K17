"use strict";


/**
 * import config library
 * @ignore
 */
import * as config_mod from "../config/config.js";


let _rss_data = {
        
    'analize_feed': function(_options) {
        return new Promise(function(_resolve, _reject) {
            try {
                // Check options
                _options = (_options !== undefined) ? _options : {};

                if (_options.feed === undefined) {
                    throw 'feed option is required.';
                }
                let _feed = _options.feed;
                
                if (_options.categories === undefined) {
                    throw 'categories option is required.';
                }
                let _categories = _options.categories;

                
                let _feed_DATA = {
                  'categories_total_entries': 0,
                  'ratio_categories_entry': 0,
                  'ratio_entries_category': 0,
                  'top_categories_linked': [],
                  'years': 0,
                  'entries_by_year': {}
                };
                
                
                _feed_DATA.ratio_categories_entry = _categories.length / _feed.entries.length;
                
                _categories.sort(function(_a,_b) {
                    if (_a.count > _b.count) {
                        return 1;
                    }
                    if (_a.count < _b.count) {
                        return -1;
                    }
                    return 0;
                });
                
                
                let _categories_total_entries = 0;
                
                _categories.forEach(function(_item, _i) {
                    _item._model = (_item._model !== undefined) ? _item._model : {};
                    _item._model._rss_data = {};
                    
                    _item._model._rss_data.deviation_entries = Math.abs(_item.count - _feed_DATA.ratio_categories_entry);
                    _item._model._rss_data.density_entries = _item.count / _feed.entries.length;
                    
                    
                    _item._model._rss_data.related_categories = _rss_data._get_related_categories({
                        'categories': _categories,
                        'name': _item.name
                    });

                    _feed_DATA.top_categories_linked.push(_item);
                    
                    _categories_total_entries += _item.count;
                });
                
                
                _feed_DATA.categories_total_entries = _categories_total_entries;
                _feed_DATA.ratio_entries_category = _categories_total_entries / _categories.length;

                
                _feed.entries.forEach(function(_item, _i) {
                    _item._model = (_item._model !== undefined) ? _item._model : {};
                    _item._model._rss_data = {};
                    _item._model._rss_data.deviation_categories = Math.abs(_item.categories.length - _feed_DATA.ratio_categories_entry);

                    
                    let _date = new Date(_item.published);
                    let _year = _date.getFullYear();
                    if (_feed_DATA.entries_by_year[_year] === undefined) {
                        _feed_DATA.entries_by_year[_year] = [];
                        _feed_DATA.years++;
                    }
                    _feed_DATA.entries_by_year[_year].push(_item);
                    
                });
                
                
                _categories.forEach(function(_item, _i) {
                    _item._model._rss_data.deviation_categories = Math.abs(_item.count - _feed_DATA.ratio_entries_category);
                    _item._model._rss_data.density_categories = _item.count / _categories_total_entries;

                });
                
                
                _feed_DATA.top_categories_linked.sort(function(_a,_b) {
                    var _rel_cat_a = _a._model._rss_data.related_categories;
                    var _rel_cat_b = _b._model._rss_data.related_categories;

                    if (_rel_cat_a.length > _rel_cat_b.length) {
                        return -1;
                    }
                    if (_rel_cat_a.length < _rel_cat_b.length) {
                        return 1;
                    }
                    return 0;
                });

                
                _resolve(_feed_DATA);
                
            } catch (_e) {
                _reject(_e);
            }            
        });
    },
    
    
    
    '_get_related_categories': function(_options) {
        
        // Check options
        _options = (_options !== undefined) ? _options : {};

        if (_options.categories === undefined) {
            throw 'categories option is required.';
        }
        let _categories = _options.categories;
        
        if (_options.name === undefined) {
            throw 'name option is required.';
        }
        let _name = _options.name;
        
        let _related_categories = [];
        
        _categories.forEach(function(_category, _i) {
            if (_name === _category.name) {
                return;
            }
            
            let _category_link = {
                'name': _category.name,
                'count': 0,
                '_category': _category
            };
            
            _category.posts.forEach(function(_post, _i_B) {
                if (_post.categories.indexOf(_name) !== -1) {
                    _category_link.count++;
                }
            });
            
            if (_category_link.count > 0) {
                _related_categories.push(_category_link);
            }
        });

        
        _related_categories.sort(function(_a,_b) {
            if (_a.count > _b.count) {
                return 1;
            }
            if (_a.count < _b.count) {
                return -1;
            }
            return 0;
        });
        
        return _related_categories;

    }


};

module.exports = _rss_data;
