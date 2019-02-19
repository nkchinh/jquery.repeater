// jquery.repeater version 1.2.2
// https://github.com/DubFriend/jquery.repeater
// (MIT) 19-02-2019
// Brian Detering <BDeterin@gmail.com> (http://www.briandetering.net/)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
    typeof define === 'function' && define.amd ? define(['jquery'], factory) :
    (factory(global.jQuery));
  }(this, (function ($) { 'use strict';
  
    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
  
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
  
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }
  
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
  
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
  
    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }
  
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
  
      return _setPrototypeOf(o, p);
    }
  
    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
  
      return self;
    }
  
    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }
  
      return _assertThisInitialized(self);
    }
  
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
  
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
  
        return arr2;
      }
    }
  
    function _iterableToArray(iter) {
      if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }
  
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
  
    function isArray(value) {
      return $.isArray(value);
    }
    function isObject(value) {
      return !isArray(value) && value instanceof Object;
    }
    function isFunction(value) {
      return value instanceof Function;
    }
    function partial(f) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
  
      if (isFunction(f)) {
        return function () {
          for (var _len3 = arguments.length, args1 = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args1[_key3] = arguments[_key3];
          }
  
          return f.apply(void 0, _toConsumableArray(args.concat(args1)));
        };
      }
  
      return undefined;
    }
    function indexOf(object, value) {
      return $.inArray(value, object);
    }
    function inArray(array, value) {
      return indexOf(array, value) !== -1;
    } // deep copy of json objects
    function foreach(collection, callback) {
      if (collection) {
        Object.keys(collection).forEach(function (i) {
          return callback(collection[i], i, collection);
        });
      }
    }
    function last(array) {
      return array[array.length - 1];
    }
    function mapToArray(collection, callback) {
      var mapped = [];
      foreach(collection, function (value, key, coll) {
        mapped.push(callback(value, key, coll));
      });
      return mapped;
    }
    function mapToObject(collection, callback, keyCallback) {
      var mapped = {};
      foreach(collection, function (value, key, coll) {
        // eslint-disable-next-line no-param-reassign
        key = keyCallback ? keyCallback(key, value) : key;
        mapped[key] = callback(value, key, coll);
      });
      return mapped;
    }
    function map(collection, callback, keyCallback) {
      return isArray(collection) ? mapToArray(collection, callback) : mapToObject(collection, callback, keyCallback);
    }
    function call(collection, functionName, args) {
      return map(collection, function (object) {
        return object[functionName].apply(object, _toConsumableArray(args || []));
      });
    }
    function $getAnyForminatorModule(preSelector, name, moduleName) {
      return $(preSelector + (moduleName ? "-".concat(moduleName) : '') + (name ? "-".concat(name) : ''));
    }
    var $getForminatorByClass = partial($getAnyForminatorModule, '.frm');
  
    var PubSub =
    /*#__PURE__*/
    function () {
      function PubSub() {
        _classCallCheck(this, PubSub);
  
        this.topics = {};
      }
  
      _createClass(PubSub, [{
        key: "publish",
        value: function publish(topic, data) {
          foreach(this.topics[topic], function (callback) {
            callback(data);
          });
        }
      }, {
        key: "subscribe",
        value: function subscribe(topic, callback) {
          this.topics[topic] = this.topics[topic] || [];
          this.topics[topic].push(callback);
        }
      }, {
        key: "unsubscribe",
        value: function unsubscribe(callback) {
          foreach(this.topics, function (subscribers) {
            var index = indexOf(subscribers, callback);
  
            if (index !== -1) {
              subscribers.splice(index, 1);
            }
          });
        }
      }]);
  
      return PubSub;
    }();
  
    var BaseInput =
    /*#__PURE__*/
    function (_PubSub) {
      _inherits(BaseInput, _PubSub);
  
      function BaseInput(fig) {
        var _this;
  
        _classCallCheck(this, BaseInput);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(BaseInput).call(this));
        _this.$self = fig.$;
        return _this;
      }
      /**
       * @abstract
       * @method
       * @name get
       */
  
      /**
       * @abstract
       * @method
       * @name set
       * @param {*} newValue new value
       */
  
      /**
       * @virtual
       */
  
  
      _createClass(BaseInput, [{
        key: "getType",
        value: function getType() {
          throw 'implement me (return type. "text", "radio", etc.)';
        }
      }, {
        key: "$",
        value: function $$$1(selector) {
          return selector ? this.$self.find(selector) : this.$self;
        }
      }, {
        key: "disable",
        value: function disable() {
          this.$().prop('disabled', true);
          this.publish('isEnabled', false);
        }
      }, {
        key: "enable",
        value: function enable() {
          this.$().prop('disabled', false);
          this.publish('isEnabled', true);
        }
      }, {
        key: "equalTo",
        value: function equalTo(a, b) {
          return a === b;
        }
      }, {
        key: "publishChange",
        value: function publishChange(e, domElement) {
          var newValue = this.get();
  
          if (!this.equalTo(newValue, this.oldValue)) {
            this.publish('change', {
              e: e,
              domElement: domElement
            });
          }
  
          this.oldValue = newValue;
        }
      }]);
  
      return BaseInput;
    }(PubSub);
    var Input =
    /*#__PURE__*/
    function (_BaseInput) {
      _inherits(Input, _BaseInput);
  
      function Input() {
        _classCallCheck(this, Input);
  
        return _possibleConstructorReturn(this, _getPrototypeOf(Input).apply(this, arguments));
      }
  
      _createClass(Input, [{
        key: "get",
        value: function get() {
          return this.$().val();
        }
      }, {
        key: "set",
        value: function set(newValue) {
          this.$().val(newValue);
        }
      }, {
        key: "clear",
        value: function clear() {
          this.set('');
        }
      }, {
        key: "buildSetter",
        value: function buildSetter(callback) {
          var _this2 = this;
  
          return function (newValue) {
            return callback.call(_this2, newValue);
          };
        }
      }]);
  
      return Input;
    }(BaseInput);
    function inputEqualToArray(a, b) {
      // eslint-disable-next-line no-param-reassign
      a = isArray(a) ? a : [a]; // eslint-disable-next-line no-param-reassign
  
      b = isArray(b) ? b : [b];
      var isEqual = true;
  
      if (a.length !== b.length) {
        isEqual = false;
      } else {
        foreach(a, function (value) {
          if (!inArray(b, value)) {
            isEqual = false;
          }
        });
      }
  
      return isEqual;
    }
  
    var InputText =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputText, _Input);
  
      function InputText(fig) {
        var _this;
  
        _classCallCheck(this, InputText);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputText).call(this, fig));
  
        if (fig.type) {
          _this.$type = fig.type;
        }
  
        _this.$().on('change keyup keydown', function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputText, [{
        key: "getType",
        value: function getType() {
          return this.$type || 'text';
        }
      }]);
  
      return InputText;
    }(Input);
  
    var InputTextarea =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputTextarea, _Input);
  
      function InputTextarea(fig) {
        var _this;
  
        _classCallCheck(this, InputTextarea);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputTextarea).call(this, fig));
  
        _this.$().on('change keyup keydown', function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputTextarea, [{
        key: "getType",
        value: function getType() {
          return 'textarea';
        }
      }]);
  
      return InputTextarea;
    }(Input);
  
    var InputSelect =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputSelect, _Input);
  
      function InputSelect(fig) {
        var _this;
  
        _classCallCheck(this, InputSelect);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputSelect).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputSelect, [{
        key: "getType",
        value: function getType() {
          return 'select';
        }
      }]);
  
      return InputSelect;
    }(Input);
  
    var InputRadio =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputRadio, _Input);
  
      function InputRadio(fig) {
        var _this;
  
        _classCallCheck(this, InputRadio);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputRadio).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputRadio, [{
        key: "getType",
        value: function getType() {
          return 'radio';
        }
      }, {
        key: "get",
        value: function get() {
          return this.$().filter(':checked').val() || null;
        }
      }, {
        key: "set",
        value: function set(newValue) {
          if (!newValue) {
            this.$().each(function () {
              $(this).prop('checked', false);
            }); // self.$().prop('checked', false);
          } else {
            this.$().filter("[value=\"".concat(newValue, "\"]")).prop('checked', true);
          }
        } // self.set = my.buildSetter(function (newValue) {
        //     console.log('set : ', newValue, self.$());
        //     if(!newValue) {
        //         self.$().prop('checked', false);
        //     }
        //     else {
        //     self.$().filter('[value="' + newValue + '"]').prop('checked', true);
        //     }
        // });
  
      }]);
  
      return InputRadio;
    }(Input);
  
    var InputCheckbox =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputCheckbox, _Input);
  
      function InputCheckbox(fig) {
        var _this;
  
        _classCallCheck(this, InputCheckbox);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputCheckbox).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputCheckbox, [{
        key: "getType",
        value: function getType() {
          return 'checkbox';
        }
      }, {
        key: "get",
        value: function get() {
          var _this2 = this;
  
          var values$$1 = [];
          this.$().filter(':checked').each(function (_, ele) {
            values$$1.push($(_this2).val(ele));
          });
          return values$$1;
        }
      }, {
        key: "set",
        value: function set(newValues) {
          var _this3 = this;
  
          // eslint-disable-next-line no-param-reassign
          newValues = isArray(newValues) ? newValues : [newValues];
          this.$().each(function () {
            $(this).prop('checked', false);
          });
          foreach(newValues, function (value) {
            _this3.$().filter("[value=\"".concat(value, "\"]")).prop('checked', true);
          });
        }
      }, {
        key: "equalTo",
        value: function equalTo() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
  
          inputEqualToArray(args);
        }
      }]);
  
      return InputCheckbox;
    }(Input);
  
    var InputFile =
    /*#__PURE__*/
    function (_BaseInput) {
      _inherits(InputFile, _BaseInput);
  
      function InputFile(fig) {
        var _this;
  
        _classCallCheck(this, InputFile);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputFile).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputFile, [{
        key: "getType",
        value: function getType() {
          return 'file';
        }
      }, {
        key: "get",
        value: function get() {
          return last(this.$().val().split('\\'));
        }
      }, {
        key: "clear",
        value: function clear() {
          // eslint-disable-next-line max-len
          // http://stackoverflow.com/questions/1043957/clearing-input-type-file-using-jquery
          this.$().each(function (_, ele) {
            $(ele).wrap('<form>').closest('form').get(0).reset();
            $(ele).unwrap();
          });
        }
      }]);
  
      return InputFile;
    }(BaseInput);
  
    var InputButton =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputButton, _Input);
  
      function InputButton(fig) {
        var _this;
  
        _classCallCheck(this, InputButton);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputButton).call(this, fig));
  
        _this.$().on('change', function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      } // eslint-disable-next-line class-methods-use-this
  
  
      _createClass(InputButton, [{
        key: "getType",
        value: function getType() {
          return 'button';
        }
      }]);
  
      return InputButton;
    }(Input);
  
    var InputHidden =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputHidden, _Input);
  
      function InputHidden(fig) {
        var _this;
  
        _classCallCheck(this, InputHidden);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputHidden).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputHidden, [{
        key: "getType",
        value: function getType() {
          return 'hidden';
        }
      }]);
  
      return InputHidden;
    }(Input);
  
    var InputRange =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputRange, _Input);
  
      function InputRange(fig) {
        var _this;
  
        _classCallCheck(this, InputRange);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputRange).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputRange, [{
        key: "getType",
        value: function getType() {
          return 'range';
        }
      }]);
  
      return InputRange;
    }(Input);
  
    var InputMultipleSelect =
    /*#__PURE__*/
    function (_Input) {
      _inherits(InputMultipleSelect, _Input);
  
      function InputMultipleSelect(fig) {
        var _this;
  
        _classCallCheck(this, InputMultipleSelect);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputMultipleSelect).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputMultipleSelect, [{
        key: "getType",
        value: function getType() {
          return 'select[multiple]';
        }
      }, {
        key: "get",
        value: function get() {
          return this.$().val() || [];
        }
      }, {
        key: "set",
        value: function set(newValues) {
          var val;
  
          if (newValues === '') {
            val = [];
          } else if (isArray(newValues)) {
            val = newValues;
          } else {
            val = [newValues];
          }
  
          this.$().val(val);
        }
      }, {
        key: "equalTo",
        value: function equalTo() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
  
          inputEqualToArray(args);
        }
      }]);
  
      return InputMultipleSelect;
    }(Input);
  
    var InputMultipleFile =
    /*#__PURE__*/
    function (_BaseInput) {
      _inherits(InputMultipleFile, _BaseInput);
  
      function InputMultipleFile(fig) {
        var _this;
  
        _classCallCheck(this, InputMultipleFile);
  
        _this = _possibleConstructorReturn(this, _getPrototypeOf(InputMultipleFile).call(this, fig));
  
        _this.$().change(function (e) {
          return _this.publishChange(e, e.target);
        });
  
        return _this;
      }
  
      _createClass(InputMultipleFile, [{
        key: "getType",
        value: function getType() {
          return 'file[multiple]';
        }
      }, {
        key: "get",
        value: function get() {
          // eslint-disable-next-line max-len
          // http://stackoverflow.com/questions/14035530/how-to-get-value-of-html-5-multiple-file-upload-variable-using-jquery
          var fileListObject = this.$().get(0).files || [];
          var names = [];
          var i;
  
          for (i = 0; i < (fileListObject.length || 0); i += 1) {
            names.push(fileListObject[i].name);
          }
  
          return names;
        }
      }, {
        key: "clear",
        value: function clear() {
          // eslint-disable-next-line max-len
          // http://stackoverflow.com/questions/1043957/clearing-input-type-file-using-jquery
          this.$().each(function (_, ele) {
            $(ele).wrap('<form>').closest('form').get(0).reset();
            $(ele).unwrap();
          });
        }
      }]);
  
      return InputMultipleFile;
    }(BaseInput);
  
    function buildFormInputs(fig) {
      var inputs = {};
      var $self = fig.$;
      var constructor = fig.constructorOverride || {
        button: InputButton,
        // text: InputText,
        // url: InputURL,
        // email: InputEmail,
        // password: InputPassword,
        range: InputRange,
        textarea: InputTextarea,
        select: InputSelect,
        'select[multiple]': InputMultipleSelect,
        radio: InputRadio,
        checkbox: InputCheckbox,
        file: InputFile,
        'file[multiple]': InputMultipleFile,
        hidden: InputHidden
      };
  
      var createInput = function createInput(type, $e) {
        return Object.keys(constructor).indexOf(type) > -1 ? new constructor[type]({
          $: $e
        }) : new InputText({
          type: type,
          $: $e
        });
      };
  
      var addInputsBasic = function addInputsBasic(type, selector) {
        var $input = isObject(selector) ? selector : $self.find(selector);
        $input.each(function (_, ele) {
          var $e = $(ele);
          var name = $e.attr('name');
          inputs[name] = createInput(type || $e.attr('type'), $e);
        });
      };
  
      var addInputsGroup = function addInputsGroup(type, selector) {
        var names = [];
        var $input = isObject(selector) ? selector : $self.find(selector);
  
        if (isObject(selector)) {
          inputs[$input.attr('name')] = createInput(type, $input);
        } else {
          // group by name attribute
          $input.each(function () {
            var name = $(this).attr('name');
  
            if (indexOf(names, name) === -1) {
              names.push(name);
            }
          });
          foreach(names, function (name) {
            inputs[name] = createInput(type, $self.find("input[name=\"".concat(name, "\"]")));
          });
        }
      };
  
      if ($self.is('input, select, textarea')) {
        if ($self.is('input[type="button"], button, input[type="submit"]')) {
          addInputsBasic('button', $self);
        } else if ($self.is('textarea')) {
          addInputsBasic('textarea', $self);
        } else if (($self.is('input[type="text"]') || $self.is('input')) && !$self.attr('type')) {
          addInputsBasic('text', $self);
        } else if ($self.is('input[type="password"]')) {
          addInputsBasic('password', $self);
        } else if ($self.is('input[type="email"]')) {
          addInputsBasic('email', $self);
        } else if ($self.is('input[type="url"]')) {
          addInputsBasic('url', $self);
        } else if ($self.is('input[type="range"]')) {
          addInputsBasic('range', $self);
        } else if ($self.is('select')) {
          if ($self.is('[multiple]')) {
            addInputsBasic('select[multiple]', $self);
          } else {
            addInputsBasic('select', $self);
          }
        } else if ($self.is('input[type="file"]')) {
          if ($self.is('[multiple]')) {
            addInputsBasic('file[multiple]', $self);
          } else {
            addInputsBasic('file', $self);
          }
        } else if ($self.is('input[type="hidden"]')) {
          addInputsBasic('hidden', $self);
        } else if ($self.is('input[type="radio"]')) {
          addInputsGroup('radio', $self);
        } else if ($self.is('input[type="checkbox"]')) {
          addInputsGroup('checkbox', $self);
        } else if ($self.is('input[type]')) {
          addInputsGroup($self.attr('type'), $self);
        } else {
          // in all other cases default to a "text" input interface.
          addInputsBasic('text', $self);
        }
      } else {
        addInputsBasic('button', 'input[type="button"], button, input[type="submit"]'); // addInputsBasic('text', 'input[type="text"]');
        // addInputsBasic('password', 'input[type="password"]');
        // addInputsBasic('email', 'input[type="email"]');
        // addInputsBasic('url', 'input[type="url"]');
  
        addInputsBasic('range', 'input[type="range"]');
        addInputsBasic('textarea', 'textarea');
        addInputsBasic('select', 'select:not([multiple])');
        addInputsBasic('select[multiple]', 'select[multiple]');
        addInputsBasic('file', 'input[type="file"]:not([multiple])');
        addInputsBasic('file[multiple]', 'input[type="file"][multiple]');
        addInputsBasic('hidden', 'input[type="hidden"]');
        addInputsGroup('radio', 'input[type="radio"]');
        addInputsGroup('checkbox', 'input[type="checkbox"]'); // eslint-disable-next-line max-len
  
        addInputsBasic(undefined, 'input[type]:not([type="file"],[type="hidden"],[type="radio"],[type="checkbox"])');
      }
  
      return inputs;
    }
  
    $.fn.inputVal = function (newValue) {
      var $self = $(this);
      var inputs = buildFormInputs({
        $: $self
      });
  
      if ($self.is('input, textarea, select')) {
        if (typeof newValue === 'undefined') {
          return inputs[$self.attr('name')].get();
        }
  
        inputs[$self.attr('name')].set(newValue);
        return $self;
      }
  
      if (typeof newValue === 'undefined') {
        return call(inputs, 'get');
      }
  
      foreach(newValue, function (value, inputName) {
        if (inputs[inputName]) {
          inputs[inputName].set(value);
        }
      });
      return $self;
    };
  
    $.fn.inputOnChange = function (callback) {
      var $self = $(this);
      var inputs = buildFormInputs({
        $: $self
      });
      foreach(inputs, function (input) {
        input.subscribe('change', function (data) {
          callback.call(data.domElement, data.e);
        });
      });
      return $self;
    };
  
    $.fn.inputDisable = function () {
      var $self = $(this);
      call(buildFormInputs({
        $: $self
      }), 'disable');
      return $self;
    };
  
    $.fn.inputEnable = function () {
      var $self = $(this);
      call(buildFormInputs({
        $: $self
      }), 'enable');
      return $self;
    };
  
    $.fn.inputClear = function () {
      var $self = $(this);
      call(buildFormInputs({
        $: $self
      }), 'clear');
      return $self;
    };
  
  })));
  
(function ($) {
'use strict';

var identity = function (x) {
    return x;
};

var isArray = function (value) {
    return $.isArray(value);
};

var isObject = function (value) {
    return !isArray(value) && (value instanceof Object);
};

var isNumber = function (value) {
    return value instanceof Number;
};

var isFunction = function (value) {
    return value instanceof Function;
};

var indexOf = function (object, value) {
    return $.inArray(value, object);
};

var inArray = function (array, value) {
    return indexOf(array, value) !== -1;
};

var foreach = function (collection, callback) {
    for(var i in collection) {
        if(collection.hasOwnProperty(i)) {
            callback(collection[i], i, collection);
        }
    }
};


var last = function (array) {
    return array[array.length - 1];
};

var argumentsToArray = function (args) {
    return Array.prototype.slice.call(args);
};

var extend = function () {
    var extended = {};
    foreach(argumentsToArray(arguments), function (o) {
        foreach(o, function (val, key) {
            extended[key] = val;
        });
    });
    return extended;
};

var mapToArray = function (collection, callback) {
    var mapped = [];
    foreach(collection, function (value, key, coll) {
        mapped.push(callback(value, key, coll));
    });
    return mapped;
};

var mapToObject = function (collection, callback, keyCallback) {
    var mapped = {};
    foreach(collection, function (value, key, coll) {
        key = keyCallback ? keyCallback(key, value) : key;
        mapped[key] = callback(value, key, coll);
    });
    return mapped;
};

var map = function (collection, callback, keyCallback) {
    return isArray(collection) ?
        mapToArray(collection, callback) :
        mapToObject(collection, callback, keyCallback);
};

var pluck = function (arrayOfObjects, key) {
    return map(arrayOfObjects, function (val) {
        return val[key];
    });
};

var filter = function (collection, callback) {
    var filtered;

    if(isArray(collection)) {
        filtered = [];
        foreach(collection, function (val, key, coll) {
            if(callback(val, key, coll)) {
                filtered.push(val);
            }
        });
    }
    else {
        filtered = {};
        foreach(collection, function (val, key, coll) {
            if(callback(val, key, coll)) {
                filtered[key] = val;
            }
        });
    }

    return filtered;
};

var call = function (collection, functionName, args) {
    return map(collection, function (object, name) {
        return object[functionName].apply(object, args || []);
    });
};

//execute callback immediately and at most one time on the minimumInterval,
//ignore block attempts
var throttle = function (minimumInterval, callback) {
    var timeout = null;
    return function () {
        var that = this, args = arguments;
        if(timeout === null) {
            timeout = setTimeout(function () {
                timeout = null;
            }, minimumInterval);
            callback.apply(that, args);
        }
    };
};


var mixinPubSub = function (object) {
    object = object || {};
    var topics = {};

    object.publish = function (topic, data) {
        foreach(topics[topic], function (callback) {
            callback(data);
        });
    };

    object.subscribe = function (topic, callback) {
        topics[topic] = topics[topic] || [];
        topics[topic].push(callback);
    };

    object.unsubscribe = function (callback) {
        foreach(topics, function (subscribers) {
            var index = indexOf(subscribers, callback);
            if(index !== -1) {
                subscribers.splice(index, 1);
            }
        });
    };

    return object;
};

$.fn.repeaterVal = function () {
    var parse = function (raw) {
        var parsed = [];

        foreach(raw, function (val, key) {
            var parsedKey = [];
            if(key !== "undefined") {
                parsedKey.push(key.match(/^[^\[]*/)[0]);
                parsedKey = parsedKey.concat(map(
                    key.match(/\[[^\]]*\]/g),
                    function (bracketed) {
                        return bracketed.replace(/[\[\]]/g, '');
                    }
                ));

                parsed.push({
                    val: val,
                    key: parsedKey
                });
            }
        });

        return parsed;
    };

    var build = function (parsed) {
        if(
            parsed.length === 1 &&
            (parsed[0].key.length === 0 || parsed[0].key.length === 1 && !parsed[0].key[0])
        ) {
            return parsed[0].val;
        }

        foreach(parsed, function (p) {
            p.head = p.key.shift();
        });

        var grouped = (function () {
            var grouped = {};

            foreach(parsed, function (p) {
                if(!grouped[p.head]) {
                    grouped[p.head] = [];
                }
                grouped[p.head].push(p);
            });

            return grouped;
        }());

        var built;

        if(/^[0-9]+$/.test(parsed[0].head)) {
            built = [];
            foreach(grouped, function (group) {
                built.push(build(group));
            });
        }
        else {
            built = {};
            foreach(grouped, function (group, key) {
                built[key] = build(group);
            });
        }

        return built;
    };

    return build(parse($(this).inputVal()));
};

$.fn.repeater = function (fig) {
    fig = fig || {};

    var setList;

    $(this).each(function () {

        var $self = $(this);

        var show = fig.show || function () {
            $(this).show();
        };

        var hide = fig.hide || function (removeElement) {
            removeElement();
        };

        var $list = $self.find('[data-repeater-list]').first();

        var $filterNested = function ($items, repeaters) {
            return $items.filter(function () {
                return repeaters ?
                    $(this).closest(
                        pluck(repeaters, 'selector').join(',')
                    ).length === 0 : true;
            });
        };

        var $items = function () {
            return $filterNested($list.find('[data-repeater-item]'), fig.repeaters);
        };

        var $itemTemplate = $list.find('[data-repeater-item]')
                                 .first().clone().hide();

        var $firstDeleteButton = $filterNested(
            $filterNested($(this).find('[data-repeater-item]'), fig.repeaters)
            .first().find('[data-repeater-delete]'),
            fig.repeaters
        );

        if(fig.isFirstItemUndeletable && $firstDeleteButton) {
            $firstDeleteButton.remove();
        }

        var getGroupName = function () {
            var groupName = $list.data('repeater-list');
            return fig.$parent ?
                fig.$parent.data('item-name') + '[' + groupName + ']' :
                groupName;
        };

        var initNested = function ($listItems) {
            if(fig.repeaters) {
                $listItems.each(function () {
                    var $item = $(this);
                    foreach(fig.repeaters, function (nestedFig) {
                        $item.find(nestedFig.selector).repeater(extend(
                            nestedFig, { $parent: $item }
                        ));
                    });
                });
            }
        };

        var $foreachRepeaterInItem = function (repeaters, $item, cb) {
            if(repeaters) {
                foreach(repeaters, function (nestedFig) {
                    cb.call($item.find(nestedFig.selector)[0], nestedFig);
                });
            }
        };

        var setIndexes = function ($items, groupName, repeaters) {
            $items.each(function (index) {
                var $item = $(this);
                $item.data('item-name', groupName + '[' + index + ']');
                $filterNested($item.find('[name]'), repeaters)
                .each(function () {
                    var $input = $(this);
                    // match non empty brackets (ex: "[foo]")
                    var matches = $input.attr('name').match(/\[[^\]]+\]/g);

                    var name = matches ?
                        // strip "[" and "]" characters
                        last(matches).replace(/\[|\]/g, '') :
                        $input.attr('name');


                    var newName = groupName + '[' + index + '][' + name + ']' +
                        ($input.is(':checkbox') || $input.attr('multiple') ? '[]' : '');

                    $input.attr('name', newName);

                    $foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
                        var $repeater = $(this);
                        setIndexes(
                            $filterNested($repeater.find('[data-repeater-item]'), nestedFig.repeaters || []),
                            groupName + '[' + index + ']' +
                                        '[' + $repeater.find('[data-repeater-list]').first().data('repeater-list') + ']',
                            nestedFig.repeaters
                        );
                    });
                });
            });

            $list.find('input[name][checked]')
                .removeAttr('checked')
                .prop('checked', true);
        };

        setIndexes($items(), getGroupName(), fig.repeaters);
        initNested($items());
        if(fig.initEmpty) {
            $items().remove();
        }

        if(fig.ready) {
            fig.ready(function () {
                setIndexes($items(), getGroupName(), fig.repeaters);
            });
        }

        var appendItem = (function () {
            var setItemsValues = function ($item, data, repeaters) {
                if(data || fig.defaultValues) {
                    var inputNames = {};
                    $filterNested($item.find('[name]'), repeaters).each(function () {
                        var key = $(this).attr('name').match(/\[([^\]]*)(\]|\]\[\])$/)[1];
                        inputNames[key] = $(this).attr('name');
                    });

                    $item.inputVal(map(
                        filter(data || fig.defaultValues, function (val, name) {
                            return inputNames[name];
                        }),
                        identity,
                        function (name) {
                            return inputNames[name];
                        }
                    ));
                }


                $foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
                    var $repeater = $(this);
                    $filterNested(
                        $repeater.find('[data-repeater-item]'),
                        nestedFig.repeaters
                    )
                    .each(function () {
                        var fieldName = $repeater.find('[data-repeater-list]').data('repeater-list');
                        if(data && data[fieldName]) {
                            var $template = $(this).clone();
                            $repeater.find('[data-repeater-item]').remove();
                            foreach(data[fieldName], function (data) {
                                var $item = $template.clone();
                                setItemsValues(
                                    $item,
                                    data,
                                    nestedFig.repeaters || []
                                );
                                $repeater.find('[data-repeater-list]').append($item);
                            });
                        }
                        else {
                            setItemsValues(
                                $(this),
                                nestedFig.defaultValues,
                                nestedFig.repeaters || []
                            );
                        }
                    });
                });

            };

            return function ($item, data) {
                $list.append($item);
                setIndexes($items(), getGroupName(), fig.repeaters);
                $item.find('[name]').each(function () {
                    $(this).inputClear();
                });
                setItemsValues($item, data || fig.defaultValues, fig.repeaters);
            };
        }());

        var addItem = function (data) {
            var $item = $itemTemplate.clone();
            appendItem($item, data);
            if(fig.repeaters) {
                initNested($item);
            }
            show.call($item.get(0));
        };

        setList = function (rows) {
            $items().remove();
            foreach(rows, addItem);
        };

        $filterNested($self.find('[data-repeater-create]'), fig.repeaters).click(function () {
            addItem();
        });

        $list.on('click', '[data-repeater-delete]', function () {
            var self = $(this).closest('[data-repeater-item]').get(0);
            hide.call(self, function () {
                $(self).remove();
                setIndexes($items(), getGroupName(), fig.repeaters);
            });
        });
    });

    this.setList = setList;

    return this;
};

}(jQuery));