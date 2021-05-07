import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Tetromino } from 'objects';
import { BasicLights } from 'lights';
import { globals } from '../../globals';

class SeedScene extends Scene {
    constructor() {

        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add lights
        const lights = new BasicLights();
        this.add(lights);

        // Add meshes to scene
        this.minoList = [];

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);

        // Gameplay variables
        this.frame = 0;
        this.dropRate = 30; // Frames per drop
        this.generateOnNextInterval = false; // Generate new mino after dropRate frames?
    }

    generateRandomMino() {
        let types = "ILTOSWAV";
        let type = types[Math.floor(Math.random() * types.length)];
        let mino = new Tetromino(type);
        mino.translate("y", globals.STARTING_YPOS);
        this.minoList.push(mino);
        this.add(mino);
    }

    update(timeStamp) {
        let BLOCK_SIZE = globals.BLOCK_SIZE;
        let BOARD_WIDTH = globals.BOARD_WIDTH;
        let BOARD_LENGTH = globals.BOARD_LENGTH;
        let BOARD_HEIGHT = globals.BOARD_HEIGHT;
        let STARTING_YPOS = globals.STARTING_YPOS;

        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        this.frame += 1;

        // Tetromino dropping code
        if (this.minoList.length === 0 || this.generateOnNextInterval) {
            this.generateRandomMino();
            this.generateOnNextInterval = false;
        } else {
            let curMino = this.minoList[this.minoList.length - 1];
            let minHeight = STARTING_YPOS - (BLOCK_SIZE * BOARD_HEIGHT);
            if (this.frame % this.dropRate === 0) {
                if (curMino.position.y > minHeight) {
                    curMino.translate("y", -BLOCK_SIZE);
                } else {
                    this.generateOnNextInterval = true;
                }
            }
        }
    }
}

export default SeedScene;
