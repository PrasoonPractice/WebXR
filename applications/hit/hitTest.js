import * as THREE from '../libs/three.js-r132/build/three.module.js';
import { loadGLTF, loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial(); 
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

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

        const planeGeometry = new THREE.PlaneGeometry(1.63, 0.5);
        const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        const card = new THREE.Mesh(planeGeometry, cardMaterial);
        //const cardMaterial = new THREE.SpriteMaterial({ map: cardTexture, transparent: false, opacity: 0.5 });
        //const card = new THREE.Sprite(cardMaterial);
        card.position.set(0.5, 0.4, 0);
        
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

        playIcon.position.set(-0.80, 0.38, 0.05);
        webIcon.position.set(-0.14, -0.60, 0);
        locationIcon.position.set(0.16, -0.60, -0.02);
        callIcon.position.set(0.46, -0.60, 0);
        messageIcon.position.set(0.76, -0.60, 0);
        emailIcon.position.set(1.06, -0.60, 0);

        //if (id === anything)
            const avatar = await loadGLTF('../Project1/Avatar.glb');
        //else
        //    const avatar = await loadGLTF('./Project1/Avatar1.glb');
        
        avatar.scene.scale.set(1, 0.85, 1);
        avatar.scene.position.set(-0.8, -0.75, -0.3);
        
        //if (id === anything)
            const name = "Prasoon Srivastava";
        //else
        //    const name = "Manish Chitkara";

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
        label.position.set(0.5, -0.26, 0.003);
        
        const audioClip = await loadAudio('../Project1/intro.mp3');

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const audio = new THREE.PositionalAudio(listener);
 
        audio.setBuffer(audioClip);
        audio.setRefDistance(600);
        audio.setLoop(false);
        
        //anchor.onTargetFound = () => {
        //    audio.play();
        //}
        
         //handle buttons
        playIcon.userData.clickable = true;
        webIcon.userData.clickable = true;
        locationIcon.userData.clickable = true;
        callIcon.userData.clickable = true;
        messageIcon.userData.clickable = true;
        emailIcon.userData.clickable = true;
	  
    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);



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
                        playIcon.visible = false;
                    } else if (o === webIcon) {
                        window.location.href = " https://falconicx.com/";
                    } else if (o === locationIcon) {
			window.location.href = " https://www.google.co.in/maps/dir//Good+Earth+City+Center+Mall,+Vikas+Marg,+Pocket+H,+Nirvana+Country,+Sector+50,+Gurugram,+Haryana+122018/";
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
	  
    const items = new THREE.Group();
    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', () => {
    
    //avatar.scene.scale.set(1, 0.85, 1);
    //avatar.scene.position.set(-0.8, -0.75, -0.3);
    
        items.add(avatar.scene);
        items.add(card);
        items.add(playIcon);
        items.add(webIcon);
        items.add(locationIcon);
        items.add(callIcon);
        items.add(messageIcon);
        items.add(emailIcon);
        items.add(audio);
	items.add(label);
    	items.position.setFromMatrixPosition(reticle.matrix);
    	items.visible = false;
    });

    renderer.xr.addEventListener("sessionstart", async (e) => {
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
         
      var counter = false;
	    
      renderer.setAnimationLoop((timestamp, frame) => {
	if (!frame) return;

	const hitTestResults = frame.getHitTestResults(hitTestSource);

	if (hitTestResults.length) {
		const hit = hitTestResults[0];
		const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
		const hitPose = hit.getPose(referenceSpace);
		if (!counter) {
			reticle.visible = true;
			reticle.matrix.fromArray(hitPose.transform.matrix);
		} else if (!counter && reticle.visible) {
	    		items.visible = true;
	    		counter = true;
	}
	}else {
		reticle.visible = false;
	}
	    if (audio.paused) {
                playIcon.visible = true;
            }  
	renderer.render(scene, camera);
      });
    });

    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });

  }

  initialize();
});
