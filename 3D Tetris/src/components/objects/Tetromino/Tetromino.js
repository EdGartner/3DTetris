import { Group, BoxGeometry, MeshBasicMaterial, Mesh, Object3D, EdgesGeometry, LineSegments, LineBasicMaterial, Vector3 } from 'three';
import { globals } from '../../../globals';

class Cube extends Group {
    constructor(cubeColor) {

        // Call Mesh constructor
        super();

        // Store previous position
        this.previousPosition = null;

        // Store previous game position
        this.prevGame = null;

        let BLOCK_SIZE = globals.BLOCK_SIZE;

        // Create Cube using three.js
        // Source: https://threejs.org/docs/#api/en/geometries/BoxGeometry
        const geometry = new BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        const material = new MeshBasicMaterial( {color: cubeColor} );
        const cube = new Mesh( geometry, material );
        this.add(cube);

        // Create edges using three.js
        // Source: https://threejs.org/docs/#api/en/geometries/EdgesGeometry
        const edges = new EdgesGeometry( geometry );
        // Note: linewidth is a parameter, but according to documentation
        // it is ignored on most platforms
        const outline = new LineSegments( edges, new LineBasicMaterial( { color: 0x000000 } ) );
        this.add(outline);
    }
}

class Tetromino extends Group {
    constructor(type) {

        // Call Group constructor
        super();

        let BLOCK_SIZE = globals.BLOCK_SIZE;

        // Store previous quaternion
        this.prevQuaternion = this.quaternion;

        // Store previous position
        this.prevPosition = null;

        // Dictionary of types of tetrominoes, describing their color and
        // each cubie's offset from the center.
        const minoTypes = { I: {offsets: [[0,0,0],[1,0,0],[2,0,0],[-1,0,0]], color: "white"},
                            L: {offsets: [[1,0,0],[0,1,0],[-1,1,0],[1,1,0]], color: "blue"},
                            T: {offsets: [[0,0,0],[0,1,0],[-1,1,0],[1,1,0]], color: "green"},
                            O: {offsets: [[0,0,0],[0,1,0],[1,0,0],[1,1,0]], color: "yellow"},
                            S: {offsets: [[0,0,0],[-1,0,0],[0,1,0],[1,1,0]], color: "orange"},
                            W: {offsets: [[0,0,0],[1,0,0],[0,1,0],[0,0,1]], color: "red"},
                            A: {offsets: [[0,0,0],[1,0,0],[1,1,0],[0,0,1]], color: "purple"},
                            V: {offsets: [[0,0,0],[-1,0,0],[0,1,1],[0,0,1]], color: "gray"}
                            };

        // Create tetromino
        let offsets = minoTypes[type]["offsets"];

        let color = minoTypes[type]["color"];
        for (let i = 0; i < offsets.length; i++) {
            let cube = new Cube(color);
            cube.translateX(offsets[i][0] * BLOCK_SIZE);
            cube.translateY(offsets[i][1] * BLOCK_SIZE);
            cube.translateZ(offsets[i][2] * BLOCK_SIZE);
            this.add(cube);
        }
    }

    // Remove block i from Tetromino
    cut(i) {
        this.remove(this.children[i]);
    }

    // Rotate Tetromino by rad radians on axis ax="x"||"y"||"z"
    rotate(ax, rads) {
        ax = ax.toLowerCase();
        console.log(this);
        if (ax === "x") {
            this.rotateX(rads);
        } else if (ax === "y") {
            this.rotateY(rads);
        } else if (ax === "z") {
            this.rotateZ(rads);
        }
    }

    // Translate Tetromino by x, y, and z
    translate(x, y, z) {
        for (let c = 0; c < this.children.length; c++) {
            this.children[c].previousPosition = this.children[c].position;
        }
        let holdPos = this.position.clone();
        this.position.add(new Vector3(x, y, z));
        
        this.previousPosition = holdPos;
    }

    getMinimumY() {
        let min = Infinity;
        for (let i = 0; i < this.children.length; i++) {
            let val = this.children[i].position.clone().applyQuaternion(this.quaternion).y;
            if (val < min) {
                min = val;
            }
        }

        return min;
    }
}

export default Tetromino;
