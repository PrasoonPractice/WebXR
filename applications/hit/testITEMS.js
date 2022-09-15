//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
import { loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
	const initialize = async() => {
		//create scene and camera
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
		//create light
		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add(light);
		//create a reticle to mark the hit test succes location
		const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    		const reticleMaterial = new THREE.MeshBasicMaterial(); 
    		const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    		reticle.matrixAutoUpdate = false;
		//make the reticle idealy not visible and add it to scene
    		reticle.visible = false;
    		scene.add(reticle);
		console.log("reticle added");
		//lod the 3d model using a loder object
		const loader = new GLTFLoader();
		console.log("loader");
		let avatar;
		await loader.load(
			'../Project1/person/scene.gltf',
			function (gltf) {
				avatar = gltf.scene;
				console.log("avatar loaded");
				avatar.position.x = reticle.position.x - 0.03;
				avatar.position.y = reticle.position.y + 0.08;
				avatar.position.z = reticle.position.z - 0.05;
				avatar.visible = false;
				scene.add(avatar);
								
			},
			function (loading) {
				console.log("loading avatar");
				
			}
		);
		const [
            playTexture,
            cardTexture,
            webTexture,
            locationTexture,
            callTexture,
            messageTexture,
            emailTexture,
        ] = await loadTextures([
            './Project1/play.png',
            './Project1/card.png',
            './Project1/web.png',
            './Project1/location.png',
            './Project1/call.png',
            './Project1/message.png',
            './Project1/email.png'
        ]);

        const planeGeometry = new THREE.PlaneGeometry(1.63, 0.5);
        const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        const card = new THREE.Mesh(planeGeometry, cardMaterial);
        //const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        //const card = new THREE.Sprite(cardMaterial);
        card.position.set(reticle.position.x + 0.5,reticle.position.y + 0.4,reticle.position.z);
        
        //const labelGeometry = new THREE.PlaneBufferGeometry(1.63, 0.5);

        const iconGeometry = new THREE.CircleGeometry(0.15, 32);
        const mapiconGeometry = new THREE.CircleGeometry(0.2, 32);
        const playMaterial = new THREE.MeshBasicMaterial({ map: playTexture });
        const webMaterial = new THREE.MeshBasicMaterial({ map: webTexture });
        const locationMaterial = new THREE.MeshBasicMaterial({ map: locationTexture });
        const callMaterial = new THREE.MeshBasicMaterial({ map: callTexture });
        const messageMaterial = new THREE.MeshBasicMaterial({ map: messageTexture });
        const emailMaterial = new THREE.MeshBasicMaterial({ map: emailTexture });

        const playIcon = new THREE.Mesh(iconGeometry, playMaterial);
        const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
        const locationIcon = new THREE.Mesh(mapiconGeometry, locationMaterial);
        const callIcon = new THREE.Mesh(iconGeometry, callMaterial);
        const messageIcon = new THREE.Mesh(iconGeometry, messageMaterial);
        const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);

        playIcon.position.set(reticle.position.x - 0.80, reticle.position.y + 0.38,reticle.position.z + 0.05);
        webIcon.position.set(reticle.position.x - 0.14, reticle.position.y - 0.60, reticle.position.z );
        locationIcon.position.set(reticle.position.x + 0.16, reticle.position.y - 0.60, reticle.position.z - 0.02);
        callIcon.position.set(reticle.position.x + 0.46, reticle.position.y - 0.60, reticle.position.z);
        messageIcon.position.set(reticle.position.x + 0.76, reticle.position.y - 0.60, reticle.position.z);
        emailIcon.position.set(reticle.position.x + 1.06, reticle.position.y - 0.60, reticle.position.z);

		playIcon.userData.clickable = true;
        webIcon.userData.clickable = true;
        locationIcon.userData.clickable = true;
        callIcon.userData.clickable = true;
        messageIcon.userData.clickable = true;
        emailIcon.userData.clickable = true;
		
		const items = new THREE.Group();
		item.add(
			playIcon, 
			webIcon,
			locationIcon,
			callIcon,
			messageIcon,
			emailIcon
			);

		//Create a renderer
		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    		renderer.setPixelRatio(window.devicePixelRatio);
    		renderer.setSize(window.innerWidth, window.innerHeight);
    		renderer.xr.enabled = true;
		//creat a button to request an XR session
		const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    		document.body.appendChild(renderer.domElement);
    		document.body.appendChild(arButton);
		//create a counter variable to use as a check for number of models shown
		var counter = false;
		//create a controller object to store co ordinate information about any user input event
		const controller = renderer.xr.getController(0);
		scene.add(controller);
		//create an event listner on how to respond if a click or tap event occures
		controller.addEventListener('select', () => {
			console.log("select");
			if (reticle.visible && avatar) {
				avatar.scale.set(0.005, 0.005, 0.005);
				avatar.visible = true;
				console.log(avatar);
				console.log("Avatar rendered at reticle");
				reticle.visible = false;
				counter = true;
				console.log("counter is now true");
			}
			
			//always use the reticle.matrix to set/compare position
			//mesh.position.setFromMatrixPosition(reticle.matrix);
      			//mesh.scale.y = Math.random() * 2 + 1;
			//scene.add(mesh);
		});
		//creat an event listner for when an event occure once an event start
		renderer.xr.addEventListener("sessionstart", async (e) => {
			const session = renderer.xr.getSession();
			const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
			const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
			//start a render loop i.e., to determine the runtime activities
			renderer.setAnimationLoop((timestamp, frame) => {
				if (!frame) return;

				const hitTestResults = frame.getHitTestResults(hitTestSource);

				if (hitTestResults.length) {
					const hit = hitTestResults[0];
					const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
					const hitPose = hit.getPose(referenceSpace);
					//show where the x,y,z origin will be set in case of an event
					if (!counter) {
						reticle.visible = true;
						reticle.matrix.fromArray(hitPose.transform.matrix);
					}
					
				} else {
					reticle.visible = false;
				}
				//render scene and camera
				renderer.render(scene, camera);
				
			});
		});

    		renderer.xr.addEventListener("sessionend", () => {
      			console.log("session end");
    		});
		
	}
  initialize();
});