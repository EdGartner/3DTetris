import { Group, BoxGeometry, MeshBasicMaterial, Mesh, Object3D } from 'three';
import { globals } from '../../../globals';

class Cube {
    constructor(cubeColor) {
        let BLOCK_SIZE = globals.BLOCK_SIZE;

        // Create Cube using three.js
        // Source: https://threejs.org/docs/#api/en/geometries/BoxGeometry
        const geometry = new BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        const material = new MeshBasicMaterial( {color: cubeColor} );
        const cube = new Mesh( geometry, material );
        return cube;
    }
}

class Tetromino extends Group {
    constructor(type) {

        // Call Group constructor
        super();

        let BLOCK_SIZE = globals.BLOCK_SIZE;

        // Dictionary of types of tetrominoes, describing their color and
        // each cubie's offset from the center.
        const minoTypes = { I: {offsets: [[0,-1,0],[0,0,0],[0,1,0],[0,2,0]], color: "white"},
                            L: {offsets: [[0,-1,0],[0,0,0],[0,1,0],[1,1,0]], color: "blue"},
                            T: {offsets: [[0,-1,0],[0,0,0],[0,1,0],[1,0,0]], color: "green"},
                            O: {offsets: [[0,0,0],[0,1,0],[1,0,0],[1,1,0]], color: "yellow"},
                            S: {offsets: [[0,-1,0],[0,0,0],[1,0,0],[1,1,0]], color: "orange"},
                            W: {offsets: [[0,0,0],[1,0,0],[0,1,0],[0,0,1]], color: "red"},
                            A: {offsets: [[0,0,0],[1,0,0],[1,1,0],[0,0,1]], color: "purple"},
                            V: {offsets: [[0,0,0],[-1,0,0],[0,1,1],[0,0,1]], color: "gray"}
                            };
        
        // Create tetromino
        let offsets = minoTypes[type]["offsets"];
        let color = minoTypes[type]["color"];
        for (let i = 0; i < offsets.length; i++) {
            let cube = new Cube(color);
            cube.position.x += offsets[i][0] * BLOCK_SIZE;
            cube.position.y += offsets[i][1] * BLOCK_SIZE;
            cube.position.z += offsets[i][2] * BLOCK_SIZE;
            this.add(cube);
        }
    }

    // Remove block i from Tetromino
    cut(i) {
        this.remove(this.children[i]);
    }

    // Rotate Tetromino by rad radians on axis ax="x"||"y"||"z"
    rotate(ax, rads) {
        if (ax === "x") {
            this.rotation.x = rads;
        } else if (ax === "y") {
            this.rotation.y = rads;
        } else if (ax === "z") {
            this.rotation.z = rads;
        }
        
    }
}

export default Tetromino;