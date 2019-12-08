import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../../lib/three.js-r110/examples/jsm/loaders/FBXLoader.js';

let Bird = (scene) => {

    const BIRD_MODEL = './src/models/flappy.fbx';
    const BIRD_TEXTURE = './src/textures/flappy-bird.jpeg';
    const offset = 3;
    const POINTING_GROUND = 1.55;
    let loader = new FBXLoader();
    let birdMesh, birdNewTheta;

    let loadModelHandler = (model) =>
    {
        let texture = new THREE.TextureLoader().load(BIRD_TEXTURE);
        
        model.traverse(function(child) {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({ map : texture })
            }
        });

        model.rotation.z = 90 * Math.PI/180;
        model.rotation.x = 90 * Math.PI/180;
        model.rotation.y = -90 * Math.PI/180;

        model.position.x = -400;
        model.position.z = 100;
        model.position.y = 200;

        model.scale.set(0.1, 0.1, 0.1);

        birdMesh = model;

        scene.add(model);
    }

    let loadBirdModel = () =>
    {
        loader.load(BIRD_MODEL, loadModelHandler);
    }

    let fall = (y) =>
    {
        if (birdMesh && birdMesh.position.y - y > 20) {
            birdMesh.position.y -= y;
        }
    }

    let moveForwards = (x) => {
        birdMesh.position.x += x;
    }

    let climb = (y) =>
    {
        if (birdMesh) birdMesh.position.y += y;
    }

    let rotate = (tetha) => {

        if (birdMesh)
            birdNewTheta = birdMesh.rotation.y + tetha;

        if (birdNewTheta < -1.22 && birdNewTheta > -3.0)
            birdMesh.rotation.y += tetha;
    }

    return {
        init : () => loadBirdModel(),
        fall : (y) => fall(y),
        climb : (x) => climb(x), 
        rotate : (tetha) => rotate(tetha), 
        moveForwards : (x) => moveForwards(x)
    }
}

let Pipe = (scene, heightBottom, heightTop, opening, x) => {

    const LEFT_SCREEN_OUT = -1041;
    const RIGHT_SCREEN_OUT = 1041;
    let topPipe, bottomPipe;
    let originalX = null;
    
    if (!originalX)
        originalX = x;

    let init = () =>
    {
        let bottomGeometry = new THREE.CylinderGeometry( 40, 40, heightBottom, 100 );
        let topGeometry = new THREE.CylinderGeometry( 40, 40, heightTop, 100 );
        let material = new THREE.MeshBasicMaterial( {color: 0x00ff00 } );

        topPipe = new THREE.Mesh( topGeometry, material);
        bottomPipe = new THREE.Mesh( bottomGeometry, material );

        bottomPipe.position.y =  heightBottom / 2;
        topPipe.position.y = bottomPipe.position.y + (heightBottom / 2) + (heightTop / 2) + opening;
        
        bottomPipe.position.z = 100;
        topPipe.position.z = 100;
        
        bottomPipe.position.x = x;
        topPipe.position.x = x;

        scene.add(bottomPipe);
        scene.add(topPipe);
    }

    let move = (x) => {

        if (topPipe.position.x < LEFT_SCREEN_OUT) {
            topPipe.position.x = RIGHT_SCREEN_OUT;
            bottomPipe.position.x = RIGHT_SCREEN_OUT;
        }
        else {
            topPipe.position.x -= x;
            bottomPipe.position.x -= x;
        }
        // topPipe.position.x -= x;
        // bottomPipe.position.x -= x;
    }

    let printX = () => {
        console.log("Current x: " + topPipe.position.x);
        console.log("Original x: " + originalX);
    }

    return {
        init : () => init(),
        move : (x) => move(x),
        printX : () => printX()
    }

}

let Game = () => {

    const SPACE = ' ';
    const BACKGROUND = './src/textures/background.jpg';

    let scene = new THREE.Scene();
    let camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    
    let groundMaterial, groundMesh, groundGeometry;
    let controls, bird, pipe;
    let birdRotation = 0.0275;
    let climb = false, speed = 1.5;
    let climbs = 0;
    let pipes = new Array();
    let openings = [150, 200, 250, 300, 350, 100, 404, 600, 330, 320];
    
    let spaceKeyHandler = (e) => {
        
        if (e.key == SPACE) 
        {
            climb = true;
            climbs++;
            birdRotation = 0.0275;
            speed = 1.5;
            bird.rotate(0.058);
            //pipes[0].move(-1.5);
            //pipes[0].printX();
        }
    }

    let printCameraSettings = () => {
        console.log(camera.position.x);
        console.log(camera.position.y);
        console.log(camera.position.z);

        console.log(camera.rotation.x);
        console.log(camera.rotation.y);
        console.log(camera.rotation.z);
    }

    let createControls = () => {

        controls = new OrbitControls(camera, renderer.domElement);

    }

    let setDefaultSettings = () => {

        camera.position.set(1.09, 392, 557.4);
        camera.rotation.set(-0.61, 0.001, 0.0001);
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
        
        let pipe = null;
        let initialPos = 1041;
        
        for (let i=0; i < 10; i++) {
            pipe = Pipe(scene, 50, window.innerHeight, openings[Math.floor(Math.random() * 10)], initialPos);
            pipe.init();
            pipes.push(pipe);
            initialPos += 210;
        }

        /*
        let pipe1 = Pipe(scene, 50, window.innerHeight, 150, 900.5);
        pipe1.init();
        pipes.push(pipe1);

        let pipe2 = Pipe(scene, 100, window.innerHeight, 150, 900.5);
        pipe2.init();
        pipes.push(pipe2);
        
        let pipe3 = Pipe(scene, 150, window.innerHeight, 150, 1100.5);
        pipe3.init();
        pipes.push(pipe3);
        
        let pipe4 = Pipe(scene, 200, window.innerHeight, 150, 1300.5);
        pipe4.init();
        pipes.push(pipe4);
        
        let pipe5 = Pipe(scene, 250, window.innerHeight, 150, 1500.5);
        pipe5.init();
        pipes.push(pipe5);*/

        background();

        addListeners();
        createCanvas();
    }
    
    let ambientLight = () => {

        var lightRight = new THREE.AmbientLight(0xffffff);
        scene.add(lightRight);
    
    }
    
    let ground = () => {
        groundGeometry = new THREE.PlaneBufferGeometry(2000, 1550);
        groundMaterial = new THREE.MeshPhongMaterial({ color : 0x8BC34A });
        
        groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.z = -100;
        
        groundMesh.receiveShadow = true;
        scene.add(groundMesh);
    }

    let background = () => {

        let backgroundTexture = new THREE.TextureLoader().load(BACKGROUND);
        let backgroundGeometry = new THREE.PlaneGeometry(2000, 1100);
        let backgroundMaterial = new THREE.MeshPhongMaterial({color : 0xffffff, map : backgroundTexture});

        let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

        background.position.z = -300;
        background.position.y = 280;

        scene.add(background);
    }

    let animate = () => {
        requestAnimationFrame(animate);

        if (climb && climbs) {
            bird.climb(3.5);
            bird.rotate(0.058);
            climbs++;
            birdRotation = 0.0275;
        }
        
        else {
            bird.fall(speed);
            bird.rotate(-birdRotation);
            birdRotation += 0.0055;
            speed += 0.3;
        }

        if (climbs >= 7)
            climbs = 0;

        for (let pipe of pipes)
        {
            pipe.move(2);
        }

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