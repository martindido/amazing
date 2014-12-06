var App = (function() {
    'use strict';

    function App() {
        this.maze = new Maze(5, 10, Maze.Algorithms['Eller']);
        this.$maze = $('#maze');
        this.$score = $('#score');
        this.score = 0;
        this.interval = 30;
        this.cells = {};
        this.current;
        this.world = new World();

        _.each(this.maze.grid.data, this.generateRow, this);

        this.maze.onUpdate(this.onUpdate.bind(this));
        this.maze.onEvent(this.onEvent.bind(this));
        this.maze.algorithm.isFinal = this.isFinal;
    }

    App.prototype.generateRow = function(row, y) {
        var $row = $(JST['app/templates/row.html']({
            y: y
        }));

        this.cells[y] = {};
        _.each(row, function each(cell, x) {
            var $cell = $(JST['app/templates/cell.html']({
                x: x,
                y: y
            }));

            this.cells[y][x] = $cell;
            $row.prepend($cell);
        }, this);
        this.$maze.prepend($row);
    }

    App.prototype.onUpdate = function(maze, x, y) {
        var $cell = this.cells[y][x];

        if (this.maze.isEast(x, y)) {
            $cell.addClass('east');
        }
        if (this.maze.isWest(x, y)) {
            $cell.addClass('west');
        }
        if (this.maze.isNorth(x, y)) {
            $cell.addClass('north');
        }
        if (this.maze.isSouth(x, y)) {
            $cell.addClass('south');
        }
        if (this.maze.isUnder(x, y)) {
            $cell.addClass('under');
        }
    }

    App.prototype.onEvent = function(maze, x, y) {
        var firstRow;

        if (this.current === y) {
            return;
        }
        this.current = y;
        if (y < this.maze.height - 1) {
            return;
        }
        this.score += this.maze.width + this.current;
        this.$score.text(this.score);
        this.maze.grid.data.push(_.range(this.maze.width).map(function each() {
            return 0;
        }));
        this.generateRow(this.maze.grid.data[y + 1], y + 1);
        firstRow = Object.keys(this.cells).shift();
        this.cells[firstRow][0].parent().remove();
        delete this.cells[firstRow];
    }

    App.prototype.isFinal = function() {
        return false;
    }

    App.prototype.start = function() {
        this.intervalId = setInterval(this.onInterval.bind(this), this.interval);
    }

    App.prototype.onInterval = function() {
        if (!this.maze.step()) {
            clearInterval(this.intervalId);
        }
    }

    return App;
})();
