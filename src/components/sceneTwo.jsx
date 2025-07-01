import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

function SceneTwo({ setLoading }) {
    const mousePosition = useRef({ x: 0, y: 0 });
    const scrollDelta = useRef(0);
  
    useEffect(() => {
      // THREE.js scene 
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({ antialias: true });
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

      // Mouse event listener 
      const handleMouseMove = (event) => {
        mousePosition.current = {
          x: (event.clientX / window.innerWidth) * 2,
          y: -(event.clientY / window.innerHeight) * 2
        };
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Mouse scroll event listener
      const handleWheel = (event) => {
        if (event.deltaY > 0) {
          scrollDelta.current += 0.5;
        } else if (event.deltaY < 0) {
          scrollDelta.current -= 0.5;
        }
      };
      window.addEventListener('wheel', handleWheel);

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
        camera = gltf.cameras[0];
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.camera = camera;

        // initialRotation
        const initialRotation = camera.rotation.clone();
        const initialPosition = camera.position.clone();

        function animate() {
            requestAnimationFrame(animate);
            // Mouse Position Camera Rotation
            camera.rotation.x = initialRotation.x + mousePosition.current.y * 0.01;
            camera.rotation.y = initialRotation.y + mousePosition.current.x * -0.01;
            camera.position.x = initialPosition.x + 1.2 + mousePosition.current.y * 0.5;
            camera.position.y = initialPosition.y + 0.1 + mousePosition.current.x * -0.05;
            /* camera.position.z = initialPosition.z + scrollDelta.current / 30; */
            
            // Update animation mixer
            if (mixer) {
              const delta = clock.getDelta();
              mixer.update(delta);
            }
            renderer.render(scene, camera);
          }

          const clock = new THREE.Clock();
          animate();
          if (setLoading) setLoading(false);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('wheel', handleWheel);
          document.body.removeChild(renderer.domElement);
        };
      });
    }, []);

    return null;
}
  
export default SceneTwo;



