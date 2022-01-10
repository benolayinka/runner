function init() {

	/////////////////////
	///   MISC
	/////////////////////

	clock = new THREE.Clock();

	var manager = new THREE.LoadingManager();

	gltfLoader = new THREE.GLTFLoader(manager);
	var dracoLoader = new THREE.DRACOLoader();

	dracoLoader.setDecoderPath( 'libs/draco/' )
	gltfLoader.setDRACOLoader( dracoLoader );

	textureLoader = new THREE.TextureLoader();
	fileLoader = new THREE.FileLoader()

	// CAMERA

	scene = new THREE.Scene();

	const aspectRatio = window.innerWidth / window.innerHeight;
	const cameraWidth = 960;
	const cameraHeight = cameraWidth / aspectRatio;

	camera = new THREE.OrthographicCamera(
		cameraWidth / -2, // left
		cameraWidth / 2, // right
		cameraHeight / 2, // top
		cameraHeight / -2, // bottom
		50, // near plane
		2000 // far plane
	);

	// camera = new THREE.PerspectiveCamera( 
	// 	600, // fov
	// 	aspectRatio, // aspect
	// 	50, // near
	// 	700 // far
	// );


	camera.position.set(0, -500, 1000);
	camera.lookAt(0, 0, 0);

	renderMap(cameraWidth, cameraHeight * 2); // The map height is higher because we look at the map from an angle

	// addTeufel()

	addTurm()

	// Set up lights
	ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
	dirLight.position.set(100, -300, 300);
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 1024;
	dirLight.shadow.mapSize.height = 1024;
	dirLight.shadow.camera.left = -400;
	dirLight.shadow.camera.right = 350;
	dirLight.shadow.camera.top = 400;
	dirLight.shadow.camera.bottom = -300;
	dirLight.shadow.camera.near = 100;
	dirLight.shadow.camera.far = 800;
	scene.add(dirLight);

	if (config.grid) {
		const gridHelper = new THREE.GridHelper(80, 8);
		gridHelper.rotation.x = Math.PI / 2;
		scene.add(gridHelper);
	}

	//////////////
	/// RENDERER
	//////////////

	renderer = new THREE.WebGLRenderer();

	renderer.autoClear = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true ;

	document.body.appendChild(renderer.domElement);

	// anti-aliasing setup

	var renderPass = new THREE.RenderPass( scene, camera );

	fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );

	var pixelRatio = renderer.getPixelRatio();

	fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * pixelRatio );
	fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * pixelRatio );

	composer = new THREE.EffectComposer( renderer );
	composer.addPass( renderPass );
	composer.addPass( fxaaPass );

	// CHAR

	chars = Chars()

	charSpeed = 0

	manager.onLoad = function() {

			manager.onLoad = function() {};

			updateCharacters(playerData)

			loop();

	};

	window.addEventListener( 'resize', ()=> {

	    if ( camera ) {

	        // Adjust camera
	        const newAspectRatio = window.innerWidth / window.innerHeight;
	        
	        // ortho

	        const adjustedCameraHeight = cameraWidth / newAspectRatio;

	        camera.top = adjustedCameraHeight / 2;
	        camera.bottom = adjustedCameraHeight / -2;

	        // perspective

	        // camera.aspect = newAspectRatio

	        camera.updateProjectionMatrix(); // Must be called after change

	        // Reset renderer
	        renderer.setSize(window.innerWidth, window.innerHeight);
	        renderer.render(scene, camera);
	    };
	});

};