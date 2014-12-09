var World = (function() {
    'use strict';

    function World(width, height) {
        this.physics = Physics();
        this.width = width;
        this.height = height;
        this.behaviors = {};
        this.bodies = {};
        this.squares = [];
        this.delta = 0;
        this.speed = 50;

        this.addRenderer();
        this.addBehaviors();
    }

    World.prototype.addRenderer = function() {
        this.renderer = Physics.renderer('canvas', {
            id: 'maze',
            width: this.width,
            height: this.height,
            styles: {
                circle: {
                    strokeStyle: '#351024',
                    lineWidth: 1,
                    fillStyle: '#b58900',
                    angleIndicator: '#351024'
                }
            },
            offset: {
                x: 0,
                y: 350
            }
        });
        this.physics.add(this.renderer);
        this.physics.on('step', this.physics.render.bind(this.physics));
    }

    World.prototype.addCircle = function(options) {
        var circle = Physics.body('circle', _.extend(options));

        this.bodies.circle = circle;
        this.physics.add(this.bodies.circle);
        return circle;
    }

    World.prototype.addSquare = function(options) {
        var square = this.squares.pop();

        if (!square) {
            square = Physics.body('rectangle', _.extend(options, {
                treatment: 'static',
                restitution: 0
            }));
        }
        else {
            square.state.pos.set(options.x, options.y);
        }
        this.bodies.squares = this.bodies.squares || [];
        this.bodies.squares.push(square);
        this.physics.add(square);
        return square;
    }

    World.prototype.removeSquare = function(square) {
        this.physics.remove(square);
    }

    World.prototype.addBehaviors = function() {
        this.detectEdgeCollisions();
        this.impulseBodyResponse();
        this.detectBodyCollisions();
        this.gravity();
    }

    World.prototype.detectEdgeCollisions = function() {
        this.bounds = Physics.aabb(0, 0, this.width, this.height);
        this.behaviors.edgeCollisionDetection = Physics.behavior('edge-collision-detection', {
            aabb: this.bounds,
            restitution: 0,
            cof: 0
        });
        this.physics.add(this.behaviors.edgeCollisionDetection);
    }

    World.prototype.detectBodyCollisions = function() {
        this.behaviors.bodyCollisionDetection = Physics.behavior('body-collision-detection');
        this.behaviors.sweepPrune = Physics.behavior('sweep-prune');
        this.physics.add(this.behaviors.bodyCollisionDetection);
        this.physics.add(this.behaviors.sweepPrune);

    }

    World.prototype.impulseBodyResponse = function() {
        this.behaviors.bodyImpulseResponse = Physics.behavior('body-impulse-response');
        this.physics.add(this.behaviors.bodyImpulseResponse);
    }

    World.prototype.gravity = function() {
        this.behaviors.constantAcceleration = Physics.behavior('constant-acceleration');
        this.physics.add(this.behaviors.constantAcceleration);
    }

    World.prototype.onTick = function(time, dt) {
        this.physics.step(time);
    }

    World.prototype.start = function(options) {
        this.addCircle(options.circle);
        this.ticker = Physics.util.ticker;
        this.ticker.on(this.onTick.bind(this));
        this.ticker.on(options.onTick);
        this.ticker.start();
    }

    World.prototype.startCamera = function(onStep) {
        this.physics.on('step', this.moveCamera.bind(this, onStep));
        this.renderer._layers.main.options.offset = Physics.vector(0, 0);
    }

    World.prototype.moveCamera = function(onStep) {
        var square = _.first(this.bodies.squares);
        var delta = square.height / this.speed;

        this.delta += delta;
        this.renderer._layers.main.options.offset.vsub(Physics.vector(0, -delta));
        if (this.delta >= square.height * 3) {
            this.delta = 0;
            onStep();
        }
    }

    World.prototype.removeSquares = function() {
        this.squares = this.bodies.squares.slice(0, 40);
        this.physics.remove(this.squares);
        this.bodies.squares = this.bodies.squares.slice(40);
    }

    return World;
})();
