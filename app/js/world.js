var World = (function() {
    'use strict';

    function World() {
        this.physics = Physics();
    }

    World.prototype.isFinal = function() {
        return false;
    }

    return World;
})();
