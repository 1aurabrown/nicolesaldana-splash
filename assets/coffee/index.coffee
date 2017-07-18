class EmailForm

  constructor: (@$form, @$email, @$placeholder, @$success, @$errorEl) ->
    @$email.on 'focus', @hidePlaceholder
    @$email.on 'blur', @showPlaceholder
    @$form.submit @onSubmit
    @clearNotices()

  clearNotices: =>
    @$errorEl.css 'visibility', 'hidden'
    @$success.css 'visibility', 'hidden'

  showError: ->
    @$errorEl.css 'visibility', 'visible'

  showSuccessAndDisable: ->
    @$success.css 'visibility', 'visible'
    @$email.attr('disabled','disabled').css('visibility', 'hidden')
    @$form.find("input[type='submit']").attr('disabled','disabled')

  showPlaceholder: =>
    return if @$email[0].value.length
    @$errorEl.css 'visibility', 'hidden'
    @$placeholder.css 'visibility', 'visible'

  hidePlaceholder: =>
    @$placeholder.css 'visibility', 'hidden'

  onSubmit: (e) =>
    # Hijack submit event and submit via ajax
    e.preventDefault()
    @clearNotices()
    return if not @$email[0].value.length
    unless @$form[0].checkValidity()
      return @showError()
    @submit()

  # Submit the form with an ajax/jsonp request.
  # Based on http://stackoverflow.com/a/15120409/215821
  submit:  ->
    @$email.prop('disabled', true)
    @$form.find("input[type='submit']").prop('disabled', true)
    $.ajax
      type: "GET",
      url: @$form.attr("action").replace('/post', '/post-json'),
      data: @$form.serialize(),
      cache: false,
      dataType: "jsonp",
      jsonp: "c", # trigger MailChimp to return a JSONP response
      contentType: "application/json; charset=utf-8",
      error: (error) -> # According to jquery docs, this is never called for cross-domain JSONP requests
      success: (data) =>
        if (data.result == "success") || (data.msg && data.msg.indexOf("already subscribed") >= 0)
          @showSuccessAndDisable()
        else
          @$email.prop('disabled', false)
          @$form.find("input[type='submit']").prop('disabled', false)
          @showError()

classForViewport = ->
  ratio = $(window).width()/$(window).height()
  if ratio < .9
    $('body').addClass 'is-skinny'
  else
    $('body').removeClass 'is-skinny'

$(document).ready ->
  classForViewport()
  $(window).resize _.debounce =>
    classForViewport()
  window.form = new EmailForm(
    $("#subscribe-form"),
    $("#subscribe-form input[type='email']"),
    $("#subscribe-form #fake-placeholder"),
    $("#subscribe-form #subscribe-success"),
    $("#subscribe-error")
  )
