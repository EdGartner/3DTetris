import { Vector3 } from "three";
import { globals } from "../../globals";

class Game {
    constructor() { 
        const BOARD_HEIGHT = globals.BOARD_HEIGHT;
        const BOARD_LENGTH = globals.BOARD_LENGTH;
        const BOARD_WIDTH = globals.BOARD_WIDTH;
        // Board listed as (y, x, z)
        this.board = [];
        for (let y = 0; y < BOARD_HEIGHT + 2; y++) {
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

    gameCoords (pos) {
        let gamePos = new Vector3();
        gamePos.y = Math.floor((pos.y + 3.1) * 2 + 1);
        gamePos.x = Math.floor(pos.x * 2 + 2.1);
        gamePos.z = Math.floor(pos.z * 2 + 2.1);
        return gamePos;
    }

    // Most important function of the class. Keeps track of each cube's position in the game board.
    // Triggers plane clears, as well as awards and tallies points for the game
    update (minos, final) {
        const BOARD_HEIGHT = globals.BOARD_HEIGHT;
        const BOARD_LENGTH = globals.BOARD_LENGTH;
        const BOARD_WIDTH = globals.BOARD_WIDTH;
        

        // Clear previous positions to null to not leave "streaks" where tetrominos have moved
        let curMino = minos[minos.length - 1];
        let children = curMino.children;
        
        for(let c = 0; c < children.length; c++) {
            if (children[c].prevGame != null) {
                this.board[children[c].prevGame.y][children[c].prevGame.x][children[c].prevGame.z] = null;
                this.planeMinos[children[c].prevGame.y]--;
            }
        }


        // Fill current positions in game board
        for (let c = 0; c < children.length; c++) {
            let copy = this.gameCoords(curMino.position.clone().add(children[c].position.clone().applyQuaternion(curMino.quaternion)));
            this.board[copy.y][copy.x][copy.z] = children[c];
            this.planeMinos[copy.y]++;
            children[c].prevGame = copy;
        }

        // Clear full layers
        let planeNum = 0;
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            if (final) {
                if (this.planeMinos[y] == 16){
                    this.clearPlane(y);
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
                let mino = [];
                mino.push(minos[m]);
                this.update(mino, false);
            }
        }
        console.log(this.board);
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
                    if (current.position.equals(pieces[i].position)) {
                        mino.cut(i);
                    }
                }
                this.board[y][x][z] = null;
            }
        }
        this.planeMinos[y] = 0;
    }

    checkCollision(newMino) {
        let children = newMino.children;
        for (let c = 0; c < children.length; c++) {
            let copy = this.gameCoords(newMino.position.clone().add(children[c].position.clone().applyQuaternion(newMino.quaternion)));
            // If the new child is outside the bounds, return that a collision has ocurred
            if (copy.x < 0 || copy.x > 3 || copy.z < 0 || copy.z > 3 || copy.y > 16 || copy.y <= 0) {
                return true;
            }
        }
        for (let c = 0; c < children.length; c++) {
            let copy = this.gameCoords(newMino.position.clone().add(children[c].position.clone().applyQuaternion(newMino.quaternion)));
            // If there is a cube in the next position, check if it is part of the same tetromino.
            if (this.board[copy.y][copy.x][copy.z] != null) {
                // Test each of the prevGame coordinates. If there is one that is the same, it is from the same tetromino, and that is not a collision
                let same = false;
                for (let i = 0; i < children.length; i++) {
                    if (copy.equals(children[i].prevGame)) {
                        same = true;
                        break;
                    }
                }
                // If the algorithm goes through all the children without finding equality, that other must be another tetromino, and a collision has occurred.
                if (!same) return true;
            }
        }
        // If all the children are found to not have collisions, then there are no collisions
        return false;
    }
}

export default Game;