/* START OpenCities.CustomControls.LanguageSelector.Language.js */
var langCookies;

function getToolbarLanguageItem(element) {
    return $(element).closest(".toolbar-item.toolbar-language");
}

function syncDropdownAriaSelection(selectedLink) {
    var $item = selectedLink && selectedLink.length
        ? getToolbarLanguageItem(selectedLink)
        : $();
    var $dropdown = $item.length
        ? $item.find(".toolbar-language-drop-down")
        : $(".toolbar-language-drop-down");
    var $button = $item.length
        ? $item.find(".toolbar-button-language")
        : $(".toolbar-button-language");
    var $options = $dropdown.find("li[role='option']");
    $options.attr("aria-selected", "false");

    if (!selectedLink || selectedLink.length === 0) {
        $button.removeAttr("aria-activedescendant");
        return;
    }

    var $selectedOption = $(selectedLink).closest("li[role='option']");
    if ($selectedOption.length === 0) {
        $button.removeAttr("aria-activedescendant");
        return;
    }

    $selectedOption.attr("aria-selected", "true");
    var selectedOptionId = $selectedOption.attr("id");
    if (selectedOptionId) {
        $button.attr("aria-activedescendant", selectedOptionId);
    }
}

function getDropdownOptions($toolbarItem) {
    if (!$toolbarItem || !$toolbarItem.length) {
        return $();
    }
    return $toolbarItem.find(".toolbar-language-drop-down li[role='option']");
}

function focusDropdownOptionByIndex(index, $toolbarItem) {
    var $options = getDropdownOptions($toolbarItem);
    if ($options.length === 0) {
        return;
    }

    if (index < 0) {
        index = $options.length - 1;
    }
    if (index >= $options.length) {
        index = 0;
    }

    var $option = $options.eq(index);
    var $link = $option.find("a").first();
    syncDropdownAriaSelection($link);
    if ($link.length > 0) {
        $link.focus();
    }

    var optionElement = $option.get(0);
    if (optionElement && optionElement.scrollIntoView) {
        optionElement.scrollIntoView({ block: "nearest" });
    }
}

function getOptionIndexFromElement(element, $toolbarItem) {
    var $option = $(element).closest("li[role='option']");
    if ($option.length === 0) {
        return -1;
    }

    var optionNodes = getDropdownOptions($toolbarItem).get();
    return optionNodes.indexOf($option[0]);
}

function closeLanguageDropdownAndFocusButton(context) {
    var $item = context ? getToolbarLanguageItem(context) : $(".toolbar-item.toolbar-language").first();
    var $button = $item.find(".toolbar-button-language");
    if ($button.attr("aria-expanded") === "true") {
        $button.trigger("click");
    }
    $button.focus();
}

function getCurrentLanguageOption(selector) {
    var currentLanguageOption = $(selector).filter(function () {
        var language = $(this).attr("data-translate-to").toLowerCase();
        var userSelectedLang = OpenCities.Settings.Application.LanguageSettings.UserLanguage.toLowerCase();
        return language == userSelectedLang || language.startsWith(userSelectedLang) || userSelectedLang.startsWith(language);
    });

    if (currentLanguageOption && currentLanguageOption.length > 0) {
        return currentLanguageOption[0];
    }
    else {
        return null;
    }
}

function updateUserSelectedLanguageText() {
    var currentLanguage = getCurrentLanguageOption(".toolbar-language-drop-down a");
    syncDropdownAriaSelection($(currentLanguage));
    if (currentLanguage) {
        $(currentLanguage).find("span.visuallyhidden").remove(); // remove "Select this as your...", to get just the language display text
        var languageText = $(currentLanguage).text();
        $(".toolbar-button-language .current-language").text(languageText);
        $(".toolbar-button-language").append("<span class=\"visuallyhidden\"> is your current preferred language.</span>");

                
        $(currentLanguage).remove();
        getToolbarLanguageItem($(currentLanguage)).find(".toolbar-button-language").removeAttr("aria-activedescendant");
        // Handling scenario where only one language is added to LanguageSelector control. 
        if ($('.toolbar-language-drop-down ul li a').length == 0) {
            $('.toolbar-button-language').prop('disabled', true);
            $('.toolbar-button-language i').remove()
            $('.toolbar-language-drop-down').remove();
        }
    }

    currentLanguage = getCurrentLanguageOption(".toolbar-language-links a");
    if (currentLanguage) {
        $(currentLanguage).find("span.visuallyhidden").remove(); // remove "Select this as your...", to get just the language display text
        var languageCode = $(currentLanguage).attr("data-translate-to");
        var languageText = $(currentLanguage).text();
        var currentLanguagelink = $(".toolbar-language-links").find(".lang-" + languageCode);
        var currentLanguageSpan = $("<span class=\"lang-item current-language\"></span>");
        currentLanguageSpan.addClass("lang-" + languageCode);
        currentLanguageSpan.attr("lang", currentLanguagelink.attr("lang"));
        currentLanguageSpan.append(languageText + "<span class=\"visuallyhidden\"> is your current preferred language.</span>");
        currentLanguagelink.replaceWith(currentLanguageSpan);
    }
}

function googleTranslateElementInit() {
    var pageLang = OpenCities.Settings.Application.LanguageSettings.PageLanguage;
    if (pageLang !== 'zh-CN' && pageLang !== 'zh-TW') {
        pageLang = pageLang.split('-')[0];
    }
    var userLang = OpenCities.Settings.Application.LanguageSettings.UserLanguage;
    if (userLang !== 'zh-CN' && userLang !== 'zh-TW') {
        userLang = userLang.split('-')[0];
    }
    var alwaysRun = OpenCities.Settings.Application.LanguageSettings.Always;
    var runTranslate = true;
    if (!alwaysRun) {
        runTranslate = false;
        var checkLang = $('html').attr('lang').split('-')[0];
        $("*[lang]").each(function () {
            var newLang = $(this).attr('lang').split('-')[0];
            if (checkLang !== newLang) {
                runTranslate = true;
                return false;
            }
        });
    }
    if (!runTranslate) {
        return;
    }
    new google.translate.TranslateElement(
        {
            pageLanguage: pageLang,
            includedLanguages: userLang,
            layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT, multilanguagePage: true
        },
        'google_translate_element');
    $('.toolbar-language .current-language').addClass('google-translate-language');
    // Update match height after google translate runs
    setTimeout(function () { $.fn.matchHeight._update(); }, 2000);
}

$(function () {
    $(document).on("click", ".toolbar-language-drop-down a", function () {
        syncDropdownAriaSelection($(this));
    });

    $(document).on("keydown", ".toolbar-button-language", function (e) {
        var key = e.key || { 38: "ArrowUp", 40: "ArrowDown", 27: "Escape" }[e.keyCode];
        if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Escape") {
            return;
        }

        if (key === "Escape") {
            e.preventDefault();
            closeLanguageDropdownAndFocusButton(this);
            return;
        }

        e.preventDefault();
        var $button = $(this);
        var $item = getToolbarLanguageItem($button);
        if ($button.attr("aria-expanded") !== "true") {
            $button.trigger("click");
        }

        var $opts = getDropdownOptions($item);
        var startIndex = key === "ArrowUp" ? $opts.length - 1 : 0;
        setTimeout(function () {
            focusDropdownOptionByIndex(startIndex, $item);
        }, 0);
    });

    $(document).on("keydown", ".toolbar-language-drop-down a", function (e) {
        var key = e.key || { 38: "ArrowUp", 40: "ArrowDown", 27: "Escape", 36: "Home", 35: "End", 32: " " }[e.keyCode];
        var $item = getToolbarLanguageItem(this);
        if (key === "ArrowDown" || key === "ArrowUp") {
            e.preventDefault();
            var currentIndex = getOptionIndexFromElement(this, $item);
            if (currentIndex < 0) {
                focusDropdownOptionByIndex(0, $item);
                return;
            }
            focusDropdownOptionByIndex(currentIndex + (key === "ArrowDown" ? 1 : -1), $item);
            return;
        }

        if (key === "Home") {
            e.preventDefault();
            focusDropdownOptionByIndex(0, $item);
            return;
        }

        if (key === "End") {
            e.preventDefault();
            var $opts = getDropdownOptions($item);
            focusDropdownOptionByIndex($opts.length - 1, $item);
            return;
        }

        if (key === "Escape") {
            e.preventDefault();
            closeLanguageDropdownAndFocusButton(this);
            return;
        }

        if (key === " ") {
            e.preventDefault();
            $(this).trigger("click");
        }
    });

    updateUserSelectedLanguageText();
    if (OpenCities.Settings.Application.LanguageSettings.InjectGoogleTranslate) {
        var script = document.createElement('script');
        script.src = "../translate.google.com/translate_a/elementa0d8.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
    }
});
/* END OpenCities.CustomControls.LanguageSelector.Language.js */
if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();
(function() {
    function loadHandler() {
        var hf = window.__TsmHiddenField;
        if (!hf) return;
        if (!hf._RSM_init) { hf._RSM_init = true; hf.value = ''; }
        hf.value += ';;OpenCities.CustomControls:en-GB:5da10c8e-b64d-411a-8c8c-af154c09df97:8e1d32bf';
        Sys.Application.remove_load(loadHandler);
    };
    Sys.Application.add_load(loadHandler);
})();
