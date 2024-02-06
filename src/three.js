import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

let line;
let scene, renderer, camera, controls;
let clock;

const matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 1,
    worldUnits: true,
    vertexColors: true,
    alphaToCoverage: true,
});

const matThresholdLine = new LineMaterial({
    color: 0xffffff,
    linewidth: matLine.linewidth,
    worldUnits: true,
    transparent: true,
    opacity: 0.2,
    depthTest: false,
    visible: false,
});

const params = {
    'line type': 0,
    'world units': matLine.worldUnits,
    'visualize threshold': matThresholdLine.visible,
    'width': matLine.linewidth,
    'alphaToCoverage': matLine.alphaToCoverage,
    'animate': true
};

init();
animate();

function init() {
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(-40, 0, 60);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.enablePan = false;
    controls.minDistance = 50;
    controls.maxDistance = 75;

    const positions = [];
    const colors = [];
    const points = [];

    for (let i = -50; i < 50; i++) {
        const t = i / 3;
        points.push( new THREE.Vector3( t * Math.sin( 3 * t ), t, t * Math.cos( 3 * t ) ) );
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

    line = new Line2( lineGeometry, matLine );
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    scene.add(line);

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    matLine.resolution.set( window.innerWidth, window.innerHeight );
    matThresholdLine.resolution.set( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (params.animate) {
        line.rotation.y += delta * 0.1;
    }

    renderer.render( scene, camera );
}