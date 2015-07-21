var FynxMixins =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint browserify: true */
	'use strict';
	module.exports = {
	  listenTo: __webpack_require__(1),
	  listenToProp: __webpack_require__(2),
	  connect: __webpack_require__(3),
	  connectProp: __webpack_require__(4),
	  connectVia: __webpack_require__(5)
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*jshint browserify: true */
	'use strict';
	module.exports = listenTo;

	function listenTo(store, fn) {
	  return {
	    componentDidMount: function componentDidMount() {
	      store.listen(typeof fn === 'function' ? fn : this[fn], this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      store.unlisten(typeof fn === 'function' ? fn : this[fn], this);
	    }
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	/*jshint browserify: true */
	'use strict';
	module.exports = listenToProp;

	function listenToProp(prop, fn) {
	  return {
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	      var func = typeof fn === 'function' ? fn : this[fn];
	      if (nextProps[prop]) {
	        if (nextProps[prop] === this.props[prop]) return;
	        nextProps[prop].listen(func, this);
	        if (this.props[prop]) {
	          this.props[prop].unlisten(func, this);
	        }
	      } else {
	        if (!this.props[prop]) return;
	        this.props[prop].unlisten(func, this);
	      }
	    },
	    componentDidMount: function componentDidMount() {
	      if (!this.props[prop]) return;
	      var func = typeof fn === 'function' ? fn : this[fn];
	      this.props[prop].listen(func, this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      if (!this.props[prop]) return;
	      var func = typeof fn === 'function' ? fn : this[fn];
	      this.props[prop].unlisten(func, this);
	    }
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*jshint browserify: true */
	'use strict';
	module.exports = connect;

	function connect(store, name) {
	  function update(value) {
	    /*jshint validthis: true */
	    var state = {};
	    state[name] = value;
	    this.setState(state);
	  }
	  return {
	    getInitialState: function getInitialState() {
	      var state = {};
	      state[name] = store();
	      return state;
	    },
	    componentDidMount: function componentDidMount() {
	      store.listen(update, this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      store.unlisten(update, this);
	    }
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*jshint browserify: true */
	'use strict';
	module.exports = connectProp;

	function connectProp(prop, name) {
	  function update(value) {
	    /*jshint validthis: true */
	    var state = {};
	    state[name] = value;
	    this.setState(state);
	  }
	  return {
	    getInitialState: function getInitialState() {
	      var state = {};
	      if (this.props[prop]) {
	        state[name] = this.props[prop]();
	      }
	      return state;
	    },
	    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	      if (nextProps[prop]) {
	        if (nextProps[prop] === this.props[prop]) return;
	        nextProps[prop].listen(update, this);
	        update.call(this, nextProps[prop]());
	        if (this.props[prop]) {
	          this.props[prop].unlisten(update, this);
	        }
	      } else {
	        if (!this.props[prop]) return;
	        update.call(this, undefined);
	        this.props[prop].unlisten(update, this);
	      }
	    },
	    componentDidMount: function componentDidMount() {
	      if (!this.props[prop]) return;
	      this.props[prop].listen(update, this);
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      if (!this.props[prop]) return;
	      this.props[prop].unlisten(update, this);
	    }
	  };
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	/*jshint browserify: true */
	'use strict';
	module.exports = connectVia;

	function connectVia(stores, fn) {
	  if (!Array.isArray(stores)) stores = [stores];
	  function getStateFromStores(self) {
	    var values = stores.map(function (store) {
	      return store();
	    });
	    var func = typeof fn === 'function' ? fn : self[fn];
	    return func.apply(self, values);
	  }
	  function update() {
	    /*jshint validthis: true */
	    this.setState(getStateFromStores(this));
	  }
	  return {
	    getInitialState: function getInitialState() {
	      return getStateFromStores(this);
	    },
	    componentDidMount: function componentDidMount() {
	      var _this = this;

	      stores.map(function (store) {
	        return store.listen(update, _this);
	      });
	    },
	    componentWillUnmount: function componentWillUnmount() {
	      var _this2 = this;

	      stores.map(function (store) {
	        return store.unlisten(update, _this2);
	      });
	    }
	  };
	}

/***/ }
/******/ ]);