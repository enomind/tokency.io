(function(window, $, undefined) {
	'use strict';

	var successStatus = 'success',
		validate = ($.fn.validate !== undefined),
		$registerForm = $("#registerForm"),
		$loginForm = $("#loginForm"),
		$forgotPasswordForm = $("#forgotPasswordForm"),
		$resetPasswordForm = $("#resetPasswordForm"),
		objLoginForm = {
			recaptcha2Loaded: false
		};

	// Define custom validator
	if(validate) {
		$.validator.addMethod("confirmPasswordMatch", function(value, element) {
			var $form = $(element).closest("form"),
				passVal = $form.find("input[name='password']").val(),
				confirmPassVal = $form.find("input[name='confirmPassword']").val();
			return passVal == confirmPassVal;
		}, language.userErrMsg.CONFIRM_PASSWORD_NOT_MATCH);

		$.validator.addMethod("uniqueEmail", function(value, element) {
			var isValid = true;
			$.ajax({
				async: false,
				method: "POST",
				dataType: "JSON",
				url: "/api/checkEmailExist",
				data: {
					email: value
				}
			}).done(function(data){
				isValid = (data.status == successStatus);
			}).fail(function(){
				isValid = false;
			});
			return isValid;
		}, language.userErrMsg.EMAIL_EXIST);
	}

	// register form ------------------------------------------------------------------------------------
	if($registerForm.length > 0 && validate) {
		$registerForm.find("input[name='email']").focus();

		$registerForm.validate({
			rules: {
				"email": {
					required: true,
					email: true,
					uniqueEmail: true
				},
				"password": {
					required: true
				},
				"confirmPassword": {
					required: true,
					confirmPasswordMatch: true
				}
			},
			messages: {
				"email": {
					required: language.userErrMsg.EMAIL_IS_EMPTY,
					email: language.userErrMsg.INVALID_EMAIL
				},
				"password": {
					required: language.userErrMsg.PASSWORD_IS_EMPTY
				},
				"confirmPassword": {
					required: language.userErrMsg.REQUIRE_CONFIRM_PASSWORD
				}
			},
			onkeyup: false,
			errorClass: "error-message",
			wrapper: "li",
			errorPlacement: function (error, element) {
				var $errMsgWrap = $registerForm.find(".selectorErrMsgWrap");
				$errMsgWrap.find("li.success-message").remove();
				$errMsgWrap.append(error);
			},
			success: function (label) {
				$(label).closest("li").remove();
			},
			submitHandler: function (form) {
				var $form = $(form),
					$errMsgWrap = $form.find(".selectorErrMsgWrap");
				FrontUtils.disableButtons($form);
				$errMsgWrap.html('').hide();
				$.post({
					url: $form.find("input[name='submitUrl']").val(),
					data: $form.serialize()
				}).done(function(data) {
					var resStatus = data.status == successStatus ? 'REGISTER_SUCCESS' : data.status,
						msg = language.sysErrMsg[resStatus] || language.userErrMsg[resStatus] || "";
					if(msg.length > 0) {
						$errMsgWrap.html('<li>' + msg + '</li>').show();
					}
					if(data.status == successStatus) {
						var successUrl = $form.find("input[name='successUrl']").val() || '';
						if(successUrl.length > 0) {
							FrontUtils.redirect(successUrl);
						}
						$errMsgWrap.find("li").removeClass("error-message").addClass("success-message");
						FrontUtils.resetForm($form);
					}
					else {
						$errMsgWrap.find("li").removeClass("success-message").addClass("error-message");
					}
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				}).fail(function(){
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				});
				return false;
			}
		});
	}
	// END of register form




	// login form ------------------------------------------------------------------------------------
	if($loginForm.length > 0 && validate) {
		$loginForm.find("input[name='email']").focus();

		$loginForm.validate({
			rules: {
				"email": {
					required: true,
					email: true
				},
				"password": {
					required: true
				}
			},
			messages: {
				"email": {
					required: language.userErrMsg.EMAIL_IS_EMPTY,
					email: language.userErrMsg.INVALID_EMAIL
				},
				"password": {
					required: language.userErrMsg.PASSWORD_IS_EMPTY
				}
			},
			onkeyup: false,
			errorClass: "error-message",
			wrapper: "li",
			errorPlacement: function (error, element) {
				var $errMsgWrap = $loginForm.find(".selectorErrMsgWrap");
				$errMsgWrap.find("li.success-message").remove();
				$errMsgWrap.append(error);
			},
			success: function (label) {
				$(label).closest("li").remove();
			},
			submitHandler: function (form) {
				var $form = $(form),
					$errMsgWrap = $form.find(".selectorErrMsgWrap");
				$errMsgWrap.html('').hide();
				FrontUtils.disableButtons($form);
				$.post({
					url: $form.find("input[name='submitUrl']").val(),
					data: $form.serialize()
				}).done(function(data) {
					var resStatus = data.status == successStatus ? 'LOGIN_SUCCESS' : data.status,
						msg = language.sysErrMsg[resStatus] || language.userErrMsg[resStatus] || "";
					if(msg.length > 0) {
						$errMsgWrap.html('<li>' + msg + '</li>').show();
					}
					if(data.status == successStatus) {
						var successUrl = $form.find("input[name='successUrl']").val() || '';
						if(successUrl.length > 0) {
							FrontUtils.redirect(successUrl);
						}
						$errMsgWrap.find("li").removeClass("error-message").addClass("success-message");
						FrontUtils.resetForm($form);
					}
					else {
						$errMsgWrap.find("li").removeClass("success-message").addClass("error-message");
						if(data.status === 'INCORRECT_PASSWORD_AND_REQUIRE_CAPTCHA' && objLoginForm.recaptcha2Loaded === false) {
							objLoginForm.recaptcha2Loaded = true;
							FrontUtils.loadScript('https://www.google.com/recaptcha/api.js', function(){
								console.log('load remote done.');
							});
						}
					}
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				}).fail(function(){
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				});
				return false;
			}
		});
	}
	// END of login form


	// forgot password form -----------------------------------------------------------------------------
	if($forgotPasswordForm.length > 0 && validate) {
		$forgotPasswordForm.find("input[name='email']").focus();

		$forgotPasswordForm.validate({
			rules: {
				"email": {
					required: true,
					email: true
				}
			},
			messages: {
				"email": {
					required: language.userErrMsg.EMAIL_IS_EMPTY,
					email: language.userErrMsg.INVALID_EMAIL
				}
			},
			onkeyup: false,
			errorClass: "error-message",
			wrapper: "li",
			errorPlacement: function (error, element) {
				var $errMsgWrap = $forgotPasswordForm.find(".selectorErrMsgWrap");
				$errMsgWrap.find("li.success-message").remove();
				$errMsgWrap.append(error);
			},
			success: function (label) {
				$(label).closest("li").remove();
			},
			submitHandler: function (form) {
				var $form = $(form),
					$errMsgWrap = $form.find(".selectorErrMsgWrap");
				FrontUtils.disableButtons($form);
				$errMsgWrap.html('').hide();
				$.post({
					url: $form.find("input[name='submitUrl']").val(),
					data: $form.serialize()
				}).done(function(data) {
					var resStatus = data.status == successStatus ? 'REQUEST_PASSWORD_HASH_SUCCESS' : data.status,
						msg = language.sysErrMsg[resStatus] || language.userErrMsg[resStatus] || language.sendEmailErrMsg[resStatus] || "";
					if(msg.length > 0) {
						$errMsgWrap.html('<li>' + msg + '</li>').show();
					}
					if(data.status == successStatus) {
						var successUrl = $form.find("input[name='successUrl']").val() || '';
						if(successUrl.length > 0) {
							FrontUtils.redirect(successUrl);
						}
						$errMsgWrap.find("li").removeClass("error-message").addClass("success-message");
						FrontUtils.resetForm($form);
					}
					else {
						$errMsgWrap.find("li").removeClass("success-message").addClass("error-message");
					}
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				}).fail(function(){
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				});
				return false;
			}
		});
	}
	// END of forgot password form



	// reset password form -----------------------------------------------------------------------------
	if($resetPasswordForm.length > 0 && validate) {
		$resetPasswordForm.find("input[name='password']").focus();

		$resetPasswordForm.validate({
			rules: {
				"password": {
					required: true
				},
				"confirmPassword": {
					required: true,
					confirmPasswordMatch: true
				}
			},
			messages: {
				"password": {
					required: language.userErrMsg.PASSWORD_IS_EMPTY
				},
				"confirmPassword": {
					required: language.userErrMsg.REQUIRE_CONFIRM_PASSWORD
				}
			},
			onkeyup: false,
			errorClass: "error-message",
			wrapper: "li",
			errorPlacement: function (error, element) {
				var $errMsgWrap = $resetPasswordForm.find(".selectorErrMsgWrap");
				$errMsgWrap.find("li.success-message").remove();
				$errMsgWrap.append(error);
			},
			success: function (label) {
				$(label).closest("li").remove();
			},
			submitHandler: function (form) {
				var $form = $(form),
					$errMsgWrap = $form.find(".selectorErrMsgWrap");
				FrontUtils.disableButtons($form);
				$errMsgWrap.html('').hide();
				$.post({
					url: $form.find("input[name='submitUrl']").val(),
					data: $form.serialize()
				}).done(function(data) {
					var resStatus = data.status == successStatus ? 'RESET_PASSWORD_SUCCESS' : data.status,
						msg = language.sysErrMsg[resStatus] || language.userErrMsg[resStatus] || "";
					if(msg.length > 0) {
						$errMsgWrap.html('<li>' + msg + '</li>').show();
					}
					if(data.status == successStatus) {
						var successUrl = $form.find("input[name='successUrl']").val() || '';
						if(successUrl.length > 0) {
							FrontUtils.redirect(successUrl);
						}
						$errMsgWrap.find("li").removeClass("error-message").addClass("success-message");
						FrontUtils.resetForm($form);
					}
					else {
						$errMsgWrap.find("li").removeClass("success-message").addClass("error-message");
					}
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				}).fail(function(){
					FrontUtils.enableButtons($form);
					// check and reload recaptcha
					if(typeof grecaptcha !== "undefined") {
						grecaptcha.reset();
					}
				});
				return false;
			}
		});
	}
	// END of reset password form




	// edit profile form -----------------------------------------------------------------------------
	// END of edit profile form




	// change email && password form -----------------------------------------------------------------
	// END of change email && password form


})(window, window.$);
