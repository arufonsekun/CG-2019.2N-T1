import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';

let FlappyBird = () => {

    const MODEL_PATH = './src/models/scene.gltf';
    const GRASS_TEXTURE = './src/textures/grass.jpeg';
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    let loader = new GLTFLoader();
    let sun, groundTexture, groundMaterial, groundMesh, groundGeometry;
    let mousePointerX = 0;
    let mousePointerY = 0;
    var birdModelMesh;

    let init  = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);
        document.body.appendChild(renderer.domElement);
        document.onmousemove = handleMouseMovements;
    }

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

    let loadModelHandler = (model) => {
        var birdModelMesh = model.scene.children[0];
        birdModelMesh.position.z = -200;
        birdModelMesh.scale.x = 0.51;
        birdModelMesh.scale.y = 0.51;
        birdModelMesh.scale.z = 0.51;
        console.log(birdModelMesh);
        scene.add(birdModelMesh);
        sunShine(birdModelMesh);
    }

    let loadBirdModel = () => {
        loader.load(MODEL_PATH, loadModelHandler)
    }

    let sunShine = (birdModel) => {
        sun = new THREE.DirectionalLight(0xffffff, 0.5);
        sun.position.set( 0, 1, 0 );
        sun.castShadow = true;
        sun.target = birdModel;
        scene.add(sun);
    }

    let ground = () => {
        groundTexture = new THREE.TextureLoader().load(GRASS_TEXTURE);
        groundGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        groundMaterial = new THREE.MeshPhongMaterial({color : 0xffffff, map : groundTexture});

        groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.material.map.repeat.set(8, 8);
        groundMesh.material.map.wrapS = groundMesh.material.map.wrapT = THREE.RepeatWrapping;
        groundMesh.receiveShadow = true;
        
        scene.add(groundMesh);
    }

    let animate = () => {
        requestAnimationFrame(animate);

        //birdModelMesh.position.y -= 0.001;

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        loadBirdModel : () => loadBirdModel(),
        sunShine : () => sunShine(),
        ground : () => ground(),
        start : () => animate()
    }
}

let bird = FlappyBird();
bird.init();
bird.loadBirdModel();
//bird.sunShine();
bird.ground();
bird.start();