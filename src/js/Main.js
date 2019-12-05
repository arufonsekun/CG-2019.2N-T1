import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let Bird = (scene) => {

    const BIRD_MODEL = './src/models/scene.gltf';
    const POINTING_GROUND = 1.55;
    let loader = new GLTFLoader();
    let birdMesh, birdNewTheta;

    let loadModelHandler = (model) =>
    {
        birdMesh = model.scene.children[0];
        birdMesh.scale.x = 0.51;
        birdMesh.scale.y = 0.51;
        birdMesh.scale.z = 0.51;
        birdMesh.position.y = 100;
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
        loader.load(BIRD_MODEL, loadModelHandler);
    }

    let fall = (y) =>
    {
        if (birdMesh && birdMesh.position.y > 0) {
            birdMesh.position.y -= y;
        }
    }

    let climb = (y) =>
    {
        if (birdMesh) birdMesh.position.y += y;
    }

    let rotate = (tetha) => {

        birdNewTheta = birdMesh.rotation.y + tetha;

        if (birdNewTheta < 1.55 && birdNewTheta > -0.48)
            birdMesh.rotation.y += tetha;
    }

    return {
        init : () => loadBirdModel(),
        fall : (y) => fall(y),
        climb : (x) => climb(x), 
        rotate : (tetha) => rotate(tetha)
    }
}

let Pipe = (scene, opening) => {

    let topPipe, bottomPipe;

    let init = () =>
    {
        let geometry = new THREE.CylinderGeometry( 40, 40, 200, 32 );
        let material = new THREE.MeshBasicMaterial( {color: 0xeeeeee } );

        topPipe = new THREE.Mesh( geometry, material );
        bottomPipe = new THREE.Mesh( geometry, material );

        bottomPipe.position.y = 100;
        topPipe.position.y = 300 + opening;
        
        scene.add( bottomPipe )
        scene.add( topPipe );
    }

    let move = (x) => {
        topPipe.position.x -= x;
        bottomPipe.position.x -= x;
        
    }

    return {
        init : () => init(),
        move : (x) => move(x)
    }

}

let Game = () => {

    const SPACE = ' ';
    const BACKGROUND = './src/textures/background.jpeg';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    
    let sun, groundMaterial, groundMesh, groundGeometry;
    let controls, bird, pipe;
    let birdRotation = 0.0275;
    let climb = false, speed = 1.5;
    let climbs = 0;
    
    let spaceKeyHandler = (e) => {
        
        if (e.key == SPACE) 
        {
            climb = true;
            climbs++;
            birdRotation = 0.0275;
            speed = 1.5;
        }

        if (e.key == 'r')
        {
            bird.rotate(birdRotation);
        }
    }

    let createControls = () => {

        controls = new OrbitControls(camera, renderer.domElement);

    }

    let setDefaultSettings = () => {

        camera.position.set(-320.6, 164.2, 541.9);
        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);

    }

    let addListeners = () => {
        
        document.onkeypress = spaceKeyHandler;

    }

    let createCanvas = () => {
    
       document.body.appendChild(renderer.domElement);

    }

    let init  = () => {

        createControls();
        
        setDefaultSettings();

        bird = Bird(scene);
        bird.init();
        
        pipe = Pipe(scene, 100);
        pipe.init();

        background();

        addListeners();
        createCanvas();
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

    let background = () => {

        let backgroundTexture = new THREE.TextureLoader().load(BACKGROUND);
        let backgroundGeometry = new THREE.PlaneGeometry(2000, 2000);
        let backgroundMaterial = new THREE.MeshPhongMaterial({color : 0xffffff, map : backgroundTexture});

        let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

        background.position.z = -300;

        //background.rotation.x = - Math.PI / 2;
        //background.rotation.y = Math.PI / 2;

        scene.add(background);

    }

    let animate = () => {
        requestAnimationFrame(animate);

        if (climb && climbs) {
            bird.climb(3.5);
            bird.rotate(-0.058);
            climbs++;
        }
        
        else {
            bird.fall(speed);
            bird.rotate(birdRotation);
            birdRotation += 0.0001;
            speed += 0.1;
        }

        if (climbs >= 7)
            climbs = 0;
        // pipe.move(1.5);

        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
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