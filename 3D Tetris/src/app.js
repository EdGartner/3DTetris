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
import StartScene from './components/scenes/StartScene.js'
import CreditsScene from './components/scenes/CreditsScene.js'
import InfoScene from './components/scenes/InfoScene.js'
import ControlsScene from './components/scenes/ControlsScene.js'
import { OrbitLock } from './orbitLock';
import { globals } from 'globals';
import Game from './components/objects/Game.js';

// Initialize core ThreeJS components
let seedScene;
let startScene;
let infoScene;
let creditsScene;
let controlsScene;
let minos;
let game;
let camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const BLOCK_SIZE = globals.BLOCK_SIZE;

// Start button (adapted from Chromatic Arrow)
function initStartScene() {
  startScene = new StartScene(
    startToGameHandler,
    startToInfoHandler,
    startToCreditsHandler,
    startToControlsHandler
  );
  camera.position.copy(new Vector3(0, 2, 0));
  camera.lookAt(new Vector3(0, 2, 1)); // camera starts looking down the +z axis
  windowResizeHandler();
}

// Scene change functions (adapted from Chromatic Arrow)
function changeToGame(lastScene) {
  lastScene.destruct();
  if (seedScene !== undefined) {
    seedScene.destruct();
  }
  seedScene = new SeedScene();
  minos = seedScene.minoList;
  game = seedScene.game;
  //seedScene.updateScore();

  // Set up camera
  camera.position.set(6, 3, -10);
  camera.lookAt(new Vector3(0, 0, 0));

  // Set up controls
  const controls = new OrbitLock(camera, canvas);
  controls.minPolarAngle = 95 * Math.PI / 180;
  controls.maxPolarAngle = 170 * Math.PI / 180;
  controls.minDistance = 4;
  controls.maxDistance = 16;
  window.addEventListener('click', function () {
      controls.lock();
  }, false);
}

function changeToInfo(lastScene) {
  lastScene.destruct();
  if (infoScene !== undefined) {
    infoScene.destruct();
  }
  infoScene = new InfoScene(back);
}

function changeToCredits(lastScene) {
  lastScene.destruct();
  if (creditsScene !== undefined) {
    creditsScene.destruct();
  }
  creditsScene = new CreditsScene(back);
}

function changeToControls(lastScene) {
  lastScene.destruct();
  if (controlsScene !== undefined) {
    controlsScene.destruct();
  }
  controlsScene = new ControlsScene(back);
}

function changeToStart() {
  if (infoScene !== undefined) {
    infoScene.destruct();
  }
  if (creditsScene !== undefined) {
    creditsScene.destruct();
  }
  if (controlsScene !== undefined) {
    controlsScene.destruct();
  }
  if (startScene !== undefined) {
    startScene.destruct();
  }
  initStartScene();
}

// Start game handler
const startToGameHandler = () => {
  changeToGame(startScene);
  startScene = undefined;
};

// Info handler
const startToInfoHandler = () => {
  changeToInfo(startScene);
  startScene = undefined;
};

// Credits handler
const startToCreditsHandler = () => {
  changeToCredits(startScene);
  startScene = undefined;
};

// Controls handler
const startToControlsHandler = () => {
  changeToControls(startScene);
  startScene = undefined;
};

// Back to start handler
const back = () => {
  changeToStart();
  infoScene = undefined;
  creditsScene = undefined;
  controlsScene = undefined;
}

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
  // Forgive me for what I'm about to do
  let seed = (
    startScene == undefined &&
    creditsScene == undefined &&
    infoScene == undefined &&
    controlsScene == undefined
  )
  let start = (
    seedScene == undefined &&
    creditsScene == undefined &&
    infoScene == undefined &&
    controlsScene == undefined
  )
  let info = (
    startScene == undefined &&
    creditsScene == undefined &&
    seedScene == undefined &&
    controlsScene == undefined
  )
  let credits = (
    startScene == undefined &&
    seedScene == undefined &&
    infoScene == undefined &&
    controlsScene == undefined
  )
  let controls = (
    startScene == undefined &&
    creditsScene == undefined &&
    infoScene == undefined &&
    seedScene == undefined
  )
  if (start) {
    renderer.render(startScene, camera);
    startScene.update && startScene.update(timeStamp);
  } else if (seed) {
    renderer.render(seedScene, camera);
    seedScene.update && seedScene.update(timeStamp);
  } else if (info) {
    renderer.render(infoScene, camera);
    infoScene.update && infoScene.update(timeStamp);
  } else if (credits) {
    renderer.render(creditsScene, camera);
    creditsScene.update && creditsScene.update(timeStamp);
  } else if (controls) {
    renderer.render(controlsScene, camera);
    controlsScene.update && controlsScene.update(timeStamp);
  }
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
    let rot = keyMap[event.key];

    let rotation = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    console.log(rotation)
    if (typeof(keyMap[event.key]) == "object") {

      let valRotation;
      const axis = new Vector3(0, 1, 0);
      const ninety = Math.PI / 2.0;

      if (rotation.x >= -0.5 && rotation.x < 0.5) {
        if (rotation.z > 0.5 && rotation.z <= 1) {
          valRotation = 1.0 * ninety
        } else {
          valRotation = 3.0 * ninety
        }
      } else if (rotation.x < -0.5) {
        valRotation = 0.0 * ninety
      } else {
        valRotation = 2.0 * ninety
      }

      val.applyAxisAngle(axis, valRotation);
    } else {

    }

    // Handles rotation based on the current camera position. If a collision is detected, it will undo any work that has been done.
    let holdQuat;
    let collCheck;
		switch (event.key) {
			case 'f':
			case 'r':
        for (let c = 0; c < curMino.children.length; c++) {
            curMino.children[c].previousPosition = curMino.children[c].position;
        }
        holdQuat = curMino.quaternion.clone();
        if (rotation.x >= -0.5 && rotation.x < 0.5) {
          if (rotation.z > 0.5 && rotation.z <= 1) {
          curMino.rotateX(-rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateX(rot);
          } else {
            curMino.rotateX(rot);
            collCheck = game.checkCollision(curMino);
            if (collCheck) curMino.rotateX(-rot);
          }
        } else if (rotation.x < -0.5) {
          curMino.rotateZ(-rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateZ(rot);
        } else {
          curMino.rotateZ(rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateZ(-rot);
        }

        if (!collCheck) curMino.prevQuaternion = holdQuat;
        game.update(minos, false);
				break;

			case 'e':
			case 'q':
        for (let c = 0; c < curMino.children.length; c++) {
          curMino.children[c].previousPosition = curMino.children[c].position;
        }
        holdQuat = curMino.quaternion.clone();
				curMino.rotateY(rot);

        collCheck = game.checkCollision(curMino);
        if (collCheck) curMino.rotateY(-rot);

        if (!collCheck) curMino.prevQuaternion = holdQuat;
        game.update(minos, false);
				break;

			case 'z':
			case 'c':
        for (let c = 0; c < curMino.children.length; c++) {
          curMino.children[c].previousPosition = curMino.children[c].position;
        }
        holdQuat = curMino.quaternion.clone();
        if (rotation.x >= -0.5 && rotation.x < 0.5) {
          if (rotation.z > 0.5 && rotation.z <= 1) {
          curMino.rotateZ(rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateZ(-rot);
          } else {
            curMino.rotateZ(-rot);
            collCheck = game.checkCollision(curMino);
            if (collCheck) curMino.rotateZ(rot);
          }
        } else if (rotation.x < -0.5) {
          curMino.rotateX(-rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateX(rot);
        } else {
          curMino.rotateX(rot);
          collCheck = game.checkCollision(curMino);
          if (collCheck) curMino.rotateX(-rot);
        }

        if (!collCheck) curMino.prevQuaternion = holdQuat;
        game.update(minos, false);
        break;
			default:
				seedScene.translateCurrentMino(val.x, val.y, val.z);
		}
	}
};
window.addEventListener("keydown", handleImpactEvents);

initStartScene();
