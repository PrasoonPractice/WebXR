//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
import { loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

const name = "Prasoon Srivastava";
function makeLabelCanvas(size, name) {
	const borderSize = 2;
	const ctx = document.createElement('canvas').getContext('2d');
	const font = `${size}px bold sans-serif`;
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
	ctx.fillStyle = '#f58814';
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
		
		const canvas =  makeLabelCanvas(15, name);
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
		
		const label = new THREE.Mesh(planeGeometry, labelMaterial);
		label.position.set(0, 0, -2.97);
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
				avatar.position.x = xPose - 0.006 ;
				avatar.position.y = yPose - 0.006 ;
				avatar.position.z = zPose ;
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

        	const planeGeometry = new THREE.PlaneGeometry(0.815, 0.25);
        	const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        	const card = new THREE.Mesh(planeGeometry, cardMaterial);
        	//const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        	//const card = new THREE.Sprite(cardMaterial);
        	card.position.set(xPose, yPose + 1, zPose + 0.00003);
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

        	playIcon.position.set(xPose - 0.006, yPose, zPose + 0.03);
        	webIcon.position.set( xPose, yPose - 0.36, zPose);
        	locationIcon.position.set(xPose + 0.18, yPose - 0.36, zPose - 0.0003);
        	callIcon.position.set(xPose + 0.36, yPose - 0.36, zPose);
        	messageIcon.position.set(xPose + 0.54, yPose - 0.36, zPose);
        	emailIcon.position.set(xPose + 0.72, yPose - 0.36, zPose);
		console.log("Icones generated");
		
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

		//creat an event listner for when an event occure once an event start
		renderer.xr.addEventListener("sessionstart", async (e) => {
			console.log("Session start");
			renderer.setAnimationLoop((timestamp, frame) => {
				scene.add(items);
				renderer.render(scene, camera);
			});
			console.log("All items added to scene and rendered");
		});

    		renderer.xr.addEventListener("sessionend", () => {
      			console.log("session end");
    		});
		
	}
  initialize();
});
