$(function () {
    var $window = $(window);
    var $usernameInput = $('.usernameInput');
    var $messages = $('.messages');
    var $inputMessage = $('.inputMessage');
    var $loginPage = $('.login.page');
    var $chatPage = $('.chat.page');

    var username;
    var connected = false;

    var $currentInput = $usernameInput.focus();

    var socket = io();

    $window.keydown(function (event) {
        if (event.which === 13) {
            if (username) {
                sendMessage();
            } else {
                setUsername();
            }
        }
    });

    function setUsername() {
        username = $usernameInput.val().trim();

        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();

            $currentInput = $inputMessage.focus();

            socket.emit('add user', username);
        }
    }

    function sendMessage() {
        var message = $inputMessage.val().trim();

        if (message && connected) {
            $inputMessage.val('');

            addChatMessage({ username: username, message: message });

            socket.emit('new message', message);
        }
    }

    function log(message) {
        var $el = $('<li>').addClass('log').text(message);
        $messages.append($el);
    }

    function addChatMessage(data) {
        var $usernameDiv = $('<span class="username"/>').text(data.username);
        var $messageBodyDiv = $('<span class="messageBody">').text(data.message);
        var $messageDiv = $('<li class="message"/>').append($usernameDiv, $messageBodyDiv);
        $messages.append($messageDiv);
    }


    socket.on('login', function (data) {
        connected = true;
        log("You joined");
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    socket.on('user joined', function (data) {
        log(data + ' joined');
    });

    socket.on('user left', function (data) {
        log(data + ' left');
    });
});