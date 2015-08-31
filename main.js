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
        }),
        new Howl({
            urls: ['assets/sounds/winSound.mp3']
        })
    ];

    var QUEUE_PLAYBACK_DELAY = 1500,    // delay after which queue starts playing
        BUTTON_PLAYBACK_DELAY = [       // delay between buttons with ranking (1-4, 5-8, 9-12, 13-20)
            500,
            400,
            300,
            200
        ],
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
        var buttonTimeoutPromises = [null, null, null, null],
            playbackPromises = [];

        $scope.buttonPress = function(buttonID) {
            if(!$scope.game.gameInProgress || !$scope.game.userInput)
                return;

            var correct = $scope.game.checkStep(buttonID);
            if(correct) {
                playButton(buttonID, $scope.game.currentStep);

                if($scope.game.currentStep+1 == $scope.game.currentQueueLength) {
                    if($scope.game.currentQueueLength == GAME_WIN_CONDITION) {
                        // win
                        /*for(var i=0; i < 4; ++i) {
                            if(i != buttonID)
                                playButton(i, 0);
                        }*/
                        $scope.game.gameInProgress = false;
                        $scope.game.won = true;
                        setTimeout(function() {
                            sounds[5].play();
                        }, getButtonPlaybackDelay(GAME_WIN_CONDITION));

                    }
                    else {
                        $scope.game.addRandomStep();
                        $scope.game.resetStep();
                        updateCurrentStreak();

                        playbackQueue();
                    }
                }
                else {
                    $scope.game.nextStep();
                }
            }
            else {
                playButton(buttonID, $scope.game.currentStep, true);  // play it muted (only highlight)
                sounds[4].play(); // play an error sound

                if($scope.strictMode) {
                    $scope.game = new Game();

                    $timeout(updateCurrentStreak, 1000);
                }
                else {
                    /*$scope.game.userInput = false;
                    $timeout(playbackQueue, 500);*/
                    $scope.game.resetStep();
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
                cancelPlaybackPromises();
            }
        };

        function playButton(buttonID, currentStep, muted) {
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
            }, getButtonPlaybackDelay(currentStep));
        }


        function playbackQueue() {
            $scope.game.userInput = false;
            $scope.game.queuePlayback = true;
            //$scope.game.resetStep();
            playbackPromises = [];

            var currentStep = 0,
                buttonDelay = getButtonPlaybackDelay($scope.game.currentQueueLength);

            $scope.game.currentQueue.forEach(function(button) {
                playbackPromises.push(
                    $timeout(function() {
                        playButton(button, currentStep);
                    }, QUEUE_PLAYBACK_DELAY+currentStep*buttonDelay)
                );

                ++currentStep;
            });
            $timeout(function() {
                $scope.game.userInput = true;
                $scope.game.queuePlayback = false;
            }, QUEUE_PLAYBACK_DELAY+currentStep*buttonDelay);
        }

        function cancelPlaybackPromises() {
            playbackPromises.forEach(function(promise) {
                $timeout.cancel(promise);
            });
        }


        function updateCurrentStreak() {
            $scope.currentStreak = $scope.game.currentQueueLength;
        }

        function getButtonPlaybackDelay(currentStep) {
            if(currentStep < 5)
                return BUTTON_PLAYBACK_DELAY[0];
            else if(currentStep < 9)
                return BUTTON_PLAYBACK_DELAY[1];
            else if(currentStep < 13)
                return BUTTON_PLAYBACK_DELAY[2];
            else
                return BUTTON_PLAYBACK_DELAY[3];
        }
    }]);
})();