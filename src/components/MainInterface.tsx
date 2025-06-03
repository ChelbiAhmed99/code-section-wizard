
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Home } from 'lucide-react';
import { MXFilesGenerator } from './generators/MXFilesGenerator';
import { PackGenerator } from './generators/PackGenerator';
import { ApplicationGenerator } from './generators/ApplicationGenerator';
import { FullPackGenerator } from './generators/FullPackGenerator';
import { ConfigurationManager } from './managers/ConfigurationManager';
import { TemplateManager } from './managers/TemplateManager';
import { ConsoleOutput } from './shared/ConsoleOutput';

interface MainInterfaceProps {
  selectedMode: string;
  onBackToWelcome: () => void;
}

export const MainInterface: React.FC<MainInterfaceProps> = ({ 
  selectedMode, 
  onBackToWelcome 
}) => {
  const [activeTab, setActiveTab] = useState(selectedMode);

  const getModeTitle = (mode: string) => {
    const titles = {
      'generate-mx': 'Generate MX Files',
      'generate-pack': 'Generate Pack',
      'generate-app': 'Generate Application',
      'generate-full-pack': 'Generate Full Pack',
      'config-manager': 'Configuration Manager',
      'template-manager': 'Template Manager'
    };
    return titles[mode] || 'STM32Cube Builder';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToWelcome}
                className="text-white hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Welcome
              </Button>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="/api/placeholder/48/48" 
                  alt="STM32 Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">STM32Cube Builder</h1>
                <p className="text-blue-200 text-sm">{getModeTitle(selectedMode)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToWelcome}
                className="text-white hover:bg-blue-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-6 bg-white border-b">
              <TabsTrigger value="generate-mx">⚙️ MX Files</TabsTrigger>
              <TabsTrigger value="generate-pack">⚡ Pack</TabsTrigger>
              <TabsTrigger value="generate-app">⚛️ Application</TabsTrigger>
              <TabsTrigger value="generate-full-pack">⚢ Full Pack</TabsTrigger>
              <TabsTrigger value="config-manager">⚒️ Config</TabsTrigger>
              <TabsTrigger value="template-manager">✎ Templates</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="generate-mx" className="h-full m-0">
                <MXFilesGenerator />
              </TabsContent>
              
              <TabsContent value="generate-pack" className="h-full m-0">
                <PackGenerator />
              </TabsContent>
              
              <TabsContent value="generate-app" className="h-full m-0">
                <ApplicationGenerator />
              </TabsContent>
              
              <TabsContent value="generate-full-pack" className="h-full m-0">
                <FullPackGenerator />
              </TabsContent>
              
              <TabsContent value="config-manager" className="h-full m-0">
                <ConfigurationManager />
              </TabsContent>
              
              <TabsContent value="template-manager" className="h-full m-0">
                <TemplateManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Console Output */}
      <ConsoleOutput />
    </div>
  );
};
