import React, { useState } from 'react';
import Scene from './components/scene'
import './App.css'
import Loading from './components/loading'
import Navbar from './components/navbar'
import SceneTwo from './components/sceneTwo'


function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loading />}
      <SceneTwo setLoading={setLoading} />

    </>
  );
}

export default App