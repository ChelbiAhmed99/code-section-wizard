
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, FolderOpen, Play } from 'lucide-react';
import { useSTM } from '../../contexts/STMContext';

export const ApplicationGenerator: React.FC = () => {
  const [serie, setSerie] = useState('');
  const [board, setBoard] = useState('');
  const [middleware, setMiddleware] = useState('');
  const [application, setApplication] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [toolchain, setToolchain] = useState('');
  const { addConsoleOutput, setIsGenerating, isGenerating } = useSTM();

  const seriesBoards = {
    f4: ['STM32469I-Discovery', 'STM32F429ZI-Nucleo'],
    f7: ['STM32F767ZI-Nucleo', 'STM32F769I-Discovery'],
    g4: ['NUCLEO-G474RE', 'STM32G474E-EVAL'],
    h7: ['NUCLEO-H723ZG', 'STM32H735G-DK', 'STM32H743I-EVAL', 'STM32H747I-DISCO'],
    h7rs: ['NUCLEO-H7S3L8', 'STM32H7S78-DK'],
    l4: ['NUCLEO-L4R5ZI', 'STM32L4R9I-Discovery'],
    l5: ['NUCLEO-L552ZE-Q', 'STM32L562E-DK'],
    wb: ['P-NUCLEO-WB55.Nucleo', 'STM32WB5MM-DK'],
    wl: ['NUCLEO-WL55JC']
  };

  const boardMiddleware = {
    'STM32469I-Discovery': ['ThreadX', 'NetXDuo', 'USBX'],
    'STM32F429ZI-Nucleo': ['ThreadX', 'NetXDuo', 'USBX'],
    'NUCLEO-G474RE': ['ThreadX', 'FileX'],
    'NUCLEO-H723ZG': ['ThreadX', 'NetXDuo', 'USBX']
  };

  const middlewareApps = {
    ThreadX: ['Tx_Thread_Creation', 'Tx_Thread_Sync', 'Tx_Thread_MsgQueue', 'Tx_LowPower'],
    FileX: ['Fx_File_Edit_Standalone', 'Fx_MultiAccess', 'Fx_Dual_Instance'],
    NetXDuo: ['Nx_TCP_Echo_Server', 'Nx_UDP_Echo_Client', 'Nx_MQTT_Client'],
    USBX: ['Ux_Device_HID', 'Ux_Device_CDC_ACM', 'Ux_Host_MSC']
  };

  const handleGenerate = async () => {
    if (!serie || !board || !middleware || !application || !outputDir || !toolchain) {
      addConsoleOutput('Error: Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    addConsoleOutput(`Starting application generation: ${application} on ${board}...`);
    
    try {
      addConsoleOutput('Validating configuration...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Creating BOARD class...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addConsoleOutput('Generating application files...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      addConsoleOutput(`Application ${application} generated successfully for ${toolchain}!`);
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
            <Code className="w-5 h-5 mr-2" />
            Generate Application
          </CardTitle>
          <CardDescription>
            Create complete applications for specific STM32 boards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serie">STM32 Series</Label>
              <Select value={serie} onValueChange={(value) => {
                setSerie(value);
                setBoard('');
                setMiddleware('');
                setApplication('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select STM32 series" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(seriesBoards).map(s => (
                    <SelectItem key={s} value={s}>STM32{s.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="board">STM32 Board</Label>
              <Select value={board} onValueChange={(value) => {
                setBoard(value);
                setMiddleware('');
                setApplication('');
              }} disabled={!serie}>
                <SelectTrigger>
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {serie && seriesBoards[serie]?.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middleware">Middleware</Label>
              <Select value={middleware} onValueChange={(value) => {
                setMiddleware(value);
                setApplication('');
              }} disabled={!board}>
                <SelectTrigger>
                  <SelectValue placeholder="Select middleware" />
                </SelectTrigger>
                <SelectContent>
                  {board && boardMiddleware[board]?.map(m => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="application">Application</Label>
              <Select value={application} onValueChange={setApplication} disabled={!middleware}>
                <SelectTrigger>
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {middleware && middlewareApps[middleware]?.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toolchain">Toolchain</Label>
              <Select value={toolchain} onValueChange={setToolchain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select toolchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IAR">IAR</SelectItem>
                  <SelectItem value="Keil">Keil</SelectItem>
                  <SelectItem value="STM32CubeIDE">STM32CubeIDE</SelectItem>
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
            disabled={isGenerating || !serie || !board || !middleware || !application || !outputDir || !toolchain}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Application'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
