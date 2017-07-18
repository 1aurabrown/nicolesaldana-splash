var EmailForm, classForViewport,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

EmailForm = (function() {
  function EmailForm($form, $email, $placeholder, $success, $errorEl) {
    this.$form = $form;
    this.$email = $email;
    this.$placeholder = $placeholder;
    this.$success = $success;
    this.$errorEl = $errorEl;
    this.onSubmit = bind(this.onSubmit, this);
    this.hidePlaceholder = bind(this.hidePlaceholder, this);
    this.showPlaceholder = bind(this.showPlaceholder, this);
    this.clearNotices = bind(this.clearNotices, this);
    this.$email.on('focus', this.hidePlaceholder);
    this.$email.on('blur', this.showPlaceholder);
    this.$form.submit(this.onSubmit);
    this.clearNotices();
  }

  EmailForm.prototype.clearNotices = function() {
    this.$errorEl.css('visibility', 'hidden');
    return this.$success.css('visibility', 'hidden');
  };

  EmailForm.prototype.showError = function() {
    return this.$errorEl.css('visibility', 'visible');
  };

  EmailForm.prototype.showSuccessAndDisable = function() {
    this.$success.css('visibility', 'visible');
    this.$email.attr('disabled', 'disabled').css('visibility', 'hidden');
    return this.$form.find("input[type='submit']").attr('disabled', 'disabled');
  };

  EmailForm.prototype.showPlaceholder = function() {
    if (this.$email[0].value.length) {
      return;
    }
    this.$errorEl.css('visibility', 'hidden');
    return this.$placeholder.css('visibility', 'visible');
  };

  EmailForm.prototype.hidePlaceholder = function() {
    return this.$placeholder.css('visibility', 'hidden');
  };

  EmailForm.prototype.onSubmit = function(e) {
    e.preventDefault();
    this.clearNotices();
    if (!this.$email[0].value.length) {
      return;
    }
    if (!this.$form[0].checkValidity()) {
      return this.showError();
    }
    return this.submit();
  };

  EmailForm.prototype.submit = function() {
    this.$email.prop('disabled', true);
    this.$form.find("input[type='submit']").prop('disabled', true);
    return $.ajax({
      type: "GET",
      url: this.$form.attr("action").replace('/post', '/post-json'),
      data: this.$form.serialize(),
      cache: false,
      dataType: "jsonp",
      jsonp: "c",
      contentType: "application/json; charset=utf-8",
      error: function(error) {},
      success: (function(_this) {
        return function(data) {
          if ((data.result === "success") || (data.msg && data.msg.indexOf("already subscribed") >= 0)) {
            return _this.showSuccessAndDisable();
          } else {
            _this.$email.prop('disabled', false);
            _this.$form.find("input[type='submit']").prop('disabled', false);
            return _this.showError();
          }
        };
      })(this)
    });
  };

  return EmailForm;

})();

classForViewport = function() {
  var ratio;
  ratio = $(window).width() / $(window).height();
  if (ratio < .9) {
    return $('body').addClass('is-skinny');
  } else {
    return $('body').removeClass('is-skinny');
  }
};

$(document).ready(function() {
  classForViewport();
  $(window).resize(_.debounce((function(_this) {
    return function() {
      return classForViewport();
    };
  })(this)));
  return window.form = new EmailForm($("#subscribe-form"), $("#subscribe-form input[type='email']"), $("#subscribe-form #fake-placeholder"), $("#subscribe-form #subscribe-success"), $("#subscribe-error"));
});
