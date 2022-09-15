//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
import { loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

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
		
		//load the 3d model using a loder object
		const loader = new GLTFLoader();
		console.log("loader");
		let avatar;
		await loader.load(
			'../Project1/person/scene.gltf',
			function (gltf) {
				avatar = gltf.scene;
				avatar.scale.set(0.001, 0.001, 0.001);
				avatar.position.set(-0.8, -0.75, -0.3);
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

        	const planeGeometry = new THREE.PlaneGeometry(1.63, 0.5);
        	const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        	const card = new THREE.Mesh(planeGeometry, cardMaterial);
        	//const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        	//const card = new THREE.Sprite(cardMaterial);
        	card.position.set(0.5, 0.4, -0.3);
		console.log("Card generated");
        
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

        	playIcon.position.set(0.80, 0.38, -0.05);
        	webIcon.position.set( -0.14, -0.60, -0.3);
        	locationIcon.position.set(0.16, -0.60, -0.32);
        	callIcon.position.set(0.46, -0.60, -0.3);
        	messageIcon.position.set(0.76, -0.60, -0.3);
        	emailIcon.position.set(1.06,-0.60, -0.3);
		console.log("Icones generated");
		
		items.add(playIcon);
		items.add(webIcon);
		items.add(locationIcon);
		items.add(callIcon);
		items.add(messageIcon);
		items.add(emailIcon);
		console.log("Icones added to the group");
		
		const canvas =  makeLabelCanvas(30, name);
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
		label.position.set(0.5, -0.26, 0.303);
		console.log("Lable generated");
		items.add(label);
		console.log("Lable added to the group");
		
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
			});
			console.log("All items added to scene and rendered");
		});

    		renderer.xr.addEventListener("sessionend", () => {
      			console.log("session end");
    		});
		
	}
  initialize();
});
