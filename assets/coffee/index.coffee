$(document).ready ->
  ajaxMailChimpForm $("#subscribe-form"), $("#subscribe-success"), $("#subscribe-error")
  # Turn the given MailChimp form into an ajax version of it.
  # If resultElement is given, the subscribe result is set as html to
  # that element.


ajaxMailChimpForm = ($form, $successEl, $errorEl) ->

  $form.submit (e) ->
    e.preventDefault()
    $errorEl.html ""
    return if not $form.find("input[type='email']")[0].value.length
    unless $form[0].checkValidity()
      return $errorEl.html "Please check the email you entered!"

    submitSubscribeForm $form, $successEl, $errorEl

# Submit the form with an ajax/jsonp request.
# Based on http://stackoverflow.com/a/15120409/215821
submitSubscribeForm = ($form, $successEl, $errorEl) ->
  $successEl.hide
  $errorEl.html ''
  $.ajax
    type: "GET",
    url: $form.attr("action").replace('/post', '/post-json'),
    data: $form.serialize(),
    cache: false,
    dataType: "jsonp",
    jsonp: "c", # trigger MailChimp to return a JSONP response
    contentType: "application/json; charset=utf-8",
    error: (error) -> # According to jquery docs, this is never called for cross-domain JSONP requests
    success: (data) ->
      if (data.result == "success") || (data.msg && data.msg.indexOf("already subscribed") >= 0)
        $successEl.show()
        $form.find("input[type='email']").hide()
        $successEl.html "Thank you!"
        $successEl.show()
      else
        $errorEl.html "Please check the email you entered!"

