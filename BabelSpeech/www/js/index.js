// API KEY = 
var supportedLanguagesAndroid =
{
  'CS':'Czech', 'DA':'Danish','NL':'Dutch',
  'EN':'English','FR':'French',
  'DE':'German','HI':'Hindi','HU':'Hungarian'
  ,'LT':'Lithuanian','SR':'Serbian',
  'ES':'Spanish', 'JP':'Japanese'
    };

var languageCodes = ["cs-CZ", "da-DK", "nl-NL", "en-US", "fr-FR", "de-DE", "hi-IN", "hu-HU", "lt-LT", "sr-RS", "es-ES", "ja-JP"]



for (var key in supportedLanguagesAndroid) {
    if (supportedLanguagesAndroid.hasOwnProperty(key)) {
        $("#fromLanguage").append("<option value=" + key + ">" + supportedLanguagesAndroid[key] + "</option>");
        $("#toLanguage").append("<option value=" + key + ">" + supportedLanguagesAndroid[key] + "</option>");
    }
}

var options = {
    language: "fr-FR", // {String} used language for recognition (default "en-US")
    matches: 1,        // {Number} number of return matches (default 5, on iOS: maximum number of matches)
    prompt: "",        // {String} displayed prompt of listener popup window (default "", Android only)    
    showPopup: false    //  {Boolean} display listener popup window with prompt (default true, Android only)
};

var currentState = 1;


var app = {
    
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {

        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);

        // Check if speech recognition is available on device
        window.plugins.speechRecognition.isRecognitionAvailable(
            this.speechRecognitionSuccessCallback,
            this.speechRecognitionErrorCallback);

        // Add on click to start listening
        $("#startListening").click(this.startListening.bind(this));

        // Add on click to translate button
        $("#translateButton").click(this.translateFromText);

        // Add on click to clear values button
        $("#clearValues").click(this.clearValues);

        $("#pronunce").click(this.textToSpeech);

        $("#switch").click(this.changeCurrentState);
    },

    onOffline: function () {
        console.log("NO INTERNET");
        
        $(".packListen").css("display", "none");
        $(".packWrite").css("display", "none");
        $(".selectPack").css("display", "none");
        $(".translate").css("display", "none"); 

        $(".loader").css("display", "block");
    },

    onOnline: function () {
        console.log("INTERNET");

        $(".selectPack").css("display", "");
        $(".translate").css("display", "");

        $(".loader").css("display", "none");

        if (currentState == 1) {
            $(".packListen").css("display", "");
        }
        else {
            $(".packWrite").css("display", "");
        }
            
            

    },

    speechRecognitionSuccessCallback: function () {
        //$("#isRecognitionAvailable").text("isRecognitionAvailable : YES");
        
    },

    speechRecognitionErrorCallback: function () {
        //$("#isRecognitionAvailable").text("isRecognitionAvailable : NO");
    },

    stopListeningAnimation: function() {
        $('#startListening').removeClass('listen');
        $('#startListening').addClass('loading').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        function () 
        {
            $('#startListening').removeClass('loading');
        });
    },

    setOptions: function() {
        options.language = languageCodes[document.getElementById("fromLanguage").selectedIndex];
        console.log(options.language);
    },

    startListening: function () {

        $('#startListening').addClass('listen');

        this.setOptions();

        window.plugins.speechRecognition.startListening(
            this.startListeningSuccessCallback,
            this.startListeningErrorCallback,
            options);
        $("#listeningStatus").text("Listening status : Recording");
        this.clearValues();
    },

    startListeningSuccessCallback: function (matches) {
        $("#listeningStatus").text("Listening status : Success");

        app.stopListeningAnimation();

        for (match in matches) {
            console.log(matches[match]);
            $("#matches").append("<button class='resultRecord col-md-12 matchButton' value=" + matches[match] + ">" + matches[match] + "</button>");
        }
        $(".matchButton").click(app.onClickedMatchButton);

        setTimeout(app.displayMatches, 2000);
        
    },

    startListeningErrorCallback: function (err) {
        app.stopListeningAnimation();
        $("#listeningStatus").text("listeningStatus : Error");
        console.log(err);
    },

    onClickedMatchButton: function () {

        app.translate($(this).text());

        //Hide matches
        app.hideMatches();

    },

    translateFromText: function () {
        app.translate($("#textToTranslate").val());
    },

    translate: function (text) {
        var url = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyAK4NVqudf3OVwWSmQCHjk6ERC9S0XRF9o";
        url += "&source=" + $("#fromLanguage").val();
        url += "&target=" + $("#toLanguage").val();
        url += "&q=" + escape(text);
        console.log(url);
        $.get(url, function (data, status) {
            console.log(data);
            $("#translation").html(data.data.translations[0].translatedText);
        });
    },

    clearValues: function () {
        $("#matches").html("");
        $("#translation").html("");
        $("#textToTranslate").val("");
    },

    textToSpeech: function () {
        var textToSpeak = $("#translation").html();
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
    },

    changeCurrentState: function () {
        app.clearValues();
        if (currentState == 1) {
            $('.packListen').css('display', 'none');
            $('.packWrite').css('display', 'block');
            currentState = 0;
        }
        else {
            $('.packListen').css('display', 'block');
            $('.packWrite').css('display', 'none');
            currentState = 1;
        }
    },

    displayMatches: function () {
        $(".packListen").css("display", "none");
        $(".packWrite").css("display", "none");
        $(".selectPack").css("display", "none");
        $(".translate").css("display", "none");

        $(".buttonsResult").css("display", "block");
    },

    hideMatches: function () {
        $(".packListen").css("display", "");
        $(".speech-control-container").removeClass("loading");
        $(".selectPack").css("display", "");
        $(".translate").css("display", "");

        $(".buttonsResult").css("display", "none");
    },

    


};

app.initialize();

