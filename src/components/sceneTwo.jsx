import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';


function SceneTwo({ setLoading, onContactClick }) {
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
      let githubMesh = null; 
      let linkedinMesh = null; 
      let githubHitboxMesh = null;
      let contactMeMesh = null;
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

      // onClick function
      function onClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        let opened = false;
        if (githubHitboxMesh) {
          const intersects = raycaster.intersectObject(githubHitboxMesh, true);
          if (intersects.length > 0) {
            window.open('https://github.com/erendl', '_blank');
            opened = true;
          }
        }
        if (!opened && linkedinMesh) {
          const intersects = raycaster.intersectObject(linkedinMesh, true);
          if (intersects.length > 0) {
            window.open('https://www.linkedin.com/in/erenozdil/', '_blank');
            opened = true;
          }
        }
        if (!opened && contactMeMesh && onContactClick) {
          const intersects = raycaster.intersectObject(contactMeMesh, true);
          if (intersects.length > 0) {
            onContactClick();
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
          if (githubHitboxMesh) {
            const intersects = raycaster.intersectObject(githubHitboxMesh, true);
            if (intersects.length > 0) {
              window.location.href = 'https://github.com/erendl';
              opened = true;
            }
          }
          if (!opened && linkedinMesh) {
            const intersects = raycaster.intersectObject(linkedinMesh, true);
            if (intersects.length > 0) {
              window.location.href = 'https://www.linkedin.com/in/erenozdil/';
              opened = true;
            }
          }
          if (!opened && contactMeMesh && onContactClick) {
            const intersects = raycaster.intersectObject(contactMeMesh, true);
            if (intersects.length > 0) {
              onContactClick();
              opened = true;
            }
          }
          event.preventDefault();
        }
      }

      loader.load('/assets/models/scenetwo.glb', (gltf) => {
        scene.add(gltf.scene);

        //meshes for hitboxes
        githubMesh = gltf.scene.getObjectByName('GitHub');
        linkedinMesh = gltf.scene.getObjectByName('LinkedIn');
        contactMeMesh = gltf.scene.getObjectByName('ContactMe');

        
        // github hitbox
        if (githubMesh) {
          const githubBox = new THREE.Box3().setFromObject(githubMesh);
          const githubSize = new THREE.Vector3();
          githubBox.getSize(githubSize);
          const githubScaleFactor = 1.2;
          const githubHelperGeometry = new THREE.BoxGeometry(githubSize.x * githubScaleFactor, githubSize.y * githubScaleFactor, githubSize.z * githubScaleFactor);
          const githubHelperMaterial = new THREE.MeshBasicMaterial({ visible: false });
          const githubHitboxMeshLocal = new THREE.Mesh(githubHelperGeometry, githubHelperMaterial);
          githubHitboxMeshLocal.position.copy(githubMesh.position);
          githubHitboxMeshLocal.quaternion.copy(githubMesh.quaternion);
          githubHitboxMeshLocal.updateMatrixWorld();
          scene.add(githubHitboxMeshLocal);
          githubHitboxMesh = githubHitboxMeshLocal;
        }
        // contact hitbox
        if (contactMeMesh) {
          const worldPosition = new THREE.Vector3();
          const worldQuaternion = new THREE.Quaternion();
          const worldScale = new THREE.Vector3();
          contactMeMesh.getWorldPosition(worldPosition);
          contactMeMesh.getWorldQuaternion(worldQuaternion);
          contactMeMesh.getWorldScale(worldScale);
          const contactBox = new THREE.Box3().setFromObject(contactMeMesh);
          const contactSize = new THREE.Vector3();
          contactBox.getSize(contactSize);
          const contactScaleFactor = 5;
          const contactHelperGeometry = new THREE.BoxGeometry(contactSize.x * contactScaleFactor, contactSize.y * contactScaleFactor, contactSize.z * contactScaleFactor);
          const contactHelperMaterial = new THREE.MeshBasicMaterial({ visible: false });
          const contactHitboxMesh = new THREE.Mesh(contactHelperGeometry, contactHelperMaterial);
          contactHitboxMesh.position.copy(worldPosition);
          contactHitboxMesh.quaternion.copy(worldQuaternion);
          contactHitboxMesh.scale.copy(worldScale);
          contactHitboxMesh.updateMatrixWorld(true);
          scene.add(contactHitboxMesh);
          contactMeMesh = contactHitboxMesh;
        }

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
        controls.rotateSpeed = 0.3;
        if (window.innerWidth <= 768) {
          camera.position.set(-0.5256585328246953, 0.6154948028987944, -1.2);
        }


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



