
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Download, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Folder,
  FileCode,
  Zap
} from 'lucide-react';

export const FullPackGenerator: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState('');
  const [firmwarePath, setFirmwarePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [includeApps, setIncludeApps] = useState(true);
  const [includeDocs, setIncludeDocs] = useState(true);
  const [includeDemos, setIncludeDemos] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const seriesOptions = [
    { value: 'f4', label: 'STM32F4 Series' },
    { value: 'f7', label: 'STM32F7 Series' },
    { value: 'g4', label: 'STM32G4 Series' },
    { value: 'h7', label: 'STM32H7 Series' },
    { value: 'h7rs', label: 'STM32H7RS Series' },
    { value: 'l4', label: 'STM32L4 Series' },
    { value: 'l5', label: 'STM32L5 Series' },
    { value: 'wb', label: 'STM32WB Series' },
    { value: 'wl', label: 'STM32WL Series' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate generation process
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsGenerating(false);
    console.log('Full pack generated');
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Package className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Generate Full Pack</h1>
              <p className="text-gray-600">Create a complete pack with all applications for the selected STM32 series</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Series Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Configuration
                </CardTitle>
                <CardDescription>
                  Configure the pack generation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="series">STM32 Series</Label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select STM32 series" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="firmware">X-Cube Firmware Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="firmware"
                      placeholder="Select firmware directory..."
                      value={firmwarePath}
                      onChange={(e) => setFirmwarePath(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Folder className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="output">Output Directory</Label>
                  <div className="flex gap-2">
                    <Input
                      id="output"
                      placeholder="Select output directory..."
                      value={outputPath}
                      onChange={(e) => setOutputPath(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Folder className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Customize what to include in the generated pack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="apps" 
                    checked={includeApps}
                    onCheckedChange={(checked) => setIncludeApps(checked === true)}
                  />
                  <Label htmlFor="apps">Include All Applications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="docs" 
                    checked={includeDocs}
                    onCheckedChange={(checked) => setIncludeDocs(checked === true)}
                  />
                  <Label htmlFor="docs">Include Documentation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="demos" 
                    checked={includeDemos}
                    onCheckedChange={(checked) => setIncludeDemos(checked === true)}
                  />
                  <Label htmlFor="demos">Include Demo Projects</Label>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Important Notice</p>
                    <p className="text-sm text-orange-700 mt-1">
                      This operation may take a significant amount of time depending on the number of applications and boards. 
                      Please ensure you have sufficient disk space and be patient while the generation process completes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            {/* Generation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Generation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">Generating full pack...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-gray-500">{progress}% complete</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Ready to generate</span>
                    </div>
                    <Button 
                      onClick={handleGenerate}
                      disabled={!selectedSeries || !firmwarePath || !outputPath}
                      className="w-full"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Generate Full Pack
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Apps</Badge>
                  <span className="text-sm">All Azure RTOS applications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Boards</Badge>
                  <span className="text-sm">All supported boards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Templates</Badge>
                  <span className="text-sm">Jinja2 template files</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Config</Badge>
                  <span className="text-sm">JSON configuration files</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
