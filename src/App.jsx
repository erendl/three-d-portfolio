import React, { useState } from 'react';
import Scene from './components/scene'
import './App.css'
import Loading from './components/loading'
import Navbar from './components/navbar'
import SceneTwo from './components/sceneTwo'
import ContactForm from './components/contactForm'

function App() {
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState('scene');
  const [showContact, setShowContact] = useState(false);

  const handleSetActiveScene = (sceneName) => {
    setLoading(true);
    setActiveScene(sceneName);
    setShowContact(false);
  };

  return (
    <>
      {loading && <Loading />}
      {activeScene === 'scene' && <Scene setLoading={setLoading} setActiveScene={handleSetActiveScene} />}
      {activeScene === 'sceneTwo' && (
        <div style={{ position: 'relative' }}>
          <SceneTwo setLoading={setLoading} onContactClick={() => setShowContact(true)} />
          {showContact && <ContactForm className="contact-form-overlay" onClose={() => setShowContact(false)} />}
        </div>
      )}
    </>
  );
}

export default App