import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Tetromino } from 'objects';
import { BasicLights } from 'lights';

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

        // Add meshes to scene
        this.minoList = []
        const tetromino = new Tetromino("W");
        tetromino.cut(2);
        this.minoList.push(tetromino);
        console.log(this.minoList)

        this.tetromino2 = new Tetromino("I");
        tetromino.rotate("z", Math.PI / 2);
        tetromino.translate("y", 4);

        const lights = new BasicLights();
        this.add(tetromino, this.tetromino2, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        if (timeStamp < 7000) {
            this.tetromino2.translate("y", 0.01);
        }
    }
}

export default SeedScene;
