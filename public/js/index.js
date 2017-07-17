var ajaxMailChimpForm, submitSubscribeForm;

$(document).ready(function() {
  return ajaxMailChimpForm($("#subscribe-form"), $("#subscribe-success"), $("#subscribe-error"));
});

ajaxMailChimpForm = function($form, $successEl, $errorEl) {
  return $form.submit(function(e) {
    e.preventDefault();
    $errorEl.html("");
    if (!$form.find("input[type='email']")[0].value.length) {
      return;
    }
    if (!$form[0].checkValidity()) {
      return $errorEl.html("Please check the email you entered!");
    }
    return submitSubscribeForm($form, $successEl, $errorEl);
  });
};

submitSubscribeForm = function($form, $successEl, $errorEl) {
  $successEl.hide;
  $errorEl.html('');
  return $.ajax({
    type: "GET",
    url: $form.attr("action").replace('/post', '/post-json'),
    data: $form.serialize(),
    cache: false,
    dataType: "jsonp",
    jsonp: "c",
    contentType: "application/json; charset=utf-8",
    error: function(error) {},
    success: function(data) {
      if ((data.result === "success") || (data.msg && data.msg.indexOf("already subscribed") >= 0)) {
        $successEl.show();
        $form.find("input[type='email']").hide();
        $successEl.html("Thank you!");
        return $successEl.show();
      } else {
        return $errorEl.html("Please check the email you entered!");
      }
    }
  });
};
