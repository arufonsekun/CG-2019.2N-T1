import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../../lib/three.js-r110/examples/jsm/loaders/FBXLoader.js';

let Bird = (scene) => {

    const BIRD_MODEL = './src/models/flappy.fbx';
    const BIRD_TEXTURE = './src/textures/flappy-bird.jpeg';
    const offset = 3;
    const POINTING_GROUND = 1.55;
    let loader = new FBXLoader();
    let birdMesh, birdNewTheta, birdBox;
    let birdHeight, birdWidth;
    var birdDimentions;

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

        model.position.set(-930, 200, 100);
        model.scale.set(0.1, 0.1, 0.1);
        birdMesh = model;

        birdBox = new THREE.Box3().setFromObject(model);
        scene.add(model);
        birdDimentions = birdBox.getSize();
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


    let getHeight = () => {
        if (!birdDimentions) return 0;
        return birdDimentions.y;
    }

    let getWidth = () => {
        if (!birdDimentions) return 0;
        return birdDimentions.x;
    }

    let setZ = (z) => {
        birdMesh.position.z = z;
    }

    let setY = (y) => {
        birdMesh.position.y = y
    }

    let getY = () => {
      return birdMesh.position.y;
    }


    return {
        init : () => loadBirdModel(),
        fall : (y) => fall(y),
        climb : (x) => climb(x),
        rotate : (tetha) => rotate(tetha),
        moveForwards : (x) => moveForwards(x),
        setY : (y) => setY(y),
        getY : () => getY(),
        setZ : (z) => setZ(z),
        getHeight : () => getHeight(),
        getWidth : () => getWidth()
    }
}

let Pipe = (scene, heightBottom, heightTop, opening, x) => {

    const LEFT_SCREEN_OUT = -1041;
    const RIGHT_SCREEN_OUT = 1041;
    let topPipe, bottomPipe;
    let originalX = null;
    let pipeOpening = opening;

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
        topPipe.position.x -= x;
        bottomPipe.position.x -= x;
    }

    let printX = () => {
        console.log("Current x: " + topPipe.position.x);
        console.log("Original x: " + originalX);
    }

    let reset = () => {
        topPipe.position.x = RIGHT_SCREEN_OUT;
        bottomPipe.position.x = RIGHT_SCREEN_OUT;
    }

    let setX = (x) => {
        bottomPipe.position.x = x;
        topPipe.position.x = x;
    }

    let getX = () => {
        return topPipe.position.x;
    }

    let getBottomY = () => {
        return bottomPipe.position.y;
    }

    let getTopY = () => {
        return bottomPipe.position.y * 2 + pipeOpening;
    }

    return {
        init : () => init(),
        move : (x) => move(x),
        reset : () => reset(),
        getX : () => getX(),
        setX : (x) => setX(x),
        getBottomY : () => getBottomY(),
        getTopY : () => getTopY(),
        printX : () => printX()
    }

}

let Game = () => {

    const SPACE = ' ';
    const BACKGROUND = './src/textures/background.jpg';
    const LEFT_SCREEN_OUT = -1041;
    const BIRD_HEIGHT = 48;

    let scene = new THREE.Scene();
    let camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    let renderer = new THREE.WebGLRenderer({antialias:true});

    let groundMaterial, groundMesh, groundGeometry;
    let controls, bird, pipeX, pipeBottomY, pipeTopY, birdY;
    let birdRotation = 0.0275;
    let climb = false, speed = 1.5;
    let climbs = 0, collided = false, dot;
    let pipes = new Array();
    let pipesIndexes = new Array();
    let openings = [150, 200, 250, 300, 350, 100, 404, 600, 330, 320];
    let bottomPipeHeight = [350, 250, 100, 200, 150, 275, 180, 385, 190, 160];
    let frontPipe = null;
    let PIPE_RADIUS = 40, sphere = null;
    let gameStart = false, score = 0, textMesh, scoreTextMesh, climbing = true, endGame = false;
    let scoreMeshes = new Array();

    let spaceKeyHandler = (e) => {

        if (e.key == SPACE) {
            if (!collided) {
                climb = true;
                climbs++;
                birdRotation = 0.0275;
                speed = 1.5;
                bird.rotate(0.058);
                bird.getHeight();
                textMesh.position.z = 1000;
                gameStart = true;
                printCameraSettings();
            }
            else {
                score = 0;
                collided = false;
                endGame = false;
                gameStart = false;
                bird.setY(220);
                resetPipes();

                console.log("perdeu e hito o espaço");
            }
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

        camera.position.set(-164.97475652336848, 505.03319820221066, 532.802501557092);
        camera.rotation.set(-0.7381463293462468, 0.023758150866644467, 0.021607301637374027);

        renderer.setSize(window.innerWidth, window.innerHeight);
        scene.background = new THREE.Color(0x0f0f0f);

    }

    let addListeners = () => {

        document.onkeypress = spaceKeyHandler;

    }

    let createCanvas = () => {

       document.body.appendChild(renderer.domElement);

    }

    let generatePipes = () => {

        let pipe = null;
        let initialPos = 1041;
        let randomNumber = 0;

        for (let i=0; i < 10; i++)
        {
            randomNumber = Math.floor(Math.random() * 10);
            pipe = Pipe(scene, bottomPipeHeight[randomNumber], window.innerHeight, openings[randomNumber], initialPos);
            pipe.init();
            pipes.push(pipe);
            pipesIndexes.push(i);
            initialPos += 210;
        }
    }

    let createText = () => {
        var loader = new THREE.FontLoader();

        loader.load( './../lib/three.js-r110/examples/fonts/helvetiker_regular.typeface.json',
            function ( font ) {
                var textGeometry = new THREE.TextGeometry( 'Press space bar to start!',
                {
                    font: font,
                    size: 70,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: false,
                    bevelThickness: 15,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                let textMaterial = new THREE.MeshPhongMaterial({color:0x0000ff});
                textMesh = new THREE.Mesh(textGeometry, textMaterial);

                textMesh.position.set(-750, 100, 100);
                textMesh.rotation.z = 0.01;

                scene.add(textMesh);
        });

    }

    let init = () => {

        createControls();

        setDefaultSettings();

        bird = Bird(scene);
        bird.init();

        generatePipes();
        updateScoreTextures();

        background();
        createText();

        addListeners();
        createCanvas();
    }

    let updateScoreTextures = () => {

        scene.remove(scene.getObjectByName("score"));

        var loader = new THREE.FontLoader();

        loader.load( './../lib/three.js-r110/examples/fonts/helvetiker_regular.typeface.json',
            function ( font ) {
                var textGeometry = new THREE.TextGeometry( score.toString(),
                {
                    font: font,
                    size: 70,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: false,
                    bevelThickness: 15,
                    bevelSize: 8,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
                let scoreTextMaterial = new THREE.MeshPhongMaterial({color:0xffffff});
                scoreTextMesh = new THREE.Mesh(textGeometry, scoreTextMaterial);

                scoreTextMesh.position.set(-290, 350, 250);
                scoreTextMesh.name = "score";

                scene.add(scoreTextMesh);
        });

    }

    let ambientLight = () => {
        var lightRight = new THREE.AmbientLight(0xffffff);
        scene.add(lightRight);
    }

    let sphereHelper = () => {
        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(-930, 200, 100);
        scene.add( sphere );
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
        background.position.y = 315 ;

        scene.add(background);
    }

    let isOnTheBirdRange = () => {
        return pipeX > -997 && pipeX < -905;
    }

    let checkCollision = () => {

        pipeX = pipes[pipesIndexes[0]].getX() - PIPE_RADIUS;
        pipeBottomY = pipes[pipesIndexes[0]].getBottomY() * 2;
        pipeTopY = pipes[pipesIndexes[0]].getTopY();
        birdY = bird.getY();

        if(isOnTheBirdRange())
        {
            if (birdY - BIRD_HEIGHT / 2 <= pipeBottomY)
                collided = true, bird.setZ(200), textMesh.position.z=250;
            else if(birdY + BIRD_HEIGHT / 2 >= pipeTopY)
                collided = true, bird.setZ(200), textMesh.position.z=250;
            endGame = collided;
        }

    }

    let birdAnimation = () => {

        if (bird.getY() >= 250) {
            climbing = true;
        }
        if (bird.getY() <= 200 && climbing) {
            climbing = false;
        }
        if (!climbing) {
            bird.climb(1.5);
        } else if (climbing) {
            bird.fall(1.5);
        }

    }

    let checkIfHitTheGround = () => {
        birdY = bird.getY();
        collided = birdY < 27;
        endGame = collided;
    }

    let resetPipes = () => {

        let pipeInitialPosition = 1041;

        for (let pipeIndex of pipesIndexes) {
            pipes[pipeIndex].setX(pipeInitialPosition);
            pipeInitialPosition += 210;
        }
    }

    let animate = () => {
        requestAnimationFrame(animate);

        if (gameStart) {
            if (!collided) {
                if (climb && climbs) {
                    bird.climb(3.9);
                    bird.rotate(0.058);
                    climbs++;
                    birdRotation = 0.0275;
                }

                else {
                    bird.fall(speed);
                    bird.rotate(-birdRotation);
                    birdRotation += 0.0055;
                    speed += 0.5;
                }

                if (climbs >= 7)
                    climbs = 0;

                if (pipes[pipesIndexes[0]].getX() < LEFT_SCREEN_OUT) {
                    pipes[pipesIndexes[0]].reset();
                    frontPipe = pipesIndexes.splice(0,1);
                    pipesIndexes.push(frontPipe[0]);
                    score += 1;
                    updateScoreTextures();
                }
                for (let pipeIndex of pipesIndexes)
                {
                    pipes[pipeIndex].move(3.5);
                }

                checkCollision();
                checkIfHitTheGround();
            }

            else {
                bird.fall(speed);
                speed +=3;
            }
        }

        else {
            birdAnimation();
        }


        renderer.render(scene, camera);
    }

    return {
        init : () => init(),
        ground : () => ground(),
        start : () => animate(),
        ambientLight: () => ambientLight(),
        sphereHelper : () => sphereHelper()
    }
}

let game = Game();
game.init();
game.ambientLight();
game.ground();
game.sphereHelper();
game.start();
