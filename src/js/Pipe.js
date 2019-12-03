import * as THREE from '../../lib/three.js-r110/build/three.module.js';

let Pipe = (x=0, y=0, z=0, scene) => {

    var topGeometry = new THREE.CylinderGeometry( 50, 50, 150, 32 );
    var topMaterial = new THREE.MeshBasicMaterial( {color: 0xeeffee} );
    var topCylinder = new THREE.Mesh( topMaterial, topGeometry );
        
    var bottomGeometry = new THREE.CylinderGeometry( 50, 50, 150, 32 );
    var bottomMaterial = new THREE.MeshBasicMaterial( {color: 0xeeffee} );
    var bottomCylinder = new THREE.Mesh( bottomMaterial, bottomGeometry);

    topCylinder.position.y = y;
    topCylinder.position.x = x;
    topCylinder.position.z = z;
    bottomCylinder.position.y = y;
    bottomCylinder.position.x = x;
    bottomCylinder.position.z = z;

    scene.add( topCylinder );
    scene.add( bottomCylinder );

    let move = () => {
        topCylinder.position.y -= 1;
        bottomCylinder.position.y -= 1;
    }

    return
    {
        move : () => move()
    }

}