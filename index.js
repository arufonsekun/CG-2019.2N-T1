import * as THREE from './lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from './lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';

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

/*var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('./three.js-r110/examples/js/libs/draco');
loader.setDRACOLoader(dracoLoader);*/

loader.load(
    './src/models/scene.gltf',
    function ( gltf ) {
        var mesh = gltf.scene.children[0];
        scene.add(mesh);
        mesh.position.z = -200;
        mesh.scale = (2,2,2);
    }
);

scene.background = new THREE.Color(0x0f0f0f);

let mousePointerX = 0;
let mousePointerY = 0;

let handleMouseMovements = (e) => {
    if(!mousePointerX) mousePointerX = e.clientX;
    if(!mousePointerY) mousePointerY = e.clientY;

    if (mousePointerX > e.clientX)
        camera.rotation.y += (mousePointerX - e.clientX) / 100;
    else
        camera.rotation.y -= (e.clientX - mousePointerX) / 100;

    if (mousePointerY > e.clientY)
        camera.rotation.x += (mousePointerY - e.clientY) / 100;
    else
        camera.rotation.x -= (e.clientY - mousePointerY) / 100;

    
    mousePointerX = e.clientX;
    mousePointerY = e.clientY;
    e.preventDefault();
}

let ambientLight = () => {
        
    scene.add(new THREE.AmbientLight(0x222222));

    let light = new THREE.SpotLight(0xffffff, 5, 1000);
    light.position.set(200, 250, 500);
    light.angle = 3;
    light.penumbra = 0.5;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    scene.add(light);

    let light1 = new THREE.SpotLight(0xffffff, 5, 1000);
    light1.position.set(- 100, 350, 350);
    light1.angle = 2;
    light1.penumbra = 0.5;

    light1.castShadow = true;
    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;

    scene.add(light1);
}

window.onmousemove = handleMouseMovements;
ambientLight();

var animate = function() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
};
animate();

