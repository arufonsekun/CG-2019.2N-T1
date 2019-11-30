import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '../../lib/three.js-r110/examples/jsm/controls/OrbitControls.js';

let FlappyBird = () => {

    const SKY_TEXTURE = './src/textures/sky.jpeg';
    const front = './src/textures/plane-box-front.jpg';
    const back = './src/textures/plane-box-back.jpg';
    const bottom = './src/textures/plane-box-bottom.jpg';
    const top = './src/textures/plane-box-top.jpg';
    const left = './src/textures/plane-box-left.jpg';
    const right = './src/textures/plane-box-right.jpg';

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);
    let renderer = new THREE.WebGLRenderer({antialias:true});
    
    let init  = () => {
        camera.position.set(-900,-200,-900);
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', renderer);
        controls.minDistance = 50;
        controls.maxDistance = 150;
        renderer.setSize(window.innerWidth, window.innerHeight);
        //scene.background = new THREE.Color(0x0f0f0f);
        document.body.appendChild(renderer.domElement);
    }
    
    let world = () => {
        let worldBoxMaterial = [];
        let textureFT = new THREE.TextureLoader().load(front);
        let textureBK = new THREE.TextureLoader().load(back);
        let textureTP = new THREE.TextureLoader().load(top);
        let textureBT = new THREE.TextureLoader().load(bottom);
        let textureRT = new THREE.TextureLoader().load(right);
        let textureLT = new THREE.TextureLoader().load(left);

        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureFT }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureBK }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureTP }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureBT }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureRT }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureRT }));
        worldBoxMaterial.push(new THREE.MeshBasicMaterial({ map : textureLT }));

        let worldBoxGeometry = new THREE.BoxGeometry(100, 100, 100);
        let boxWorld = new THREE.Mesh(worldBoxGeometry, worldBoxMaterial);

        for (let i=0; i < 6; i++)
            worldBoxMaterial[i].side = THREE.BackSide

        scene.add(boxWorld);
    }

    let animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);

    }

    return {
        init : () => init(),
        world: () => world(),
        start : () => animate(),
    }
}

let bird = FlappyBird();
bird.init();
bird.world();
bird.start();