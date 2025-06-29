import { useBaseScene } from '../hooks/useBaseScene';

function Scene() {
  useBaseScene({ cameraIndex: 0 }, { orbitPoint: "Gpencil" });
}

export default Scene;