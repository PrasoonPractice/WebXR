import { GLTFLoader, GLTFLoder } from "../../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";
import { mockWithVideo } from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
      mockWithVideo('../../assets/mock-videos/musicband1.mp4');
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const anchor = mindarThree.addAnchor(0);
    const loder = new GLTFLoader();
    loder.load("../../assets/models/musicband-raccoon/scene.gltf", (gltf) => {
        //gltf.scene: THREE.Group
        anchor.group.add(gltf.scene);

      };

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
