// jQuery Wrapper
$(document).ready(function() {

  // Init Firebase
    var config = {
        apiKey: "AIzaSyByTJ-GZCXXrl0254gJMPcTfjK-UxcHebM",
        authDomain: "train-scheduler-8ad9d.firebaseapp.com",
        databaseURL: "https://train-scheduler-8ad9d.firebaseio.com",
        projectId: "train-scheduler-8ad9d",
        storageBucket: "",
        messagingSenderId: "550445077976"
    };
    firebase.initializeApp(config);

    // Declare firebase variable
    var database = firebase.database();
    // When user submits form...
    $('#submit').on('click', function() {
        // Prevent form from submitting
        event.preventDefault();
        // Declare user input values to variables
        var name = $('#name').val().trim();
        var destination = $('#destination').val().trim();
        var firstTrain = $('#time').val().trim();
        var frequency = $('#frequency').val().trim();
        // Calculate time until next train and format
        firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        currentTime = moment();
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        tRemainder = diffTime % frequency;
        minutesTillTrain = frequency - tRemainder;
        nextTrain = moment().add(minutesTillTrain, "minutes");
        nextTrainFormatted = moment(nextTrain).format("hh:mm");

        // Push data into firebase object
        database.ref().push({
            name: name,
            destination: destination,
            frequency: frequency,
            firstTrain: firstTrain,
            frequency: frequency,
            nextTrainFormatted: nextTrainFormatted,
            minutesTillTrain: minutesTillTrain

        })

        // Clear form inputs on HTML
        $('#name').val('');
        $('#destination').val('');
        $('#time').val('');
        $('#frequency').val('');

    });

    // Pull data from firebase when a child is added to database
    database.ref().on('child_added', function(childSnapshot) {
        // Pull each child value
        var childName = childSnapshot.val().name;
        var childDestination = childSnapshot.val().destination;
        var childFrequency = childSnapshot.val().frequency;
        var childNextTrainFormatted = childSnapshot.val().nextTrainFormatted;
        var childMinutesTillTrain = childSnapshot.val().minutesTillTrain;

        // Declare train table selector
        var trainTable = $('#train-data');
        // Append data to html table
        trainTable.append(
            '<tr><td>' + childName + '</td>' +
            '<td>' + childDestination + '</td>' +
            '<td>' + childFrequency + '</td>' +
            '<td>' + childNextTrainFormatted + '</td>' +
            '<td>' + childMinutesTillTrain + '</td>' +
            '</tr>'
        )
    });

    // Clear table when user clecks button
    $('#clear').on('click', function() {
        $('td').remove();

    })

})