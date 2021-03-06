// keep the bundle slim by only requiring the necessary modules
var recognizeMicrophone = require('watson-speech/speech-to-text/recognize-microphone');
var WatsonSpeech = require('watson-speech');

//establishing sockets and connecting client to server(app.js -- speechtotextcode.js)
var socket = io('http://localhost:3000');

//listening for a connect event
socket.on("connect", function () {
  console.log("!CONNECTION ESTABLISHED!")
});

var transcript;
//var token;
socket.on('auth', function(authToken) {
  var token = authToken;
  console.log("success");
//code that starts mic... it is enabled when the #startbtn is clicked and stops when the #Stopbtn is clicked
document.querySelector('#Startbtn').onclick = function() {
  fetch('')
    .then(function(response) {
        return response.text();
    }).then(function () {
      var stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        token: token,
				continuous: true,
        format: true, // optional - performs basic formatting on the results such as capitals an periods
        object_mode: false
      });

      //the variable transcript is defined at the beginning of the "mic starting" code
      transcript = "I am the placeholder for when the mic begins working and there is transcripted material";
      stream.setEncoding('utf8');

      //logs the data from the mic to the console... the content is stored in the data event...
      stream.on('data', function(data) {
        console.log(data);
      });

      //listening for error
      stream.on('error', function(err) {
          console.log(err);
      });

      console.log("Your mic has started recording!")
  document.querySelector('#Stopbtn').onclick = function() {
    console.log("Your mic has stopped recording!");
    //sends mic variable w/ its content to server-side(app.js) so it can be processed and sent to watson conversation...
    socket.emit ('transcript', transcript);

    stream.stop.bind(stream);

    //stops mic
    stream.stop();
  }
  });
};
})
