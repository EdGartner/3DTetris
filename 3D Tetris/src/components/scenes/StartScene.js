import { Scene, BoxGeometry, Color, Euler, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { BasicLights } from 'lights';
import '../../style.css'
import _ from 'lodash';

class StartScene extends Scene {
    constructor(startGameCallback) {
        // Call parent Scene() constructor
        super();

        console.log("i guess we're starting")
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

        console.log("mesh should be made")
        // Text and buttons
        this.divElements = [];
        this.divElements.push(this.createText("3D Tetris", "3%"));
        this.divElements.push(this.createButton("Info", "54%", -150, -1, startGameCallback));
        this.divElements.push(this.createButton("Begin", "54%", 0, -1, startGameCallback));
        this.divElements.push(this.createButton("Credits", "54%", 150, 28, startGameCallback));
        this.divElements.push(this.createButton("Controls", "33%", 0, 24, startGameCallback));
        console.log("do we get thru everything")
    }

    createText(str, top) {

        const text = document.createElement('h1');
        document.body.appendChild(text);
        // Set content and style
        text.innerHTML = str;
        text.style.position = 'absolute';
        text.style.fontFamily = 'Lucida Console';
        text.style.fontSize = '75px';
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
        button.style.left = (window.innerWidth - button.clientWidth) / 2 + sideOff + 'px';
        button.style.top = top;
        if (font > -1) {
          button.style.fontSize = font + "px";
        } else if (font === -2) {
          button.style.fontSize = 70 + "px";
          button.style.color = "white";
          button.style.background = "black";
          button.style.whitespace = "nowrap";
          button.style.overflow = "hidden";
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

export default StartScene;
