import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

let formatTitle = () => {
    let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    let titleElem = document.getElementById('profile-title');
    titleElem.innerHTML = (width < 500) ? "<br>&emsp;\"Alec Breton\"<br>" : "\"Alec Breton\"";
};

formatTitle();

window.addEventListener('resize', formatTitle);

const scene = new THREE.Scene();
scene.background = new THREE.Color( 'white' );
const camera = new THREE.PerspectiveCamera( 75, 500 / 500, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( 250, 250 );
document.getElementById("tetris-icon").appendChild( renderer.domElement );

const tetrominoe = createTetrominoe();
scene.add(tetrominoe);

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

if (WebGL.isWebGLAvailable()) {
	animate();
} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );
}

function createTetrominoe() {
	const group = new THREE.Object3D();
	const tShape = [[1, 1, 1], [0, 1, 0]];

	for (let y = 0; y < tShape.length; y++) {
		for (let x = 0; x < tShape[0].length; x++) {
			let cell = tShape[y][x]
			let block, material, cube;
	
			if (cell) {
				block = new THREE.BoxGeometry(1, 1, 1);
				material = new THREE.MeshPhongMaterial({ color: 'green' });
				cube = new THREE.Mesh(block, material);
	
				cube.scale.set(1, 1, 1);
				cube.position.set(x * 1 + (x * 0.1), y * 1 + (y * 0.1), 0);
	
				group.add(cube);
			}
		}
	}

	return group;
}