import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { loadGLTF, loadAudio, loadTextures } from './libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {

        // initialize MindAR 
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: '../../assets/targets/card.mind',
        });
        const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const [
            cardTexture,
            webTexture,
            locationTexture,
            callTexture,
            messageTexture,
            emailTexture,
        ] = await loadTextures([
            './Project1/card.jpg',
            './Project1/web.png',
            './Project1/location.png',
            './Project1/call.png',
            './Project1/message.png',
            './Project1/email.png'
        ]);

        const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
        const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
        const card = new THREE.Mesh(planeGeometry, cardMaterial);

        const iconGeometry = new THREE.CircleGeometry(0.075, 32);
        const webMaterial = new THREE.MeshBasicMaterial({ map: webTexture });
        const locationMaterial = new THREE.MeshBasicMaterial({ map: locationTexture });
        const callMaterial = new THREE.MeshBasicMaterial({ map: callTexture });
        const messageMaterial = new THREE.MeshBasicMaterial({ map: Texture });
        const emailMaterial = new THREE.MeshBasicMaterial({ map: emailTexture });

        const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
        const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
        const callIcon = new THREE.Mesh(iconGeometry, callMaterial);
        const messageIcon = new THREE.Mesh(iconGeometry, messageMaterial);
        const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);

        webIcon.position.set(-0.42, -1, 0);
        locationIcon.position.set(-0.14, -1, 0);
        callIcon.position.set(0.14, -1, 0);
        messageIcon.position.set(0.42, -1, 0);
        emailIcon.position.set(0.70, -1, 0);

        const avatar = await loadGLTF('./Project1/Avatar.glb');
        avatar.scene.scale.set(0.4, 0.4, 0.4);
        avatar.scene.position.set(0, -1, -0.3);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(avatar.scene);
        anchor.group.add(card);
        anchor.group.add(emailIcon);
        anchor.group.add(webIcon);
        anchor.group.add(callIcon);
        anchor.group.add(locationIcon);
        anchor.group.add(messageIcon);

        const obj = new CSS3DObject(document.querySelector("#ar-div"));
        textObj.position.set(0, -0.5, 0);
        textObj.visible = true;

        const cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(obj);

        const audioClip = await loadAudio('./Project1/background.mp3');

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const audio = new THREE.PositionalAudio(listener);
        anchor.group.add(audio);

        audio.setBuffer(audioClip);
        audio.setRefDistance(100);
        audio.setLoop(true);

        anchor.onTargetFound = () => {
            audio.play();
        }
        anchor.onTargetLost = () => {
            audio.pause();
        }

        // handle buttons
        webIcon.userData.clickable = true;
        locationIcon.userData.clickable = true;
        callIcon.userData.clickable = true;
        messageIcon.userData.clickable = true;
        emailIcon.userData.clickable = true;


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
                    if (o === webIcon) {
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

        const clock = new THREE.Clock();
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            const iconScale = 1 + 0.2 * Math.sin(elapsed * 5);
            [webIcon, locationIcon, callIcon, messageIcon, emailIcon].forEach((icon) => {
                icon.scale.set(iconScale, iconScale, iconScale);
            });


            renderer.render(scene, camera);
            cssRenderer.render(cssScene, camera);
        });
    }
    start();
});
