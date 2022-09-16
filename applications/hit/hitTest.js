//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
import { loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

const name = "Prasoon Srivastava";
function makeLabelCanvas(size, name) {
	const borderSize = 2;
	const ctx = document.createElement('canvas').getContext('2d');
	const font = `oblique ${size}px lighter sans-serif`;
	ctx.font = font;
	// measure how long the name will be
	const doubleBorderSize = borderSize * 2;
	const width = ctx.measureText(name).width + doubleBorderSize;
	const height = size + doubleBorderSize;
	ctx.canvas.width = width;
	ctx.canvas.height = height;
	
	// need to set font again after resizing canvas
	ctx.font = font;
	ctx.textBaseline = 'top';

	ctx.fillStyle = 'rgba(0,0,0,0)';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = '#ffffff';
	//ctx.fillStyle = 'rgba(245,136,20,0.99)';
	ctx.fillText(name, borderSize, borderSize);
	
	return ctx.canvas;
}       


document.addEventListener('DOMContentLoaded', () => {
	const initialize = async() => {
		//create scene and camera
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
		//create light
		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add(light);
		//creat a group to bind all the objects
		const items = new THREE.Group();
		
		const canvas =  makeLabelCanvas(20, name);
		const texture = new THREE.CanvasTexture(canvas);
		// because our canvas is likely not a power of 2
		// in both dimensions set the filtering appropriately.
		texture.minFilter = THREE.LinearFilter;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;

		const labelMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			side: THREE.DoubleSide,
			transparent: true,
		});
		
		const planeGeometry = new THREE.PlaneGeometry(0.815, 0.25);
		const label = new THREE.Mesh(planeGeometry, labelMaterial);
		label.position.set(0.2, -0.285, -2.25);
		console.log("Lable generated");
		const xPose = label.position.x;
		const yPose = label.position.y;
		const zPose = label.position.z;
		items.add(label);
		console.log("Lable added to the group");
		
		//load the 3d model using a loder object
		const loader = new GLTFLoader();
		console.log("loader");
		let avatar;
		await loader.load(
			'../Project1/person/scene.gltf',
			function (gltf) {
				avatar = gltf.scene;
				avatar.scale.set(0.012, 0.012, 0.012);
				avatar.position.x = xPose - 0.75 ;
				avatar.position.y = yPose - 0.92 ;
				avatar.position.z = zPose - 0.2;
				console.log("avatar loaded");				
				items.add(avatar);
				console.log("Avatar added to group");
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
            		'../Project1/play.png',
            		'../Project1/card.png',
            		'../Project1/web.png',
            		'../Project1/location.png',
            		'../Project1/call.png',
            		'../Project1/message.png',
            		'../Project1/email.png'
        	]);
		
		console.log("Textures loaded");

        	const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        	const card = new THREE.Mesh(planeGeometry, cardMaterial);
        	//const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        	//const card = new THREE.Sprite(cardMaterial);
        	card.position.set(xPose, yPose + 0.33, zPose + 0.00003);
		console.log("Card generated");
        
        	//const labelGeometry = new THREE.PlaneBufferGeometry(1.63, 0.5);

        	const iconGeometry = new THREE.CircleGeometry(0.1, 32);
        	const mapiconGeometry = new THREE.CircleGeometry(0.142, 32);
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

        	playIcon.position.set(xPose - 0.75, yPose + 0.355, zPose + 0.3);
        	webIcon.position.set( xPose - 0.28, yPose - 0.26, zPose);
        	locationIcon.position.set(xPose - 0.08, yPose - 0.26, zPose - 0.0003);
        	callIcon.position.set(xPose + 0.12, yPose - 0.26, zPose);
        	messageIcon.position.set(xPose + 0.323, yPose - 0.26, zPose);
        	emailIcon.position.set(xPose + 0.523, yPose - 0.26, zPose);
		console.log("Icones generated");
		
		 //handle buttons
		playIcon.userData.clickable = true;
		webIcon.userData.clickable = true;
		locationIcon.userData.clickable = true;
		callIcon.userData.clickable = true;
		messageIcon.userData.clickable = true;
		emailIcon.userData.clickable = true;
		
		items.add(card);
		items.add(playIcon);
		items.add(webIcon);
		items.add(locationIcon);
		items.add(callIcon);
		items.add(messageIcon);
		items.add(emailIcon);
		console.log("Icones added to the group");
				
		//Create a renderer
		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    		renderer.setPixelRatio(window.devicePixelRatio);
    		renderer.setSize(window.innerWidth, window.innerHeight);
    		renderer.xr.enabled = true;
		//creat a button to request an XR session
		const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    		document.body.appendChild(renderer.domElement);
    		document.body.appendChild(arButton);
		
		const controller = renderer.xr.getController(0);
		scene.add(controller);
		console.log(controller);
		controller.addEventListener('select', () => {
		document.body.addEventListener('click', (e) => {
			const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
			const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
			const mouse = new THREE.Vector2(mouseX, mouseY);
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(scene.children, true);
				
			if (intersects.length > 0) {
				let o = intersects[0].object;
				while (o.parent && !o.userData.clickable) {
					o = o.parent;
				}
				if (o.userData.clickable) {
					if (o === playIcon) {
						console.log("intro");
						//audio.play();
						//playIcon.visible = false;
					} else if (o === webIcon) {
						window.location.href = " https://falconicx.com/";
					} else if (o === locationIcon) {
						console.log("loc");
					} else if (o === callIcon) {
						window.location.href = "tel://+919453275960";
					} else if (o === messageIcon) {
						window.location.href = "https://wa.me/919453275960";
					} else if (o === emailIcon) {
						window.location.href = "mailto:contact@falconicx.com?subject=Hello";
					}
				}
			}
		});
		});

		//creat an event listner for when an event occure once an event start
		renderer.xr.addEventListener("sessionstart", async (e) => {
			console.log("Session start");
			document.getElementById("Header").setAttribute("hidden", "hidden");
			renderer.setAnimationLoop((timestamp, frame) => {
				scene.add(items);
				renderer.render(scene, camera);
			});
			console.log("All items added to scene and rendered");
		});

    		renderer.xr.addEventListener("sessionend", () => {
      			console.log("session end");
			window.location.href = "https://prasoonpractice.github.io/WebXR/applications/hit/index.html";
    		});
		
	}
  initialize();
});
