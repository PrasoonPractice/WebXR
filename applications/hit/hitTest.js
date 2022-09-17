//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
import {loadGLTF, loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

const name = "Prasoon Srivastava";
function makeLabelCanvas(size, name) {
	const borderSize = 2;
	const ctx = document.createElement('canvas').getContext('2d');
	const font = `oblique ${size}px lighter Tahoma`;
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
	ctx.fillStyle = '#3b329c';
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
		
		const canvas =  makeLabelCanvas(60, name);
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
		
		const lableGeometry = new THREE.PlaneGeometry(0.825, 0.125);
		const label = new THREE.Mesh(lableGeometry, labelMaterial);
		label.position.set(0.22, -0.255, -2.2);
		console.log("Lable generated");
		const xPose = label.position.x - 0.11;
		const yPose = label.position.y;
		const zPose = label.position.z;
		items.add(label);
		console.log("Lable added to the group");
		
		//load the 3d model using a loder object
		const avatar = await loadGLTF('../Project1/person/Avatar.gltf');
		
		avatar.scene.scale.set(1.2, 1.2, 1.2);
		avatar.scene.position.x = xPose - 0.75 ;
		avatar.scene.position.y = yPose - 1.22 ;
		avatar.scene.position.z = zPose - 0.2;
		console.log(avatar.scene);				
		items.add(avatar.scene);
		console.log("Avatar added to group");
		
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

		const planeGeometry = new THREE.PlaneGeometry(0.815, 0.25);
        	const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        	const card = new THREE.Mesh(planeGeometry, cardMaterial);
		
		const bgGeometry = new THREE.PlaneGeometry(0.85, 0.55);
        	const cardbgMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.6});
        	const cardbg = new THREE.Mesh(bgGeometry, cardbgMaterial);
		
        	//const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        	//const card = new THREE.Sprite(cardMaterial);
        	card.position.set(xPose + 0.11, yPose + 0.29, zPose + 0.0003);
		console.log("Card generated");
		
		cardbg.position.set(xPose + 0.11001, yPose + 0.18, zPose - 0.001);
		
		const shelfgeometry = new THREE.BoxGeometry(0.97, 0.025, 0.25);
		const shelfmaterial = new THREE.MeshBasicMaterial({color: 0x541994, transparent: true, opacity: 0.4});
		const shelf = new THREE.Mesh(shelfgeometry, shelfmaterial);
		
		shelf.position.set( xPose + 0.1, yPose - 0.4, zPose);
        
        	//const labelGeometry = new THREE.PlaneBufferGeometry(1.63, 0.5);

        	const iconGeometry = new THREE.CircleGeometry(0.1, 32);
		const mapiconGeometry = new THREE.CircleGeometry(0.14, 32);
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

        	playIcon.position.set(xPose - 0.75, yPose + 0.355, zPose + 0.18);
        	webIcon.position.set( xPose - 0.3, yPose - 0.246, zPose);
        	locationIcon.position.set(xPose - 0.1, yPose - 0.243, zPose - 0.003);
        	callIcon.position.set(xPose + 0.1, yPose - 0.246, zPose);
        	messageIcon.position.set(xPose + 0.303, yPose - 0.246, zPose);
        	emailIcon.position.set(xPose + 0.503, yPose - 0.246, zPose);
		console.log("Icones generated");
		
		 //handle buttons
		playIcon.userData.clickable = true;
		playIcon.visible = true;
		webIcon.userData.clickable = true;
		locationIcon.userData.clickable = true;
		callIcon.userData.clickable = true;
		messageIcon.userData.clickable = true;
		emailIcon.userData.clickable = true;
		
		items.add(card);
		items.add(cardbg);
		items.add(playIcon);
		items.add(webIcon);
		items.add(locationIcon);
		items.add(callIcon);
		items.add(messageIcon);
		items.add(emailIcon);
		items.add(shelf)
		console.log("Icones added to the group");
		
		const audioClip = await loadAudio('../Project1/intro.mp3');

        	const listener = new THREE.AudioListener();
        	camera.add(listener);

        	const audio = new THREE.PositionalAudio(listener);
        	
        	audio.setBuffer(audioClip);
        	audio.setRefDistance(100);
        	audio.setLoop(false);
		
		items.add(audio);
				
		//Create a renderer
		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    		renderer.setPixelRatio(window.devicePixelRatio);
    		renderer.setSize(window.innerWidth, window.innerHeight);
    		renderer.xr.enabled = true;
		//creat a button to request an XR session
		const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    		document.body.appendChild(renderer.domElement);
    		document.body.appendChild(arButton);
		
		const mixer = new THREE.AnimationMixer(avatar.scene);
		const action = mixer.clipAction(avatar.animations[0]);
		action.play();
		
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
						audio.play();
						playIcon.visible=false;
						console.log(audio);
					} else if (o === webIcon) {
						window.location.href = " https://falconicx.com/";
					} else if (o === locationIcon) {
						window.location.href = "https://www.google.com/maps/dir//Good+Earth+City+Center+Mall,+Vikas+Marg,+Pocket+H,+Nirvana+Country,+Sector+50,+Gurugram,+Haryana+122018/";
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
		
		const clock = new THREE.Clock();

		//creat an event listner for when an event occure once an event start
		renderer.xr.addEventListener("sessionstart", async (e) => {
			console.log("Session start");
			document.getElementById("Header").setAttribute("hidden", "hidden");
			renderer.setAnimationLoop((timestamp, frame) => {
				const delta = clock.getDelta();
				mixer.update(delta);
				scene.add(items);
				if (audio.isPlaying) {
					playIcon.visible = false;
				} else {
					playIcon.visible = true;
				}
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
