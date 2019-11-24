let world = () => {
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var elements = new Object();

    let init = () => {

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

    }

    let createCube = () => {
        let geometry = new THREE.BoxGeometry(1,1,1);
        let material = new THREE.MeshBasicMaterial({color : 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        elements['cube'] = cube;

        camera.position.z = 5;
    }

    let createGround = () => {
        
    }

    let updateScreen = () => {
        
        let animate = () => {
            requestAnimationFrame(animate);
        
            elements['cube'].rotation.x += 0.01;
            elements['cube'].rotation.y += 0.01;
        
            renderer.render(scene, camera);
        };
        animate();

    }

    return {
        init : () => init(),
        updateScreen : () => updateScreen(),
        createCube : () => createCube()
    }
}

let minecraft = world();
minecraft.init();
minecraft.createCube();
minecraft.updateScreen();