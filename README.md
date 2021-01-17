# Erstellung der Client-Funktionen

## main.js

```javascript
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
```

## index.html

```html
<!doctype html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Chat-App</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .chat.page {
            display: none;
        }

        .username {
            font-weight: bold;
            margin-right: 5px;
        }
    </style>
</head>

<body>
    <div class="login page">
        <h3 class="title">Username:</h3>
        <input class="usernameInput" type="text" />
    </div>

    <div class="chat page">
        <h3 class="title">Message:</h3>
        <input class="inputMessage" />
        <ul class="messages"></ul>
    </div>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="javascripts/main.js"></script>
</body>

</html>
```
