import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {loadGLTF, loadTexture, loadTextures, loadVideo} from './libs/loader.js';
import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';


const THREEe = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    
    const initialize = async() => {

    const {renderer, cssRenderer, scene, cssScene, camera} = mindarThree;

    const light = new THREEe.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    //Make a reticle for hit test
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial();
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    //Create a button to start XR session
    const arButton = ARButton.createButton(renderer, { requriedFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);


    const [
      cardTexture,
      webTexture,
      locationTexture,
      callTexture,
      messageTexture,
      emailTexture
    ] = await loadTextures([
      './Project1/card.jpg`',
      './Project1/web.png',
      './Project1/location.png',
      './Project1/call.png',
      './Project1/message.png',
      './Project1/email.png'
    ]);

    const planeGeometry = new THREEe.PlaneGeometry(1, 0.552);
    const cardMaterial = new THREEe.MeshBasicMaterial({map: cardTexture});
    const card = new THREEe.Mesh(planeGeometry, cardMaterial);

    const iconGeometry = new THREEe.CircleGeometry(0.075, 32);
    const webMaterial = new THREEe.MeshBasicMaterial({map: webTexture, color: 0xffffff});
    const locationMaterial = new THREEe.MeshBasicMaterial({map: locationTexture, color: 0xffffff});
    const callMaterial = new THREEe.MeshBasicMaterial({map: callTexture, color: 0xffffff});
    const messageMaterial = new THREEe.MeshBasicMaterial({map: messageTexture, color: 0xffffff});
    const emailMaterial = new THREEe.MeshBasicMaterial({map: emailTexture, color: 0xffffff});

    const webIcon = new THREEe.Mesh(iconGeometry, webMaterial);
    const locationIcon = new THREEe.Mesh(iconGeometry, locationMaterial);    
    const callIcon = new THREEe.Mesh(iconGeometry, callMaterial);
    const messageIcon = new THREEe.Mesh(iconGeometry, messageMaterial);
    const emailIcon = new THREEe.Mesh(iconGeometry, emailMaterial);


    webIcon.position.set(0, -0.5, 0);
    locationIcon.position.set(0.28, -0.5, 0);
    callIcon.position.set(0.56, -0.5, 0);
    messageIcon.position.set(0.84, -0.5, 0);
    emailIcon.position.set(1.12, -0.5, 0);


    const cardGroup = new THREEe.Group();
    cardGroup.position.set(0, 0, -0.01);

    cardGroup.add(card);

    const avatar = await loadGLTF('./Project1/Avatar.glb');
    avatar.scene.scale.set(1, 1, 1);
    avatar.scene.position.set(-0.7, -0.25, -0.3);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(avatar.scene);
    anchor.group.add(webIcon);
    anchor.group.add(locationIcon);
    anchor.group.add(callIcon);
    anchor.group.add(messageIcon);
    anchor.group.add(emailIcon);
    anchor.group.add(cardGroup);

    const audioClip = await loadAudio('./Project1/background.mp3');

    const listener = new THREEe.AudioListener();
    camera.add(listener);

    const audio = new THREEe.PositionalAudio(listener);
    anchor.group.add(audio);

    audio.setBuffer(audioClip);
    audio.setRefDistance(100);
    audio.setLoop(true);

    const listener = new THREEe.AudioListener();
    camera.add(listener);

    const textElement = document.createElement("div");
    const textObj1 = new CSS3DObject(textElement);
    textObj1.position.set(0, 0, -0.02);
    textObj1.visible = false;
    const textObj2 = new CSS3DObject(textElement);
    textObj2.position.set(0, 0, -0.02);
    textObj2.visible = false;
    textElement.style.background = "#FFFFFE";
    textElement.style.padding = "30px";
    textElement.style.fontSize = "60px";

    const cssAnchor = mindarThree.addCSSAnchor(0);
    cssAnchor.group.add(textObj1, textObj2);

    // handle buttons
    webIcon.userData.clickable = true;
    locationIcon.userData.clickable = true;
    callIcon.userData.clickable = true;
    messageIcon.userData.clickable = true;
    emailIcon.userData.clickable = true;
    avatar.scene.userData.clickable = true;

    const mixer = new THREEe.AnimationMixer(avatar.scene);
    const action = mixer.clipAction(avatar.animations[0]);
    const action1 = mixer.clipAction(avatar.animations[1]);
    const action2 = mixer.clipAction(avatar.animations[2]);

    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', () => {
         document.body.addEventListener('click', (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREEe.Vector2(mouseX, mouseY);
      const raycaster = new THREEe.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	let o = intersects[0].object; 
	while (o.parent && !o.userData.clickable) {
	  o = o.parent;
	}
	if (o.userData.clickable) {
	  if (o === webIcon) {
	    window.location.href = "https://falconicx.com/";
	  } else if (o === locationIcon) {
	    //looking into ways to switch apps and show location on map;
	  } else if (o === callIcon) {
	    window.location.href = "tel://+919453275960";
      } else if (o === messageIcon) {
	    window.location.href = "https://wa.me/919453275960";
      } else if (o === emailIcon) {
	    //looking into ways to directly open a compose mail window;
	  } else if (o === avatar.scene){
        const introAudio = await loadAudio('./Project1/intro.mp3');
        const iAudio = new THREEe.PositionalAudio(listener);
        anchor.group.add(iAudio);
        audio.pause();
        action.play();
        iAudio.setBuffer(introAudio);
        iAudio.setRefDistance(100);
        iAudio.setLoop(false);
      }
      if (audio.pause()) {
      audio.play();
      action1.play();
      }

	}
      }
    });

    const clock = new THREEe.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const iconScale = 1 + 0.2 * Math.sin(elapsed*5);
      [webIcon, locationIcon, callIcon, messageIcon, emailIcon].forEach((icon) => {
	icon.scale.set(iconScale, iconScale, iconScale);
      });

      avatar.position.setFromMatrixPosition(reticle.matrix);
        scene.add(avatar);
    });

    renderer.xr.addEventListener("sessionstart", async (e) => {
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});

    renderer.setAnimationLoop((timestamp, frame) => {
	if (!frame) return;

	const hitTestResults = frame.getHitTestResults(hitTestSource);

	if (hitTestResults.length) {
	  const hit = hitTestResults[0];
	  const referenceSpace = renderer.xr.getReferenceSpace(); 
      // ARButton requested 'local' reference space
	  const hitPose = hit.getPose(referenceSpace);

	  reticle.visible = true;
	  reticle.matrix.fromArray(hitPose.transform.matrix);
	} else {
	  reticle.visible = false;
	}

      renderer.render(scene, camera);
      cssRenderer.render(cssScene, camera);
    });
    
    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });
  }
  start();
});
