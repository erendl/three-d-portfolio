import React, { useState } from 'react';
import Scene from './components/scene'
import './App.css'
import Loading from './components/loading'


function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Loading />}
      <Scene setLoading={setLoading} />
    </>
  );
}

export default App