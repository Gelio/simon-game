(function() {
    var sounds = [
        new Howl({
            urls: ['assets/sounds/simonSound1.mp3']
        }),
        new Howl({
            urls: ['assets/sounds/simonSound2.mp3']
        }),
        new Howl({
            urls: ['assets/sounds/simonSound3.mp3']
        }),
        new Howl({
            urls: ['assets/sounds/simonSound4.mp3']
        }),
        new Howl({
            urls: ['assets/sounds/errorSound.mp3']
        })
    ];

    var QUEUE_PLAYBACK_DELAY = 1500,    // delay after which queue starts playing
        BUTTON_PLAYBACK_DELAY = 200,    // delay between buttons
        GAME_WIN_CONDITION = 20;        // number of steps to win the game

    var simonGame = angular.module("simonGame", ['angularRipple']);

    simonGame.controller("MainCtrl", ["$scope", "$timeout", function($scope, $timeout) {
        /*
            0 - red
            1 - yellow
            2 - green
            3 - blue

            for sounds #4 is an error sound
        */

        $scope.game = new Game();

        $scope.strictMode = false;
        $scope.currentStreak = 0;

        $scope.buttonActive = [false, false, false, false];
        var buttonTimeoutPromises = [null, null, null, null];

        $scope.buttonPress = function(buttonID) {
            if(!$scope.game.gameInProgress || !$scope.game.userInput)
                return;

            var correct = $scope.game.checkStep(buttonID);
            if(correct) {
                playButton(buttonID);
                if($scope.game.currentStep == GAME_WIN_CONDITION) {
                    // win
                    // TODO: it!
                }
                else {

                }
            }
            else {
                playButton(buttonID, true);  // play it muted (only highlight)
                sounds[4].play(); // play an error sound

                if($scope.strictMode) {
                    $scope.game = new Game();

                    $timeout(updateCurrentStreak, 1000);
                }
                else {
                    /*$scope.game.userInput = false;
                    $timeout(playbackQueue, 500);*/
                    playbackQueue();
                }
            }


        };

        $scope.controlButtonPress = function() {
            if(!$scope.game.gameInProgress) {
                $scope.game = new Game();
                $scope.game.gameInProgress = true;

                $scope.game.addRandomStep();
                updateCurrentStreak();

                playbackQueue();
            }
            else {
                // Reset
                $scope.game = new Game();
            }
        };

        function playButton(buttonID, muted) {
            // UI play buttons
            if(muted !== true)
                sounds[buttonID].play();

            // Highlighting buttons
            $scope.buttonActive[buttonID] = true;
            if(buttonTimeoutPromises[buttonID] !== null)
                $timeout.cancel(buttonTimeoutPromises[buttonID]);


            buttonTimeoutPromises[buttonID] = $timeout(function() {
                $scope.buttonActive[buttonID] = false;
                buttonTimeoutPromises[buttonID] = null;
            }, 500);
        }


        function playbackQueue() {
            $scope.game.userInput = false;
            $scope.game.queuePlayback = true;

            var currentButtonNumber = 0;
            $scope.game.currentQueue.forEach(function(button) {
                $timeout(function() {
                    playButton(button);
                }, QUEUE_PLAYBACK_DELAY+currentButtonNumber*BUTTON_PLAYBACK_DELAY);

                ++currentButtonNumber;
            });
            $timeout(function() {
                $scope.game.userInput = true;
                $scope.game.queuePlayback = false;
            }, QUEUE_PLAYBACK_DELAY+currentButtonNumber*BUTTON_PLAYBACK_DELAY);
        }


        function updateCurrentStreak() {
            $scope.currentStreak = $scope.game.currentQueueLength;
        }
    }]);
})();