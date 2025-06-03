
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Settings, 
  Layers, 
  Shield, 
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

export const PackGenerator: React.FC = () => {
  const { addConsoleOutput, isGenerating, setIsGenerating } = useSTM();
  const [selectedSeries, setSelectedSeries] = useState('');
  const [packName, setPackName] = useState('');
  const [packVersion, setPackVersion] = useState('1.0.0');
  const [outputPath, setOutputPath] = useState('./packs');
  const [middleware, setMiddleware] = useState<string[]>([]);
  const [packType, setPackType] = useState('');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeDocumentation, setIncludeDocumentation] = useState(true);
  const [progress, setProgress] = useState(0);

  const stm32Series = [
    { id: 'f4', name: 'STM32F4 Series', description: 'High-performance ARM Cortex-M4' },
    { id: 'f7', name: 'STM32F7 Series', description: 'Very high-performance ARM Cortex-M7' },
    { id: 'h7', name: 'STM32H7 Series', description: 'Dual-core high-performance' },
    { id: 'l4', name: 'STM32L4 Series', description: 'Ultra-low-power ARM Cortex-M4' }
  ];

  const packTypes = [
    { id: 'firmware', name: 'Firmware Pack', description: 'Complete firmware package with HAL drivers' },
    { id: 'middleware', name: 'Middleware Pack', description: 'RTOS and middleware components' },
    { id: 'bsp', name: 'BSP Pack', description: 'Board Support Package' },
    { id: 'custom', name: 'Custom Pack', description: 'User-defined package configuration' }
  ];

  const availableMiddleware = [
    { id: 'threadx', name: 'ThreadX', description: 'Real-time operating system' },
    { id: 'filex', name: 'FileX', description: 'File system' },
    { id: 'netxduo', name: 'NetX Duo', description: 'TCP/IP network stack' },
    { id: 'usbx', name: 'USBX', description: 'USB host and device stack' },
    { id: 'guix', name: 'GUIX', description: 'Graphical user interface' },
    { id: 'levelx', name: 'LevelX', description: 'NAND/NOR flash management' }
  ];

  const handleMiddlewareChange = (middlewareId: string, checked: boolean) => {
    if (checked) {
      setMiddleware(prev => [...prev, middlewareId]);
    } else {
      setMiddleware(prev => prev.filter(m => m !== middlewareId));
    }
  };

  const handleGenerate = async () => {
    if (!selectedSeries || !packName || !packType) {
      addConsoleOutput('❌ Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    addConsoleOutput('🚀 Starting pack generation...');

    try {
      const steps = [
        'Initializing pack structure',
        'Setting up series configuration',
        'Including middleware components',
        'Adding board support files',
        'Generating examples',
        'Creating documentation',
        'Building package',
        'Finalizing pack'
      ];

      for (let i = 0; i < steps.length; i++) {
        addConsoleOutput(`📋 ${steps[i]}...`);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      addConsoleOutput('✅ Pack generated successfully!');
      addConsoleOutput(`📦 Pack: ${packName} v${packVersion}`);
      addConsoleOutput(`📁 Output location: ${outputPath}/${packName}-${packVersion}.pack`);
      addConsoleOutput(`🎯 Target: ${selectedSeries.toUpperCase()} Series`);
      addConsoleOutput(`⚙️ Middleware: ${middleware.length} components included`);

    } catch (error) {
      addConsoleOutput('❌ Generation failed: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Package className="w-6 h-6 mr-3 text-green-600" />
                Generate Pack
              </h1>
              <p className="text-gray-600">Build firmware packages for STM32 microcontrollers with AZRTOS</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Professional
            </Badge>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Generating Pack...</span>
                      <span className="text-sm text-green-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
              <TabsTrigger value="middleware">Middleware</TabsTrigger>
              <TabsTrigger value="options">Pack Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Pack Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Pack Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pack-name">Pack Name *</Label>
                      <Input
                        id="pack-name"
                        value={packName}
                        onChange={(e) => setPackName(e.target.value)}
                        placeholder="MySTM32Pack"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pack-version">Version</Label>
                      <Input
                        id="pack-version"
                        value={packVersion}
                        onChange={(e) => setPackVersion(e.target.value)}
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="output-path">Output Path</Label>
                    <Input
                      id="output-path"
                      value={outputPath}
                      onChange={(e) => setOutputPath(e.target.value)}
                      placeholder="./packs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Target Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>STM32 Series *</Label>
                      <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select STM32 series" />
                        </SelectTrigger>
                        <SelectContent>
                          {stm32Series.map(series => (
                            <SelectItem key={series.id} value={series.id}>
                              <div>
                                <div className="font-medium">{series.name}</div>
                                <div className="text-sm text-gray-500">{series.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Pack Type *</Label>
                      <Select value={packType} onValueChange={setPackType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pack type" />
                        </SelectTrigger>
                        <SelectContent>
                          {packTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <div>
                                <div className="font-medium">{type.name}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="middleware">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    Azure RTOS Middleware
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {availableMiddleware.map(mw => (
                      <div key={mw.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={mw.id}
                          checked={middleware.includes(mw.id)}
                          onCheckedChange={(checked) => 
                            handleMiddlewareChange(mw.id, !!checked)
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor={mw.id} className="font-medium">
                            {mw.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">{mw.description}</p>
                        </div>
                        <Badge variant="outline">{mw.id}</Badge>
                      </div>
                    ))}
                  </div>
                  {middleware.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Middleware:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {middleware.map(mw => {
                          const middlewareInfo = availableMiddleware.find(m => m.id === mw);
                          return (
                            <Badge key={mw} variant="secondary">
                              {middlewareInfo?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Pack Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-examples"
                        checked={includeExamples}
                        onCheckedChange={(checked) => setIncludeExamples(!!checked)}
                      />
                      <Label htmlFor="include-examples" className="font-medium">
                        Include Example Projects
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-docs"
                        checked={includeDocumentation}
                        onCheckedChange={(checked) => setIncludeDocumentation(!!checked)}
                      />
                      <Label htmlFor="include-docs" className="font-medium">
                        Include Documentation
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-2">
              {packName && selectedSeries && packType ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Ready to generate</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Please complete required fields</span>
                </div>
              )}
            </div>
            <div className="space-x-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !packName || !selectedSeries || !packType}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate Pack
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
