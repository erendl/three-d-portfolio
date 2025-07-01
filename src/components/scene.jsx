import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';


function Scene({ setLoading }) {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // THREE.js scene 
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const loader = new GLTFLoader();
    let camera;

    // Mouse event listener 
    const handleMouseMove = (event) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2,
        y: -(event.clientY / window.innerHeight) * 2
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
  
    // CSS2DRenderer  
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(labelRenderer.domElement);

    // Load GLTF model
    loader.load('/assets/models/scene_editor.glb', (gltf) => {
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
      camera.rotation.set(-0.4314569990246626, 0.5350401718310553, 0.28675455599246913);
      camera.position.set(2.522228232880101, 2.426328964614322, 3.9387430148330766);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      console.log(camera.position, "camera position");

      // OrbitControls setup
      const controls = new OrbitControls(camera, renderer.domElement);
      camera.rotation.set(-0.4314569990246626, 0.5350401718310553, 0.28675455599246913);
      camera.position.set(2.522228232880101, 2.426328964614322, 3.9387430148330766);
      console.log(camera.rotation, "camera rotation");
      const initialRotation = camera.rotation.clone();
      controls.rotateSpeed = 0.1;
      controls.zoomSpeed = 0.6;
      controls.panSpeed = 0.4;
      controls.enableDamping = true;
      console.log(controls.target, "controls target");
      if (window.innerWidth <= 768) {
        camera.position.set(3.83, 3, 6);
      }

      // Create label for intro (terminal style)
      const terminalDiv = document.createElement('div');
      terminalDiv.className = 'label';
      const terminalText = "\nfeel free to\nswipe\nzoom in \nzoom out...";
      terminalDiv.textContent = '';
      terminalDiv.style.padding = '8px 16px';
      terminalDiv.style.color = 'rgb(0, 0, 0)';
      terminalDiv.style.borderRadius = '8px';
      terminalDiv.style.fontSize = '1.1rem';
      terminalDiv.style.backgroundColor = 'none';
      terminalDiv.style.fontFamily = 'monospace';
      terminalDiv.style.whiteSpace = 'pre';
      terminalDiv.style.backgroundImage = 'url(/assets/images/terminal.png)';
      terminalDiv.style.backgroundSize = 'cover';
      terminalDiv.style.backgroundPosition = 'center';
      terminalDiv.style.backgroundOpacity = '0.5';
      terminalDiv.style.width = '320px'; // Fixed width
      terminalDiv.style.height = '240px'; // Fixed height
      terminalDiv.style.display = 'flex';
      terminalDiv.style.alignItems = 'center';
      terminalDiv.style.justifyContent = 'center';
      terminalDiv.style.overflow = 'hidden';
      const terminalLabel = new CSS2DObject(terminalDiv);
      terminalLabel.position.set(0, -2, 0); // Position below About Me
      scene.add(terminalLabel);

      // Animate text letter by letter for intro
      let terminalLetterIndex = 0;
      function revealTerminalNextLetter() {
        if (terminalLetterIndex <= terminalText.length) {
          terminalDiv.textContent = terminalText.slice(0, terminalLetterIndex);
          terminalLetterIndex++;
          setTimeout(revealTerminalNextLetter, 40); // Faster speed for effect
        }
      }
      // Start intro animation first
      revealTerminalNextLetter();

      // --- VIDEO TEXTURE FOR TV-SCREEN ---
      // Video texture setup for first TV screen
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
      // Video texture setup for second TV screen
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

      // Animation loop
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

      // Expose camera for debugging
      window.camera = camera;

      if (setLoading) setLoading(false);
    });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeChild(renderer.domElement);
      document.body.removeChild(labelRenderer.domElement);
    };
  }, []);

  return null;
}

export default Scene;