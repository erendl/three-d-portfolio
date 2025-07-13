import React, { useState, useRef } from 'react';
import Scene from './components/scene'
import './App.css'
import Loading from './components/loading'
import SceneTwo from './components/sceneTwo'
import ContactForm from './components/contactForm'

function App() {
  const [loading, setLoading] = useState(true);
  const [activeScene, setActiveScene] = useState('scene');
  const [showContact, setShowContact] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSetActiveScene = (sceneName) => {
    setLoading(true);
    setActiveScene(sceneName);
    setShowContact(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <audio ref={audioRef} src="/assets/audio/audio.mp3" loop />
      <button
        className={`music-btn${isPlaying ? ' playing' : ''}`}
        onClick={handlePlayPause}
      >
        {isPlaying ? ' AUDIO ' : ' AUDIO '}
      </button>
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