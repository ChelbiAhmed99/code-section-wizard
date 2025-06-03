
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, FolderOpen, Play, AlertTriangle } from 'lucide-react';
import { useSTM } from '../../contexts/STMContext';

export const FullPackGenerator: React.FC = () => {
  const [serie, setSerie] = useState('');
  const [xcubeFirmwareDir, setXcubeFirmwareDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [includeApps, setIncludeApps] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [includeDemos, setIncludeDemos] = useState(true);
  const { addConsoleOutput, setIsGenerating, isGenerating } = useSTM();

  const handleGenerate = async () => {
    if (!serie || !xcubeFirmwareDir || !outputDir) {
      addConsoleOutput('Error: Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    addConsoleOutput(`Starting full pack generation for ${serie} series...`);
    addConsoleOutput('Warning: This operation may take several minutes...');
    
    try {
      addConsoleOutput('Validating directories...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Creating PACK and BOARD classes...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Getting boards list...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate processing multiple boards
      const mockBoards = ['Board 1', 'Board 2', 'Board 3', 'Board 4'];
      for (let i = 0; i < mockBoards.length; i++) {
        addConsoleOutput(`Processing board ${i + 1}/${mockBoards.length}: ${mockBoards[i]}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        addConsoleOutput(`Processing applications for ${mockBoards[i]}...`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      addConsoleOutput('Generating final pack...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addConsoleOutput('Full pack generated successfully!');
    } catch (error) {
      addConsoleOutput(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Generate Full Pack
          </CardTitle>
          <CardDescription>
            Generate comprehensive packs with all applications for a series
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serie">STM32 Series</Label>
              <Select value={serie} onValueChange={setSerie}>
                <SelectTrigger>
                  <SelectValue placeholder="Select STM32 series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="f4">STM32F4</SelectItem>
                  <SelectItem value="f7">STM32F7</SelectItem>
                  <SelectItem value="g4">STM32G4</SelectItem>
                  <SelectItem value="h7">STM32H7</SelectItem>
                  <SelectItem value="h7rs">STM32H7RS</SelectItem>
                  <SelectItem value="l4">STM32L4</SelectItem>
                  <SelectItem value="l5">STM32L5</SelectItem>
                  <SelectItem value="wb">STM32WB</SelectItem>
                  <SelectItem value="wl">STM32WL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="xcube-dir">X-Cube Firmware Directory</Label>
              <div className="flex space-x-2">
                <Input
                  id="xcube-dir"
                  placeholder="Select X-Cube firmware directory"
                  value={xcubeFirmwareDir}
                  onChange={(e) => setXcubeFirmwareDir(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <FolderOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="output-dir">Output Directory</Label>
            <div className="flex space-x-2">
              <Input
                id="output-dir"
                placeholder="Select output directory"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <FolderOpen className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Advanced Options</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-apps" 
                  checked={includeApps}
                  onCheckedChange={setIncludeApps}
                />
                <Label htmlFor="include-apps">Include All Applications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-docs" 
                  checked={includeDocs}
                  onCheckedChange={setIncludeDocs}
                />
                <Label htmlFor="include-docs">Include Documentation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="include-demos" 
                  checked={includeDemos}
                  onCheckedChange={setIncludeDemos}
                />
                <Label htmlFor="include-demos">Include Demo Projects</Label>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                Note: This operation may take a significant amount of time depending on the number of applications and boards.
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !serie || !xcubeFirmwareDir || !outputDir}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Full Pack'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
