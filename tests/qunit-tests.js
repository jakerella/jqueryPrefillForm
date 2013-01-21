
var getCollectionIds = function(n) {
  var ids = [];
  n.each(function() { ids.push($(this).attr('id')); });
  return ids.join(', ');
}

var loc = {
  root: {host: 'fake.com', pathname: '/'},
  rootIndex: {host: 'fake.com', pathname: '/index.html'},
  file: {host: 'fake.com', pathname: '/fake.html'},
  path: {host: 'fake.com', pathname: '/test/path/'},
  pathIndex: {host: 'fake.com', pathname: '/test/path/index.html'},
  pathFile: {host: 'fake.com', pathname: '/test/path/fake.html'},
  diffPath: {host: 'fake.com', pathname: '/bad/path/'},
  diffPathFile: {host: 'fake.com', pathname: '/bad/path/fake.html'},
  diffRootFile: {host: 'fake.com', pathname: '/bad.html'}
};


// TODO: live tests (php)


module("Date Formatter Tests");

test("Invalid date input", function(a) {
  var d = "foobar";
  var r = $.Prefiller.formatDate(d, 'm/d/Y h:i:sa');

  a.strictEqual(r, d);
});

test("Typical Date Formats - Single Digits", function(a) {
  var d = new Date("1/1/2013 8:06:04");

  a.equal($.Prefiller.formatDate(d, 'n/d/Y g:i:sa'), "1/1/2013 8:06:04am", "Single digit everything");
  a.equal($.Prefiller.formatDate(d, 'm/j/Y h:i:sa'), "01/01/2013 08:06:04am", "Two digit everything");
  a.equal($.Prefiller.formatDate(d, 'n/d/Y'), "1/1/2013", "Only Date");
  a.equal($.Prefiller.formatDate(d, 'g:i a'), "8:06 am", "Only Time");
  a.equal($.Prefiller.formatDate(d, 'Y m n d j H h G g i s a'), "2013 01 1 1 01 08 08 8 8 06 04 am", "Using all format characters");
});

test("Other Date Formats - Double Digits", function(a) {
  var d = new Date("5/23/2013 15:06:04");

  a.equal($.Prefiller.formatDate(d, 'Y-m-j h:i:s'), "2013-05-23 03:06:04", "MySQL datetime format");
  a.equal($.Prefiller.formatDate(d, 'd.n.Y'), "23.5.2013", "European format");
  a.equal($.Prefiller.formatDate(d, 'Y m n d j H h G g i s a'), "2013 05 5 23 23 15 03 15 3 06 04 pm", "Using all format characters");
});


module("Form Selection");

test("Valid Form Selection", function(a) {
  a.ok($('#allFieldsNoActionGet').prefillForm().hasClass('prefillForm-prefiller'), "Using jQuery selection hook");
  a.equal((new $.Prefiller({form: '#allFieldsNoActionGet'})).form.length, 1, "Using 'new' with selector");
  a.equal((new $.Prefiller({form: $('#allFieldsNoActionGet').get(0)})).form.length, 1, "Using 'new' with html node");
  a.equal((new $.Prefiller({form: $('#allFieldsNoActionGet')})).form.length, 1, "Using 'new' with jQuery node");
});

test("Invalid Form Selection", function(a) {
  a.equal($('#nonExistentId').prefillForm().length, 0, "Using jQuery selection hook with bad ID");
  a.equal((new $.Prefiller({form: '#nonExistentId'})).form.length, 0, "Using 'new' with bad selector");
  a.equal((new $.Prefiller({form: $('#nonExistentId')})).form.length, 0, "Using 'new' with jQuery node");
});

test("Find Form By Location - GET", function(a) {
  a.equal(getCollectionIds((new $.Prefiller({location: loc.root})).form), 'allFieldsNoActionGet, hostActionNoFields, rootActionNoFields, rootIndexActionNoFields, rootIndexQueryActionNoFields, hostQueryActionNoFields', "Root path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.rootIndex})).form), 'allFieldsNoActionGet, hostActionNoFields, rootActionNoFields, rootIndexActionNoFields, rootIndexQueryActionNoFields, hostQueryActionNoFields', "Root path with index file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.file})).form), 'allFieldsNoActionGet, onlyFileActionNoFields, hostPathFileActionNoFields', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.path})).form), 'allFieldsNoActionGet, pathActionNoFields, pathIndexFileActionNoFields, hostPathActionNoFields, hostPathIndexActionNoFields, hostPathQueryActionNoFields', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.pathIndex})).form), 'allFieldsNoActionGet, pathActionNoFields, pathIndexFileActionNoFields, hostPathActionNoFields, hostPathIndexActionNoFields, hostPathQueryActionNoFields', "Directory path with index location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.pathFile})).form), 'allFieldsNoActionGet, fileActionNoFields, onlyFileActionNoFields, fileQueryActionNoFields, hostPathFileActionNoFields', "Path and file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffPath})).form), 'allFieldsNoActionGet', "Diff path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffPathFile})).form), 'allFieldsNoActionGet, onlyFileActionNoFields', "Diff path with file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffRootFile})).form), 'allFieldsNoActionGet', "Diff root file location");
});

test("Find Form By Location - POST", function(a) {
  a.equal(getCollectionIds((new $.Prefiller({location: loc.root, method: 'post'})).form), 'allFieldsNoActionPost, rootIndexActionNoFieldsPost', "Root path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.rootIndex, method: 'post'})).form), 'allFieldsNoActionPost, rootIndexActionNoFieldsPost', "Root path with index file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.file, method: 'post'})).form), 'allFieldsNoActionPost, onlyFileActionNoFieldsPost', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.path, method: 'post'})).form), 'allFieldsNoActionPost, pathActionNoFieldsPost', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.pathIndex, method: 'post'})).form), 'allFieldsNoActionPost, pathActionNoFieldsPost', "Directory path with index location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.pathFile, method: 'post'})).form), 'allFieldsNoActionPost, onlyFileActionNoFieldsPost', "Path and file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffPath, method: 'post'})).form), 'allFieldsNoActionPost', "Diff path location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffPathFile, method: 'post'})).form), 'allFieldsNoActionPost, onlyFileActionNoFieldsPost', "Diff path with file location");
  a.equal(getCollectionIds((new $.Prefiller({location: loc.diffRootFile, method: 'post'})).form), 'allFieldsNoActionPost', "Diff root file location");
});


module("Test Options");
// NOTE: does not test "ignore...", "dateClasses", or "convertBrToNewLine" options as those are tested during form filling
// NOTE: does not test date formats as those are tested above ("Date Formatter Tests")

test("Default Options Set", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.form, $('#allFieldsNoActionGet'), "Prefiller form option set as selected");
  a.equal($('#allFieldsNoActionGet').data('prefiller'), p, "Prefiller object in node data");
  a.equal(p.action, null, "action option set correctly");
  a.deepEqual(p.data, {}, "data option set correctly");
  a.equal(p.findForm, true, "findForm option set correctly");
  a.equal(p.matchMethod, true, "matchMethod option set correctly");
  a.equal(p.method, 'get', "method option set correctly");
  a.equal(p.matchEmptyAction, true, "matchEmptyAction option set correctly");
  a.deepEqual(p.ignoreNames, ['MAX_FILE_SIZE'], "ignoreNames option set correctly");
  a.deepEqual(p.ignoreIds, [], "ignoreIds option set correctly");
  a.deepEqual(p.ignoreTypes, ['button', 'submit', 'reset', 'password'], "ignoreTypes option set correctly");
  a.equal(p.convertBrToNewLine, true, "convertBrToNewLine option set correctly");
  a.deepEqual(p.dateClasses, ['date', 'datepicker'], "dateClasses option set correctly");
  a.equal(p.dateClassString, '.date, .datepicker', "dateClassString contrived option set correctly");
  a.ok($.isFunction(p.dateFormatter), "dateFormatter option is function");
  a.equal(($.isFunction(p.dateFormatter))?p.dateFormatter((new Date("1/1/2013")), 'm/j/Y'):null, '01/01/2013', "dateFormatter option returns correct data");
  a.ok($.isFunction(p.dateParser) && (p.dateParser("1/1/2013") instanceof Date), "dateParser option set correctly");
  a.equal(p.dateFormat, 'm/d/Y', "dateFormat option set correctly");
  a.equal(p.location, window.location, "location option set correctly");
});

test("Specific action option", function(a) {
  var p = new $.Prefiller({ action: '/test/path/fake.html' });
  a.deepEqual(getCollectionIds(p.form), 'allFieldsNoActionGet, fileActionNoFields', "Form for specific action option");
});

test("Dynamic form finding off", function(a) {
  var p = new $.Prefiller({ findForm: false, location: loc.path });
  a.deepEqual(p.form, $(null), "findForm option off");
});

test("Match method off (still matches action)", function(a) {
  var p1 = new $.Prefiller({ matchMethod: false, location: loc.file });
  a.deepEqual(getCollectionIds(p1.form), 'allFieldsNoActionGet, allFieldsNoActionPost, onlyFileActionNoFields, onlyFileActionNoFieldsPost, hostPathFileActionNoFields', "matchMethod option off - file path");
  var p2 = new $.Prefiller({ matchMethod: false, location: loc.path });
  a.deepEqual(getCollectionIds(p2.form), 'allFieldsNoActionGet, allFieldsNoActionPost, pathActionNoFields, pathActionNoFieldsPost, pathIndexFileActionNoFields, hostPathActionNoFields, hostPathIndexActionNoFields, hostPathQueryActionNoFields', "matchMethod option off - path");
});

test("Match empty action off", function(a) {
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.root})).form), 'hostActionNoFields, rootActionNoFields, rootIndexActionNoFields, rootIndexQueryActionNoFields, hostQueryActionNoFields', "Root path location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.rootIndex})).form), 'hostActionNoFields, rootActionNoFields, rootIndexActionNoFields, rootIndexQueryActionNoFields, hostQueryActionNoFields', "Root path with index file location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.file})).form), 'onlyFileActionNoFields, hostPathFileActionNoFields', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.path})).form), 'pathActionNoFields, pathIndexFileActionNoFields, hostPathActionNoFields, hostPathIndexActionNoFields, hostPathQueryActionNoFields', "Directory path location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.pathIndex})).form), 'pathActionNoFields, pathIndexFileActionNoFields, hostPathActionNoFields, hostPathIndexActionNoFields, hostPathQueryActionNoFields', "Directory path with index location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.pathFile})).form), 'fileActionNoFields, onlyFileActionNoFields, fileQueryActionNoFields, hostPathFileActionNoFields', "Path and file location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.diffPath})).form), '', "Diff path location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.diffPathFile})).form), 'onlyFileActionNoFields', "Diff path with file location");
  a.equal(getCollectionIds((new $.Prefiller({matchEmptyAction: false, location: loc.diffRootFile})).form), '', "Diff root file location");
});

test("Change date formatter option", function(a) {
  var p = new $.Prefiller({
    dateFormatter: function() { return "mon/day/year"; },
    form: '#allFieldsNoActionGet'
  });

  a.equal(p.dateFormatter((new Date("1/1/2013")), 'm/j/Y'), 'mon/day/year', "dateFormatter option returns correct data");
});

test("Change date parser option", function(a) {
  var p = new $.Prefiller({
    dateParser: function() { return (new Date('8/1/1980')); },
    form: '#allFieldsNoActionGet'
  });

  a.ok(/^Fri Aug 01 1980/.test(p.dateParser('2/14/2013').toString()), "dateParser option returns correct data");
});

test("Get option from node", function(a) {
  var n = $('form:first').prefillForm();

  a.deepEqual(getCollectionIds(n), 'allFieldsNoActionGet', "Prefill jQuery hook returns jQuery node");
  a.equal(n.prefillForm('dateFormat'), 'm/d/Y', "Option getter works");
});

test("Set option on node", function(a) {
  var n = $('form:first').prefillForm();

  a.deepEqual(getCollectionIds(n), 'allFieldsNoActionGet', "Prefill jQuery hook returns jQuery node");
  n.prefillForm('dateFormat', 'Y-m-d');
  a.equal(n.data('prefiller').dateFormat, 'Y-m-d', "Option setter works");
});


module("Test Form Filling");

test("Get or ignore field", function(a) {
  var p = new $.Prefiller({ignoreIds: ['f2_textarea'], form: '#allFieldsNoActionPost'});

  a.deepEqual(p.getOrIgnore('text').get[0], $('#f2_text').get[0], "Selected valid input");
  a.ok(!p.getOrIgnore('MAX_FILE_SIZE'), "Ignoring input by name");
  a.ok(!p.getOrIgnore('textarea'), "Ignoring input by ID");
  a.ok(!p.getOrIgnore('button'), "Ignoring input by tag");
  a.ok(!p.getOrIgnore('pass'), "Ignoring input by type");
});

test("Fill checkbox - one value", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillCheckbox(p.form.find('[name=checkbox]'), 'a'), [p.form.find('[name=checkbox]'), ['a']], "Return value from fill checkbox correct");
  a.ok($('#f1_checkbox_a').is(':checked'), "Checkbox filled correctly");
  a.ok(!$('#f1_checkbox_c').is(':checked'), "Checkbox not filled when no data value present");
});

test("Fill checkbox - multiple values", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillCheckbox(p.form.find('[name=checkbox]'), ['a', 'c']), [p.form.find('[name=checkbox]'), ['a', 'c']], "Return value from fill checkbox correct");
  a.ok($('#f1_checkbox_a').is(':checked'), "Checkbox filled correctly (1 of 2)");
  a.ok($('#f1_checkbox_c').is(':checked'), "Checkbox filled correctly (2 of 2)");
  a.ok(!$('#f1_checkbox_b').is(':checked'), "Checkbox not filled when no data value present");
});

test("Fill radio", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillRadio($('input[name=radio]'), 'a'), [$('input[name=radio]'), 'a'], "Return value from fill radio correct");
  a.ok($('#f1_radio_a').is(':checked'), "Radio filled correctly");
  a.ok(!$('#f1_radio_b').is(':checked'), "Non-checked radio option not filled (correct)");
});

test("Fill single select", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillSelect($('#f1_select_single'), 'c'), [$('#f1_select_single'), 'c'], "Return value from fill select correct");
  a.equal($('#f1_select_single').val(), 'c', "Select filled correctly");
  a.ok($('#f1_select_single option[value=c]').is(':selected'), "Correct option selected");
  a.ok(!$('#f1_select_single option[value=a]').is(':selected'), "Incorrect option not selected (correct)");
});

test("Fill multiple select - one value", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillSelect($('#f1_select_multiple'), 'c'), [$('#f1_select_multiple'), 'c'], "Return value from fill select (multiple)");
  a.deepEqual($('#f1_select_multiple').val(), ['c'], "Multiple select filled correctly");
  a.ok($('#f1_select_multiple option[value=c]').is(':selected'), "Correct option selected");
  a.ok(!$('#f1_select_multiple option[value=a]').is(':selected'), "Incorrect option not selected (correct)");
});

test("Fill multiple select - multiple values", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillSelect($('#f1_select_multiple'), ['b', 'd']), [$('#f1_select_multiple'), ['b', 'd']], "Return value from fill select (multiple)");
  a.deepEqual($('#f1_select_multiple').val(), ['b', 'd'], "Multiple select filled correctly");
  a.ok($('#f1_select_multiple option[value=b]').is(':selected'), "Correct option selected (1 of 2)");
  a.ok($('#f1_select_multiple option[value=d]').is(':selected'), "Correct option selected (2 of 2)");
  a.ok(!$('#f1_select_multiple option[value=a]').is(':selected'), "Incorrect option not selected (correct)");
});

test("Fill text input", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillText($('#f1_text'), 'foobar'), [$('#f1_text'), 'foobar'], "Return value from fill text correct");
  a.equal($('#f1_text').val(), 'foobar', "Text input filled correctly");
});

test("Fill textarea", function(a) {
  var p = new $.Prefiller({form: '#allFieldsNoActionGet'});
  var data = "This is some long input for the texarea with<br />a line<br>break or two.";

  a.deepEqual(p.fillText($('#f1_textarea'), data), [$('#f1_textarea'), data.replace(/\<br\s?\/?\>/g, "\n")], "Return value from fill textarea correct");
  a.equal($('#f1_textarea').val(), data.replace(/\<br\s?\/?\>/g, "\n"), "Textarea filled correctly");
});

test("Fill textarea - no new lines", function(a) {
  var p = new $.Prefiller({convertBrToNewLine: false, form: '#allFieldsNoActionGet'});
  var data = "This is some long input for the texarea with<br />a line<br>break or two.";

  a.deepEqual(p.fillText($('#f1_textarea'), data), [$('#f1_textarea'), data], "Return value from fill textarea correct");
  a.equal($('#f1_textarea').val(), data, "Textarea filled correctly");
});

test("Fill text date input", function(a) {
  var p = new $.Prefiller({dateFormat: 'Y-m-d', form: '#allFieldsNoActionGet'});

  a.deepEqual(p.fillText($('#f1_date'), '1/18/2013'), [$('#f1_date'), '1/18/2013'], "Return value from fill text date correct");
  a.equal($('#f1_date').val(), '2013-01-18', "Date input filled correctly");

  a.deepEqual(p.fillText($('#f1_text'), '1/18/2013'), [$('#f1_text'), '1/18/2013'], "Return value from fill text correct");
  a.equal($('#f1_text').val(), '1/18/2013', "Text input filled correctly (no date formatting)");
});

test("Fill entire form (normal path)", function(a) {
  var tadata = "This is some long input for the texarea with<br />a line<br>break or two.";
  $('#allFieldsNoActionGet').prefillForm({
    dateFormat: 'Y-m-d',
    data: {
      checkbox: ['a', 'c'],
      radio: 'a',
      select_single: 'c',
      select_multiple: ['b', 'd'],
      text: 'foobar',
      textarea: tadata,
      date: '1/18/2013'
    }
  });
  
  a.ok($('#f1_checkbox_a').is(':checked'), "Checkbox filled correctly (1 of 2)");
  a.ok($('#f1_checkbox_c').is(':checked'), "Checkbox filled correctly (2 of 2)");
  a.ok(!$('#f1_checkbox_b').is(':checked'), "Checkbox not filled (correct)");
  a.ok($('#f1_radio_a').is(':checked'), "Radio filled correctly");
  a.ok(!$('#f1_radio_b').is(':checked'), "Non-checked radio option not filled (correct)");
  a.equal($('#f1_select_single').val(), 'c', "Select filled correctly");
  a.ok($('#f1_select_single option[value=c]').is(':selected'), "Correct option selected");
  a.ok(!$('#f1_select_single option[value=a]').is(':selected'), "Incorrect option not selected (correct)");
  a.deepEqual($('#f1_select_multiple').val(), ['b', 'd'], "Multiple select filled correctly");
  a.ok($('#f1_select_multiple option[value=b]').is(':selected'), "Correct option selected (1 of 2)");
  a.ok($('#f1_select_multiple option[value=d]').is(':selected'), "Correct option selected (2 of 2)");
  a.ok(!$('#f1_select_multiple option[value=a]').is(':selected'), "Incorrect option not selected (correct)");
  a.equal($('#f1_text').val(), 'foobar', "Text input filled correctly");
  a.equal($('#f1_textarea').val(), tadata.replace(/\<br\s?\/?\>/g, "\n"), "Textarea filled correctly");
  a.equal($('#f1_date').val(), '2013-01-18', "Date input filled correctly");

  // ensure form 2 is not filled (should not have been selected)
  a.ok(!$('#f2_checkbox_a').is(':checked'), "Checkbox not filled (1 of 3)");
  a.ok(!$('#f2_checkbox_b').is(':checked'), "Checkbox not filled (2 of 3)");
  a.ok(!$('#f2_checkbox_c').is(':checked'), "Checkbox not filled (3 of 3)");
  a.ok(!$('#f2_radio_a').is(':checked'), "Radio not filled (1 of 3)");
  a.ok(!$('#f2_radio_b').is(':checked'), "Radio not filled (2 of 3)");
  a.ok(!$('#f2_radio_c').is(':checked'), "Radio not filled (3 of 3)");
  a.equal($('#f2_select_single').val(), 'a', "Select set to initial (first) entry");
  a.equal($('#f2_select_multiple').val(), null, "Multiple select has no selections");
  a.equal($('#f2_text').val(), '', "Text input empty");
  a.equal($('#f2_textarea').val(), '', "Textarea empty");
  a.equal($('#f2_date').val(), '', "Date input empty");
});
