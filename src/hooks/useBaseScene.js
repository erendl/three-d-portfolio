import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export function useBaseScene({cameraIndex = 0}, {setLoading}) {
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
        x: (event.clientX / window.innerWidth) * 2,
        y: -(event.clientY / window.innerHeight) * 2
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    loader.load('/assets/models/scene_editor.glb', (gltf) => {
      const gpencil = gltf.scene.getObjectByName("Gpencil");
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
      camera.rotation.set(-0.4314569990246626, 0.5350401718310553, 0.28675455599246913)
      camera.position.set(2.522228232880101,2.426328964614322, 3.9387430148330766)
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      console.log(camera.position,"camera position")
      

      const controls = new OrbitControls(camera, renderer.domElement);
      camera.rotation.set(-0.4314569990246626, 0.5350401718310553, 0.28675455599246913)
      camera.position.set(2.522228232880101,2.426328964614322, 3.9387430148330766)
      console.log(camera.rotation,"camera rotation")
      
      const initialRotation = camera.rotation.clone();
      
      controls.rotateSpeed = 0.1;
      controls.zoomSpeed = 0.6;
      controls.panSpeed = 0.4;
      controls.enableDamping = true
      console.log(controls.target,"controls target")
      if (window.innerWidth <= 768) {
        camera.position.set(3.83, 3, 6)
      }


      // Create label for intro
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

      // Animate text letter by letter for intro
      let erenLetterIndex = 0;
      function revealErenNextLetter() {
        if (erenLetterIndex <= erenText.length) {
          erenDiv.textContent = erenText.slice(0, erenLetterIndex);
          erenLetterIndex++;
          setTimeout(revealErenNextLetter, 40); // Faster speed for effect
        }
      }
      // Start Eren's intro animation first
      revealErenNextLetter();

      // --- VIDEO TEXTURE FOR TV-SCREEN ---
      // Find the mesh named 'tv-screen'
      const tvScreen = gltf.scene.getObjectByName('tv-screen');
      if (tvScreen) {
        // Create a video element
        const video = document.createElement('video');
        video.src = '/assets/images/terminalVideo.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        // Start playing (required for some browsers)
        video.play();

        // Create a THREE video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearMipMapLinearFilter; // Use mipmaps for smoother scaling
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;
        videoTexture.generateMipmaps = true;
        videoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max anisotropy for best quality

        // Flip horizontally and vertically
        videoTexture.wrapS = THREE.RepeatWrapping;
        videoTexture.wrapT = THREE.RepeatWrapping;
        videoTexture.repeat.set(1, -1); // flip X and Y
        videoTexture.center.set(0.5, 0.5); // flip around center

        // Replace the material of the mesh
        tvScreen.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      }
      // --- END VIDEO TEXTURE ---

      // --- 2nd Video Texture for TV-SCREEN ---

      // Find the mesh named 'tv-screen'
      const tvsecond = gltf.scene.getObjectByName('tv-second');
      if (tvsecond) {
        // Create a video element
        const video = document.createElement('video');
        video.src = '/assets/images/atariVideo.mp4';
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);
        // Start playing (required for some browsers)
        video.play();

        // Create a THREE video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearMipMapLinearFilter; // Use mipmaps for smoother scaling
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;
        videoTexture.generateMipmaps = true;
        videoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Max anisotropy for best quality

        // Flip horizontally and vertically
        videoTexture.wrapS = THREE.RepeatWrapping;
        videoTexture.wrapT = THREE.RepeatWrapping;
        videoTexture.repeat.set(1, -1); // flip X and Y
        videoTexture.center.set(0.5, 0.5); // flip around center

        // Replace the material of the mesh
        tvsecond.material = new THREE.MeshBasicMaterial({ map: videoTexture });
      }
      // --- END VIDEO TEXTURE ---


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

      window.camera = camera;

      if (setLoading) setLoading(false);
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
