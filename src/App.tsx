
import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainInterface } from './components/MainInterface';
import { STMProvider } from './contexts/STMContext';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedMode, setSelectedMode] = useState<string>('');

  const handleWelcomeComplete = (mode: string) => {
    setSelectedMode(mode);
    setShowWelcome(false);
  };

  const handleBackToWelcome = () => {
    setShowWelcome(true);
    setSelectedMode('');
  };

  return (
    <STMProvider>
      <div className="app">
        {showWelcome ? (
          <WelcomeScreen onModeSelect={handleWelcomeComplete} />
        ) : (
          <MainInterface 
            selectedMode={selectedMode} 
            onBackToWelcome={handleBackToWelcome}
          />
        )}
      </div>
    </STMProvider>
  );
}

export default App;
