import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import gsap from 'gsap';
import { max } from 'three/src/nodes/TSL.js';

function SceneTwo({ setLoading }) {
    const mousePosition = useRef({ x: 0, y: 0 });
    const scrollDelta = useRef(0);
  
    useEffect(() => {
      // THREE.js scene 
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      const loader = new GLTFLoader();
      let camera;
  
      // EnvMap
      new RGBELoader()
        .setPath('/assets/images/')
        .load('envMap.hdr', function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
          scene.background = texture;
        });

      loader.load('/assets/models/scenetwo.glb', (gltf) => {
        scene.add(gltf.scene);

        // Animation mixer setup
        let mixer = null;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            if (clip.name.toLowerCase().includes('camera')) {
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
            }
            action.play();
          });
        }

        // Camera setup
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

            
        // OrbitControls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        
        controls.enableDamping = true;
        camera.position.set(-0.5256585328246953, 0.6154948028987944, -0.27029663282417665);
        camera.rotation.set(-2.970708832007452, -0.006149622266331087, -3.1405314398888207);
        controls.target.set(-0.5233570373593516, 0.5518531521781637, 0.09849760556329873);


        function animate() {
            requestAnimationFrame(animate);
 
            if (mixer) {
              const delta = clock.getDelta();
              mixer.update(delta);
            }
            controls.update();
            renderer.render(scene, camera);
          }
          window.camera = camera;
          window.controls = controls;

          const clock = new THREE.Clock();
          animate();
          if (setLoading) setLoading(false);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('wheel', handleWheel);
          document.body.removeChild(renderer.domElement);

          console.log(camera.position, "camera position");
          console.log(controls.target, "controls target");
          console.log(camera.rotation, "camera rotation");
        };
      });
    }, []);

    return null;
}
  
export default SceneTwo;



