/**
 * Exports utility functions for manipulation of HTML query strings
 *
 * @module querier
 */
(function(name, context, definition) {
    if(typeof module !== 'undefined' && module.exports) module.exports = definition();
    else if(typeof define === 'function' && define.amd) define(definition);
    else context[name] = definition();
})('Querier', this, function() {
    function isArray(o) {
        return Object.prototype.toString.call(o) === "[object Array]";
    }

    var s = null,
        n = 0;

    /**
     * Querier object containing utility functions for manipulating HTML query
     * strings
     *
     * @class Querier
     * @static
     */
    var Querier = {
        /**
         * Get query string values
         *
         * @method get
         * @param [p]* Any number of keys to select, or nothing to select all as
         * object
         * @return Object if multiple or value if single
         */
        get: function(p) {
            if(!s) return false;

            if(arguments.length > 1) {
                return this.get(Array.slice ? Array.slice(arguments) : Array.prototype.slice.call(arguments));
            } else if(typeof p == "string") {
                // single key
                if(p in s) return s[p];
            } else if(typeof p == "undefined") {
                // all keys
                return s;
            } else if(isArray(p)) {
                // certain keys
                var data = {};
                for(var i = 0; i < p.length; i++) {
                    var k = p[i];
                    if(k in s) data[k] = s[k];
                }
                return data;
            }

            return false;
        },

        /**
         * Manually refresh the internal query string object
         *
         * @method refresh
         * @return {Number} Number of keys
         */
        refresh: function() {
            var q = window.location.search;

            if(q.length < 1) {
                s = null;
            } else {
                s = {};
                var pairs = q.substr(1).split("&"),
                    pair = null;

                for(n = 0; n < pairs.length; n++) {
                    pair = pairs[n].split("=");
                    s[decodeURIComponent(pair[0])] = pair.length > 1 ? decodeURIComponent(pair[1]) : "";
                }
            }

            return n;
        },

        /**
         * Generate a query string from an object
         *
         * @method make
         * @param {Object} o The object
         * @return {String} The generated query string
         */
        make: function(o) {
            if(typeof o != "object") return "";

            var a = [];

            for(var k in o) {
                var v = o[k];
                a.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }

            return a.join("&");
        }
    };

    if(window) {
        Querier.refresh();
        return Querier;
    }
});
