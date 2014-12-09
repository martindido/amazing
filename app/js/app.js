var App = (function() {
    'use strict';

    function App() {
        this.$score = $('#score');
        this.getSize(5);
        this.maze = new Maze(this.size.x, this.size.y, Maze.Algorithms['Eller']);
        this.score = 0;
        this.interval = 300;
        this.cells = {};
        this.world = new World(this.size.width, this.size.height);
        this.steps = 0;
        this.current = 0;

        _.each(this.maze.grid.data, this.generateRow, this);

        this.maze.onUpdate(this.onUpdate.bind(this));
        this.maze.onEvent(this.onEvent.bind(this));
        this.maze.algorithm.isFinal = this.isFinal.bind(this);
    }

    App.prototype.getSize = function(x) {
        this.size = {
            x: x,
            width: $('body').width(),
            height: $('body').height()
        };

        this.size.cellWidth = this.size.width / this.size.x;
        this.size.cellHeight = this.size.cellWidth;
        this.size.y = Math.ceil(this.size.height / this.size.cellHeight) + 2;
    }

    App.prototype.generateRow = function(row, y) {
        this.cells[y] = {};
        _.each(row, function each(cell, x) {
            this.cells[y][x] = {};
            _.each(_.range(3), function each(i) {
                this.cells[y][x][i] = {};
                _.each(_.range(3), function each(j) {
                    if (i === 1 && j === 1) {
                        return;
                    }
                    this.cells[y][x][i][j] = this.world.addSquare({
                        x: Math.round(this.size.cellWidth * x + this.size.cellWidth / 3 * j + this.size.cellWidth / 6),
                        y: Math.round(this.size.height - (this.size.cellHeight * y + this.size.cellHeight / 3 * i + this.size.cellHeight / 6)),
                        width: this.size.cellWidth / 3,
                        height: this.size.cellHeight / 3,
                        styles: {
                            fillStyle: x % 2 ? '#FF0000' : '#0000FF',
                            lineWidth: 0
                        }
                    });
                }, this);
            }, this);
        }, this);
    }

    App.prototype.onUpdate = function(maze, x, y) {
        var cell = this.cells[y][x];

        if (this.maze.isEast(x, y)) {
            this.world.removeSquare(cell[1][2]);
        }
        if (this.maze.isWest(x, y)) {
            this.world.removeSquare(cell[1][0]);
        }
        if (this.maze.isNorth(x, y)) {
            this.world.removeSquare(cell[0][1]);
        }
        if (this.maze.isSouth(x, y)) {
            this.world.removeSquare(cell[2][1]);
        }
    }

    App.prototype.onEvent = function(maze, x, y) {
        if (this.current === y) {
            return;
        }
        this.current = y;
        if (y < this.maze.height - 1) {
            return;
        }
        if (y === this.maze.height - 1) {
            this.world.startCamera(this.onStep.bind(this));
        }
    }

    App.prototype.isFinal = function() {
        this.paused = this.current == Object.keys(this.cells).pop();
        return false;
    }

    App.prototype.start = function() {
        this.world.start({
            circle: {
                x: this.size.width / 2,
                y: this.size.height - this.size.cellHeight / 2,
                radius: 10
            },
            onTick: this.onTick.bind(this)
        });
        this.intervalId = setInterval(this.onInterval.bind(this), this.interval);
    }

    App.prototype.onTick = function() {
        if (!this.paused) {
            this.maze.step();
        }
    }

    App.prototype.onInterval = function() {
        if (this.world.speed > 5) {
            this.world.speed--;
        }
    }

    App.prototype.onStep = function() {
        var firstRow = Object.keys(this.cells).shift();

        this.score += this.maze.width + this.current;
        this.$score.text(this.score);
        this.maze.grid.data.push(_.range(this.maze.width).map(function each() {
            return 0;
        }));
        this.generateRow(this.maze.grid.data[this.current + 1], this.current + 1);
        delete this.cells[firstRow];
        delete this.maze.grid.data[firstRow];
        this.world.removeSquares();
        this.paused = false;
    }

    return App;
})();
