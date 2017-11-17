// API KEY = 
var supportedLanguagesAndroid =
    ["af-ZA", "id-ID", "ms-MY", "ca-ES", "cs-CZ", "da-DK", "de-DE", "en-AU", "en-CA",
        "en-001", "en-IN", "en-IE", "en-NZ", "en-PH", "en-ZA", "en-GB", "en-US", "es-AR",
        "es-BO", "es-CL", "es-CO", "es-CR", "es-EC", "es-US", "es-SV", "es-ES", "es-GT",
        "es-HN", "es-MX", "es-NI", "es-PA", "es-PY", "es-PE", "es-PR", "es-DO", "es-UY",
        "es-VE", "eu-ES", "fil-PH", "fr-FR", "gl-ES", "hr-HR", "zu-ZA", "is-IS", "it-IT",
        "lt-LT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "sl-SI",
        "sk-SK", "fi-FI", "sv-SE", "vi-VN", "tr-TR", "el-GR", "bg-BG", "ru-RU", "sr-RS",
        "uk-UA", "he-IL", "ar-IL", "ar-JO", "ar-AE", "ar-BH", "ar-DZ", "ar-SA", "ar-KW",
        "ar-MA", "ar-TN", "ar-OM", "ar-PS", "ar-QA", "ar-LB", "ar-EG", "fa-IR", "hi-IN",
        "th-TH", "ko-KR", "cmn-Hans-CN", "cmn-Hans-HK", "cmn-Hant-TW", "yue-Hant-HK",
        "ja-JP"];


var options = {
    language: "fr-FR", // {String} used language for recognition (default "en-US")
    matches: 1,        // {Number} number of return matches (default 5, on iOS: maximum number of matches)
    prompt: "It's ok",        // {String} displayed prompt of listener popup window (default "", Android only)    
    showPopup: false    //  {Boolean} display listener popup window with prompt (default true, Android only)
};


var app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {

        // Check if speech recognition is available on device
        window.plugins.speechRecognition.isRecognitionAvailable(
            this.speechRecognitionSuccessCallback,
            this.speechRecognitionErrorCallback);

        // Add on click to start listening
        $("#startListening").click(this.startListening.bind(this));

        // Add on click to translate button
        $("#translate").click(this.translate);

        // Add on click to clear values button
        $("#clearValues").click(this.clearValues);

        $("#pronunce").click(this.textToSpeech);
    },

    speechRecognitionSuccessCallback: function () {
        //$("#isRecognitionAvailable").text("isRecognitionAvailable : YES");
        
    },

    speechRecognitionErrorCallback: function () {
        //$("#isRecognitionAvailable").text("isRecognitionAvailable : NO");
    },

    startListening: function () {
        window.plugins.speechRecognition.startListening(
            this.startListeningSuccessCallback,
            this.startListeningErrorCallback,
            options);
        $("#listeningStatus").text("Listening status : Recording");
        this.clearValues();
    },

    startListeningSuccessCallback: function (matches) {
        $("#listeningStatus").text("Listening status : Success");
        for (match in matches) {
            $("#matches").append("<button class='matchButton' value=" + matches[match] + ">" + matches[match] + "</button>");
        }
        $(".matchButton").click(app.onClickedMatchButton);
        
    },

    startListeningErrorCallback: function (err) {
        $("#listeningStatus").text("listeningStatus : Error");
        console.log(err);
    },

    onClickedMatchButton: function () {
        $("#clickedMatch").html("Clicked : " + $(this).text());
        $("#clickedMatch").val($(this).text());
    },

    translate: function () {
        var url = "https://translation.googleapis.com/language/translate/v2?key=API_KEY";
        url += "&source=" + $("#fromLanguage").val();
        url += "&target=" + $("#toLanguage").val();
        url += "&q=" + escape($("#clickedMatch").val());
        console.log(url);
        $.get(url, function (data, status) {
            console.log(data);
            $("#translation").val(data.data.translations[0].translatedText);
        });
    },

    clearValues: function () {
        $("#matches").html("");
        $("#clickedMatch").html("");
        $("#translation").val("");
    },

    textToSpeech: function () {
        var textToSpeak = $("#translation").val();
        console.log(textToSpeak);
        TTS
            .speak({
                text: textToSpeak,
                locale: 'en-EN',
                rate: 0.75
            }, function () {
                console.log('success');
            }, function (reason) {
                console.log(reason);
            });
    
    }

    


  
};

app.initialize();