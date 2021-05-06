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

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const minos = scene.minoList;

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

  // The vectors tom which each key code in this handler maps. (Change these if you like)
  const keyMap = {
    w : -Math.PI / 2,
    s: Math.PI / 2,
    a: -Math.PI / 2,
    d: Math.PI / 2,
    q: Math.PI / 2,
    e: -Math.PI / 2,
  };

  if (keyMap[event.key] !== undefined) {
    switch (event.key) {
      case 'q':
        minos[0].rotateX(keyMap[event.key]);
        break;
      case 'e':
        minos[0].rotateX(keyMap[event.key]);
        break;
      case 'w':
        minos[0].rotateY(keyMap[event.key]);
        break;
      case 's':
        minos[0].rotateY(keyMap[event.key]);
        break;
      case 'd':
        minos[0].rotateZ(keyMap[event.key]);
        break;
      case 'a':
        minos[0].rotateZ(keyMap[event.key]);
        break;
    }

  }
};
window.addEventListener("keydown", handleImpactEvents);
