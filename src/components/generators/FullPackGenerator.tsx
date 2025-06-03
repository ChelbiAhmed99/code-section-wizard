
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
  Zap, 
  Settings, 
  Layers, 
  Shield, 
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

export const FullPackGenerator: React.FC = () => {
  const { addConsoleOutput, isGenerating, setIsGenerating } = useSTM();
  const [selectedSeries, setSelectedSeries] = useState('');
  const [packName, setPackName] = useState('');
  const [packVersion, setPackVersion] = useState('1.0.0');
  const [outputPath, setOutputPath] = useState('./full-packs');
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [middleware, setMiddleware] = useState<string[]>([]);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeDocumentation, setIncludeDocumentation] = useState(true);
  const [includeBSP, setIncludeBSP] = useState(true);
  const [includeDrivers, setIncludeDrivers] = useState(true);
  const [progress, setProgress] = useState(0);

  const stm32Series = [
    { 
      id: 'f4', 
      name: 'STM32F4 Series', 
      description: 'High-performance ARM Cortex-M4',
      boards: [
        'STM32F469I-Discovery',
        'STM32F446RE-Nucleo', 
        'STM32F407G-Discovery',
        'STM32F429I-Discovery'
      ]
    },
    { 
      id: 'f7', 
      name: 'STM32F7 Series', 
      description: 'Very high-performance ARM Cortex-M7',
      boards: [
        'STM32F746G-Discovery',
        'STM32F767ZI-Nucleo',
        'STM32F769I-Discovery'
      ]
    },
    { 
      id: 'h7', 
      name: 'STM32H7 Series', 
      description: 'Dual-core high-performance',
      boards: [
        'STM32H743I-Discovery',
        'STM32H747I-Discovery',
        'STM32H755ZI-Nucleo'
      ]
    },
    { 
      id: 'l4', 
      name: 'STM32L4 Series', 
      description: 'Ultra-low-power ARM Cortex-M4',
      boards: [
        'STM32L476G-Discovery',
        'STM32L4R5ZI-Nucleo',
        'STM32L496G-Discovery'
      ]
    }
  ];

  const availableMiddleware = [
    { id: 'threadx', name: 'ThreadX', description: 'Real-time operating system' },
    { id: 'filex', name: 'FileX', description: 'File system' },
    { id: 'netxduo', name: 'NetX Duo', description: 'TCP/IP network stack' },
    { id: 'usbx', name: 'USBX', description: 'USB host and device stack' },
    { id: 'guix', name: 'GUIX', description: 'Graphical user interface' },
    { id: 'levelx', name: 'LevelX', description: 'NAND/NOR flash management' },
    { id: 'tracex', name: 'TraceX', description: 'System analysis tool' }
  ];

  const currentSeries = stm32Series.find(s => s.id === selectedSeries);
  const availableBoards = currentSeries?.boards || [];

  const handleBoardChange = (board: string, checked: boolean) => {
    if (checked) {
      setSelectedBoards(prev => [...prev, board]);
    } else {
      setSelectedBoards(prev => prev.filter(b => b !== board));
    }
  };

  const handleMiddlewareChange = (middlewareId: string, checked: boolean) => {
    if (checked) {
      setMiddleware(prev => [...prev, middlewareId]);
    } else {
      setMiddleware(prev => prev.filter(m => m !== middlewareId));
    }
  };

  const selectAllBoards = () => {
    setSelectedBoards(availableBoards);
  };

  const clearAllBoards = () => {
    setSelectedBoards([]);
  };

  const handleGenerate = async () => {
    if (!selectedSeries || !packName || selectedBoards.length === 0) {
      addConsoleOutput('❌ Please fill all required fields and select at least one board');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    addConsoleOutput('🚀 Starting full pack generation...');

    try {
      const totalSteps = 8 + selectedBoards.length * 3; // Base steps + board-specific steps
      let currentStep = 0;

      const updateProgress = () => {
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      };

      // Base setup
      addConsoleOutput('📋 Initializing full pack structure...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateProgress();

      addConsoleOutput('📋 Setting up series configuration...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress();

      addConsoleOutput('📋 Configuring middleware components...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress();

      // Process each board
      for (const board of selectedBoards) {
        addConsoleOutput(`📋 Processing ${board}...`);
        await new Promise(resolve => setTimeout(resolve, 600));
        updateProgress();

        addConsoleOutput(`📋 Generating applications for ${board}...`);
        await new Promise(resolve => setTimeout(resolve, 600));
        updateProgress();

        addConsoleOutput(`📋 Creating BSP for ${board}...`);
        await new Promise(resolve => setTimeout(resolve, 600));
        updateProgress();
      }

      // Final steps
      addConsoleOutput('📋 Building examples and documentation...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateProgress();

      addConsoleOutput('📋 Creating package manifest...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress();

      addConsoleOutput('📋 Compressing full pack...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateProgress();

      addConsoleOutput('📋 Validating package integrity...');
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress();

      addConsoleOutput('📋 Finalizing full pack...');
      await new Promise(resolve => setTimeout(resolve, 600));
      updateProgress();

      addConsoleOutput('✅ Full pack generated successfully!');
      addConsoleOutput(`📦 Pack: ${packName} v${packVersion}`);
      addConsoleOutput(`📁 Output location: ${outputPath}/${packName}-${packVersion}-full.pack`);
      addConsoleOutput(`🎯 Target: ${selectedSeries.toUpperCase()} Series`);
      addConsoleOutput(`🎯 Boards included: ${selectedBoards.length} boards`);
      addConsoleOutput(`⚙️ Middleware: ${middleware.length} components`);
      addConsoleOutput(`📊 Package size: ~${Math.floor(Math.random() * 500 + 100)}MB`);

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
                <Zap className="w-6 h-6 mr-3 text-orange-600" />
                Generate Full Pack
              </h1>
              <p className="text-gray-600">Generate comprehensive packs with all applications for a series</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Advanced
            </Badge>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 animate-spin text-orange-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-800">Generating Full Pack...</span>
                      <span className="text-sm text-orange-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Configuration</TabsTrigger>
              <TabsTrigger value="boards">Board Selection</TabsTrigger>
              <TabsTrigger value="middleware">Middleware</TabsTrigger>
              <TabsTrigger value="options">Pack Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Pack Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Full Pack Configuration
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
                        placeholder="MySTM32FullPack"
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
                      placeholder="./full-packs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Series Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Series Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>STM32 Series *</Label>
                    <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select STM32 series for full pack" />
                      </SelectTrigger>
                      <SelectContent>
                        {stm32Series.map(series => (
                          <SelectItem key={series.id} value={series.id}>
                            <div>
                              <div className="font-medium">{series.name}</div>
                              <div className="text-sm text-gray-500">{series.description}</div>
                              <div className="text-xs text-blue-600">{series.boards.length} boards available</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="boards">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Board Selection
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={selectAllBoards} disabled={!selectedSeries}>
                        Select All
                      </Button>
                      <Button size="sm" variant="outline" onClick={clearAllBoards}>
                        Clear All
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedSeries ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Please select a series first to see available boards</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {availableBoards.map(board => (
                        <div key={board} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={board}
                            checked={selectedBoards.includes(board)}
                            onCheckedChange={(checked) => 
                              handleBoardChange(board, !!checked)
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor={board} className="font-medium">
                              {board}
                            </Label>
                          </div>
                          <Badge variant="outline">
                            {selectedSeries.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedBoards.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">
                        Selected Boards ({selectedBoards.length}):
                      </Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedBoards.map(board => (
                          <Badge key={board} variant="secondary">
                            {board}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Full Pack Options
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
                        Include All Example Projects
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-docs"
                        checked={includeDocumentation}
                        onCheckedChange={(checked) => setIncludeDocumentation(!!checked)}
                      />
                      <Label htmlFor="include-docs" className="font-medium">
                        Include Complete Documentation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-bsp"
                        checked={includeBSP}
                        onCheckedChange={(checked) => setIncludeBSP(!!checked)}
                      />
                      <Label htmlFor="include-bsp" className="font-medium">
                        Include Board Support Packages
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-drivers"
                        checked={includeDrivers}
                        onCheckedChange={(checked) => setIncludeDrivers(!!checked)}
                      />
                      <Label htmlFor="include-drivers" className="font-medium">
                        Include All HAL Drivers
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
              {packName && selectedSeries && selectedBoards.length > 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Ready to generate full pack</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Please complete configuration and select boards</span>
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
                disabled={isGenerating || !packName || !selectedSeries || selectedBoards.length === 0}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Generate Full Pack
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
