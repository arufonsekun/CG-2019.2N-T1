import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';

let FlappyBird = () => {

    const MODEL_PATH = './src/models/scene.gltf';
    const GRASS_TEXTURE = '../textures/grass.jpeg';
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    let loader = new GLTFLoader();
    let birdModelMesh, sun, groundTexture, groundMaterial, groundGeometry;

    let init  = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0xeeeeee);
    }

    let loadModelHandler = (model) => {
        birdModelMesh = model.scene.children[0];
        birdModelMesh.position.z = -200;
        birdModelMesh.scale = (2,2,2);
        scene.add(birdModelMesh);
    }

    let loadBirdModel = () => {
        loader.load(MODEL_PATH, loadModelHandler)
    }

    let sunShine = () => {
        sun = new THREE.DirectionalLight(0xffffff, 0.5);
        scene.add(sun);
    }

    let ground = () => {
        groundTexture = new THREE.TextureLoader().load("../")
    }

    let start = () => {
        requestAnimationFrame(start);

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        loadBirdModel : () => loadBirdModel(),
        sunShine : () => sunShine(),
        ground : () => ground(),
        start : () => start()
    }
}

let bird = FlappyBird();
bird.init();
bird.loadBirdModel();
bird.sunShine();
bird.ground();
bird.start();