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
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      const loader = new GLTFLoader();
      let camera;
      let githubMesh = null; // To store the GitHub mesh
      let linkedinMesh = null; // To store the LinkedIn mesh
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
  
      // EnvMap
      new RGBELoader()
        .setPath('/assets/images/')
        .load('envMap.hdr', function (texture) {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
          scene.background = texture;
        });

      // Click handler
      function onClick(event) {
        // Normalize mouse coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        let opened = false;
        if (githubMesh) {
          const intersects = raycaster.intersectObject(githubMesh, true);
          if (intersects.length > 0) {
            window.open('https://github.com/erendl', '_blank');
            opened = true;
          }
        }
        if (!opened && linkedinMesh) {
          const intersects = raycaster.intersectObject(linkedinMesh, true);
          if (intersects.length > 0) {
            window.open('https://www.linkedin.com/in/erenozdil/', '_blank');
          }
        }
      }

      // Touch event for mobile
      function onTouch(event) {
        if (event.touches.length === 1) {
          const touch = event.touches[0];
          mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          let opened = false;
          if (githubMesh) {
            const intersects = raycaster.intersectObject(githubMesh, true);
            if (intersects.length > 0) {
              window.location.href = 'https://github.com/erendl';
              opened = true;
            }
          }
          if (!opened && linkedinMesh) {
            const intersects = raycaster.intersectObject(linkedinMesh, true);
            if (intersects.length > 0) {
              window.location.href = 'https://www.linkedin.com/in/erenozdil/';
            }
          }
          event.preventDefault();
        }
      }

      loader.load('/assets/models/scenetwo.glb', (gltf) => {
        scene.add(gltf.scene);

        // Find the GitHub and LinkedIn meshes by name
        githubMesh = gltf.scene.getObjectByName('GitHub');
        linkedinMesh = gltf.scene.getObjectByName('LinkedIn');

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
          // Add event listener for click
          window.addEventListener('click', onClick);
          renderer.domElement.addEventListener('touchstart', onTouch, { passive: false });
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('wheel', handleWheel);
          window.removeEventListener('click', onClick);
          renderer.domElement.removeEventListener('touchstart', onTouch);
          document.body.removeChild(renderer.domElement);
        };
      });
    }, []);

    return null;
}
  
export default SceneTwo;



