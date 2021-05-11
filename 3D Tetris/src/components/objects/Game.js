import { globals } from "../../globals";

class Game {
    constructor() { 
        const BOARD_HEIGHT = globals.BOARD_HEIGHT;
        const BOARD_LENGTH = globals.BOARD_LENGTH;
        const BOARD_WIDTH = globals.BOARD_WIDTH;
        // Board listed as (y, x, z)
        this.board = [];
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            let xRow = [];
            for (let x = 0; x < BOARD_WIDTH; x++) {
                let zCol = [];
                for (let z = 0; z < BOARD_LENGTH; z++) {
                    zCol[z] = null;
                }
                xRow[x] = zCol;
            }
            this.board[y] = xRow;
        }
        this.planeMinos = [];
        for (let i = 0; i < globals.BOARD_HEIGHT; i ++) {
            this.planeMinos[i] = 0;
        }

        this.points = 0;
        this.cleared = 0;
        this.level = 0;
    }

    // Most important function of the class. Keeps track of each cube's position in the game board.
    // Triggers plane clears, as well as awards and tallies points for the game
    // This function will be reworked and optimized when a "previous position" is added to tetrominos
    update (minos, final) {
        const BOARD_HEIGHT = globals.BOARD_HEIGHT;
        const BOARD_LENGTH = globals.BOARD_LENGTH;
        const BOARD_WIDTH = globals.BOARD_WIDTH;

        // Clear positions to null to not leave "streaks" where tetrominos have moved
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                for (let z = 0; z < BOARD_LENGTH; z++) {
                    this.board[y][x][z] = null;
                }
            }
            this.planeMinos[y] = 0;
        }

        // Fill current positions in game board
        for (let m = 0; m < minos.length; m++) {
            let cubes = m.children;
            for (let c = 0; c < cubes.length; c++) {
                let copy = cubes[c].position.clone();
                let y = Math.floor(copy.y + 3.1);
                let x = Math.floor(copy.x * 2 + 2.1);
                let z = Math.floor(copy.z * 2 + 2.1);
                this.board[y][x][z] = cubes[c];
            }
        }

        // Count number of cubes in a layer
        let planeNum = 0;
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                for (let z = 0; z < BOARD_WIDTH; z++) {
                    if (this.board !== null) this.planeMinos[y]++;
                }
            }
            if (final) {
                if (this.planeMinos[y] == 16){
                    clearPlane(y);
                    planeNum++;
                }
            }
        }

        // Find appropriate points to award based on number of cleared planes, award points
        let basePoints = 0;
        switch(planeNum) {
            case 1:
                basePoints = 40;
                break;
            case 2:
                basePoints = 100;
                break;
            case 3: 
                basePoints = 300;
                break;
            case 4:
                basePoints = 1200;
                break;
        }
        this.points += basePoints * (this.level + 1); 

        // Move everything down to fill the space
        for (let i = 0; i < planeNum; i++) {
            for (let m = 0; m < minos.length; m++) {
                minos[m].translate(0, -globals.BLOCK_SIZE, 0);
            }
        }
    }

    clearPlane(y) {
        const BOARD_LENGTH = globals.BOARD_LENGTH;
        const BOARD_WIDTH = globals.BOARD_WIDTH;

        // Iterate through given plane
        for (let x = 0; x < BOARD_WIDTH; x++) {
            for (let z = 0; z < BOARD_LENGTH; z++) {
                // Match current cube to child number from parent, cut using tetromino function.
                let current = this.board[y][x][z];
                let mino = current.parent;
                let pieces = mino.children;
                for (let i = 0; i < pieces.length; i++) {
                    if (current.points.equals(pieces[i].position)) {
                        mino.cut(i);
                    }
                }
            }
        }
    }
}