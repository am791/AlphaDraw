var socket = io();
var user;
var obj = {};
var rectToggle=0;
var rectTemp=0;
var circToggle=0;
var circTemp=0;
var triToggle=0;
var triTemp=0;
var dummyObj=[];

// function to toggle the onClick listener
function rectToggleValue() {
    rectToggle =1;
}
function circToggleValue() {
    circToggle =1;
}
function triToggleValue() {
    triToggle =1;
}

// function to set a username of a user
function usernameAsk() {
    $('.grey-out').fadeIn(500);
    $('.user').fadeIn(500);
    $('.user').submit(function(){
        event.preventDefault();
        user = $('#username').val().trim();

        if (user == '') {
            return false
        };

        var index = users.indexOf(user);

        if (index > -1) {
            alert(user + ' already exists');
            return false
        };
        
        socket.emit('join', user);

        $('.grey-out').fadeOut(300);
        $('.user').fadeOut(300);
        $('input.guess-input').focus();
         var html_1 = user;
        $('.playerName').html(html_1);
    });
};


var context;
var canvas;
var click = false;

// function to clear the canvas
var clearScreen = function() {
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
};

// function for the functionalities of the guesser
var guesser = function() {
    clearScreen();
    click = false;
    console.log('draw status: ' + click);
    $('.draw').hide();
    $('#guesses').empty();
    console.log('You are a guesser');
    $('#guessess').show();
    $('#guess').show();
    $('.guess-input').focus();

    $('#guess').on('submit', function() {
        event.preventDefault();
        var guess = $('.guess-input').val();

        if (guess == '') {
            return false
        };

        console.log(user + "'s guess: " + guess);
        socket.emit('guessword', {username: user, guessword: guess});
        $('.guess-input').val('');
    });
};

var guess_list=[];
var guesser_list=[];
var guessword = function(data){

    guess_list.push(data.guessword);
    guesser_list.push(data.username);
    var html_1 = '<h2 style="background-color: #D7C1E7; margin-left: 10px; margin-right: 10px">' + '<b>'+ 'Guesses!' + '</b>'+'</h2>';
        for (var i = 0; i < guess_list.length; i++) {
            html_1 += '<p>' + '<b>'+ guesser_list[i]+ " says: "+ '</b>' + guess_list[i] + '</p>';
        };
    $('#guesses').html(html_1);

    if (click == true && data.guessword == $('span.word').text() ) {
        console.log('guesser: ' + data.username + ' draw-word: ' + $('span.word').text());
        socket.emit('correct answer', {username: data.username, guessword: data.guessword});
        socket.emit('swap rooms', {from: user, to: data.username});
        click = false;
    }
};

var L;

// function for providing guess word to the drawer
var drawWord = function(word) {
    $('span.word').text(word);
    console.log('Your word to draw is: ' + word);
};

var users = [];

// function for the players list
var userlist = function(names) {
    users = names;
    var html = '<h2 class="chatbox-header" style="background-color: #D7C1E7; margin-left: 10px; margin-right: 10px">' + '<b style="margin-left: 80px">' + 'Players' + '</b>' + '</h2>';
    for (var i = 0; i < names.length; i++) {
        html += '<center>' + '<h3>' + '<b>' + names[i] + '</b>' + '</h3>' + '</center>';
    };
    $('ul').html(html);
};

// function for a new drawer
var newDrawer = function() {
    socket.emit('new drawer', user);
    clearScreen();
    $('#guesses').empty();
    $('.draw').show();
};
// function to declare  correct winner
var correctAnswer = function(data) {
    alert(data.username + ' Guessed Correctly!\n'+ 'Winner!');
    $('#guesses').html('<p>' + data.username + ' guessed correctly!' + '</p>');

    guess_list.length=0;
    guesser_list.length=0;
};

// function to reset
var reset = function(name) {
    clearScreen();
    $('#guesses').empty();
    console.log('New drawer: ' + name);
    $('#guesses').html('<p>' + name + ' is the new drawer' + '</p>');
};

// function for drawing on canvas
var draw = function(obj) {
    if(obj.color === '#FFFFFF'){
        dummyObj=obj.color;
        context.fillStyle = obj.color;
    context.beginPath();
    context.arc(obj.position.x, obj.position.y,
                     obj.slider, 0, 2 * Math.PI);
    context.fill();
    }

    
    if (obj.id == "fill") {
           // socket.emit('screen', user);
           dummyObj=obj.color;
            context.fillStyle = obj.color;
            context.fillRect(0, 0, 900, 2000);
        
    }
 
   
    if(rectToggle){
        context.beginPath();
        /*obj.color=dummyObj;*/
        context.strokeStyle=dummyObj;
         context.rect(obj.position.x, obj.position.y, 150, 100);
         
         context.stroke();
         rectToggle =0;
         rectTemp=1;
         
    }

    if(circToggle){
        context.beginPath();
        /*obj.color=dummyObj;*/
        context.strokeStyle=dummyObj;
         context.arc(obj.position.x, obj.position.y,
                     50, 0, 2 * Math.PI);
         /*context.fill();*/
         context.stroke();
         circToggle =0;
         circTemp=1;
         
    }

    if(triToggle){
        
        context.strokeStyle=dummyObj;
        context.beginPath();
        context.moveTo(obj.position.x, obj.position.y);
        context.lineTo(obj.position.x, obj.position.y+100);
        context.lineTo(obj.position.x+100, obj.position.y+100);
        
        context.closePath();
        
         
         context.stroke();
         triToggle =0;
         triTemp=1;
         
    }

    else{
        if(rectTemp==1 || circTemp==1 || triTemp==1){
        setTimeout(function() {
            
        rectTemp=0;
        circTemp=0;
        triTemp=0;
        }, 1000);
    }
    else {
        dummyObj=obj.color;
        context.beginPath();
        context.fillStyle = obj.color;
    context.arc(obj.position.x, obj.position.y,
                     obj.slider, 0, 2 * Math.PI);
    context.fill();
    }
        
    }
    
    
    
};

// listener function
var pictionary = function() {
    clearScreen();
    click = true;
    console.log('draw status: ' + click);
    $('#guess').hide();
    $('#guesses').empty();
    $('.draw').show();

    var drawing;
    var color;
    obj = {};
    var slider;
    //id=[];

    $('.draw-buttons').on('click', 'span', function(){
        obj.color = $(this).attr('value');
        obj.id = $(this).attr('id')
        console.log(obj.color);


        if (obj.color === '0') {
            socket.emit('clear screen', user);
            context.fillStyle = 'white';
        
        }
        slider = document.getElementById("myRange");

        obj.slider = slider.value;

    });

    console.log('You are the drawer');

    $('.users').on('dblclick', 'li', function() {
        if (click == true) {
            var target = $(this).text();
            socket.emit('swap rooms', {from: user, to: target});
        };
    });

    canvas.on('mousedown', function(event) { 
        drawing = true;   
    });
    canvas.on('mouseup', function(event) {
        drawing = false;
    });
    canvas.on('mouseclick', function(event) {
        drawing = true;
        var offset = canvas.offset();
        obj.position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        
        if (drawing == true && click == true) {
            draw(obj);
            socket.emit('draw', obj);
        };
    });

    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        obj.position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        
        if (drawing == true && click == true) {
            draw(obj);
            socket.emit('draw', obj);
        };
    });

};

// initialising the socket function
$(document).ready(function() {

    canvas = $('#canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;

    usernameAsk();

    socket.on('userlist', userlist);
    socket.on('guesser', guesser);
    socket.on('guessword', guessword);
    socket.on('draw', draw);
    socket.on('draw word', drawWord);
    socket.on('drawer', pictionary);
    socket.on('new drawer', newDrawer);
    socket.on('correct answer', correctAnswer);
    socket.on('reset', reset);
    socket.on('clear screen', clearScreen);

});