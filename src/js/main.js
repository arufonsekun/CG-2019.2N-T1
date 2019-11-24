let world = () => {
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var elements = new Object();
    let mousePointerX = 0;

    let handleMouseMovements = (e) => {
        if(!mousePointerX) mousePointerX = e.clientX;

        if (mousePointerX > e.clientX)
            camera.rotation.y += (mousePointerX - e.clientX) / 100;
        else
            camera.rotation.y -= (e.clientX - mousePointerX) / 100;
        mousePointerX = e.clientX;
        e.preventDefault();
    }

    let init = () => {

        camera.position.set(0,150,400);
        scene.background = new THREE.Color(0x050505);
        scene.fog = new THREE.Fog(0x050505, 400, 1000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        window.onmousemove = handleMouseMovements;

    }

    let ambientLight = () => {
        
        scene.add(new THREE.AmbientLight(0x222222));

        let light = new THREE.SpotLight(0xffffff, 5, 1000);
        light.position.set(200, 250, 500);
        light.angle = 3;
        light.penumbra = 0.5;

        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        scene.add(light);

        let light1 = new THREE.SpotLight(0xffffff, 5, 1000);
        light1.position.set(- 100, 350, 350);
        light1.angle = 2;
        light1.penumbra = 0.5;

        light1.castShadow = true;
        light1.shadow.mapSize.width = 1024;
        light1.shadow.mapSize.height = 1024;

        scene.add(light1);
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
        let groundTexture = new THREE.TextureLoader().load("./texture/ground.png");
        let groundGeometry = new THREE.PlaneBufferGeometry(2000, 2000);
        let groundMesh = new THREE.MeshPhongMaterial({color: 0xffffff, map : groundTexture});

        let ground = new THREE.Mesh(groundGeometry, groundMesh);

        ground.rotation.x = - Math.PI / 2;
        ground.material.map.repeat.set(8, 8);
        ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.receiveShadow = true;

        scene.add(ground);

    }

    let updateScreen = () => {
        
        let animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };
        animate();

    }

    return {
        init : () => init(),
        updateScreen : () => updateScreen(),
        createCube : () => createCube(),
        createGround: () => createGround(),
        ambientLight: () => ambientLight()
    }
}

let minecraft = world();
minecraft.init();
minecraft.ambientLight();
minecraft.createGround();
minecraft.updateScreen();