var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var router = express.Router();
var app = express();
var fs = require('file-system');
var Message = require('./models/message');
var responseDB = require('./models/response');
var ErrorDB = require('./models/error');
var client = require("twilio");
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var watson = require('watson-developer-cloud');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm");
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

//DB QUERYING INFORMATION
var collection = db.collection('messages');

var cursor = collection.find();

var express = require('express');

  var ConversationV1 = require('watson-developer-cloud/conversation/v1');

  var contexts = [];
  //console.log("app-1");

  var month;
  var day;
  var year;
  var date;
  var message;
  var number;
  var numberTwo;
  var twilioNumber;
  var messageData;
  var errorData;
  var answer;

app.get('/smssent', function(req, res) {
  var dateTime = require('node-datetime');
  var dt = dateTime.create();
  var date = dt.format('m-d-Y');
  message = req.query.Body;
  number = req.query.From;
  twilioNumber = req.query.To;

    // exports.message = message;
    // exports.number = number;

  var context = null;
  var index = 0;
  var contextIndex = 0;
  contexts.forEach(function(value)
  {
  console.log(value.from);
    if (value.from == number)
    {
      context = value.context;
      contextIndex = index;
    }
    index = index + 1;
  });

  console.log('Recieved message from ' + number + ' saying \'' + message  + '\'');

  var conversation = new ConversationV1({
    username: '77eaca2f-21d9-4921-970a-c61543dd2dd4',
    password: 'L6FTdKjnHqh1',
    version_date: ConversationV1.VERSION_DATE_2016_09_20
  });

    //console.log(JSON.stringify(context));
    //console.log(contexts.length);
  conversation.message({
    input: { text: message },
    workspace_id: '3af8e4c2-930d-4ff5-86c5-28031c9f1e8f',
    context: context
    },
    function(err, response) {
        if (err) {
          console.error(err);
        } else {
          answer = response.output.text[0];
          if (context == null) {
            contexts.push({'from': number, 'context': response.context});
          } else {
            contexts[contextIndex].context = response.context;
          }

          var intent = response.intents[0].intent;
          console.log(intent);
          if (intent == "thanks") {
             //contexts.splice(contexts.indexOf({'from': number, 'context': response.context}),1);
            contexts.splice(contextIndex,1);
             // Call REST API here (order pizza, etc.)
          }

          var client = require('twilio')(
            'ACd10b0a1297a7e73e7d7c633214f7fc95',
            '28a647a13b3d5524e1fa2caff79c7f7b'
          );

          client.messages.create({
            from: twilioNumber,
            to: number,
            body: response.output.text[0]
          }, function(err, message) {
            if(err) {
              console.error(err.message);
            }
          });
        }
        console.log(answer);
        console.log("Today is " + date);
        smsPost();
        //  smsPrint();
  });


    // call function to write to DB
  function smsPost(req, res, next) {
      if (date &&
        number &&
        message &&
        answer
      ) {
            // create object with form input
          messageData = {
            date: date,
            number: number,
            message: message,
            answer: answer
          };
            // use schema's `create` method to insert document into Mongo
          Message.create(messageData, function (error, message) {

          });

        } else {

//message to client

          var err = new Error('All fields required.');
          err.status = 400;
          contexts.splice(contextIndex,1);
          // Twilio Credentials
          var accountSid = 'ACd10b0a1297a7e73e7d7c633214f7fc95';
          var authToken = '28a647a13b3d5524e1fa2caff79c7f7b';

            //require the Twilio module and create a REST client
          var client = require('twilio')(accountSid, authToken);
          client.messages.create({
            to: number,
            from: "+14695073885",
            body: 'SORRY, YOUR MESSAGE MAY HAVE HAD A TYPO OR OUR BOT MAY NOT HAVE BEEN ABLE TO UNDERSTAND YOUR QUESTION/ANSWER. WE HAVE NOTIFIED ONE OF OUR HR REPS TO ASSIST YOU.',
          }, function(err, messageErr) {
                console.log(messageErr.sid);

                //message to HR rep


                 var error = message;
                 var autoMessage = "There has been an error at " + number + " ,please go check to see if anything has been resolved. This is the message that caused the error, " + message;
                             // Twilio Credentials
                 var accountSid = 'ACd10b0a1297a7e73e7d7c633214f7fc95';
                 var authToken = '28a647a13b3d5524e1fa2caff79c7f7b';

                             //require the Twilio module and create a REST client
                 var client = require('twilio')(accountSid, authToken);
                 client.messages.create({
                     to: "+19728779406",
                     from: "+14695073885",
                     body: autoMessage,
                 }, function(err, messageErr) {
                     console.log(messageErr.sid);

// Datebase code for the ----Schema Error-------


                errorDBPost();
                // call function to write to ErrorDB
                function errorDBPost(req, res, next) {
                    if (date &&
                      number &&
                      error &&
                      autoMessage
                    ) {
                        // create object with form input
                        errorData = {
                          date: date,
                          number: number,
                          error: message,
                          autoMessage: autoMessage
                        };
                        // use schema's `create` method to insert document into Mongo
                        ErrorDB.create(errorData, function (err, errordb) {

                        });
                      };
              };
            return err;
          });
        });
      };
    };
  });

  // HR rep response to client

  var responseNumber;
  console.log(responseNumber);
    app.get('/smshelp', function(req, res) {
      var dateTime = require('node-datetime');
      var dt = dateTime.create();
      var date = dt.format('m-d-Y');
      var smshelpTo = req.query.To;
      var smshelpNumber = req.query.From;
      var smshelpMessage = req.query.Body;

      if(smshelpNumber === "+19729714143") {
        var smsFrom = "+19728779406";
      }else{
        var smsFrom = "+19729714143";
      }

      console.log("this is the smshelpNumber" + smshelpNumber);
      console.log("this is the smshelpTo" + smshelpTo);
      console.log("this is the smshelpMessage" + smshelpMessage);

      var accountSid = 'ACd10b0a1297a7e73e7d7c633214f7fc95';
      var authToken = '28a647a13b3d5524e1fa2caff79c7f7b';

      //require the Twilio module and create a REST client
      var client = require('twilio')(accountSid, authToken);
      client.messages.create({
        to: smsFrom,
        from: smshelpTo,
        body: smshelpMessage,

      }, function(err, messageErr) {

  //timer code for no response


                   var time;
                    function countdown(element, minutes, seconds) {
                        // set time for the particular countdown
                        seconds = 10;
                        time = minutes*60 + seconds;
                        var interval = setInterval(function() {
                          noResponse();
                            // if the time is 0 then end the counter
                            if (time < 0) {
                              return;
                            };
                            time--;
                            console.log(time);
                            return;
                        }, 1000);
                      }
                      if(smshelpNumber === "+19729714143") {
                        countdown('clock', 0, 5);
                      }


  //message letting user know no one is currently able to answer the question
                    if(time === 5) {
                      noResponse();
                    }
                    responseNumber = req.query.From;
                    console.log("this is the response number" + req.query.From);
                    var miaMessage;
                //This is the function that is in the setInterval function above
                    function noResponse() {
                      if (time === 0 && responseNumber != "+19728779406") {
                        // Twilio Credentials
                         var accountSid = 'ACd10b0a1297a7e73e7d7c633214f7fc95';
                         var authToken = '28a647a13b3d5524e1fa2caff79c7f7b';
                         console.log("Hello I am the function please")
                         miaMessage = 'Sorry the HR rep is busy at the moment. We will try to get back to you very soon!';
                         miaMessage;
                         //require the Twilio module and create a REST client
                         var client = require('twilio')(accountSid, authToken);
                         client.messages.create({
                           to: smshelpNumber, //get another number
                           from: "+14695073885",
                           body: miaMessage,
                         }, function(err, messageErr) {
                      });
                    };
                    if(time === 0) {
                      HRresponse();
                    };
                      function HRresponse(req, res, next) {
                              // create object with form input
                              responseData = {
                                date: date,
                                number: smshelpNumber,
                                message: smshelpMessage,
                                miaMessage: miaMessage
                              };

                              // use schema's `create` method to insert document into Mongo
                              responseDB.create(responseData, function (err, responsedb) {

                              });
                            };
                      }
                    });
                  });


  //Watson text to speech api

  var input;
  app.get("/speech", function(req, res, next) {
    input = req.query.speech;
    const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
    if(input) {
      var intentValNumber = input.length;
    }

    //console.log(intentValNumber);
      if (intentValNumber > 0) {
        const text_to_speech = new TextToSpeechV1({
            url: "https://stream.watsonplatform.net/text-to-speech/api",
            username: '4f72e61f-65f6-4da3-9346-06c407d1f8dc',
            password: '68G6KkXiXHKP',
            version_date: TextToSpeechV1.VERSION_DATE_2017_04_26
          });
          var params = {
            text: input,
            voice: 'en-US_MichaelVoice',
            accept: 'audio/ogg;codecs'
          };
          //console.log(input);
      // Pipe the synthesized text to a file.
        var transcript = text_to_speech.synthesize(params).on('error', function(error) {
          console.log('Error:', error);
        }).pipe(fs.createWriteStream('public/output.ogg'));
      };
    next();
  });

  // var random;
  var audioData;
  io.sockets.on('connection', function(socket) {
    console.log("you have established a connection with sockets");

    var authorization = new watson.AuthorizationV1({
       username: '630b3e9b-cd12-4c2d-96fb-5965627118a3',
       password: 'l6jlKC5DYxpc',
       url: watson.SpeechToTextV1.URL
     });

     authorization.getToken(function (err, token) {
       if (!token) {
         console.log('error:', err);
       } else {
         var authToken = token;
         socket.emit('auth', authToken);
       }
     });

    console.log("-----------------")

    socket.on('transcript', function(data) {
      audioData = data;
      console.log(data);
      speechToSpeechFunc();
    });

    socket.on('disconnect', function() {
      console.log("socket has been disconnected");
    })

    socket.on('error', function(err) {
      console.log('something has happened to your socket, ' + err);
    })
  })


 //developing the response and outputs answer via mic...
 function speechToSpeechFunc() {
   const os = require('os');
   const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

//generates the ip for the conversation to be remembered and not restart...
   var interfaces = os.networkInterfaces();
   var addresses = [];
   for (var k in interfaces) {
       for (var k2 in interfaces[k]) {
           var address = interfaces[k][k2];
           if (address.family === 'IPv4' && !address.internal) {
               addresses.push(address.address);
           }
       }
   }
   var internetProtocol = addresses;
   console.log(internetProtocol);

   //text to speech portion
       const text_to_speech = new TextToSpeechV1({
           url: "https://stream.watsonplatform.net/text-to-speech/api",
           username: '4f72e61f-65f6-4da3-9346-06c407d1f8dc',
           password: '68G6KkXiXHKP',
           version_date: TextToSpeechV1.VERSION_DATE_2017_04_26
         });

   var answer;
   var transcript = audioData;
   //watson conversation portion... develops the response...
   var context = null;
   var index = 0;
   var contextIndex = 0;
   contexts.forEach(function(value)
   {
   console.log(value.from);
     if (value.from == internetProtocol)
     {
       context = value.context;
       contextIndex = index;
     }
     index = index + 1;
   });

   console.log('Recieved message from ' + internetProtocol + ' saying \'' + transcript  + '\'');

   var conversation = new ConversationV1({
     username: '77eaca2f-21d9-4921-970a-c61543dd2dd4',
     password: 'L6FTdKjnHqh1',
     version_date: ConversationV1.VERSION_DATE_2016_09_20
   });

   conversation.message({
     input: { text: transcript },
     workspace_id: 'ce136919-2836-4e9e-95a8-9aa013967e3f',
     context: context
     },
     function(err, response) {
         if (err) {
           console.error(err);
         } else {
           answer = response.output.text[0];
           if (context == null) {
             contexts.push({'from': number, 'context': response.context});
           } else {
             contexts[contextIndex].context = response.context;
           }

           var intent = response.intents[0].intent;
           console.log(intent);

           var time;
            function countdown(element, minutes, seconds) {
                // set time for the particular countdown
                seconds = 1;
                time = minutes*60 + seconds;
                var interval = setInterval(function() {
                    // if the time is 0 then end the counter
                    if (time === 0) {
                      return;
                    };
                    time--;
                    if(time === 0) {
                      io.emit("reloadTwo");
                      console.log('I HAVE BEEEEN CALLLEEDD!!');
                    };
                    return;
                }, 1000);
              }countdown('clock', 0, 5);


             var params = {
               text: answer,
               voice: 'en-US_MichaelVoice',
               accept: 'audio/ogg;codecs'
             };

         // Pipe the synthesized text to a file.
           var transcript = text_to_speech.synthesize(params).on('error', function(error) {
             console.log('Error:', error);
           }).pipe(fs.createWriteStream('public/outputspeechtospeech.ogg'));

           if (intent == "closing") {
             fs.createWriteStream('public/outputspeechtospeech.ogg');
             console.log('this was the closing')
           }
       };
     });
   };

// use sessions for tracking logins
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(3000, function() {
  console.log("Your HTTP server is listening on port 3000!");
});
