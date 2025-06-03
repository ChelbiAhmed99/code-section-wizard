
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cpu, FolderOpen, Play } from 'lucide-react';
import { useSTM } from '../../contexts/STMContext';

export const MXFilesGenerator: React.FC = () => {
  const [serie, setSerie] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const { addConsoleOutput, setIsGenerating, isGenerating } = useSTM();

  const handleGenerate = async () => {
    if (!serie || !outputDir) {
      addConsoleOutput('Error: Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    addConsoleOutput(`Starting MX files generation for ${serie} series...`);
    
    // Simulate generation process
    try {
      addConsoleOutput('Validating input parameters...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Creating PACK class...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Generating MX files...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addConsoleOutput('MX files generated successfully!');
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
            <Cpu className="w-5 h-5 mr-2" />
            Generate MX Files
          </CardTitle>
          <CardDescription>
            Create STM32CubeMX configuration files for your STM32 series
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
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !serie || !outputDir}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate MX Files'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
