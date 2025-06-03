
import React, { useState } from 'react';
import './App.css';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MainInterface } from './components/MainInterface';
import { STMProvider } from './contexts/STMContext';
import { ProjectFilesProvider } from './contexts/ProjectFilesContext';

function App() {
  const [selectedMode, setSelectedMode] = useState<string>('');

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleBackToWelcome = () => {
    setSelectedMode('');
  };

  return (
    <STMProvider>
      <ProjectFilesProvider>
        <div className="min-h-screen">
          {selectedMode ? (
            <MainInterface 
              selectedMode={selectedMode} 
              onBackToWelcome={handleBackToWelcome}
            />
          ) : (
            <WelcomeScreen onModeSelect={handleModeSelect} />
          )}
        </div>
      </ProjectFilesProvider>
    </STMProvider>
  );
}

export default App;
