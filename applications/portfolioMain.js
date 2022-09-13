//import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
//import {mockWithImage} from './libs/camera-mock.js';
import { loadGLTF, loadAudio, loadTextures } from './libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {

        //mockWithImage('./Project1/mock.jpg');
        // initialize MindAR 
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './assets/targets/card.mind',
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
        card.position.set(0.5, 0.05, 0);
        
        const labelGeometry = new THREE.PlaneBufferGeometry(1.63, 0.5);

        const iconGeometry = new THREE.CircleGeometry(0.12, 32);
        const webMaterial = new THREE.MeshBasicMaterial({ map: webTexture });
        const locationMaterial = new THREE.MeshBasicMaterial({ map: locationTexture });
        const callMaterial = new THREE.MeshBasicMaterial({ map: callTexture });
        const messageMaterial = new THREE.MeshBasicMaterial({ map: messageTexture });
        const emailMaterial = new THREE.MeshBasicMaterial({ map: emailTexture });

        const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
        const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
        const callIcon = new THREE.Mesh(iconGeometry, callMaterial);
        const messageIcon = new THREE.Mesh(iconGeometry, messageMaterial);
        const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);

        webIcon.position.set(-0.42, -0.65, 0);
        locationIcon.position.set(-0.14, -0.65, 0);
        callIcon.position.set(0.14, -0.65, 0);
        messageIcon.position.set(0.42, -0.65, 0);
        emailIcon.position.set(0.70, -0.65, 0);

        const avatar = await loadGLTF('./Project1/Avatar.glb');
        avatar.scene.scale.set(1, 0.85, 1);
        avatar.scene.position.set(-0.75, -0.6, -0.3);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(avatar.scene);
        anchor.group.add(card);
        anchor.group.add(emailIcon);
        anchor.group.add(webIcon);
        anchor.group.add(callIcon);
        anchor.group.add(locationIcon);
        anchor.group.add(messageIcon);

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

            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = 'black';
            ctx.fillText(name, borderSize, borderSize);

            return ctx.canvas;
        }       

        const canvas =  makeLabelCanvas(150, document.querySelector("#ar-div"));
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

        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0.5, 0.06, 0.003);
        anchor.group.add(label);

        //const obj = new CSS3DObject(document.querySelector("#ar-div"));
        //obj.scale.set(1.662, 0.5);
        //obj.position.set(0.2, -0.005, 0);
        //obj.visible = true;

        //const cssAnchor = mindarThree.addCSSAnchor(0);
        //cssAnchor.group.add(obj);

        const audioClip = await loadAudio('./Project1/intro.mp3');

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const audio = new THREE.PositionalAudio(listener);
        anchor.group.add(audio);

        audio.setBuffer(audioClip);
        audio.setRefDistance(200);
        audio.setLoop(false);

        //anchor.onTargetFound = () => {
        //    audio.play();
        //}
        anchor.onTargetLost = () => {
            audio.pause();
        }  

         //handle buttons
        avatar.scene.userData.clickable = true;
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
                    if (o === avatar) {
                        console.log("intro");
                        audio.play();                         
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

        const clock = new THREE.Clock();
        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
            //cssRenderer.render(cssScene, camera);
        });
    }

    start();
});
