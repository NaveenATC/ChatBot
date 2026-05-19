
(function (Settings, $, undefined) {
    Settings.initialise = function () {
        this.Environment = 'WebUI';
        this.Application = {"RegionSettings":{"RegionCode":"US","Distance":"imperial","Speed":"imperial","Today":"2026-05-19T00:00:00","Year":2026,"Month":5,"Day":19},"GroupName":"City","GroupId":"b9015858-988c-48a4-9473-7c193df083e4","Link":"/$B9015858-988C-48A4-9473-7C193DF083E4$/Departments/Planning-and-Zoning-Department/Development-Review-Process","SearchSettings":{"ResultsPage":"/$b9015858-988c-48a4-9473-7c193df083e4$/Content-search","ResultsQuerystring":"?dlv_OC CL City Site Search=(keyword={0})","ResultsStaffFirst":true,"ResultsStaffTitle":"","ResultsContentTitle":""},"LanguageSettings":{"PageLanguage":"en-US","UserLanguage":"en-US","Always":true,"InjectGoogleTranslate":false},"AnalyticsSettings":{"Key":"c3bdb405-a907-444f-94ed-6ced716f3d61"},"LocationSettings":{"Bounds":null,"MapRegion":"US"},"OpenForms":{"Url":"https://au.openforms.com","ScriptPath":"/Scripts/embed-iframe.js"},"ContentTypeName":"OC General","UnsupportedBrowserSettings":{"ShowWarning":true,"BrowserList":{"Trident":"Internet Explorer","MSIE":"Internet Explorer"}},"GeoCoding.CenterPoint.Default":"-37.816359,144.965633"};
        this.Debugging = {"ScriptCombine":false,"TextSnippets":false};
        this.Plugins = {};
        this.ContentListFilters = [];
        this.Visitor = null;
        this.ContentSubscriptionStatus = 'not_available';
        this.AddressPickerVariables = [];
        this.SearchVariables = [];
        this.govDSubscriptionControl='';
    };
} (OpenCities.Settings = OpenCities.Settings || {}, jQuery));
OpenCities.Settings.initialise();
