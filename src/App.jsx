import React, { useState } from 'react';
import Scene from './components/scene'
import './App.css'
import Loading from './components/loading'
import Navbar from './components/navbar'
import SceneTwo from './components/sceneTwo'


function App() {
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState('scene');

  return (
    <>
      {loading && <Loading />}
      {activeScene === 'scene' && <Scene setLoading={setLoading} setActiveScene={setActiveScene} />}
      {activeScene === 'sceneTwo' && <SceneTwo setLoading={setLoading} />}
    </>
  );
}

export default App