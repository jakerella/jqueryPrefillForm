jqueryPrefillForm
=================

This is a jQuery plugin which simply pre-fills form inputs based on JSON data passed in; that said, it is smart enough to find the correct form to autofill for you and it knows how to fill all different kinds of inputs.


Basic Usage
-----------

Include the plugin, and then either in a document ready block (below) or simply at the bottom of your page, include code like the following:

```js
$("#someForm").prefillForm({
  data: {
    name: 'foo',
    birthday: '1/18/2013',
    gender: 'm',
    contact_prefs: ['email', 'sms'],
    referral_source: 'stackoverflow',
    bio: "I am the very model of a modern major general,&lt;br /$gt;I've information vegetable, animal, and mineral."
  }
});
```

Note that this method will only fill the form indicated by the selection criteria, and it will always use the values you see above (not the ones submitted in the form).

A more "real" example would be to use a server language like PHP to get the submitted values and fill the form:
```js
$("#someForm").prefillForm({
  data: eval(&lt;?= json_encode($_REQUEST) ?&gt;)
});
```

Of course, if you wanted to abstract use of the plugin to some kind of startup script, you could do this:
```js
$(document.ready(function() {
  // handles POST or GET on any form on the page that matches an action with the current location
  var p = new $.Prefiller({
    data: eval(&lt;?= json_encode($_REQUEST) ?&gt;),
    method: "&lt;?= $_SERVER['REQUEST_METHOD'] ?&gt;"
  });
  p.doFill();
});
```

And if you had some data retrieved from an Active Record class like `User`, you could pre-fill an edit form like this:
```js
$("#userEditForm").prefillForm({
  data: eval(&lt;?= $myUserObject->toJSON() ?&gt;),
  dateFormat: 'Y-m-d',
  dateClasses: ['birthday'],
  ignoreNames: ['newStatus'] // maybe this should always be blank...
});
```


Features
--------

* __Auto-form finding:__ You can abstract the use of this plugin to a central controller and simply pass in the data necessary to fill the form. The plugin will try to find the correct form to prefill for you, so you don't need to burden your page with extra code.
* __Fill any input type:__ The plugin will correctly fill all standard form fields in the correct manner. This includes detecting if the field is a radio button, checkbox, selct box, etc and correctly check, select, or fill with the appropriate value. (Works with hidden inputs as well.)
* __Simple date formatting:__ If you add a class to your input (default is 'date' or 'datepicker'), then the plugin will format the value you provide. (Useful if you get back MySQL timestamps, but you need a pretty date displayed.)
* __Ignore fields by name, id, or type:__ Just add the name, id, or type (or tagname) to the appropriate array in the options and you can ignore any field you need to. (For example, inputs with a type of "password" are ignored by default.)

Options
-------

* _form_: The form to prefill. Note that using this option will override a jQuery selected `&lt;form&gt;` node if called in a chain: `$("form").prefillForm(...)` _(default: `null`)_
* _action_: If provided, only forms with an exact matching action will be selected _(default: `null`)_
* _data_: The request data to prefill with (should probably either be POST or GET data as a hash, see examples for more info) _(default: `{}`)_
* _findForm_: If no form is provided directly, should the plugin find a matching form on the page? _(default: `true`)_
* _matchMethod_: Should the form finder match the method as well as action? _(default: `true`)_
* _method_: The form method to check for (only used when the _matchMethod_ option set to `true`) _(default: `"get"`)_
* _matchEmptyAction_: Should the form finder match empty form `action` attributes? _(default: `true`)_
* _ignoreNames_: A list of field names to ignore when prefilling; case insensitive _(default: `["MAX_FILE_SIZE"]`)_
* _ignoreIds_: A list of field id's to ignore when prefilling _(default: `[]`)_
* _ignoreTypes_: A list of field `type` attributess (for `&lt;input&gt;`) or tag names (`&lt;textareagt;`, etc) to ignore (NOTE: always make these are lower case! The matching input type or tag name will be converted to lower case.) _(default: `['button', 'submit', 'reset', 'password']`)_
* _convertBrToNewLine_: For texarea's, should `&lt;br /&gt;` tags be converted to new line characters for display in the textarea? _(default: `true`)_
* _dateClasses_: A list of classes to check for in order to do date formatting (make this null (or empty) to disable date formatting). _(default: `['date', 'datepicker']`)_
* _dateFormatter_: The format function being used. If you provide your own function it must take the `Date` object as the first argument and the string format as the second. _(default: `$.Prefiller.formatDate`)_
* _dateParser_: The parsing function used to create `Date` objects from data. You can provide your own date parsing function, but it must take a string date value as it's sole argument. _(default: `function(v) { return (new Date(v)); }` )_
* _dateFormat_: The format to be used for display, passed into the _dateFormatter_ option as the second argument. For the interal `dateFormatter` function this string uses [PHP `date()`](http://php.net/manual/en/function.date.php) characters (but only some, see __Date formatters__ below) _(default: `"m/d/Y"`)_
* _location_: Should only be used for testing, must include valid `pathname` and `host` entries. _(default: window.location)_

The following date format characters are used in the date formatter, this is a subset of the [PHP `date()`](http://php.net/manual/en/function.date.php) characters, and no character escaping is allowed:
* 'Y': four digit year
* 'm': two digit month
* 'n': one or two digit month
* 'j': two digit day
* 'd': one or two digit day
* 'H': two digit hours on 24-hour clock
* 'G': one or two digit hours on 24-hour clock
* 'h': two digit hours on 12-hour clock
* 'g': one or two digit hours on 12-hour clock
* 'i': two digit minutes
* 's': two digit seconds
* 'a': meridiem ("am"/"pm")

