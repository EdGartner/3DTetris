import {Euler} from 'three/src/math/Euler.js';
import {EventDispatcher} from 'three/src/core/EventDispatcher.js';
import {Vector3} from 'three/src/math/Vector3.js';

// Customized version of the PointerLockControls from ThreeJS to allow for orbital movement and pointer-lock movement.


const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _vector = new Vector3();

const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class OrbitLock extends EventDispatcher {

	constructor( camera, domElement ) {

		super();

		if ( domElement === undefined ) {

			console.warn( 'The second parameter "domElement" is now mandatory.' );
			domElement = document.body;

		}

		this.domElement = domElement;
		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians
        
        // Store the distance of the camera from (0, 0, 0) as well as minimum and maximum distances
        this.length = camera.position.length();
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // Store the zoom speed
        this.zoomSpeed = 1;

		const scope = this;

        function updatePosition(){
            let lookVector = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            let newPos = lookVector.multiplyScalar(-1 * scope.length);
            
            camera.position.x = newPos.x;
            camera.position.y = newPos.y;
            camera.position.z = newPos.z;

            camera.lookAt(new Vector3(0, 0, 0));
        }

		function onMouseMove( event ) {

			if ( scope.isLocked === false ) return;

			const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			_euler.setFromQuaternion( camera.quaternion );

			_euler.y -= movementX * -0.002;
			_euler.x -= movementY * 0.002;

			_euler.x = Math.max( _PI_2 - scope.maxPolarAngle, Math.min( _PI_2 - scope.minPolarAngle, _euler.x ) );

			camera.quaternion.setFromEuler( _euler );

            updatePosition();

			scope.dispatchEvent( _changeEvent );
		}

		function onPointerlockChange() {

			if ( scope.domElement.ownerDocument.pointerLockElement === scope.domElement ) {

				scope.dispatchEvent( _lockEvent );

				scope.isLocked = true;

			} else {

				scope.dispatchEvent( _unlockEvent );

				scope.isLocked = false;

			}

		}

		function onPointerlockError() {

			console.error( 'OrbitLock: Unable to use Pointer Lock API' );

		}

        // On scroll, scale by the deltaY of the scroll multiplied by 0.002 for smoothness, multiplied by the zoom speed.
        function onScrollWheel( event ) {
            let delta = event.deltaY;
            let scale = scope.zoomSpeed * (delta * 0.002);

            scope.length = scope.length + scale;
            if (scope.length < scope.minDistance) scope.length = scope.minDistance;
            if (scope.length > scope.maxDistance) scope.length = scope.maxDistance;

            updatePosition();
        }

		this.connect = function () {

			scope.domElement.ownerDocument.addEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.addEventListener( 'pointerlockerror', onPointerlockError );
            scope.domElement.ownerDocument.addEventListener( 'wheel', onScrollWheel );

		};

		this.disconnect = function () {

			scope.domElement.ownerDocument.removeEventListener( 'mousemove', onMouseMove );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockchange', onPointerlockChange );
			scope.domElement.ownerDocument.removeEventListener( 'pointerlockerror', onPointerlockError );
            scope.domElement.ownerDocument.removeEventListener( 'wheel', onScrollWheel );

		};

		this.dispose = function () {

			this.disconnect();

		};

		this.getObject = function () { // retaining this method for backward compatibility

			return camera;

		};

		this.getDirection = function () {

			const direction = new Vector3( 0, 0, - 1 );

			return function ( v ) {

				return v.copy( direction ).applyQuaternion( camera.quaternion );

			};

		}();

		this.moveForward = function ( distance ) {

			// move forward parallel to the xz-plane
			// assumes camera.up is y-up

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			_vector.crossVectors( camera.up, _vector );

			camera.position.addScaledVector( _vector, distance );

		};

		this.moveRight = function ( distance ) {

			_vector.setFromMatrixColumn( camera.matrix, 0 );

			camera.position.addScaledVector( _vector, distance );

		};

		this.lock = function () {

			this.domElement.requestPointerLock();

		};

		this.unlock = function () {

			scope.domElement.ownerDocument.exitPointerLock();

		};

		this.connect();

	}

}

export { OrbitLock };