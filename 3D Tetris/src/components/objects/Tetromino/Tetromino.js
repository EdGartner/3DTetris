import { Group, BoxGeometry, MeshBasicMaterial, Mesh, Object3D } from 'three';

class Cube {
    constructor(cubeColor) {
        // Create Cube using three.js
        // Source: https://threejs.org/docs/#api/en/geometries/BoxGeometry
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( {color: cubeColor} );
        const cube = new Mesh( geometry, material );
        return cube;
    }
}

class Tetromino extends Group {
    constructor(type) {

        // Call Group constructor
        super();

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
        let mino = new Group();
        
        let offsets = minoTypes[type]["offsets"];
        let color = minoTypes[type]["color"];
        for (let i = 0; i < offsets.length; i++) {
            let cube = new Cube(color);
            cube.position.set(offsets[i][0], offsets[i][1], offsets[i][2]);
            mino.add(cube);
        }

        return mino;
    }
}

export default Tetromino;