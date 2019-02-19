(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function identity(x) {
    return x;
  }
  function isArray(value) {
    return $.isArray(value);
  }
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
  function extend() {
    var extended = {};

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    foreach(args, function (o) {
      foreach(o, function (val, key) {
        extended[key] = val;
      });
    });
    return extended;
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
  function pluck(arrayOfObjects, key) {
    return map(arrayOfObjects, function (val) {
      return val[key];
    });
  }
  function filter(collection, callback) {
    var filtered;

    if (isArray(collection)) {
      filtered = [];
      foreach(collection, function (val, key, coll) {
        if (callback(val, key, coll)) {
          filtered.push(val);
        }
      });
    } else {
      filtered = {};
      foreach(collection, function (val, key, coll) {
        if (callback(val, key, coll)) {
          filtered[key] = val;
        }
      });
    }

    return filtered;
  }

  $.fn.repeaterVal = function () {
    var parse = function parse(raw) {
      var parsed = [];
      foreach(raw, function (val, key) {
        var parsedKey = [];

        if (key !== 'undefined') {
          parsedKey.push(key.match(/^[^[]*/)[0]);
          parsedKey = parsedKey.concat(map(key.match(/\[[^\]]*\]/g), function (bracketed) {
            return bracketed.replace(/[[\]]/g, '');
          }));
          parsed.push({
            val: val,
            key: parsedKey
          });
        }
      });
      return parsed;
    };

    function build(parsed) {
      if (parsed.length === 1 && (parsed[0].key.length === 0 || parsed[0].key.length === 1) && !parsed[0].key[0]) {
        return parsed[0].val;
      }

      foreach(parsed, function (p) {
        // eslint-disable-next-line no-param-reassign
        p.head = p.key.shift();
      });

      var grouped = function () {
        var mGrouped = {};
        foreach(parsed, function (p) {
          if (!mGrouped[p.head]) {
            mGrouped[p.head] = [];
          }

          mGrouped[p.head].push(p);
        });
        return mGrouped;
      }();

      var built;

      if (/^[0-9]+$/.test(parsed[0].head)) {
        built = [];
        foreach(grouped, function (group) {
          built.push(build(group));
        });
      } else {
        built = {};
        foreach(grouped, function (group, key) {
          built[key] = build(group);
        });
      }

      return built;
    }

    return build(parse($(this).inputVal()));
  };

  $.fn.repeater = function (fig) {
    // eslint-disable-next-line no-param-reassign
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

      var $filterNested = function $filterNested($items, repeaters) {
        return $items.filter(function () {
          return repeaters ? $(this).closest(pluck(repeaters, 'selector').join(',')).length === 0 : true;
        });
      };

      var $items = function $items() {
        return $filterNested($list.find('[data-repeater-item]'), fig.repeaters);
      };

      var $itemTemplate = $list.find('[data-repeater-item]').first().clone().hide();
      var $firstDeleteButton = $filterNested($filterNested($(this).find('[data-repeater-item]'), fig.repeaters).first().find('[data-repeater-delete]'), fig.repeaters);

      if (fig.isFirstItemUndeletable && $firstDeleteButton) {
        $firstDeleteButton.remove();
      }

      var getGroupName = function getGroupName() {
        var groupName = $list.data('repeater-list');
        return fig.$parent ? "".concat(fig.$parent.data('item-name'), "[").concat(groupName, "]") : groupName;
      };

      var initNested = function initNested($listItems) {
        if (fig.repeaters) {
          $listItems.each(function () {
            var $item = $(this);
            foreach(fig.repeaters, function (nestedFig) {
              $item.find(nestedFig.selector).repeater(extend(nestedFig, {
                $parent: $item
              }));
            });
          });
        }
      };

      var $foreachRepeaterInItem = function $foreachRepeaterInItem(repeaters, $item, cb) {
        if (repeaters) {
          foreach(repeaters, function (nestedFig) {
            cb.call($item.find(nestedFig.selector)[0], nestedFig);
          });
        }
      };

      function setIndexes($its, groupName, repeaters) {
        $its.each(function (index) {
          var $item = $(this);
          $item.data('item-name', "".concat(groupName, "[").concat(index, "]"));
          $filterNested($item.find('[name]'), repeaters).each(function () {
            var $input = $(this); // match non empty brackets (ex: "[foo]")

            var matches = $input.attr('name').match(/\[[^\]]+\]/g);
            var name = matches // strip "[" and "]" characters
            ? last(matches).replace(/\[|\]/g, '') : $input.attr('name');
            var newName = "".concat(groupName, "[").concat(index, "][").concat(name, "]").concat($input.is(':checkbox') || $input.attr('multiple') ? '[]' : '');
            $input.attr('name', newName);
            $foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
              var $repeater = $(this);
              setIndexes($filterNested($repeater.find('[data-repeater-item]'), nestedFig.repeaters || []), "".concat(groupName, "[").concat(index, "]") + "[".concat($repeater.find('[data-repeater-list]').first().data('repeater-list'), "]"), nestedFig.repeaters);
            });
          });
        });
        $list.find('input[name][checked]').removeAttr('checked').prop('checked', true);
      }

      setIndexes($items(), getGroupName(), fig.repeaters);
      initNested($items());

      if (fig.initEmpty) {
        $items().remove();
      }

      if (fig.ready) {
        fig.ready(function () {
          setIndexes($items(), getGroupName(), fig.repeaters);
        });
      }

      var appendItem = function () {
        function setItemsValues($item, data, repeaters) {
          if (data || fig.defaultValues) {
            var inputNames = {};
            $filterNested($item.find('[name]'), repeaters).each(function () {
              var key = $(this).attr('name').match(/\[([^\]]*)(\]|\]\[\])$/)[1];
              inputNames[key] = $(this).attr('name');
            });
            $item.inputVal(map(filter(data || fig.defaultValues, function (val, name) {
              return inputNames[name];
            }), identity, function (name) {
              return inputNames[name];
            }));
          }

          $foreachRepeaterInItem(repeaters, $item, function (nestedFig) {
            var $repeater = $(this);
            $filterNested($repeater.find('[data-repeater-item]'), nestedFig.repeaters).each(function () {
              var fieldName = $repeater.find('[data-repeater-list]').data('repeater-list');

              if (data && data[fieldName]) {
                var $template = $(this).clone();
                $repeater.find('[data-repeater-item]').remove();
                foreach(data[fieldName], function (d) {
                  var $itm = $template.clone();
                  setItemsValues($itm, d, nestedFig.repeaters || []);
                  $repeater.find('[data-repeater-list]').append($itm);
                });
              } else {
                setItemsValues($(this), nestedFig.defaultValues, nestedFig.repeaters || []);
              }
            });
          });
        }

        return function ($item, data) {
          $list.append($item);
          setIndexes($items(), getGroupName(), fig.repeaters);
          $item.find('[name]').each(function () {
            $(this).inputClear();
          });
          setItemsValues($item, data || fig.defaultValues, fig.repeaters);
        };
      }();

      var addItem = function addItem(data) {
        var $item = $itemTemplate.clone();
        appendItem($item, data);

        if (fig.repeaters) {
          initNested($item);
        }

        show.call($item.get(0));
      };

      setList = function setList(rows) {
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

})));
//# sourceMappingURL=jquery.repeater.js.map
