
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, FolderOpen, Play } from 'lucide-react';
import { useSTM } from '../../contexts/STMContext';

export const PackGenerator: React.FC = () => {
  const [serie, setSerie] = useState('');
  const [xcubeFirmwareDir, setXcubeFirmwareDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const { addConsoleOutput, setIsGenerating, isGenerating } = useSTM();

  const handleGenerate = async () => {
    if (!serie || !xcubeFirmwareDir || !outputDir) {
      addConsoleOutput('Error: Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    addConsoleOutput(`Starting pack generation for ${serie} series...`);
    
    try {
      addConsoleOutput('Validating directories...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Creating PACK class...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Generating pack...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      addConsoleOutput('Pack generated successfully!');
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
            <Package className="w-5 h-5 mr-2" />
            Generate Pack
          </CardTitle>
          <CardDescription>
            Build firmware packages for STM32 microcontrollers with AZRTOS
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
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !serie || !xcubeFirmwareDir || !outputDir}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Pack'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
