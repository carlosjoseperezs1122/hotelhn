window.cfields = {"76":"dnde_prefieres_visitar"};
window._show_thank_you = function(id, message, trackcmp_url, email) {
    var form = document.getElementById('_form_' + id + '_'), thank_you = form.querySelector('._form-thank-you');
    form.querySelector('._form-content').style.display = 'none';
    thank_you.innerHTML = message;
    thank_you.style.display = 'block';
    const vgoAlias = typeof visitorGlobalObjectAlias === 'undefined' ? 'vgo' : visitorGlobalObjectAlias;
    var visitorObject = window[vgoAlias];
    if (email && typeof visitorObject !== 'undefined') {
        visitorObject('setEmail', email);
        visitorObject('update');
    } else if (typeof(trackcmp_url) != 'undefined' && trackcmp_url) {
        // Site tracking URL to use after inline form submission.
        _load_script(trackcmp_url);
    }
    if (typeof window._form_callback !== 'undefined') window._form_callback(id);
};
window._show_error = function(id, message, html) {
    var form = document.getElementById('_form_' + id + '_'),
        err = document.createElement('div'),
        button = form.querySelector('button'),
        old_error = form.querySelector('._form_error');
    if (old_error) old_error.parentNode.removeChild(old_error);
    err.innerHTML = message;
    err.className = '_error-inner _form_error _no_arrow';
    var wrapper = document.createElement('div');
    wrapper.className = '_form-inner';
    wrapper.appendChild(err);
    button.parentNode.insertBefore(wrapper, button);
    var submitButton = form.querySelector('[id^="_form"][id$="_submit"]');
    submitButton.disabled = false;
    submitButton.classList.remove('processing');
    if (html) {
        var div = document.createElement('div');
        div.className = '_error-html';
        div.innerHTML = html;
        err.appendChild(div);
    }
};
window._load_script = function(url, callback, isSubmit) {
    var head = document.querySelector('head'), script = document.createElement('script'), r = false;
    var submitButton = document.querySelector('#_form_47_submit');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = url;
    if (callback) {
        script.onload = script.onreadystatechange = function() {
            if (!r && (!this.readyState || this.readyState == 'complete')) {
                r = true;
                callback();
            }
        };
    }
    script.onerror = function() {
        if (isSubmit) {
            if (script.src.length > 10000) {
                _show_error("64ED7115AC01E", "Sorry, your submission failed. Please shorten your responses and try again.");
            } else {
                _show_error("64ED7115AC01E", "Sorry, your submission failed. Please try again.");
            }
            submitButton.disabled = false;
            submitButton.classList.remove('processing');
        }
    }

    head.appendChild(script);
};
(function() {
    if (window.location.search.search("excludeform") !== -1) return false;
    var getCookie = function(name) {
        var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }
    var setCookie = function(name, value) {
        var now = new Date();
        var time = now.getTime();
        var expireTime = time + 1000 * 60 * 60 * 24 * 365;
        now.setTime(expireTime);
        document.cookie = name + '=' + value + '; expires=' + now + ';path=/; Secure; SameSite=Lax;';
    }
            var addEvent = function(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func);
        } else {
            var oldFunc = element['on' + event];
            element['on' + event] = function() {
                oldFunc.apply(this, arguments);
                func.apply(this, arguments);
            };
        }
    }
    var _removed = false;
    var _form_output = '\<style\>\n #_form_64ED7115AC01E_ { font-size:14px; line-height:1.6; font-family:arial, helvetica, sans-serif; margin:0; }\n #_form_64ED7115AC01E_ * { outline:0; }\n ._form_hide { display:none; visibility:hidden; }\n ._form_show { display:block; visibility:visible; }\n #_form_64ED7115AC01E_._form-top { top:0; }\n #_form_64ED7115AC01E_._form-bottom { bottom:0; }\n #_form_64ED7115AC01E_._form-left { left:0; }\n #_form_64ED7115AC01E_._form-right { right:0; }\n #_form_64ED7115AC01E_ input[type=\"text\"],#_form_64ED7115AC01E_ input[type=\"tel\"],#_form_64ED7115AC01E_ input[type=\"date\"],#_form_64ED7115AC01E_ textarea { padding:6px; height:auto; border:#979797 1px solid; border-radius:4px; color:#000 !important; font-size:14px; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; }\n #_form_64ED7115AC01E_ textarea { resize:none; }\n #_form_64ED7115AC01E_ ._submit { -webkit-appearance:none; cursor:pointer; font-family:arial, sans-serif; font-size:14px; text-align:center; background:#248f8b !important; border:0 !important; -moz-border-radius:4px !important; -webkit-border-radius:4px !important; border-radius:4px !important; color:#fff !important; padding:10px !important; }\n #_form_64ED7115AC01E_ ._submit:disabled { cursor:not-allowed; opacity:0.4; }\n #_form_64ED7115AC01E_ ._submit.processing { position:relative; }\n #_form_64ED7115AC01E_ ._submit.processing::before { content:\'\'; width:1em; height:1em; position:absolute; z-index:1; top:50%; left:50%; border:double 3px transparent; border-radius:50%; background-image:linear-gradient(#248f8b, #248f8b), conic-gradient(#248f8b, #fff); background-origin:border-box; background-clip:content-box, border-box; animation:1200ms ease 0s infinite normal none running _spin; }\n #_form_64ED7115AC01E_ ._submit.processing::after { content:\'\'; position:absolute; top:0; bottom:0; left:0; right:0; background:#248f8b !important; border:0 !important; -moz-border-radius:4px !important; -webkit-border-radius:4px !important; border-radius:4px !important; color:#fff !important; padding:10px !important; }\n @keyframes _spin { 0% { transform:translate(-50%, -50%) rotate(90deg); }\n 100% { transform:translate(-50%, -50%) rotate(450deg); }\n }\n #_form_64ED7115AC01E_ ._close-icon { cursor:pointer; background-image:url(\'https:\/\/d226aj4ao1t61q.cloudfront.net\/esfkyjh1u_forms-close-dark.png\'); background-repeat:no-repeat; background-size:14.2px 14.2px; position:absolute; display:block; top:11px; right:9px; overflow:hidden; width:16.2px; height:16.2px; }\n #_form_64ED7115AC01E_ ._close-icon:before { position:relative; }\n #_form_64ED7115AC01E_ ._form-body { margin-bottom:30px; }\n #_form_64ED7115AC01E_ ._form-image-left { width:150px; float:left; }\n #_form_64ED7115AC01E_ ._form-content-right { margin-left:164px; }\n #_form_64ED7115AC01E_ ._form-branding { color:#fff; font-size:10px; clear:both; text-align:left; margin-top:30px; font-weight:100; }\n #_form_64ED7115AC01E_ ._form-branding ._logo { display:block; width:130px; height:14px; margin-top:6px; background-image:url(\'https:\/\/d226aj4ao1t61q.cloudfront.net\/hh9ujqgv5_aclogo_li.png\'); background-size:130px auto; background-repeat:no-repeat; }\n #_form_64ED7115AC01E_ .form-sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0, 0, 0, 0); border:0; }\n #_form_64ED7115AC01E_ ._form-label,#_form_64ED7115AC01E_ ._form_element ._form-label { font-weight:bold; margin-bottom:5px; display:block; }\n #_form_64ED7115AC01E_._dark ._form-branding { color:#333; }\n #_form_64ED7115AC01E_._dark ._form-branding ._logo { background-image:url(\'https:\/\/d226aj4ao1t61q.cloudfront.net\/jftq2c8s_aclogo_dk.png\'); }\n #_form_64ED7115AC01E_ ._form_element { position:relative; margin-bottom:10px; font-size:0; max-width:100%; }\n #_form_64ED7115AC01E_ ._form_element * { font-size:14px; }\n #_form_64ED7115AC01E_ ._form_element._clear { clear:both; width:100%; float:none; }\n #_form_64ED7115AC01E_ ._form_element._clear:after { clear:left; }\n #_form_64ED7115AC01E_ ._form_element input[type=\"text\"],#_form_64ED7115AC01E_ ._form_element input[type=\"date\"],#_form_64ED7115AC01E_ ._form_element select,#_form_64ED7115AC01E_ ._form_element textarea:not(.g-recaptcha-response) { display:block; width:100%; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; font-family:inherit; }\n #_form_64ED7115AC01E_ ._field-wrapper { position:relative; }\n #_form_64ED7115AC01E_ ._inline-style { float:left; }\n #_form_64ED7115AC01E_ ._inline-style input[type=\"text\"] { width:150px; }\n #_form_64ED7115AC01E_ ._inline-style:not(._clear) + ._inline-style:not(._clear) { margin-left:20px; }\n #_form_64ED7115AC01E_ ._form_element img._form-image { max-width:100%; }\n #_form_64ED7115AC01E_ ._form_element ._form-fieldset { border:0; padding:0.01em 0 0 0; margin:0; min-width:0; }\n #_form_64ED7115AC01E_ ._clear-element { clear:left; }\n #_form_64ED7115AC01E_ ._full_width { width:100%; }\n #_form_64ED7115AC01E_ ._form_full_field { display:block; width:100%; margin-bottom:10px; }\n #_form_64ED7115AC01E_ input[type=\"text\"]._has_error,#_form_64ED7115AC01E_ textarea._has_error { border:#f37c7b 1px solid; }\n #_form_64ED7115AC01E_ input[type=\"checkbox\"]._has_error { outline:#f37c7b 1px solid; }\n #_form_64ED7115AC01E_ ._error { display:block; position:absolute; font-size:14px; z-index:10000001; }\n #_form_64ED7115AC01E_ ._error._above { padding-bottom:4px; bottom:39px; right:0; }\n #_form_64ED7115AC01E_ ._error._below { padding-top:8px; top:100%; right:0; }\n #_form_64ED7115AC01E_ ._error._above ._error-arrow { bottom:-4px; right:15px; border-left:8px solid transparent; border-right:8px solid transparent; border-top:8px solid #fdd; }\n #_form_64ED7115AC01E_ ._error._below ._error-arrow { top:0; right:15px; border-left:8px solid transparent; border-right:8px solid transparent; border-bottom:8px solid #fdd; }\n #_form_64ED7115AC01E_ ._error-inner { padding:12px 12px 12px 36px; background-color:#fdd; background-image:url(\"data:image\/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' fill=\'none\' xmlns=\'http:\/\/www.w3.org\/2000\/svg\'%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM9 3V9H7V3H9ZM9 13V11H7V13H9Z\' fill=\'%23CA0000\'\/%3E%3C\/svg%3E\"); background-repeat:no-repeat; background-position:12px center; font-size:14px; font-family:arial, sans-serif; font-weight:600; line-height:16px; color:#000; text-align:center; text-decoration:none; -webkit-border-radius:4px; -moz-border-radius:4px; border-radius:4px; box-shadow:0px 1px 4px rgba(31, 33, 41, 0.298295); }\n #_form_64ED7115AC01E_ ._error-inner._form_error { margin-bottom:5px; text-align:left; }\n #_form_64ED7115AC01E_ ._button-wrapper ._error-inner._form_error { position:static; }\n #_form_64ED7115AC01E_ ._error-inner._no_arrow { margin-bottom:10px; }\n #_form_64ED7115AC01E_ ._error-arrow { position:absolute; width:0; height:0; }\n #_form_64ED7115AC01E_ ._error-html { margin-bottom:10px; }\n .pika-single { z-index:10000001 !important; }\n #_form_64ED7115AC01E_ input[type=\"text\"].datetime_date { width:69%; display:inline; }\n #_form_64ED7115AC01E_ select.datetime_time { width:29%; display:inline; height:32px; }\n #_form_64ED7115AC01E_ input[type=\"date\"].datetime_date { width:69%; display:inline-flex; }\n #_form_64ED7115AC01E_ input[type=\"time\"].datetime_time { width:29%; display:inline-flex; }\n @media all and (min-width:320px) and (max-width:667px) { ::-webkit-scrollbar { display:none; }\n #_form_64ED7115AC01E_ { margin:0; width:100%; min-width:100%; max-width:100%; box-sizing:border-box; }\n #_form_64ED7115AC01E_ * { -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; font-size:1em; }\n #_form_64ED7115AC01E_ ._form-content { margin:0; width:100%; }\n #_form_64ED7115AC01E_ ._form-inner { display:block; min-width:100%; }\n #_form_64ED7115AC01E_ ._form-title,#_form_64ED7115AC01E_ ._inline-style { margin-top:0; margin-right:0; margin-left:0; }\n #_form_64ED7115AC01E_ ._form-title { font-size:1.2em; }\n #_form_64ED7115AC01E_ ._form_element { margin:0 0 20px; padding:0; width:100%; }\n #_form_64ED7115AC01E_ ._form-element,#_form_64ED7115AC01E_ ._inline-style,#_form_64ED7115AC01E_ input[type=\"text\"],#_form_64ED7115AC01E_ label,#_form_64ED7115AC01E_ p,#_form_64ED7115AC01E_ textarea:not(.g-recaptcha-response) { float:none; display:block; width:100%; }\n #_form_64ED7115AC01E_ ._row._checkbox-radio label { display:inline; }\n #_form_64ED7115AC01E_ ._row,#_form_64ED7115AC01E_ p,#_form_64ED7115AC01E_ label { margin-bottom:0.7em; width:100%; }\n #_form_64ED7115AC01E_ ._row input[type=\"checkbox\"],#_form_64ED7115AC01E_ ._row input[type=\"radio\"] { margin:0 !important; vertical-align:middle !important; }\n #_form_64ED7115AC01E_ ._row input[type=\"checkbox\"] + span label { display:inline; }\n #_form_64ED7115AC01E_ ._row span label { margin:0 !important; width:initial !important; vertical-align:middle !important; }\n #_form_64ED7115AC01E_ ._form-image { max-width:100%; height:auto !important; }\n #_form_64ED7115AC01E_ input[type=\"text\"] { padding-left:10px; padding-right:10px; font-size:16px; line-height:1.3em; -webkit-appearance:none; }\n #_form_64ED7115AC01E_ input[type=\"radio\"],#_form_64ED7115AC01E_ input[type=\"checkbox\"] { display:inline-block; width:1.3em; height:1.3em; font-size:1em; margin:0 0.3em 0 0; vertical-align:baseline; }\n #_form_64ED7115AC01E_ button[type=\"submit\"] { padding:20px; font-size:1.5em; }\n #_form_64ED7115AC01E_ ._inline-style { margin:20px 0 0 !important; }\n }\n #_form_64ED7115AC01E_ { position:relative; text-align:left; margin:25px auto 0; padding:20px; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; box-sizing:border-box; *zoom:1; background:#99e7f0 !important; border:0px solid #b0b0b0 !important; max-width:340px; -moz-border-radius:0px !important; -webkit-border-radius:0px !important; border-radius:0px !important; color:#000 !important; }\n #_form_64ED7115AC01E_._inline-form,#_form_64ED7115AC01E_._inline-form ._form-content,#_form_64ED7115AC01E_._inline-form input,#_form_64ED7115AC01E_._inline-form ._submit { font-family:inherit; }\n #_form_64ED7115AC01E_ ._form-title { font-size:22px; line-height:22px; font-weight:600; margin-bottom:0; }\n #_form_64ED7115AC01E_:before,#_form_64ED7115AC01E_:after { content:\" \"; display:table; }\n #_form_64ED7115AC01E_:after { clear:both; }\n #_form_64ED7115AC01E_._inline-style { width:auto; display:inline-block; }\n #_form_64ED7115AC01E_._inline-style input[type=\"text\"],#_form_64ED7115AC01E_._inline-style input[type=\"date\"] { padding:10px 12px; }\n #_form_64ED7115AC01E_._inline-style button._inline-style { position:relative; top:27px; }\n #_form_64ED7115AC01E_._inline-style p { margin:0; }\n #_form_64ED7115AC01E_._inline-style ._button-wrapper { position:relative; margin:27px 12.5px 0 20px; }\n #_form_64ED7115AC01E_ ._form-thank-you { position:relative; left:0; right:0; text-align:center; font-size:18px; }\n @media all and (min-width:320px) and (max-width:667px) { #_form_64ED7115AC01E_._inline-form._inline-style ._inline-style._button-wrapper { margin-top:20px !important; margin-left:0 !important; }\n }\n #_form_64ED7115AC01E_ .iti.iti--allow-dropdown.iti--separate-dial-code { width:100%; }\n #_form_64ED7115AC01E_ .iti input { width:100%; height:32px; border:#979797 1px solid; border-radius:4px; }\n #_form_64ED7115AC01E_ .iti--separate-dial-code .iti__selected-flag { background-color:#fff; border-radius:4px; }\n #_form_64ED7115AC01E_ .iti--separate-dial-code .iti__selected-flag:hover { background-color:rgba(0, 0, 0, 0.05); }\n #_form_64ED7115AC01E_ .iti__country-list { border-radius:4px; margin-top:4px; min-width:460px; }\n #_form_64ED7115AC01E_ .iti__country-list--dropup { margin-bottom:4px; }\n #_form_64ED7115AC01E_ .phone-error-hidden { display:none; }\n #_form_64ED7115AC01E_ .phone-error { color:#e40e49; }\n #_form_64ED7115AC01E_ .phone-input-error { border:1px solid #e40e49 !important; }\n\n\<\/style\>\n\n\<form method=\"POST\" action=\"https://grupoopsa.activehosted.com\/proc.php\" id=\"_form_64ED7115AC01E_\" class=\"_form _form_47 _inline-form  _dark\" novalidate data-styles-version=\"3\"\>\n    \<input type=\"hidden\" name=\"u\" value=\"64ED7115AC01E\" \/\>\n    \<input type=\"hidden\" name=\"f\" value=\"47\" \/\>\n    \<input type=\"hidden\" name=\"s\" \/\>\n    \<input type=\"hidden\" name=\"c\" value=\"0\" \/\>\n    \<input type=\"hidden\" name=\"m\" value=\"0\" \/\>\n    \<input type=\"hidden\" name=\"act\" value=\"sub\" \/\>\n    \<input type=\"hidden\" name=\"v\" value=\"2\" \/\>\n    \<input type=\"hidden\" name=\"or\" value=\"18f39dd8f180d4872264515e86a81959\" \/\>\n    \<div class=\"_form-content\"\>\n                            \<div class=\"_form_element _x43524144 _full_width _clear\" \>\n                                        \<img class=\"_form-image\" src=\"\/\/grupoopsa.img-us3.com\/monicabelen.delcid@gmail.com\/htips-header-01-01.jpg\" style=\"height:92px;width:298px\" \/\>\n                                    \<\/div\>\n                            \<div class=\"_form_element _x15062429 _full_width _clear\" \>\n                        \<div class=\"_html-code\"\>\<pALIGN=center\>¿No sabes qué lugar visitar este fin de semana? \<b\> Honduras Tips\<\/b\> te da las mejores recomendaciones turísticas totalmente \<b\>GRATIS\<\/p\>\<\/div\>\n                    \<\/div\>\n                            \<div class=\"_form_element _x63432833 _full_width \" \>\n                        \<label for=\"fullname\" class=\"_form-label\"\>Nombre\<\/label\>\n            \<div class=\"_field-wrapper\"\>\n                \<input type=\"text\" id=\"fullname\" name=\"fullname\" placeholder=\"Escribe tu nombre\" \/\>\n            \<\/div\>\n\n                    \<\/div\>\n                            \<div class=\"_form_element _x14865035 _full_width \" \>\n                        \<label for=\"email\" class=\"_form-label\"\>Correo Electrónico*\<\/label\>\n            \<div class=\"_field-wrapper\"\>\n                \<input type=\"text\" id=\"email\" name=\"email\" placeholder=\"Escribe tu correo electrónico\" required\/\>\n            \<\/div\>\n\n                    \<\/div\>\n                            \<div class=\"_form_element _field76 _full_width \" \>\n                        \<fieldset class=\"_form-fieldset\"\> \n                \<div class=\"_row\"\>\n                    \<legend for=\"field[76][]\" class=\"_form-label\"\>\n                    ¿Dónde prefieres visitar?*                    \<\/legend\>\n                \<\/div\>\n                \<input data-autofill=\"false\" type=\"hidden\" id=\"field[76][]\" name=\"field[76][]\" value=\"~|\"\>\n                                \<div class=\"_row _checkbox-radio\"\>\n                    \<input id=\"field_76Sol y Playa\" type=\"checkbox\" name=\"field[76][]\" value=\"Sol y Playa\" class=\"any\"  required\>\n                    \<span\>\<label for=\"field_76Sol y Playa\"\>Sol y Playa\<\/label\>\<\/span\>\n                \<\/div\>\n                                    \<div class=\"_row _checkbox-radio\"\>\n                    \<input id=\"field_76Pueblos y Culturas Vivas\" type=\"checkbox\" name=\"field[76][]\" value=\"Pueblos y Culturas Vivas\"   \>\n                    \<span\>\<label for=\"field_76Pueblos y Culturas Vivas\"\>Pueblos y Culturas Vivas\<\/label\>\<\/span\>\n                \<\/div\>\n                                    \<div class=\"_row _checkbox-radio\"\>\n                    \<input id=\"field_76Ciudades Coloniales\" type=\"checkbox\" name=\"field[76][]\" value=\"Ciudades Coloniales\"   \>\n                    \<span\>\<label for=\"field_76Ciudades Coloniales\"\>Ciudades Coloniales\<\/label\>\<\/span\>\n                \<\/div\>\n                                    \<div class=\"_row _checkbox-radio\"\>\n                    \<input id=\"field_76Naturaleza y Montaña\" type=\"checkbox\" name=\"field[76][]\" value=\"Naturaleza y Montaña\"   \>\n                    \<span\>\<label for=\"field_76Naturaleza y Montaña\"\>Naturaleza y Montaña\<\/label\>\<\/span\>\n                \<\/div\>\n                                \<\/fieldset\>\n                    \<\/div\>\n                            \<div class=\"_form_element _x77785464 _full_width \" \>\n                        \<label for=\"ls\" class=\"_form-label\"\>Por favor verifica tu solicitud*\<\/label\>\n                \<div class=\"g-recaptcha\" data-sitekey=\"6LcwIw8TAAAAACP1ysM08EhCgzd6q5JAOUR1a0Go\"\>\<\/div\>                    \<\/div\>\n                \<div class=\"_button-wrapper _full_width\"\>\<button id=\"_form_47_submit\" class=\"_submit\" type=\"submit\"\>Suscribir\<\/button\>\<\/div\>        \<div class=\"_clear-element\"\>\<\/div\>\n    \<\/div\>\n    \<div class=\"_form-thank-you\" style=\"display:none;\"\>\<\/div\>\n    \<\/form\>\n';
        var _form_element = null, _form_elements = document.querySelectorAll('._form_47');
    for (var fe = 0; fe < _form_elements.length; fe++) {
        _form_element = _form_elements[fe];
        if (_form_element.innerHTML.trim() === '') break;
        _form_element = null;
    }
    if (!_form_element) {
        _form_element = document.createElement('div');
        if (!document.body) { document.firstChild.appendChild(document.createElement('body')); }
        document.body.appendChild(_form_element);
    }
    _form_element.innerHTML = _form_output;
        var form_to_submit = document.getElementById('_form_64ED7115AC01E_');
    var allInputs = form_to_submit.querySelectorAll('input, select, textarea'), tooltips = [], submitted = false;

    var getUrlParam = function(name) {
        var params = new URLSearchParams(window.location.search);
        return params.get(name) || false;
    };

    var acctDateFormat = "%m/%d/%Y";
    var getNormalizedDate = function(date, acctFormat) {
        var decodedDate = decodeURIComponent(date);
        if (acctFormat && acctFormat.match(/(%d|%e).*%m/gi) !== null) {
            return decodedDate.replace(/(\d{2}).*(\d{2}).*(\d{4})/g, '$3-$2-$1');
        } else if (Date.parse(decodedDate)) {
            var dateObj = new Date(decodedDate);
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth() + 1;
            var day = dateObj.getDate();
            return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
        }
        return false;
    };

    var getNormalizedTime = function(time) {
        var hour, minutes;
        var decodedTime = decodeURIComponent(time);
        var timeParts = Array.from(decodedTime.matchAll(/(\d{1,2}):(\d{1,2})\W*([AaPp][Mm])?/gm))[0];
        if (timeParts[3]) { // 12 hour format
            var isPM = timeParts[3].toLowerCase() === 'pm';
            if (isPM) {
                hour = parseInt(timeParts[1]) === 12 ? '12' : `${parseInt(timeParts[1]) + 12}`;
            } else {
                hour = parseInt(timeParts[1]) === 12 ? '0' : timeParts[1];
            }
        } else { // 24 hour format
            hour = timeParts[1];
        }
        var normalizedHour = parseInt(hour) < 10 ? `0${parseInt(hour)}` : hour;
        var minutes = timeParts[2];
        return `${normalizedHour}:${minutes}`;
    };

    for (var i = 0; i < allInputs.length; i++) {
        var regexStr = "field\\[(\\d+)\\]";
        var results = new RegExp(regexStr).exec(allInputs[i].name);
        if (results != undefined) {
            allInputs[i].dataset.name = allInputs[i].name.match(/\[time\]$/)
                ? `${window.cfields[results[1]]}_time`
                : window.cfields[results[1]];
        } else {
            allInputs[i].dataset.name = allInputs[i].name;
        }
        var fieldVal = getUrlParam(allInputs[i].dataset.name);

        if (fieldVal) {
            if (allInputs[i].dataset.autofill === "false") {
                continue;
            }
            if (allInputs[i].type == "radio" || allInputs[i].type == "checkbox") {
                if (allInputs[i].value == fieldVal) {
                    allInputs[i].checked = true;
                }
            } else if (allInputs[i].type == "date") {
                allInputs[i].value = getNormalizedDate(fieldVal, acctDateFormat);
            } else if (allInputs[i].type == "time") {
                allInputs[i].value = getNormalizedTime(fieldVal);
            } else {
                allInputs[i].value = fieldVal;
            }
        }
    }

    var remove_tooltips = function() {
        for (var i = 0; i < tooltips.length; i++) {
            tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
        }
        tooltips = [];
    };
    var remove_tooltip = function(elem) {
        for (var i = 0; i < tooltips.length; i++) {
            if (tooltips[i].elem === elem) {
                tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
                tooltips.splice(i, 1);
                return;
            }
        }
    };
    var create_tooltip = function(elem, text) {
        var tooltip = document.createElement('div'),
            arrow = document.createElement('div'),
            inner = document.createElement('div'), new_tooltip = {};
        if (elem.type != 'radio' && elem.type != 'checkbox') {
            tooltip.className = '_error';
            arrow.className = '_error-arrow';
            inner.className = '_error-inner';
            inner.innerHTML = text;
            tooltip.appendChild(arrow);
            tooltip.appendChild(inner);
            elem.parentNode.appendChild(tooltip);
        } else {
            tooltip.className = '_error-inner _no_arrow';
            tooltip.innerHTML = text;
            elem.parentNode.insertBefore(tooltip, elem);
            new_tooltip.no_arrow = true;
        }
        new_tooltip.tip = tooltip;
        new_tooltip.elem = elem;
        tooltips.push(new_tooltip);
        return new_tooltip;
    };
    var resize_tooltip = function(tooltip) {
        var rect = tooltip.elem.getBoundingClientRect();
        var doc = document.documentElement,
            scrollPosition = rect.top - ((window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0));
        if (scrollPosition < 40) {
            tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _below';
        } else {
            tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _above';
        }
    };
    var resize_tooltips = function() {
        if (_removed) return;
        for (var i = 0; i < tooltips.length; i++) {
            if (!tooltips[i].no_arrow) resize_tooltip(tooltips[i]);
        }
    };
    var validate_field = function(elem, remove) {
        var tooltip = null, value = elem.value, no_error = true;
        remove ? remove_tooltip(elem) : false;
        if (elem.type != 'checkbox') elem.className = elem.className.replace(/ ?_has_error ?/g, '');
        if (elem.getAttribute('required') !== null) {
            if (elem.type == 'radio' || (elem.type == 'checkbox' && /any/.test(elem.className))) {
                var elems = form_to_submit.elements[elem.name];
                if (!(elems instanceof NodeList || elems instanceof HTMLCollection) || elems.length <= 1) {
                    no_error = elem.checked;
                }
                else {
                    no_error = false;
                    for (var i = 0; i < elems.length; i++) {
                        if (elems[i].checked) no_error = true;
                    }
                }
                if (!no_error) {
                    tooltip = create_tooltip(elem, "Please select an option.");
                }
            } else if (elem.type =='checkbox') {
                var elems = form_to_submit.elements[elem.name], found = false, err = [];
                no_error = true;
                for (var i = 0; i < elems.length; i++) {
                    if (elems[i].getAttribute('required') === null) continue;
                    if (!found && elems[i] !== elem) return true;
                    found = true;
                    elems[i].className = elems[i].className.replace(/ ?_has_error ?/g, '');
                    if (!elems[i].checked) {
                        no_error = false;
                        elems[i].className = elems[i].className + ' _has_error';
                        err.push("Checking %s is required".replace("%s", elems[i].value));
                    }
                }
                if (!no_error) {
                    tooltip = create_tooltip(elem, err.join('<br/>'));
                }
            } else if (elem.tagName == 'SELECT') {
                var selected = true;
                if (elem.multiple) {
                    selected = false;
                    for (var i = 0; i < elem.options.length; i++) {
                        if (elem.options[i].selected) {
                            selected = true;
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < elem.options.length; i++) {
                        if (elem.options[i].selected
                            && (!elem.options[i].value
                            || (elem.options[i].value.match(/\n/g)))
                        ) {
                            selected = false;
                        }
                    }
                }
                if (!selected) {
                    elem.className = elem.className + ' _has_error';
                    no_error = false;
                    tooltip = create_tooltip(elem, "Please select an option.");
                }
            } else if (value === undefined || value === null || value === '') {
                elem.className = elem.className + ' _has_error';
                no_error = false;
                tooltip = create_tooltip(elem, "This field is required.");
            }
        }
        if (no_error && (elem.id == 'field[]' || elem.id == 'ca[11][v]')) {
            if (elem.className.includes('phone-input-error')) {
                elem.className = elem.className + ' _has_error';
                no_error = false;
            }
        }
        if (no_error && elem.name == 'email') {
            if (!value.match(/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)) {
                elem.className = elem.className + ' _has_error';
                no_error = false;
                tooltip = create_tooltip(elem, "Enter a valid email address.");
            }
        }
        if (no_error && /date_field/.test(elem.className)) {
            if (!value.match(/^\d\d\d\d-\d\d-\d\d$/)) {
                elem.className = elem.className + ' _has_error';
                no_error = false;
                tooltip = create_tooltip(elem, "Enter a valid date.");
            }
        }
        tooltip ? resize_tooltip(tooltip) : false;
        return no_error;
    };
    var needs_validate = function(el) {
        if(el.getAttribute('required') !== null){
            return true
        }
        if(el.name === 'email' && el.value !== ""){
            return true
        }

        if((el.id == 'field[]' || el.id == 'ca[11][v]') && el.className.includes('phone-input-error')){
            return true
        }

        return false
    };
    var validate_form = function(e) {
        var err = form_to_submit.querySelector('._form_error'), no_error = true;
        if (!submitted) {
            submitted = true;
            for (var i = 0, len = allInputs.length; i < len; i++) {
                var input = allInputs[i];
                if (needs_validate(input)) {
                    if (input.type == 'tel') {
                        addEvent(input, 'blur', function() {
                            this.value = this.value.trim();
                            validate_field(this, true);
                        });
                    }
                    if (input.type == 'text' || input.type == 'number' || input.type == 'time') {
                        addEvent(input, 'blur', function() {
                            this.value = this.value.trim();
                            validate_field(this, true);
                        });
                        addEvent(input, 'input', function() {
                            validate_field(this, true);
                        });
                    } else if (input.type == 'radio' || input.type == 'checkbox') {
                        (function(el) {
                            var radios = form_to_submit.elements[el.name];
                            for (var i = 0; i < radios.length; i++) {
                                addEvent(radios[i], 'click', function() {
                                    validate_field(el, true);
                                });
                            }
                        })(input);
                    } else if (input.tagName == 'SELECT') {
                        addEvent(input, 'change', function() {
                            validate_field(this, true);
                        });
                    } else if (input.type == 'textarea'){
                        addEvent(input, 'input', function() {
                            validate_field(this, true);
                        });
                    }
                }
            }
        }
        remove_tooltips();
        for (var i = 0, len = allInputs.length; i < len; i++) {
            var elem = allInputs[i];
            if (needs_validate(elem)) {
                if (elem.tagName.toLowerCase() !== "select") {
                    elem.value = elem.value.trim();
                }
                validate_field(elem) ? true : no_error = false;
            }
        }
        if (!no_error && e) {
            e.preventDefault();
        }
        resize_tooltips();
        return no_error;
    };
    addEvent(window, 'resize', resize_tooltips);
    addEvent(window, 'scroll', resize_tooltips);

    var hidePhoneInputError = function(inputId) {
        var errorMessage =  document.getElementById("error-msg-" + inputId);
        var input = document.getElementById(inputId);
        errorMessage.classList.remove("phone-error");
        errorMessage.classList.add("phone-error-hidden");
        input.classList.remove("phone-input-error");
    };

    var initializePhoneInput = function(input, defaultCountry) {
        return window.intlTelInput(input, {
            utilsScript: "https://unpkg.com/intl-tel-input@17.0.18/build/js/utils.js",
            autoHideDialCode: false,
            separateDialCode: true,
            initialCountry: defaultCountry,
            preferredCountries: []
        });
    }

    var setPhoneInputEventListeners = function(inputId, input, iti) {
        input.addEventListener('blur', function() {
            var errorMessage = document.getElementById("error-msg-" + inputId);
            if (input.value.trim()) {
                if (iti.isValidNumber()) {
                    iti.setNumber(iti.getNumber());
                    if (errorMessage.classList.contains("phone-error")){
                        hidePhoneInputError(inputId);
                    }
                } else {
                    showPhoneInputError(inputId)
                }
            } else {
                if (errorMessage.classList.contains("phone-error")){
                    hidePhoneInputError(inputId);
                }
            }
        });

        input.addEventListener("countrychange", function() {
            iti.setNumber('');
        });

        input.addEventListener("keydown", function(e) {
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 8) {
                e.preventDefault();
            }
        });
    };

    var showPhoneInputError = function(inputId) {
        var errorMessage =  document.getElementById("error-msg-" + inputId);
        var input = document.getElementById(inputId);
        errorMessage.classList.add("phone-error");
        errorMessage.classList.remove("phone-error-hidden");
        input.classList.add("phone-input-error");
    };


    window['recaptcha_callback'] = function() {
	// Get all recaptchas in the DOM (there may be more than one form on the page).
	var recaptchas = document.getElementsByClassName("g-recaptcha");
	for (var i in recaptchas) {
		// Set the recaptcha element ID, so the recaptcha can be applied to each element.
		var recaptcha_id = "recaptcha_" + i;
		recaptchas[i].id = recaptcha_id;
		var el = document.getElementById(recaptcha_id);
		if (el != null) {
			var sitekey = el.getAttribute("data-sitekey");
			var stoken = el.getAttribute("data-stoken");
			grecaptcha.render(recaptcha_id, {"sitekey":sitekey,"stoken":stoken});
		}
	}
};    _load_script(
        "https://www.google.com/recaptcha/api.js?onload=recaptcha_callback&render=explicit"
    );
    var _form_serialize = function(form){if(!form||form.nodeName!=="FORM"){return }var i,j,q=[];for(i=0;i<form.elements.length;i++){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"tel":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].previousSibling.querySelector('div.iti__selected-dial-code').innerText)+encodeURIComponent(" ")+encodeURIComponent(form.elements[i].value));break;case"text":case"number":case"date":case"time":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=0;j<form.elements[i].options.length;j++){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};
    var form_submit = function(e) {
        e.preventDefault();
        if (validate_form()) {
            // use this trick to get the submit button & disable it using plain javascript
            var submitButton = e.target.querySelector('#_form_47_submit');
            submitButton.disabled = true;
            submitButton.classList.add('processing');
                        var serialized = _form_serialize(
                document.getElementById('_form_64ED7115AC01E_')
            ).replace(/%0A/g, '\\n');
            var err = form_to_submit.querySelector('._form_error');
            err ? err.parentNode.removeChild(err) : false;
            _load_script('https://grupoopsa.activehosted.com/proc.php?' + serialized + '&jsonp=true', null, true);
        }
        return false;
    };
    addEvent(form_to_submit, 'submit', form_submit);
})();
