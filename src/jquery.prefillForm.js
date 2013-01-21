/* Copyright (c) 2013 Jordan Kasper
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * Copyright notice and license must remain intact for legal use
 *
 * Requires: jQuery 1.7+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Fore more usage documentation and examples, visit:
 *   https://github.com/jakerella/jqueryPrefillForm
 * 
 */

;(function($) {

  // PRIVATE VARS & METHODS
  var ns = 'prefillForm';
  function getCleanVal(v) {
    // can't include brackets or double quotes for some jQuery selectors
    return v.replace(/[\[\]\"]/g, '');
  }


  /**
   * This method will add a prefiller to the selected <form> and do the prefill with
   * data provided in the options.
   * 
   *  Typical usage:
   *   $('#myForm').prefillForm({
   *     data: eval(<?= json_encode($_POST) ?>)
   *   });
   * 
   * Optionally, if a prefiller is already on this node you can call the method again with:
   *  - the name of an option to retrieve that option's value (i.e. var df = $('#myForm').prefillForm('dateFormat'); )
   *  - the name of an option and a value to set that option's value (i.e. $('#myForm').prefillForm('dateFormat', 'Y-m-d'); )
   *  - "fillform" to fill (or refill) the form from the data (i.e. $('#myForm').prefillForm('fillform'); )
   * 
   * @param  {object|string} o If an OBJECT, creates a new prefiller on this <form> and uses the object as options (see method description for other uses)
   * @param  {object} d The value of the option being set; only used when the first argument is a STRING
   * @return {jQuery} The jQuery object for chain calling (NOTE: If an option was requested (not set) then this method returns that option value)
   */
  $.fn.prefillForm = function(o, d) {
    var n = $(this);

    if (n.hasClass(ns+'-prefiller') && n.data('prefiller') && o) {
      var p = n.data('prefiller');
      
      if (o === 'fillform') {
        return p.doFill(p.data);

      } else {
        if (d && p[o]) {
          p[o] = d;
        } else {
          return p[o];
        }
      }

    } else {
      o = $.extend({}, $.Prefiller.defaults, ((o)?o:{}));
      
      if (!o.form && n.is('form')) {
        o = $.extend(((o)?o:{}), {form: n});
        var p = new $.Prefiller(o);

        p.doFill(p.data);
      }
    }

    return n;
  };

  
  // CONSTRUCTOR
  $.Prefiller = function(o) {
    var t = this;
    $.extend(t, ((o)?o:{}));

    if (!t.form && !!t.findForm) {
      t.form = t.doFindForm();
      if (t.form.length) { t.form.trigger(ns+'.formFound', [t]) };
    }
    t.form = $(t.form); // ensure we have a jQuery object

    // tweak date classes array for internal use
    if (t.dateClasses && $.isArray(t.dateClasses) && t.dateClasses.length) {
      t.dateClassString = '.'+t.dateClasses.join(', .');
    } else {
      t.dateClassString = null;
    }

    if (t.form.length && t.form.is('form')) {
      t.form
        .addClass(ns+'-prefiller')
        .data('prefiller', t);
    }
    t.form.trigger(ns+'.created', [t])
  };


  // STATIC METHODS & PROPERTIES
  /**
   * Formats a given date object using the format provided
   * @param  {Date} d    The Date object to format
   * @param  {String} f  A string representation of the format (see $.Prefiller.formatters for options)
   * @see $.Prefiller.formatters
   * @return {String}    The String representation of the date
   */
  $.Prefiller.formatDate = function(d, f) {
    if (!d || !(d instanceof Date)) { return d; }
    
    var v = '';
    f = (''+f).split('');
    var fm = $.Prefiller.formatters;
    var c;
    for (var ch in f) {
      if ($.isFunction(fm[f[ch]])) {
        c = ''+fm[f[ch]](d);
      } else if (fm[f[ch]]) {
        c = ''+d[fm[f[ch]]].call(d);
      }
      v += (c && c.length)?c:f[ch];
      c = null;
    }

    return v;
  };
  // Static date format options based on PHP date() formatters
  $.Prefiller.formatters = {
    'Y': 'getFullYear', // four digit year
    'm': function(d) { var m = d.getMonth()+1; return ((m<10)?('0'+m):m); }, // two digit month
    'n': function(d) { return d.getMonth()+1; }, // one or two digit month
    'j': function(d) { var dt = d.getDate(); return ((dt<10)?('0'+dt):dt); }, // two digit day
    'd': 'getDate', // one or two digit day
    'H': function(d) { var h = d.getHours(); return ((h<10)?('0'+h):h); }, // two digit hours on 24-hour clock
    'G': 'getHours', // one or two digit hours on 24-hour clock
    'h': function(d) { var h = d.getHours(); h = ((h>12)?(h-12):h); return ((h<10)?('0'+h):h); }, // two digit hours on 12-hour clock
    'g': function(d) { var h = d.getHours(); return ((h>12)?(h-12):h); }, // one or two digit hours on 12-hour clock
    'i': function(d) { var m = d.getMinutes(); return ((m<10)?('0'+m):m); }, // two digit minutes
    's': function(d) { var s = d.getSeconds(); return ((s<10)?('0'+s):s); }, // two digit seconds
    'a': function(d) { var h = d.getHours(); return ((h<12)?'am':'pm'); } // meridiem ("am"/"pm")
  };


  // PUBLIC PROPERTIES (Default options)
  // Assign default options to the class prototype
  $.extend($.Prefiller.prototype, {
    form: null, // the form to prefill
    action: null, // only match forms with this action
    data: {}, // the request data (either POST or GET)
    findForm: true, // if no form is provided, should the plugin find matching forms on the page?
    matchMethod: true, // should the form finder match method? (only used when finding matching forms on the page)
    method: 'get', // the form method to check for (only used when finding matching forms on the page)
    matchEmptyAction: true, // should the form finder match empty form action attributes? (only used when finding matching forms on the page)
    ignoreNames: ['MAX_FILE_SIZE'], // field names to ignore when prefilling - case insensitive
    ignoreIds: [], // field IDs to ignore when prefilling
    ignoreTypes: ['button', 'submit', 'reset', 'password'], // field types (for <input>) or tags (<textarea>, etc) to ignore (NOTE: always make these lower case! (the input type or tag will be converted to lower case))
    convertBrToNewLine: true, // for texarea's only, should <br /> tags be converted to new line characters for display in the textarea?
    dateClasses: ['date', 'datepicker'], // format date values for inputs with these classes (make this null (or empty) to disable date formatting)
    dateFormatter: $.Prefiller.formatDate, // you can provide your own function here, but it must take the date object as the first arg and the string format as the second
    dateParser: function(v) { return (new Date(v)); }, // you can provide your own date parsing function, but it must take a string date value as an argument
    dateFormat: 'm/d/Y', // passed into the 'dateFormatter' option as second argument; for interal dateFormatter this uses PHP date() characters (but only some, see $.Prefiller.formatters)
    location: window.location // Should only be used for testing, must include valid "pathname" and "host" entries
  });
  

  // PUBLIC METHODS
  $.extend($.Prefiller.prototype, {
    
    doFindForm: function() {
      var t = this;
      
      var s = '';
      var f = p = null;
      var m = (t.matchMethod && t.method)?'[method="'+t.method+'"]':'';

      if (t.action) {
        s += 'form[action="'+getCleanVal(t.action)+'"]'+m;

      } else {
        var a = t.location.pathname.match(/(.+?)\/?([^\/]+\.[^.]+)?$/);
        if (a && a[0].length === 1) { a = null; } // don't match lonely "/"
        if (a) {
          p = ((a[1] && a[1].length > 1)?a[1]:null);
          f = (a[2] && !(/^(index|default)\./.test(a[2])))?a[2]:null; // ignore index or default files
        }

        if (p) {
          s += 'form[action*="'+getCleanVal(p)+((f)?('/'+getCleanVal(f)):'')+'"]'+m;
          
        } else {
          s += 'form[action*="'+t.location.host+'"]'+m+', form[action="/"]'+m+', form[action^="/index."]'+m+', form[action^="/default."]'+m;
        }

        if (f) {
          s += ', form[action^="'+getCleanVal(f)+'"]'+m;
        }
      }

      // Check for forms with no action (which submit to the current page, thus matching)
      if (t.matchEmptyAction) { s += ', form[action=""]'+m; }

      var forms = null;
      $(s).each(function() {
        if (t.action) {
          forms = $(this).add(forms);

        } else {
          // if we had to find the form(s) without a specific action, 
          // we may need to double check the "action" for an ending query string or "index" file
          var a = $(this).attr('action');
          if (a && a.length) {
            if (f) {
              // specific filename
              var rep = (p)?"("+p+"/|^)":'';
              if ((new RegExp(rep+f.replace('.', '\\.')+"(\\?.*)?$")).test(a)) {
                forms = $(this).add(forms);
              }

            } else if (p) {
              if ((new RegExp(p+"(/|/(index|default)\\.[a-zA-Z0-9]{1,5})?(\\?.*)?$")).test(a)) {
                forms = $(this).add(forms);
              }

            } else {
              if ((new RegExp("^(https?://"+t.location.host+"/?|/)((index|default)\\.[a-zA-Z0-9]{1,5})?(\\?.*)?$")).test(a)) {
                forms = $(this).add(forms);
              }
            }
          } else {
            // blank action, let it in
            forms = $(this).add(forms);
          }
        }
        
      });
      return (forms)?forms:$(null);
    },

    doFill: function(d) {
      var t = this;
      d = (d)?d:((t.data)?t.data:{});

      if (!t.form || !t.form.length || !t.form.is('form')) { return []; } // no form to fill!

      var fields = [];
      // loop through submitted data
      for (n in d) {
        
        // Either gets the input or ignores it per options
        var i = t.getOrIgnore(n);
        if (!i) { continue; }

        // go through various input types/tags and add values
        
        if (i.is(':checkbox')) {
          t.fillCheckbox(i, d[n]);

        } else if (i.is(':radio')) {
          t.fillRadio(i, d[n]);

        } else if (i.is('select')) {
          t.fillSelect(i, d[n]);

        } else {
          t.fillText(i, d[n]);
        }

        fields.push([i, d[n]]);
        i.trigger(ns+'.fieldFilled', [t, d[n]]);
      }

      this.form
        .addClass(ns+'-prefilled')
        .trigger(ns+'.formFilled', [t, fields]);
      return fields;
    },

    getOrIgnore: function(n) {
      // ignore by name (no need to find the field)
      if ($.inArray(n, this.ignoreNames) > -1) { return null; }
      
      // find the field
      var i = this.form.find('[name="'+n+'"], [name="'+n+'[]"]');
      if (!i.length) { return null; }

      // ignore some field IDs
      var id = i.attr('id');
      if (id && $.inArray(id, this.ignoreIds) > -1) { return null; }
      
      // ignore some field types (or tags)
      var tp = (i.attr('type'))?i.attr('type'):i[0].tagName;
      if ($.inArray(tp.toLowerCase(), this.ignoreTypes) > -1) { return null; }

      return i;
    },

    fillCheckbox: function(i, v) {
      if (v == null || ($.isArray(v) && !v.length)) {
        i.removeAttr('checked');
      } else {
        v = ($.isArray(v))?v:[v];
        for (var k in v) {
          i.filter('[value="'+getCleanVal(v[k])+'"]').attr('checked', 'checked');
        }
      }
      return [i, v];
    },

    fillRadio: function(i, v) {
      if (v == null) {
        i.removeAttr('checked');
      } else {
        i.filter('[value="'+getCleanVal(v)+'"]').attr('checked', 'checked');
      }
      return [i, v];
    },

    fillSelect: function(i, v) {
      i.val(v); // jQuery handles this one pretty well...
      return [i, v];
    },

    fillText: function(i, v) {
      if (v && v.length) {
        // date field handling
        if (this.dateClassString && i.is(this.dateClassString)) {
          // date input
          var d = null;
          if ($.isFunction(this.dateParser)) {
            d = this.dateParser(v);
          }
          
          if (d instanceof Date) {
            if ($.isFunction(this.dateFormatter)) {
              i.val(this.dateFormatter(d, this.dateFormat));
            }
          } else {
            i.val(v);
          }

        } else {
          // "normal" text inputs & textareas
          if (!!this.convertBrToNewLine && i.is('textarea')) { v = v.replace(/\<br\s?\/?\>/g, "\n"); }
          i.val(v);
        }
      }
      return [i, v];
    }

  });

})(jQuery);