import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let Game = () => {

    const MODEL_PATH = './src/models/scene.gltf';
    const SPACE = ' ';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    let loader = new GLTFLoader();
    
    let sun, groundMaterial, groundMesh, groundGeometry;
    let birdModelMesh, controls;
    
    let spaceKeyHandler = (e) => {
        if (e.key == SPACE) {
            birdModelMesh.position.y += 10;
            iteration = 1;
            rotation = -0.01;
        }
    }

    let init  = () => {
        
        camera.position.set(-670,250,10);
        controls = new OrbitControls(camera, renderer.domElement);

        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);
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
        
        birdModelMesh.position.y -= 1;

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        loadBirdModel : () => loadBirdModel(),
        sunShine : () => sunShine(),
        ground : () => ground(),
        start : () => animate(),
        ambientLight: () => ambientLight(),
        createPipes: () => createPipes()
    }
}

let game = Game();
game.init();
game.loadBirdModel();
game.ambientLight();
game.ground();
game.createPipes();
game.start();