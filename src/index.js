import * as THREE from 'three'
import SceneObjects from './SceneObjects.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const sizes = { width: window.innerWidth, height: window.innerHeight };

const sceneObjects = new SceneObjects(scene, sizes);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    sceneObjects.adjustPositions(sizes);

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrollY = window.scrollY;
window.addEventListener('scroll', () => scrollY = window.scrollY)

const clock = new THREE.Clock();
let previousTime = 0;

const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;
    camera.position.y = - scrollY / sizes.height * sceneObjects.distance;

    sceneObjects.rotate(deltaTime);

    renderer.render(scene, camera);

    window.requestAnimationFrame(animate);
};

animate();
