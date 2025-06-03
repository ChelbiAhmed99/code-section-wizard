
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
  Code, 
  Settings, 
  Layers, 
  Wrench, 
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

export const ApplicationGenerator: React.FC = () => {
  const { addConsoleOutput, isGenerating, setIsGenerating } = useSTM();
  const [selectedBoard, setSelectedBoard] = useState('');
  const [appName, setAppName] = useState('');
  const [appType, setAppType] = useState('');
  const [outputPath, setOutputPath] = useState('./apps');
  const [toolchain, setToolchain] = useState('');
  const [middleware, setMiddleware] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const boards = [
    { id: 'STM32F469I-Discovery', name: 'STM32F469I-Discovery', series: 'F4', mcu: 'STM32F469NIH6' },
    { id: 'STM32F746G-Discovery', name: 'STM32F746G-Discovery', series: 'F7', mcu: 'STM32F746NGH6' },
    { id: 'STM32H743I-Discovery', name: 'STM32H743I-Discovery', series: 'H7', mcu: 'STM32H743IIT6' },
    { id: 'STM32L476G-Discovery', name: 'STM32L476G-Discovery', series: 'L4', mcu: 'STM32L476VGT6' },
    { id: 'STM32F446RE-Nucleo', name: 'STM32F446RE-Nucleo', series: 'F4', mcu: 'STM32F446RET6' }
  ];

  const appTypes = [
    { id: 'basic', name: 'Basic Application', description: 'Simple application with main loop' },
    { id: 'rtos', name: 'RTOS Application', description: 'Multi-threaded application with ThreadX' },
    { id: 'iot', name: 'IoT Application', description: 'Connected application with networking' },
    { id: 'gui', name: 'GUI Application', description: 'Graphical user interface application' },
    { id: 'bootloader', name: 'Bootloader', description: 'Custom bootloader application' }
  ];

  const toolchains = [
    { id: 'gcc', name: 'GCC ARM', description: 'GNU ARM Embedded Toolchain' },
    { id: 'iar', name: 'IAR EWARM', description: 'IAR Embedded Workbench for ARM' },
    { id: 'keil', name: 'Keil MDK', description: 'Keil Microcontroller Development Kit' },
    { id: 'stm32cubeide', name: 'STM32CubeIDE', description: 'STMicroelectronics IDE' }
  ];

  const availableMiddleware = [
    'ThreadX', 'FileX', 'NetX Duo', 'USBX', 'GUIX', 'LevelX', 'TraceX'
  ];

  const availableFeatures = [
    'LED Control', 'Button Input', 'UART Communication', 'SPI Interface', 
    'I2C Interface', 'ADC Sampling', 'PWM Output', 'Timer Functions',
    'Watchdog Timer', 'RTC Clock', 'DMA Transfer', 'Interrupt Handling'
  ];

  const handleMiddlewareChange = (mw: string, checked: boolean) => {
    if (checked) {
      setMiddleware(prev => [...prev, mw]);
    } else {
      setMiddleware(prev => prev.filter(m => m !== mw));
    }
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFeatures(prev => [...prev, feature]);
    } else {
      setFeatures(prev => prev.filter(f => f !== feature));
    }
  };

  const handleGenerate = async () => {
    if (!selectedBoard || !appName || !appType || !toolchain) {
      addConsoleOutput('❌ Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    addConsoleOutput('🚀 Starting application generation...');

    try {
      const steps = [
        'Initializing application structure',
        'Setting up board configuration',
        'Configuring toolchain',
        'Adding middleware components',
        'Implementing features',
        'Generating source files',
        'Creating project files',
        'Finalizing application'
      ];

      for (let i = 0; i < steps.length; i++) {
        addConsoleOutput(`📋 ${steps[i]}...`);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 900));
      }

      const selectedBoardInfo = boards.find(b => b.id === selectedBoard);
      addConsoleOutput('✅ Application generated successfully!');
      addConsoleOutput(`🎯 Application: ${appName}`);
      addConsoleOutput(`📁 Output location: ${outputPath}/${appName}`);
      addConsoleOutput(`🎯 Target: ${selectedBoardInfo?.name}`);
      addConsoleOutput(`🔧 Toolchain: ${toolchain.toUpperCase()}`);
      addConsoleOutput(`⚙️ Features: ${features.length} components included`);

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
                <Code className="w-6 h-6 mr-3 text-purple-600" />
                Generate Application
              </h1>
              <p className="text-gray-600">Create complete applications for specific STM32 boards</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Popular
            </Badge>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-purple-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-800">Generating Application...</span>
                      <span className="text-sm text-purple-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              <TabsTrigger value="target">Target & Toolchain</TabsTrigger>
              <TabsTrigger value="middleware">Middleware</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Application Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Application Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="app-name">Application Name *</Label>
                      <Input
                        id="app-name"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="MySTM32App"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-path">Output Path</Label>
                      <Input
                        id="output-path"
                        value={outputPath}
                        onChange={(e) => setOutputPath(e.target.value)}
                        placeholder="./apps"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Application Type *</Label>
                    <Select value={appType} onValueChange={setAppType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select application type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appTypes.map(type => (
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="target">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="w-5 h-5 mr-2" />
                    Target & Toolchain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Development Board *</Label>
                    <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select development board" />
                      </SelectTrigger>
                      <SelectContent>
                        {boards.map(board => (
                          <SelectItem key={board.id} value={board.id}>
                            <div>
                              <div className="font-medium">{board.name}</div>
                              <div className="text-sm text-gray-500">{board.mcu} - {board.series} Series</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Toolchain *</Label>
                    <Select value={toolchain} onValueChange={setToolchain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select toolchain" />
                      </SelectTrigger>
                      <SelectContent>
                        {toolchains.map(tc => (
                          <SelectItem key={tc.id} value={tc.id}>
                            <div>
                              <div className="font-medium">{tc.name}</div>
                              <div className="text-sm text-gray-500">{tc.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="middleware">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    Middleware Components
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {availableMiddleware.map(mw => (
                      <div key={mw} className="flex items-center space-x-2">
                        <Checkbox
                          id={mw}
                          checked={middleware.includes(mw)}
                          onCheckedChange={(checked) => 
                            handleMiddlewareChange(mw, !!checked)
                          }
                        />
                        <Label htmlFor={mw} className="text-sm font-medium">
                          {mw}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {middleware.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Middleware:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {middleware.map(mw => (
                          <Badge key={mw} variant="secondary">
                            {mw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Application Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {availableFeatures.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={features.includes(feature)}
                          onCheckedChange={(checked) => 
                            handleFeatureChange(feature, !!checked)
                          }
                        />
                        <Label htmlFor={feature} className="text-sm font-medium">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {features.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Features:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {features.map(feature => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-2">
              {appName && selectedBoard && appType && toolchain ? (
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
                disabled={isGenerating || !appName || !selectedBoard || !appType || !toolchain}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
