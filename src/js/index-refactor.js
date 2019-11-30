import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let FlappyBird = () => {

    const MODEL_PATH = './src/models/scene.gltf';
    const GRASS_TEXTURE = './src/textures/grass.jpeg';
    const SKY_TEXTURE = './src/textures/sky.jpeg';
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    let loader = new GLTFLoader();
    let sun, groundTexture, groundMaterial, groundMesh, groundGeometry;
    let mousePointerX = 0;
    let mousePointerY = 0;
    var birdModelMesh;
    
    let init  = () => {
        camera.position.set(0,250,100);
        let controls = new OrbitControls(camera, renderer.domElement);
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);
        document.body.appendChild(renderer.domElement);
    }
    
    let loadModelHandler = (model) => {
        var birdModelMesh = model.scene.children[0];
        birdModelMesh.position.z = -200;
        birdModelMesh.scale.x = 0.51;
        birdModelMesh.scale.y = 0.51;
        birdModelMesh.scale.z = 0.51;
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
    
    let ambientLight = () => {
        let light = new THREE.SpotLight(0xffffff, 5, 1000);
        light.position.set(200, 250, 500);
        light.angle = 3;
        light.penumbra = 0.5;
        
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        
        scene.add(light);
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