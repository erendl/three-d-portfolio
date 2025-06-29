import { useBaseScene } from '../hooks/useBaseScene';

function Scene({ setLoading }) {
  useBaseScene({ cameraIndex: 0 }, { setLoading });
  return null;
}

export default Scene;