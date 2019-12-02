import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let FlappyBird = () => {

    const MODEL_PATH = './src/models/scene.gltf';
    const GRASS_TEXTURE = './src/textures/grass.jpeg';
    const SKY_TEXTURE = './src/textures/sky.jpeg';
    const SPACE = ' ';
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    let loader = new GLTFLoader();
    let sun, groundTexture, groundMaterial, groundMesh, groundGeometry;
    let mousePointerX = 0;
    let mousePointerY = 0;
    let birdModelMesh;
    let rotation = 0.01;
    let iteration = 0;
    let pipes = new Array();
    
    let spaceKeyHandler = (e) => {
        if (e.key == SPACE) {
            birdModelMesh.position.y += 10;
            iteration = 1;
            rotation = -0.01;
        }
    }

    let init  = () => {
        camera.position.set(-670,250,10);
        let controls = new OrbitControls(camera, renderer.domElement);
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);
        document.body.appendChild(renderer.domElement);
        document.onkeypress = spaceKeyHandler;
    }
    
    let loadModelHandler = (model) => {
        birdModelMesh = model.scene.children[0];
        //birdModelMesh.position.z = -200;
        birdModelMesh.scale.x = 0.51;
        birdModelMesh.scale.y = 0.51;
        birdModelMesh.scale.z = 0.51;
        birdModelMesh.position.x = -500;
        scene.add(birdModelMesh);
        sunShine(birdModelMesh);
        
        return birdModelMesh;
    }
    
    let createPipes = () => {
        var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var cylinder = new THREE.Mesh( geometry, material );
        
        cylinder.position = (0,100,0);

        pipes.push(cylinder);

        scene.add( cylinder );
    }

    let loadBirdModel = () => {
        birdModelMesh = loader.load(MODEL_PATH, loadModelHandler)
    }
    
    let sunShine = (birdModel) => {
        sun = new THREE.DirectionalLight(0xffffff, 0.5);
        sun.position.set( 0, 1, 0 );
        sun.castShadow = true;
        sun.target = birdModel;
        scene.add(sun);
    }
    
    let ambientLight = () => {

        var lightRight = new THREE.AmbientLight(0xffffff);
        // var lightLeft = new THREE.AmbientLight(0xf0ffff);

        //lightLeft.position.z = -1000;

        //scene.add(lightLeft);
        scene.add( lightRight );
    
    }
    
    let ground = () => {
        groundGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        groundMaterial = new THREE.MeshPhongMaterial({ color : 0x6B8E23 });
        
        groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);
    }

    let animate = () => {
        requestAnimationFrame(animate);

        birdModelMesh.position.y -= 1;
        // birdModelMesh.rotation.y += rotation;

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        loadBirdModel : () => loadBirdModel(),
        sunShine : () => sunShine(),
        ground : () => ground(),
        start : () => animate(),
        ambientLight: () => ambientLight()
    }
}

let bird = FlappyBird();
bird.init();
bird.loadBirdModel();
bird.ambientLight();
bird.ground();
bird.start();