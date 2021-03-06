import { Scene, BoxGeometry, Color, Euler, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { BasicLights } from 'lights';
import '../../style.css'
import _ from 'lodash';

class ControlsScene extends Scene {
    constructor(backCallback) {
        // Call parent Scene() constructor
        super();

        // Add lights
        this.add(new BasicLights());

        // Canvas
        const geometry = new BoxGeometry(100, 100, 1);
        const color = new Color( 0x000000 );
        const material = new MeshBasicMaterial({color});
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(new Vector3(0, 0, 10));
        mesh.updateMatrix();
        this.screen = mesh;
        this.add(mesh);
        this.mesh = mesh;

        // Text and buttons
        this.divElements = [];
        this.divElements.push(this.createText("3D Tetris", "3%", "75px"));
        this.divElements.push(this.createText("WASD - Move Piece", "23%", "30px"));
        this.divElements.push(this.createText("Q / E - Spin Piece", "33%", "30px"));
        this.divElements.push(this.createText("R / F - Rotate Piece Forward / Backward", "53%", "30px"));
        this.divElements.push(this.createText("Z / C - Rotate Piece Sideways", "73%", "30px"));
        this.divElements.push(this.createButton("Back", "85%", "5%", -1, backCallback));
    }

    createText(str, top, size) {

        const text = document.createElement("h1");
        document.body.appendChild(text);
        // Set content and style
        text.innerHTML = str;
        text.style.position = 'absolute';
        text.style.fontFamily = 'Lucida Console';
        text.style.fontSize = size;
        text.style.color = 'white';
        text.style.left = (window.innerWidth - text.clientWidth) / 2 + 'px';
        text.style.top = top;
        return text;
    }

    createButton(str, top, sideOff, font, callback) {
        const button = document.createElement('button');
        document.body.appendChild(button);
        // Set content and style
        button.innerHTML = str;
        button.style.left = sideOff;
        button.style.top = top;
        button.style.height = "50px";
        if (font > -1) {
          button.style.fontSize = font + "px";
        }
        button.onclick = callback;
        return button;
    }

    /* Event handlers */
    resizeHandler() {
        // realign divElements
        this.divElements.forEach((divElement) => {
            divElement.style.left = (window.innerWidth - divElement.clientWidth)/2 + 'px';
        });
    }

    /* Clean up */
    destruct() {
        this.mesh.geometry = null;
        this.mesh.material = null;
        this.mesh = null;

        // Remove textboxes and buttons
        this.divElements.forEach((divElement) => divElement.remove());
        this.divElements = null;

        // Dispose the scene
        this.dispose();
    }
}

export default ControlsScene;
