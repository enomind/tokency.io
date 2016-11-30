var FrontUtils = function() {}
FrontUtils.resetForm = function($form) {
	if($form && $form.length > 0) {
		$form.find("input.selectorResetMe[type='text']").val("");
		$form.find("input.selectorResetMe[type='password']").val("");
		$form.find("input.selectorResetMe[type='checkbox']").prop("checked", false);
		$form.find("input.selectorResetMe[type='radio']").prop("checked", false);
		$form.find("textarea.selectorResetMe").val("");
		$form.find("select.selectorResetMe option").prop("selected", false);
		// check if set data-default_value attribute
		// input text & text area
		$form.find("input.selectorResetMe[data-default_value], textarea.selectorResetMe[data-default_value]").each(function(){
			var $this = $(this);
			$this.val($this.attr("data-default_value"));
		});
		//select
		$form.find("select.selectorResetMe[data-default_value]").each(function(){
			var $this = $(this);
			$this.find("option[value='" + $this.attr("data-default_value") + "']").prop("selected", true);
		});
		//checkbox && radio
		$form.find("input:checkbox.selectorResetMe[data-default_check], input:radio.selectorResetMe[data-default_check]").prop("checked", true);
	}
}

FrontUtils.disableButtons = function ($form) {
	if($form && $form.length > 0) {
		var $selectors = $form.find(".selectorButton"),
			disabledClasses = 'disabled';
		if($selectors.length > 0) {
			$selectors.attr("disabled", "disabled");
			$selectors.addClass(disabledClasses);
		}
	}
},
FrontUtils.enableButtons = function ($form) {
	if($form && $form.length > 0) {
		var $selectors = $form.find(".selectorButton"),
			disabledClasses = 'disabled';
		if($selectors.length > 0) {
			$selectors.removeAttr("disabled");
			$selectors.removeClass(disabledClasses);
		}
	}
},

FrontUtils.redirect = function(url, immediately) {
	if(typeof immediately === "boolean" && immediately) {
		window.location.href = url;
	}
	else {
		setTimeout(function(){
			window.location.href = url;
		}, 5*1000);
	}
}


// -----------------------Load JS & CSS dynamic ---------------
FrontUtils.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

FrontUtils.loadCssHack = function(url, callbackFunction) {
    var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    var img = document.createElement('img');
    img.onerror = function() {
        callback();
    };
    img.src = url;
};

FrontUtils.loadRemote = function(url, type, callbackFunction) {
    var callback = (typeof callbackFunction === "function" ? callbackFunction : function() {});
    if (type === "css" && FrontUtils.isSafari) {
        FrontUtils.loadCssHack(url, callback);
        return;
    }
    var _element, _type, _attr, scr, s, element;
    switch (type) {
        case 'css':
            _element = "link";
            _type = "text/css";
            _attr = "href";
            break;
        case 'js':
            _element = "script";
            _type = "text/javascript";
            _attr = "src";
            break;
    }
    scr = document.getElementsByTagName(_element);
    element = document.createElement(_element);
    element.type = _type;
    if (type == "css") {
        element.rel = "stylesheet";
    }
    if (element.readyState) {
        element.onreadystatechange = function() {
            if (element.readyState == "loaded" || element.readyState == "complete") {
                element.onreadystatechange = null;
                callback();
            }
        };
    } else {
        element.onload = function() {
            callback();
        };
    }
    element[_attr] = url;
    if (scr.length == 0) {
        var scr = document.getElementsByTagName('script');
    }
    s = scr[scr.length - 1];
    s.parentNode.insertBefore(element, s.nextSibling);
};

FrontUtils.loadScript = function(url, callbackFunction) {
    FrontUtils.loadRemote(url, "js", callbackFunction);
};

FrontUtils.loadCss = function(url, callbackFunction) {
    FrontUtils.loadRemote(url, "css", callbackFunction);
};
// -----------------------END of Load JS & CSS dynamic ---------------

$(document).on("click", ".selectorShowPassword", function(){
    var $wrap = $(this).closest(".selectorPasswordGroup");
    if($wrap.length > 0) {
        var $pInput = $wrap.find("input[type='password']"),
            $tInput = $wrap.find("input[type='text']");
        if($pInput.length > 0) {
            $pInput.attr("type", "text");
        }
        else if($tInput.length > 0) {
            $tInput.attr("type", "password");
        }
    }
});