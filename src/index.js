import * as THREE from 'three'

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

const parameters = { materialColor: '#ffeded' }
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const objectsDistance = 4;
const sectionMeshes = createObjects(objectsDistance);
createBackgroundParticles(objectsDistance);

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let scrollY = window.scrollY;
window.addEventListener('scroll', () => scrollY = window.scrollY)

const cursor = {x: 0, y: 0}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock();
let previousTime = 0;

const animate = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    camera.position.y = - scrollY / sizes.height * objectsDistance

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)
}
animate()

function makeSpiral() {
    const positions = [];
    const colors = [];
    const points = [];

    for (let i = -50; i < 50; i++) {
        const t = i / 3;

        points.push(
            new THREE.Vector3(
                t * Math.sin( 3 * t ),
                t,
                t * Math.cos( 3 * t )
            )
        );
    }

    const spline = new THREE.CatmullRomCurve3( points );
    const divisions = Math.round(3 * points.length);
    const point = new THREE.Vector3();
    const color = new THREE.Color();

    for (let i = 0, l = divisions; i < l; i++) {
        const t = i / l;

        spline.getPoint(t, point);
        positions.push(point.x, point.y, point.z);

        color.setHSL(t, 1, 0.5, THREE.SRGBColorSpace);
        colors.push(color.r, color.g, color.b);
    }

    const lineGeometry = new LineGeometry();
    lineGeometry.setPositions(positions);
    lineGeometry.setColors(colors);

    const line = new Line2(
        lineGeometry,
        new LineMaterial({
            color: 0xffffff,
            linewidth: 1,
            worldUnits: true,
            vertexColors: true,
            alphaToCoverage: true,
        })
    );
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    return line;
}

function createObjects(objectsDistance) {
    const material = new THREE.MeshToonMaterial({
        color: parameters.materialColor,
        gradientMap: gradientTexture
    })

    const mesh1 = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        material
    );
    const mesh2 = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        material
    );
    const mesh3 = makeSpiral();

    mesh1.position.x = 2;
    mesh2.position.x = - 2;

    mesh1.position.y = - objectsDistance * 0;
    mesh2.position.y = - objectsDistance * 1;

    scene.add(mesh1, mesh2, mesh3);

    return [mesh1, mesh2, mesh3];
}

function createBackgroundParticles(objectsDistance) {
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: parameters.materialColor,
        sizeAttenuation: true,
        size: 0.03
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}