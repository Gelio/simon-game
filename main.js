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
        })
    ];

    var simonGame = angular.module("simonGame", ['angularRipple']);

    simonGame.controller("MainCtrl", ["$scope", "$timeout", function($scope, $timeout) {
        /*
            0 - red
            1 - yellow
            2 - green
            3 - blue
        */

        $scope.buttonActive = [false, false, false, false];
        var buttonTimeoutPromises = [null, null, null, null];

        $scope.buttonPress = function(buttonID) {


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
    }]);
})();