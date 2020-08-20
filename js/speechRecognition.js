document.getElementById("recordButton").addEventListener("click", function () {

    let output = document.getElementById("task-description");
    let recordButton = document.getElementById("record");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();

    recognition.onstart = function () {
        recordButton.innerHTML = "speak..";
    };

    recognition.onspeechend = function () {
        recognition.stop();
    };

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        output.innerHTML = transcript;
    };
    recognition.start();
});
