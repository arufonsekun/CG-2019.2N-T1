import * as THREE from './three.js-r110/build/three.module.js';
import { GLTFLoader } from './three.js-r110/examples/jsm/loaders/GLTFLoader.js';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the cube
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;

// load 3D model
var loader = new GLTFLoader();

var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('./three.js-r110/examples/js/libs/draco');
loader.setDRACOLoader(dracoLoader);

loader.load(
    './flappy-bird-model/scene.gltf',
    function ( gltf ) {
        scene.add( gltf.scene );
        gltf.animations;
        gltf.scene;
        gltf.scenes;
        gltf.cameras;
        gltf.asset;
    },
    function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + "% loaded");
    },
    function ( error ) { 
        console.error( error )
    }
);


var animate = function() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};
animate();

