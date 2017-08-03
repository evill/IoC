"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represent any data which can be stored in container without dependencies and resolved as is
 */
var SimpleResource = function () {
    /**
     * Constructor
     *
     * @param {*} resource
     */
    function SimpleResource(resource) {
        _classCallCheck(this, SimpleResource);

        this._resource = resource;
    }

    _createClass(SimpleResource, [{
        key: "resolve",
        value: function resolve() {
            return this._resource;
        }
    }]);

    return SimpleResource;
}();

exports.default = SimpleResource;