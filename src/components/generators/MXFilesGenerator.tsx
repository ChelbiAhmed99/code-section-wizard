
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Settings, 
  Zap, 
  Clock, 
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

export const MXFilesGenerator: React.FC = () => {
  const { addConsoleOutput, isGenerating, setIsGenerating } = useSTM();
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [projectName, setProjectName] = useState('');
  const [outputPath, setOutputPath] = useState('./output');
  const [peripherals, setPeripherals] = useState<string[]>([]);
  const [clockConfig, setClockConfig] = useState({
    hse: '25',
    pllM: '25',
    pllN: '360',
    pllP: '2',
    pllQ: '7'
  });
  const [progress, setProgress] = useState(0);

  const stm32Series = [
    { id: 'f4', name: 'STM32F4 Series', description: 'High-performance ARM Cortex-M4' },
    { id: 'f7', name: 'STM32F7 Series', description: 'Very high-performance ARM Cortex-M7' },
    { id: 'h7', name: 'STM32H7 Series', description: 'Dual-core high-performance' },
    { id: 'l4', name: 'STM32L4 Series', description: 'Ultra-low-power ARM Cortex-M4' }
  ];

  const boardsBySeriesMap = {
    f4: [
      { id: 'STM32F469I-Discovery', name: 'STM32F469I-Discovery', mcu: 'STM32F469NIH6' },
      { id: 'STM32F446RE-Nucleo', name: 'STM32F446RE-Nucleo', mcu: 'STM32F446RET6' },
      { id: 'STM32F407G-Discovery', name: 'STM32F407G-Discovery', mcu: 'STM32F407VGT6' }
    ],
    f7: [
      { id: 'STM32F746G-Discovery', name: 'STM32F746G-Discovery', mcu: 'STM32F746NGH6' },
      { id: 'STM32F767ZI-Nucleo', name: 'STM32F767ZI-Nucleo', mcu: 'STM32F767ZIT6' }
    ],
    h7: [
      { id: 'STM32H743I-Discovery', name: 'STM32H743I-Discovery', mcu: 'STM32H743IIT6' },
      { id: 'STM32H747I-Discovery', name: 'STM32H747I-Discovery', mcu: 'STM32H747IIT6' }
    ],
    l4: [
      { id: 'STM32L476G-Discovery', name: 'STM32L476G-Discovery', mcu: 'STM32L476VGT6' },
      { id: 'STM32L4R5ZI-Nucleo', name: 'STM32L4R5ZI-Nucleo', mcu: 'STM32L4R5ZIT6' }
    ]
  };

  const availablePeripherals = [
    'GPIO', 'USART', 'SPI', 'I2C', 'TIM', 'ADC', 'DAC', 'DMA', 'USB', 'ETH', 'CAN', 'SDIO', 'RTC', 'WWDG', 'IWDG'
  ];

  const boards = selectedSeries ? boardsBySeriesMap[selectedSeries] || [] : [];

  const handlePeripheralChange = (peripheral: string, checked: boolean) => {
    if (checked) {
      setPeripherals(prev => [...prev, peripheral]);
    } else {
      setPeripherals(prev => prev.filter(p => p !== peripheral));
    }
  };

  const handleGenerate = async () => {
    if (!selectedSeries || !selectedBoard || !projectName) {
      addConsoleOutput('❌ Please fill all required fields');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    addConsoleOutput('🚀 Starting MX files generation...');

    try {
      // Simulate generation process
      const steps = [
        'Initializing project configuration',
        'Setting up MCU parameters',
        'Configuring clock system',
        'Enabling selected peripherals',
        'Generating pin assignments',
        'Creating project files',
        'Finalizing configuration'
      ];

      for (let i = 0; i < steps.length; i++) {
        addConsoleOutput(`📋 ${steps[i]}...`);
        setProgress(((i + 1) / steps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      addConsoleOutput('✅ MX files generated successfully!');
      addConsoleOutput(`📁 Output location: ${outputPath}/${projectName}.ioc`);
      addConsoleOutput(`🎯 Target: ${selectedBoard}`);
      addConsoleOutput(`⚙️ Peripherals: ${peripherals.join(', ')}`);

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
                <Cpu className="w-6 h-6 mr-3 text-blue-600" />
                Generate MX Files
              </h1>
              <p className="text-gray-600">Create STM32CubeMX configuration files for your project</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Quick Setup
            </Badge>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Generating MX Files...</span>
                      <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
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
              <TabsTrigger value="peripherals">Peripherals</TabsTrigger>
              <TabsTrigger value="clock">Clock Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Project Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Project Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-name">Project Name *</Label>
                      <Input
                        id="project-name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="MySTM32Project"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-path">Output Path</Label>
                      <Input
                        id="output-path"
                        value={outputPath}
                        onChange={(e) => setOutputPath(e.target.value)}
                        placeholder="./output"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Target Selection</CardTitle>
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
                      <Label>Development Board *</Label>
                      <Select 
                        value={selectedBoard} 
                        onValueChange={setSelectedBoard}
                        disabled={!selectedSeries}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select development board" />
                        </SelectTrigger>
                        <SelectContent>
                          {boards.map(board => (
                            <SelectItem key={board.id} value={board.id}>
                              <div>
                                <div className="font-medium">{board.name}</div>
                                <div className="text-sm text-gray-500">{board.mcu}</div>
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

            <TabsContent value="peripherals">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Peripheral Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {availablePeripherals.map(peripheral => (
                      <div key={peripheral} className="flex items-center space-x-2">
                        <Checkbox
                          id={peripheral}
                          checked={peripherals.includes(peripheral)}
                          onCheckedChange={(checked) => 
                            handlePeripheralChange(peripheral, !!checked)
                          }
                        />
                        <Label htmlFor={peripheral} className="text-sm font-medium">
                          {peripheral}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {peripherals.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Selected Peripherals:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {peripherals.map(peripheral => (
                          <Badge key={peripheral} variant="secondary">
                            {peripheral}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clock">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Clock Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hse">HSE Value (MHz)</Label>
                      <Input
                        id="hse"
                        type="number"
                        value={clockConfig.hse}
                        onChange={(e) => setClockConfig(prev => ({ ...prev, hse: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pll-m">PLL M</Label>
                      <Input
                        id="pll-m"
                        type="number"
                        value={clockConfig.pllM}
                        onChange={(e) => setClockConfig(prev => ({ ...prev, pllM: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pll-n">PLL N</Label>
                      <Input
                        id="pll-n"
                        type="number"
                        value={clockConfig.pllN}
                        onChange={(e) => setClockConfig(prev => ({ ...prev, pllN: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pll-p">PLL P</Label>
                      <Input
                        id="pll-p"
                        type="number"
                        value={clockConfig.pllP}
                        onChange={(e) => setClockConfig(prev => ({ ...prev, pllP: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-2">
              {projectName && selectedSeries && selectedBoard ? (
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
                disabled={isGenerating || !projectName || !selectedSeries || !selectedBoard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate MX Files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
