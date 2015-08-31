function Game() {
    this.currentQueue = [];
    this.currentQueueLength = 0;
    this.currentStep = 0;

    this.gameInProgress = false;
    this.queuePlayback = false;
    this.userInput = false;

    this.won = false;
}

Game.prototype.addRandomStep = function() {
    this.currentQueue.push(Math.floor(Math.random()*4));
    
    this.currentQueueLength = this.currentQueue.length;
};

Game.prototype.resetQueue = function() {
    this.currentQueue = [];
    this.currentQueueLength = 0;
    this.currentStep = 0;
};

Game.prototype.getCurrentStep = function() {
    return this.currentQueue[this.currentStep];
};

Game.prototype.nextStep = function() {
    this.currentStep += 1;
};

Game.prototype.resetStep = function() {
    this.currentStep = 0;
};

Game.prototype.checkStep = function(step) {
    /*if(this.getCurrentStep() == step) {
        if(this.currentStep == 20)
            return GAME_WIN;
        else {
            //this.addRandomStep();
            return STEP_CORRECT;
        }
    }
    else
        return STEP_INCORRECT;*/
    return this.getCurrentStep() == step;
};