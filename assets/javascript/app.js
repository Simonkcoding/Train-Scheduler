// Initialize Firebase
var config = {
    apiKey: "AIzaSyD15Mr-ngstQ_Nxk7nEATc1mWMDS4ChSJU",
    authDomain: "assignment-sandbox.firebaseapp.com",
    databaseURL: "https://assignment-sandbox.firebaseio.com",
    projectId: "assignment-sandbox",
    storageBucket: "assignment-sandbox.appspot.com",
    messagingSenderId: "758586243376"
};

firebase.initializeApp(config);

var database = firebase.database();
//create a child "trainsInfo" to store object 
var trainsInfo = database.ref("/trainsInfo");

// get current time for new arrival time calculation, 
//current hours and mins for minutes to wait
var currentTime = moment().format("HH:mm")
var currentHours = moment().format('HH')
var currentMins = moment().format('mm')

//for each child in the object on firebase
trainsInfo.on("child_added", function (snapankle) {

    var svTrain = snapankle.val().train;
    var svDestin = snapankle.val().destination;
    var svFirstTime = snapankle.val().firstTrainTime;
    var svFreq = snapankle.val().frequency;

    //unify format
    var svHours = moment(svFirstTime, "HH:mm").format('HH')
    var svMins = moment(svFirstTime, "HH:mm").format('mm')
    var svTimeConverted = moment(svFirstTime, "HH:mm").format("hh:mm A")

    //calculate minutes to wait
    var hourDiff = svHours - currentHours
    var minsDiff = svMins - currentMins
    var timeDiff = hourDiff * 60 + minsDiff

    // if minutes to wait is negative, it means first train arrived, calculate new time
    if (timeDiff < 0) {
        timeDiff = (-1 * timeDiff) % svFreq
        console.log(timeDiff)
        var newTime = moment().add(timeDiff, 'minutes').format("hh:mm A");
        console.log('the new time is: ' + newTime)

        svFirstTime = newTime;
    } else {
        svFirstTime = svTimeConverted
    }

    //append new table row to table body
    var tableRow = $('<tr>');
    tableRow.append('<td>' + svTrain + '</td>');
    tableRow.append('<td>' + svDestin + '</td>');
    tableRow.append('<td>' + svFreq + '</td>');
    tableRow.append('<td>' + svFirstTime + '</td>');
    tableRow.append('<td>' + timeDiff + '</td>');
    $('tbody').append(tableRow)
})

//submit button to add data on firebase
$(".submit").on('click', function (event) {

    event.preventDefault();

    var train = $('#trainName-text').val().trim();
    var destin = $("#destination-text").val().trim();
    var firstTime = $("#firstTrainTime").val().trim();
    var freq = parseInt($("#frequency").val().trim());

    var trainObject = {
        train: train,
        destination: destin,
        firstTrainTime: firstTime,
        frequency: freq

    }

    trainsInfo.push(trainObject);

    //Reset the world
    $('#trainName-text').val('');
    $('#destination-text').val('');
    $('#firstTrainTime').val('');
    $('#frequency').val('');
    
});