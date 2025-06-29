import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export function useBaseScene({cameraIndex = 0}, {orbitPoint = "Gpencil"}) {
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // CSS2DRenderer setup
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);

    const loader = new GLTFLoader();
    let camera;   

    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    loader.load('/assets/models/scene_editor.glb', (gltf) => {
      const gpencil = gltf.scene.getObjectByName(orbitPoint);
      if (gpencil) {
        scene.add(gpencil);
      } else {
        scene.add(gltf.scene);
      }

      // Animation mixer setup
      let mixer = null;
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(gpencil ? gpencil : gltf.scene);
        gltf.animations.forEach((clip) => {
          mixer.clipAction(clip).play();
        });
      }

      camera = gltf.cameras[cameraIndex];
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);

      const controls = new OrbitControls(camera, renderer.domElement);

      const initialRotation = camera.rotation.clone();

      controls.rotateSpeed = 0.03;
      controls.zoomSpeed = 0.1;
      controls.panSpeed = 0.04;

      // Create About Me label
/*       const aboutDiv = document.createElement('div');
      aboutDiv.className = 'label';
      // Animated text setup
      const aboutText = 'About Me';
      aboutDiv.textContent = '';
      aboutDiv.style.padding = '8px 16px';
      aboutDiv.style.color = 'rgb(0, 0, 0)';
      aboutDiv.style.borderRadius = '0px';
      aboutDiv.style.fontSize = '1.5rem';
      aboutDiv.style.backgroundColor = 'transparent'; // Initially transparent
      aboutDiv.style.fontFamily = 'Arial';
      aboutDiv.style.whiteSpace = 'nowrap';
      const aboutLabel = new CSS2DObject(aboutDiv);
      aboutLabel.position.set(-9, -2, -4); // Adjust position as needed
      scene.add(aboutLabel); */

      // Animate text letter by letter for About Me
      let letterIndex = 0;
      function revealNextLetter() {
        if (letterIndex === 0) {
          aboutDiv.style.backgroundColor = 'rgb(242, 255, 0)'; // Set yellow when animation starts
        }
        if (letterIndex <= aboutText.length) {
          aboutDiv.textContent = aboutText.slice(0, letterIndex);
          letterIndex++;
          setTimeout(revealNextLetter, 100); // Adjust speed as needed
        }
      }

      // Create second label for Eren's intro
      const erenDiv = document.createElement('div');
      erenDiv.className = 'label';
      const erenText = "\nlorem ipsum dolor\nsit amet\nconsectetur adipisicing\nelit. Quisquam, quos.";
      erenDiv.textContent = '';
      erenDiv.style.padding = '8px 16px';
      erenDiv.style.color = 'rgb(0, 0, 0)';
      erenDiv.style.borderRadius = '8px';
      erenDiv.style.fontSize = '1.1rem';
      erenDiv.style.backgroundColor = 'none';
      erenDiv.style.fontFamily = 'monospace';
      erenDiv.style.whiteSpace = 'pre';
      erenDiv.style.backgroundImage = 'url(/assets/images/terminal.png)';
      erenDiv.style.backgroundSize = 'cover';
      erenDiv.style.backgroundPosition = 'center';
      erenDiv.style.backgroundOpacity = '0.5';
      erenDiv.style.width = '320px'; // Fixed width
      erenDiv.style.height = '240px'; // Fixed height
      erenDiv.style.display = 'flex';
      erenDiv.style.alignItems = 'center';
      erenDiv.style.justifyContent = 'center';
      erenDiv.style.overflow = 'hidden';
      const erenLabel = new CSS2DObject(erenDiv);
      erenLabel.position.set(0, -2, 0); // Position below About Me
      scene.add(erenLabel);

      // Animate text letter by letter for Eren's intro
      let erenLetterIndex = 0;
      function revealErenNextLetter() {
        if (erenLetterIndex <= erenText.length) {
          erenDiv.textContent = erenText.slice(0, erenLetterIndex);
          erenLetterIndex++;
          setTimeout(revealErenNextLetter, 40); // Faster speed for effect
        } else {
          // Start About Me after Eren finishes
          setTimeout(revealNextLetter, 300);
        }
      }
      // Start Eren's intro animation first
      revealErenNextLetter();

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        camera.rotation.x = initialRotation.x + mousePosition.current.y * 0.05;
        camera.rotation.y = initialRotation.y + mousePosition.current.x * -0.05;
        // Update animation mixer
        if (mixer) {
          const delta = clock.getDelta();
          mixer.update(delta);
        }
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
      }
      // Add clock for animation timing
      const clock = new THREE.Clock();
      animate();
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up renderers and label
      document.body.removeChild(renderer.domElement);
      document.body.removeChild(labelRenderer.domElement);
    };
  }, []);

  return null;
}
