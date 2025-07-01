import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

function SceneTwo({ setLoading }) {
    const mousePosition = useRef({ x: 0, y: 0 });
  
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

      loader.load('/assets/models/scenetwo.glb', (gltf) => {
        scene.add(gltf.scene);

        // Animation mixer setup
        let mixer = null;
        if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
        }

        // Camera setup
        camera = gltf.cameras[0];
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        function animate() {
            requestAnimationFrame(animate);
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
          document.body.removeChild(renderer.domElement);
        };
      });
    }, []);

    return null;
}
  
export default SceneTwo;



