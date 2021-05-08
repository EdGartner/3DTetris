/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { SeedScene } from 'scenes';
import { OrbitLock } from './orbitLock';
import { globals } from 'globals';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const minos = scene.minoList;
const BLOCK_SIZE = globals.BLOCK_SIZE;

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitLock(camera, canvas);
controls.minPolarAngle = 95 * Math.PI / 180;
controls.maxPolarAngle = 170 * Math.PI / 180;
controls.minDistance = 4;
controls.maxDistance = 16;
window.addEventListener('click', function () {
    controls.lock();
}, false);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

const handleImpactEvents = (event) => {
	// Ignore keypresses typed into a text box
	if (event.target.tagName === "INPUT") { return; }

	// The vectors to which each key code in this handler maps. (Change these if you like)
	const keyMap = {
		w: new Vector3(-BLOCK_SIZE, 0, 0),
		s: new Vector3(BLOCK_SIZE, 0, 0),
		a: new Vector3(0, 0, BLOCK_SIZE),
		d: new Vector3(0, 0, -BLOCK_SIZE),
		r: -Math.PI / 2,
		f: Math.PI / 2,
		z: -Math.PI / 2,
		c: Math.PI / 2,
		q: Math.PI / 2,
		e: -Math.PI / 2,
	};

	const curMino = minos[minos.length - 1];

	if (keyMap[event.key] !== undefined) {

		let val = keyMap[event.key];

		switch (event.key) {
			case 'q':
				curMino.rotateX(val);
				break;
			case 'e':
				curMino.rotateX(val);
				break;
			case 'r':
				curMino.rotateY(val);
				break;
			case 'f':
				curMino.rotateY(val);
				break;
			case 'z':
				curMino.rotateZ(val);
				break;
			case 'c':
				curMino.rotateZ(val);
				break;
			default:
				scene.translateCurrentMino(val.x, val.y, val.z);
		}
	}
};
window.addEventListener("keydown", handleImpactEvents);
