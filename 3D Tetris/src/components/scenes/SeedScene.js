import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, BoxGeometry, MeshBasicMaterial, Mesh, GridHelper, EdgesGeometry, WireframeGeometry, LineSegments } from 'three';
import { Tetromino } from 'objects';
import { BasicLights } from 'lights';
import { globals } from '../../globals';

class SeedScene extends Scene {
    constructor() {
        let BLOCK_SIZE = globals.BLOCK_SIZE;
        let BOARD_WIDTH = globals.BOARD_WIDTH;
        let BOARD_HEIGHT = globals.BOARD_HEIGHT;

        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            //gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add lights
        const lights = new BasicLights();
        this.add(lights);

        // Add base and wireframe play area signifier
        const base = new BoxGeometry(BLOCK_SIZE * 2 * BOARD_WIDTH, BLOCK_SIZE * 4, BLOCK_SIZE * 2 * BOARD_WIDTH);
        const texture = new MeshBasicMaterial( { color: 0x002259 } );
        const baseMesh = new Mesh(base, texture);
        baseMesh.translateY(globals.STARTING_YPOS - (BLOCK_SIZE * BOARD_HEIGHT) - BLOCK_SIZE * 2 + 0.25);
        this.add(baseMesh);

        const grid = new GridHelper(BLOCK_SIZE * BOARD_WIDTH, 4, 0xFFFFFF, 0xFFFFFF);
        grid.translateY(globals.STARTING_YPOS - (BLOCK_SIZE * BOARD_HEIGHT) + 0.25);
        console.log(grid.position);
        this.add(grid);

        const playSpace = new BoxGeometry(BLOCK_SIZE * BOARD_WIDTH, BLOCK_SIZE * BOARD_HEIGHT, BLOCK_SIZE * BOARD_WIDTH);
        const playSpaceEdges = new EdgesGeometry(playSpace);
        const playGrid = new LineSegments(playSpaceEdges);
        this.add(playGrid);


        // Add meshes to scene
        this.minoList = [];

        // Gameplay variables
        this.frame = 0;
        this.dropRate = 90; // Frames per drop
        this.generateOnNextInterval = false; // Generate new mino after dropRate frames?

        // Generate gameboard; false = voxel is unoccupied
        this.board = [];
        for (let x = 0; x < globals.BOARD_LENGTH; x++) {
            this.board.push([]);
            for (let y = 0; y < globals.BOARD_HEIGHT; y++) {
                this.board[x].push([]);
                for (let z = 0; z < globals.BOARD_WIDTH; z++) {
                    this.board[x][y].push(false);
                }
            }
        }

        console.log(this.board);
    }

    generateRandomMino() {
        let types = "ILTOSWAV";
        let type = types[Math.floor(Math.random() * types.length)];
        let mino = new Tetromino(type);
        mino.translate(globals.STARTING_XPOS, globals.STARTING_YPOS, globals.STARTING_ZPOS);
        this.minoList.push(mino);
        this.add(mino);
    }

    // Return position of child i of mino in board coordinates
    boardPositionOfChild(mino, i) {
        let pos_i = mino.position.clone().add(mino.children[i].position);
        pos_i.add(new Vector3(0, -globals.STARTING_YPOS, 0));
        pos_i.divideScalar(globals.BLOCK_SIZE);
        pos_i.add(new Vector3(-globals.X_MIN, globals.BOARD_HEIGHT-1, -globals.Z_MIN));
        pos_i.x = Math.round(pos_i.x);
        pos_i.y = Math.round(pos_i.y);
        pos_i.z = Math.round(pos_i.z);
        return pos_i;
    }

    // Translate the current Tetromino by (x, y, z) units
    // Handle collision detection - do not translate if collision will occur
    translateCurrentMino(x, y, z) {
        let curMino = this.minoList[this.minoList.length - 1];
        curMino.translate(x, y, z);

        let collision = false;
        // Handle collision detection
        for (let i = 0; i < curMino.children.length; i++) {
            let pos_i = this.boardPositionOfChild(curMino, i);
            if (pos_i.y < globals.BOARD_HEIGHT) { // Ignore initial frame
                if (pos_i.x < 0 || pos_i.y < 0 || pos_i.z < 0 ||
                    pos_i.x >= globals.BOARD_LENGTH || pos_i.z >= globals.BOARD_WIDTH ||
                    this.board[pos_i.x][pos_i.y][pos_i.z]) {
                    collision = true;
                }
            }
        }

        if (!collision) {
            return true;
        } else {
            curMino.translate(-x, -y, -z);
            return false;
        }
    }

    update(timeStamp) {
        let BLOCK_SIZE = globals.BLOCK_SIZE;
        let BOARD_WIDTH = globals.BOARD_WIDTH;
        let BOARD_LENGTH = globals.BOARD_LENGTH;
        let BOARD_HEIGHT = globals.BOARD_HEIGHT;
        let STARTING_YPOS = globals.STARTING_YPOS;

        this.frame += 1;

        // Tetromino dropping code
        if (this.minoList.length === 0 || this.generateOnNextInterval) {
            this.generateRandomMino();
            this.generateOnNextInterval = false;
        } else {
            let curMino = this.minoList[this.minoList.length - 1];
            let minHeight = STARTING_YPOS - (BLOCK_SIZE * BOARD_HEIGHT);
            if (this.frame % this.dropRate === 0) {
                if (curMino.getMinimumY() > minHeight) {
                    let gen = this.translateCurrentMino(0, -BLOCK_SIZE, 0);
                    if (!gen) {
                        this.generateOnNextInterval = true;
                    }
                } else {
                    this.generateOnNextInterval = true;
                }

                if (this.generateOnNextInterval) {
                    for (let i = 0; i < curMino.children.length; i++) {
                        let pos_i = this.boardPositionOfChild(curMino, i);
                        console.log(pos_i);
                        this.board[pos_i.x][pos_i.y][pos_i.z] = true;
                    }
                }
            }
        }
    }
}

export default SeedScene;
