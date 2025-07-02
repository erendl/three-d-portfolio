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
        camera = new THREE.PerspectiveCamera(22.9, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.camera = camera;
        
        // OrbitControls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        window.controls = controls;
        camera.position.set(-4.633936405181885, -0.800000011920929, 5.5);
        camera.rotation.set(1.5708013445146851, -1.5533431252620336, 1.5708013445146851);
        controls.target.set(1.200, -0.743, -4.627);

        controls.rotateSpeed = 0.01;
        controls.zoomSpeed = 0.2;
        controls.panSpeed = 0.6;
        controls.enableDamping = true;
        controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
        controls.enableRotate = false;
        controls.touches.ONE = THREE.TOUCH.PAN;
        console.log(controls.target, "controls target");
/*         if (window.innerWidth <= 768) {
          camera.position.set(3.83, 3, 6);
        } */

        // GSAP easing effect
        gsap.to(camera.position, { x: -6.633936405181885, y: -0.800000011920929, z: -4.547184467315674, duration: 4, ease: 'power2.inOut' });

        function animate() {
            requestAnimationFrame(animate);
 
            if (mixer) {
              const delta = clock.getDelta();
              mixer.update(delta);
            }
            // Camera position limit    
            camera.position.z = Math.max(-5, Math.min(camera.position.z, 5.5));
            camera.position.y = Math.max(-1, Math.min(camera.position.y, -0.5));
            renderer.render(scene, camera);
          }

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



