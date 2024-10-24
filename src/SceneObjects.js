import * as THREE from 'three'

import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

import holographicVertexShader from './shaders/holographic/vertex.glsl';
import holographicFragmentShader from './shaders/holographic/fragment.glsl';
import rainbowVertexShader from './shaders/rainbow/vertex.glsl';
import rainbowFragmentShader from './shaders/rainbow/fragment.glsl';

export default class SceneObjects {
    constructor(scene, sizes) {
        this.scene = scene;
        this.sizes = sizes;
        this.distance = 4;
        this.parameters = { materialColor: '#ffeded' };
        this.textureLoader = new THREE.TextureLoader();
        this.rainbowMaterial = null;
        this.sectionMeshes = this._generateSectionMeshes();
        this.particles = this._generateBackgroundParticles();
        this.spiral = this._generateBackgroundSpiral();
        this.adjustPositions(sizes);
    }

    animate(elapsedTime) {
        if (this.rainbowMaterial) {
            this.rainbowMaterial.uniforms.uTime.value = elapsedTime;
        }
    }

    rotate(deltaTime) {
        for (const mesh of this.sectionMeshes) {
            mesh.rotation.x += deltaTime * 0.1;
            mesh.rotation.y += deltaTime * 0.12;
        }

        this.spiral.rotation.y += deltaTime * 0.15;
    }

    adjustPositions(sizes) {
        const isMobile = sizes.width < 1024;

        this.sectionMeshes.forEach((mesh, index) => {
            if (isMobile) {
                mesh.position.x = 0;
            } else {
                const xPosition = this._calculateXPosition(sizes.height);
                mesh.position.x = index % 2 === 0 ? xPosition : -xPosition;
            }
        })
    }

    _calculateXPosition(height) {
        if (height <= 200) {
            return 10;
        } else {
            return 2000 / height;
        }
    }

    _generateBackgroundSpiral() {
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
                alphaToCoverage: false,
                depthWrite: true,
            })
        );
        line.computeLineDistances();
        line.scale.set(1, 1, 1);
        line.position.set(0, -5, -20);

        this.scene.add(line);

        return line;
    }

    _generateBackgroundParticles() {
        const particlesCount = 200;
        const positions = new Float32Array(particlesCount * 3);
    
        for (let i = 0; i < particlesCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = this.distance * 0.5 - Math.random() * this.distance * this.sectionMeshes.length
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
    
        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
        const particlesMaterial = new THREE.PointsMaterial({
            color: this.parameters.materialColor,
            sizeAttenuation: true,
            size: 0.03
        });
    
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        return particles;
    }

    _generateSectionMeshes() {
        const gradientTexture = this.textureLoader.load('./assets/textures/gradients/3.jpg')
        gradientTexture.magFilter = THREE.NearestFilter

        const toonMaterial = new THREE.MeshToonMaterial({
            color: this.parameters.materialColor,
            gradientMap: gradientTexture
        })

        const hologramMaterial = new THREE.ShaderMaterial({ 
            vertexShader: holographicVertexShader,
            fragmentShader: holographicFragmentShader,
            transparent: true,
            uniforms: { uColor: new THREE.Uniform(new THREE.Color('white')) },
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        this.rainbowMaterial = new THREE.ShaderMaterial({
            vertexShader: rainbowVertexShader,
            fragmentShader: rainbowFragmentShader,
            uniforms: { uTime: { value: 0 } },
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
    
        const mesh1 = new THREE.Mesh(new THREE.OctahedronGeometry(), hologramMaterial);
        const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(), this.rainbowMaterial);
        const mesh3 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), toonMaterial);
    
        mesh1.position.x = this.sizes.width < 1024 ? 0 : 2;
        mesh2.position.x = this.sizes.width < 1024 ? 0 : -2;
        mesh3.position.x = this.sizes.width < 1024 ? 0 :  2;
    
        mesh1.position.y = - this.distance * 0;
        mesh2.position.y = - this.distance * 1;
        mesh3.position.y = - this.distance * 2;
    
        this.scene.add(mesh1, mesh2, mesh3);
    
        return [mesh1, mesh2, mesh3];
    }
}