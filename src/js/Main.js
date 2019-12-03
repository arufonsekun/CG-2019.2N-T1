import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let Bird = (scene) => {

    const BIRD_MODEL = './src/models/scene.gltf';
    let loader = new GLTFLoader();
    let birdMesh;

    let loadModelHandler = (model) =>
    {
        birdMesh = model.scene.children[0];
        birdMesh.scale.x = 0.51;
        birdMesh.scale.y = 0.51;
        birdMesh.scale.z = 0.51;
        birdMesh.position.x = -500;
        scene.add(birdMesh);
        
        focusSpotLight(birdMesh);

        return birdMesh;
    }

    let focusSpotLight = (birdModel) => {
        let spotLight = new THREE.DirectionalLight(0xffffff, 0.5);
        spotLight.position.set( 0, 1, 0 );
        spotLight.castShadow = true;
        spotLight.target = birdModel;
        scene.add(spotLight);
    }

    let loadBirdModel = () =>
    {
        birdMesh = loader.load(BIRD_MODEL, loadModelHandler);
    }

    let fall = (y) =>
    {
        birdMesh.position.y -= y;
    }

    let climb = (y) =>
    {
        birdMesh.position.y += y;
    }

    let getBird = () =>
    {
        return birdMesh;
    }

    return {
        getBird : () => getBird(),
        init : () => loadBirdModel(),
        fall : (y) => fall(y),
        climb : (x) => climb(x)
    }
}

let Game = () => {

    const SPACE = ' ';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true}), bird;
    
    let sun, groundMaterial, groundMesh, groundGeometry;
    let controls;
    
    let spaceKeyHandler = (e) => {
        if (e.key == SPACE)
        { 
            bird.climb(10);
        }
    }

    let init  = () => {
        
        camera.position.set(-320.6, 164.2, 541.9);
        controls = new OrbitControls(camera, renderer.domElement);

        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);
        
        bird = Bird(scene);
        bird.init();

        document.body.appendChild(renderer.domElement);
        document.onkeypress = spaceKeyHandler;

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

        if (bird) { bird.fall(1.5); }

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        sunShine : () => sunShine(),
        ground : () => ground(),
        start : () => animate(),
        ambientLight: () => ambientLight()
    }
}

let game = Game();
game.init();
game.ambientLight();
game.ground();
game.start();