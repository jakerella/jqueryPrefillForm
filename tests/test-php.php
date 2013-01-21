<!doctype html>
<html>
  <head>
    <meta charset='UTF-8' />
    <meta http-equiv='content-type' content='text/html; charset=utf-8' />
    
    <title>jQuery.prefillForm Tests</title>

    <meta name='description' content='Testsr for jquery.PrefillForm plugin' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    
    <script src='lib/jquery-1.7.2.min.js'></script>
    <script src='../src/jquery.prefillForm.js'></script>
  </head>
  <body>
    <div id='wrapper'>
      
      <h1>jQuery.prefillForm Functional Tests - PHP</h1>

      <p>
        The two forms below both submit back to this page (one with blank action, one by file name).
        Only the form you submit should be prefilled on return. Below is the JavaScript/PHP
        code used for the test:
      </p>

      <pre>&lt;script>
  &lt;?php if (isset($_REQUEST['hidden'])) { ?>
    var p = new $.Prefiller({
      data: eval(&lt;?=json_encode($_REQUEST)?>),
      method: "&lt;?=$_SERVER['REQUEST_METHOD']?>"
    });
    p.doFill();

    // Note that this could be rewritten as
    // $("#postForm").prefillForm({
    //   data: eval(json_encode($_POST)),
    //   method: 'post'
    // });

  &lt;?php } ?>
&lt;/script>
</pre>

      <form id='getForm' action='' method='GET'>
        <h3>GET method, all field types</h3>
        
        <div class='group'>
          <label for='f1_text'>Text</label>
          <input type='text' id='f1_text' name='text' />
        </div>

        <div class='group'>
          <label for='f1_date'>Text Date Input</label>
          <input type='text' id='f1_date' name='date' class='date' />
        </div>

        <div class='group'>
          <label for='f1_pass'>Password</label>
          <input type='password' id='f1_pass' name='pass' />
        </div>

        <div class='group'>
          <label for='f1_radio_a'>Radio</label>
          <input type='radio' id='f1_radio_a' name='radio' value='a' /> a
          <input type='radio' id='f1_radio_b' name='radio' value='b' /> b
          <input type='radio' id='f1_radio_c' name='radio' value='c' /> c
        </div>

        <div class='group'>
          <label for='f1_checkbox_a'>Checkbox</label>
          <input type='checkbox' id='f1_checkbox_a' name='checkbox[]' value='a' /> a
          <input type='checkbox' id='f1_checkbox_b' name='checkbox[]' value='b' /> b
          <input type='checkbox' id='f1_checkbox_c' name='checkbox[]' value='c' /> c
        </div>

        <div class='group'>
          <label for='f1_select_single'>Select Single</label>
          <select id='f1_select_single' name='select_single'>
            <option value='a'>Option a</option>
            <option value='b'>Option b</option>
            <option value='c'>Option c</option>
            <option value='d'>Option d</option>
          </select>
        </div>

        <div class='group'>
          <label for='f1_select_multiple'>Select Multiple</label>
          <select id='f1_select_multiple' name='select_multiple[]' multiple='multiple'>
            <option value='a'>Option a</option>
            <option value='b'>Option b</option>
            <option value='c'>Option c</option>
            <option value='d'>Option d</option>
          </select>
        </div>

        <div class='group'>
          <label for='f1_textarea'>Textarea</label>
          <textarea id='f1_textarea' name='textarea'></textarea>
        </div>

        <div class='group'>
          <label>Hidden and Buttons</label>
          <input type='hidden' id='f1_hidden' name='hidden' />
          <input type='button' id='f1_input_button' name='input_button' value='Input Button' />
          <input type='submit' id='f1_submit' name='submit' />
          <input type='reset' id='f1_reset' name='reset' />
          <button id='f1_button' name='button'>Button Tag</button>
        </div>
      </form>

      <form id='postForm' action='test-php.php' method='POST'>
        <h3>POST method, all field types</h3>
        
        <div class='group'>
          <label for='f2_text'>Text</label>
          <input type='text' id='f2_text' name='text' />
        </div>

        <div class='group'>
          <label for='f2_date'>Text Date Input</label>
          <input type='text' id='f2_date' name='date' class='date' />
        </div>

        <div class='group'>
          <label for='f2_pass'>Password</label>
          <input type='password' id='f2_pass' name='pass' />
        </div>

        <div class='group'>
          <label for='f2_radio_a'>Radio</label>
          <input type='radio' id='f2_radio_a' name='radio' value='a' /> a
          <input type='radio' id='f2_radio_b' name='radio' value='b' /> b
          <input type='radio' id='f2_radio_c' name='radio' value='c' /> c
        </div>

        <div class='group'>
          <label for='f2_checkbox_a'>Checkbox</label>
          <input type='checkbox' id='f2_checkbox_a' name='checkbox[]' value='a' /> a
          <input type='checkbox' id='f2_checkbox_b' name='checkbox[]' value='b' /> b
          <input type='checkbox' id='f2_checkbox_c' name='checkbox[]' value='c' /> c
        </div>

        <div class='group'>
          <label for='f2_select_single'>Select Single</label>
          <select id='f2_select_single' name='select_single'>
            <option value='a'>Option a</option>
            <option value='b'>Option b</option>
            <option value='c'>Option c</option>
            <option value='d'>Option d</option>
          </select>
        </div>

        <div class='group'>
          <label for='f2_select_multiple'>Select Multiple</label>
          <select id='f2_select_multiple' name='select_multiple[]' multiple='multiple'>
            <option value='a'>Option a</option>
            <option value='b'>Option b</option>
            <option value='c'>Option c</option>
            <option value='d'>Option d</option>
          </select>
        </div>

        <div class='group'>
          <label for='f2_textarea'>Textarea</label>
          <textarea id='f2_textarea' name='textarea'></textarea>
        </div>

        <div class='group'>
          <label>Hidden and Buttons</label>
          <input type='hidden' id='f2_hidden' name='hidden' />
          <input type='button' id='f2_input_button' name='input_button' value='Input Button' />
          <input type='submit' id='f2_submit' name='submit' />
          <input type='reset' id='f2_reset' name='reset' />
          <button id='f2_button' name='button'>Button Tag</button>
        </div>
      </form>

      <script>
        <?php if (isset($_REQUEST['hidden'])) { ?>
          var p = new $.Prefiller({
            data: eval(<?=json_encode($_REQUEST)?>),
            method: "<?=$_SERVER['REQUEST_METHOD']?>"
          });
          p.doFill();

          // Note that this could be rewritten as
          // $("#postForm").prefillForm({
          //   data: eval(json_encode($_POST)),
          //   method: 'post'
          // });

        <?php } ?>
      </script>

      <h2>$_REQUEST object for debugging:</h2>
      <pre><?=var_dump($_REQUEST)?></pre>
    </body>
</html>