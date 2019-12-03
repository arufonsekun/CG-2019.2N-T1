import * as THREE from '../../lib/three.js-r110/build/three.module.js';
import { GLTFLoader } from '../../lib/three.js-r110/examples/jsm/loaders/GLTFLoader.js';

let FlappyBird = () => {

    let loader = new GLTFLoader();
    let birdMesh;

    let loadModelHandler = (model) => {
        let birdModelMesh = model.scene.children[0];
        birdModelMesh.scale.x = 0.51;
        birdModelMesh.scale.y = 0.51;
        birdModelMesh.scale.z = 0.51;
        birdModelMesh.position.x = -500;
        scene.add(birdModelMesh);
        sunShine(birdModelMesh);
        
        return birdModelMesh;
    }

    let loadBirdModel = (modelPath) => {
        birdMesh = loader.load(modelPath, loadModelHandler)
    }

    let getBird = () => {
        return birdMesh;
    }

    return {
        getBird : () => getBird(),
        init : (modelPath) => loadBirdModel(modelPath) 
    }
}