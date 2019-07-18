class Cell {
    constructor() {
        this._owner = 'none';
    }

    get owner() {
        return this._owner;
    }

    set owner(value) {
        if(typeof value === 'number') {
            this._owner = value;
            return true;
        } else {
            return false;
        }
    }
}

class Game {
    constructor() {
        this._playerOne = 'X';
        this._playerTwo = 'O';
        this._emptyCell = '&nbsp;';
        this._currentPlayer = 1; // 1 or 2 only
        this._field = [];
        this._gameElement;
        this._fieldElement;
        this._settingsElement;
        this._lastLaunchSize;
        this._minimumFieldSize = 3;
        this._cellsToWin = 3;
    }

    get field() {
        return this._field;
    }

    set field(value) {
        this._field = value;
    }

    get player() {
        return this._currentPlayer;
    }

    set player(value) {
        this._currentPlayer = value;
    }
 
    start(size = this._minimumFieldSize) {
        if(size >= this._minimumFieldSize) {
            this.field = this.createField(size)
            this._lastLaunchSize = size;
        } else {
            this.field = this.createField(this._minimumFieldSize);
            this._lastLaunchSize = this._minimumFieldSize;
        } 

        (this._lastLaunchSize > 3) ? this._cellsToWin = 4 : this._cellsToWin = 3;
        
        this.player = 1;
        this.drawField();
    }

    turn(cell) {
        this.changeOwner(cell);
        this.drawField();
        if(this.checkWinCondition()) {
            this.victory();
        } else if(this.checkDraw()) {
            this.draw();
        } else {
            this.changePlayer();           
        }
        
    }

    changeOwner(cell) {
        cell.owner = this.player;
    }

    changePlayer() {
        (this.player === 1) ? this.player = 2 : this.player = 1;
    }

    victory() {
        alert('Game is finished. Player ' + this.player + ' won!');
        this.start(this._lastLaunchSize);
    }

    draw() {
        alert('Game is finished. Draw!');
        this.start(this._lastLaunchSize);
    }

    createField(size) {
        let field = [];

        for(let row = 1; row <= size; row++) {
            let row = [];
            for(let cell = 1; cell <= size; cell++) {
                row.push(new Cell());
            }
            field.push(row);
        }

        return field;
    }

    checkWinCondition() {
        let lines = [...this.getDiagonals(), ...this.getHorizontals(), ...this.getVerticals()];

        for(let line of lines) {
            if(this.checkLine(line)) return true;
        }

        return false;
    }

    checkDraw() {
        let line = [];

        for(let row of this.field) {
            for(let cell of row) {
                line.push(cell.owner);
            }
        }

        return line.every(elem => elem !== 'none');

    }

    getHorizontals() {
        let horizontals = [];
        
        for(let x = 0; x < this.field.length; x++) {
            let horizontal = [];
            for(let y = 0; y < this.field.length; y++) {
                horizontal.push(this.field[x][y].owner);
            }
            horizontals.push(horizontal);
        }
        
        return horizontals;
    }

    getVerticals() {
        let verticals = [];
        
        for(let y = 0; y < this.field.length; y++) {
            let vertical = [];
            for(let x = 0; x < this.field.length; x++) {
                vertical.push(this.field[x][y].owner);
            }
            verticals.push(vertical);
        }

        return verticals;
    }

    getDiagonals() {
        let diagonals = [];
        for(let i = 0; i < this.field.length; i++) {
            diagonals.push(this.diagonal(0, i, 1, 1));
            diagonals.push(this.diagonal(0, i, 1, -1));
            diagonals.push(this.diagonal(this.field.length - i, i, -1, 1));
            diagonals.push(this.diagonal(this.field.length - i, i, -1, -1));
        }

        return diagonals;
    }

    diagonal(startX, startY, stepX, stepY) {
        let diagonal = [];
        for (let i = startX, j = startY; i < this.field.length && i >= 0 && j < this.field.length && j >= 0; i += stepX, j += stepY) {
		    diagonal.push(this.field[i][j].owner);
	    }
        return diagonal;
    }

    checkLine(line) {
        let counter = 0;
        let lastItem;
        for(let i in line) {
            if(i === '0') {
                lastItem = line[i];
                counter++; 
            } else {
                if(lastItem === line[i] && line[i] !== 'none') {
                    (counter == 0) ? counter+=2 : counter++;
                    if(counter === this._cellsToWin) return true;
                } else {
                    counter = 0;
                }
                lastItem = line[i];
            }
        }
        
        return false;
    }

    drawField() {
        this._fieldElement.innerHTML = '';
        let fieldElement = document.createElement('div');
        fieldElement.className = 'xo-field';

        for(let row of this.field) {
            let rowElement = document.createElement('div');
            rowElement.className = 'xo-row';
            for(let cell of row) {
                let cellElement = document.createElement('div');
                cellElement.className = 'xo-cell';
                switch(cell.owner) {
                    case 1:
                        cellElement.innerHTML = this._playerOne;
                        break;
                    case 2:
                        cellElement.innerHTML = this._playerTwo;
                        break;
                    default:
                        cellElement.className += ' xo-empty-field';
                        cellElement.innerHTML = this._emptyCell;
                        cellElement.onclick = () => {
                            this.turn(cell);
                        };  
                        break;
                }
                rowElement.appendChild(cellElement);
            }
            fieldElement.appendChild(rowElement);
        }

        this._fieldElement.appendChild(fieldElement);
    }

    drawSettings() {
        let settingsElement = document.createElement('div');
        settingsElement.className = 'xo-settings';

        let inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.value = this._minimumFieldSize;
        inputElement.id = 'xo-field-size';
        inputElement.setAttribute('min', '3');

        let startButton = document.createElement('input');
        startButton.type = 'button';
        startButton.value = 'START';
        startButton.className = 'xo-start-button';
        startButton.onclick = () => {
            this.start(inputElement.value);
        }

        settingsElement.appendChild(inputElement);
        settingsElement.appendChild(startButton)
        this._gameElement.appendChild(settingsElement);
    }

    init(gameDiv = this._gameElement) {
        this._gameElement = gameDiv;
        this._gameElement.innerHTML = '';
        this.drawSettings();
        this._fieldElement = document.createElement('div');
        this._gameElement.appendChild(this._fieldElement);
        this.start();
    }

}

let game = new Game();

game.init(document.getElementById('game'));