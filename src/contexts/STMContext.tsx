
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface STMContextType {
  currentProject: string;
  setCurrentProject: (project: string) => void;
  consoleOutput: string[];
  addConsoleOutput: (message: string) => void;
  clearConsoleOutput: () => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const STMContext = createContext<STMContextType | undefined>(undefined);

export const useSTM = () => {
  const context = useContext(STMContext);
  if (context === undefined) {
    throw new Error('useSTM must be used within a STMProvider');
  }
  return context;
};

interface STMProviderProps {
  children: ReactNode;
}

export const STMProvider: React.FC<STMProviderProps> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const addConsoleOutput = (message: string) => {
    setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearConsoleOutput = () => {
    setConsoleOutput([]);
  };

  const value = {
    currentProject,
    setCurrentProject,
    consoleOutput,
    addConsoleOutput,
    clearConsoleOutput,
    isGenerating,
    setIsGenerating
  };

  return (
    <STMContext.Provider value={value}>
      {children}
    </STMContext.Provider>
  );
};
