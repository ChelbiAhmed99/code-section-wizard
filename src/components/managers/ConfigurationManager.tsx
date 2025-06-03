
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  FileText, 
  Save, 
  Upload, 
  Download,
  Eye,
  Edit,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

interface ConfigFile {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  modified: string;
  content: any;
}

export const ConfigurationManager: React.FC = () => {
  const { addConsoleOutput } = useSTM();
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ConfigFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Mock configuration files
  const mockConfigFiles: ConfigFile[] = [
    {
      id: '1',
      name: 'stm32f4_config.json',
      path: 'configs/series/stm32f4_config.json',
      type: 'series',
      size: 2048,
      modified: '2024-01-15',
      content: {
        series: 'F4',
        family: 'STM32F4xx',
        architecture: 'ARM Cortex-M4',
        max_frequency: 180,
        flash_size: {
          min: 128,
          max: 2048
        },
        ram_size: {
          min: 64,
          max: 384
        },
        peripherals: ['GPIO', 'USART', 'SPI', 'I2C', 'TIM', 'ADC', 'DAC', 'DMA', 'USB', 'ETH'],
        boards: [
          {
            name: 'STM32F469I-Discovery',
            mcu: 'STM32F469NIH6',
            flash: 2048,
            ram: 384
          }
        ]
      }
    },
    {
      id: '2',
      name: 'middleware_config.json',
      path: 'configs/middleware/middleware_config.json',
      type: 'middleware',
      size: 1536,
      modified: '2024-01-14',
      content: {
        azure_rtos: {
          version: '6.4.1',
          components: {
            threadx: {
              enabled: true,
              version: '6.4.1',
              config: {
                max_priorities: 32,
                minimum_stack: 200,
                timer_ticks_per_second: 1000
              }
            },
            filex: {
              enabled: true,
              version: '6.4.1',
              config: {
                max_files: 32,
                sector_size: 512
              }
            },
            netxduo: {
              enabled: false,
              version: '6.4.1'
            }
          }
        }
      }
    },
    {
      id: '3',
      name: 'build_config.json',
      path: 'configs/build/build_config.json',
      type: 'build',
      size: 1024,
      modified: '2024-01-13',
      content: {
        toolchains: {
          gcc: {
            version: '12.3.1',
            flags: ['-mcpu=cortex-m4', '-mthumb', '-mfpu=fpv4-sp-d16', '-mfloat-abi=hard'],
            linker_script: 'template'
          },
          iar: {
            version: '9.50.2',
            optimization: 'high'
          }
        },
        output: {
          format: 'elf',
          debug_info: true,
          optimization: 'O2'
        }
      }
    }
  ];

  useEffect(() => {
    // Simulate loading configuration files
    setIsLoading(true);
    setTimeout(() => {
      setConfigFiles(mockConfigFiles);
      setIsLoading(false);
      addConsoleOutput('📁 Configuration files loaded');
    }, 1000);
  }, []);

  const filteredFiles = configFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (file: ConfigFile) => {
    setSelectedFile(file);
    setEditContent(JSON.stringify(file.content, null, 2));
    setIsEditing(false);
    setValidationErrors([]);
    addConsoleOutput(`📄 Opened ${file.name}`);
  };

  const handleEdit = () => {
    setIsEditing(true);
    addConsoleOutput('✏️ Started editing configuration');
  };

  const handleSave = () => {
    try {
      const parsedContent = JSON.parse(editContent);
      setValidationErrors([]);
      
      if (selectedFile) {
        const updatedFile = { ...selectedFile, content: parsedContent };
        setConfigFiles(prev => 
          prev.map(file => file.id === selectedFile.id ? updatedFile : file)
        );
        setSelectedFile(updatedFile);
        setIsEditing(false);
        addConsoleOutput(`✅ Saved ${selectedFile.name}`);
      }
    } catch (error) {
      setValidationErrors(['Invalid JSON format: ' + error.message]);
      addConsoleOutput('❌ Failed to save: Invalid JSON format');
    }
  };

  const handleCancel = () => {
    if (selectedFile) {
      setEditContent(JSON.stringify(selectedFile.content, null, 2));
    }
    setIsEditing(false);
    setValidationErrors([]);
    addConsoleOutput('❌ Cancelled editing');
  };

  const handleExport = () => {
    if (selectedFile) {
      const dataStr = JSON.stringify(selectedFile.content, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;
      link.click();
      addConsoleOutput(`📥 Exported ${selectedFile.name}`);
    }
  };

  const getFileTypeColor = (type: string) => {
    const colors = {
      series: 'bg-blue-100 text-blue-800',
      middleware: 'bg-green-100 text-green-800',
      build: 'bg-purple-100 text-purple-800',
      board: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex">
      {/* Sidebar - File Browser */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Configuration Files</h2>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">Loading configurations...</span>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center p-3 hover:bg-blue-50 cursor-pointer rounded border ${
                    selectedFile?.id === file.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <FileText className="w-4 h-4 mr-3 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {file.path}
                    </div>
                    <div className="text-xs text-gray-400">
                      Modified: {file.modified}
                    </div>
                  </div>
                  <Badge className={`text-xs ${getFileTypeColor(file.type)}`}>
                    {file.type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedFile.name}</h3>
                  <p className="text-xs text-gray-500">{selectedFile.path}</p>
                </div>
                <Badge className={getFileTypeColor(selectedFile.type)}>
                  {selectedFile.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                {validationErrors.length === 0 && !isEditing && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Valid
                  </Badge>
                )}
                
                {validationErrors.length > 0 && (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {validationErrors.length} Error(s)
                  </Badge>
                )}
                
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                
                {!isEditing ? (
                  <Button size="sm" onClick={handleEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="editor" className="flex-1 flex flex-col">
              <TabsList className="mx-4 mt-4">
                <TabsTrigger value="editor">
                  {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Editor' : 'Viewer'}
                </TabsTrigger>
                <TabsTrigger value="form">Form View</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="flex-1 m-4">
                <div className="h-full border rounded-lg overflow-hidden">
                  {isEditing ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="h-full font-mono text-sm resize-none border-none outline-none"
                      placeholder="Enter JSON configuration..."
                    />
                  ) : (
                    <ScrollArea className="h-full">
                      <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                        {JSON.stringify(selectedFile.content, null, 2)}
                      </pre>
                    </ScrollArea>
                  )}
                </div>
                
                {validationErrors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-800">Validation Errors</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="form" className="flex-1 m-4">
                <ScrollArea className="h-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configuration Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedFile.type === 'series' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Series</Label>
                            <Input value={selectedFile.content.series} readOnly />
                          </div>
                          <div>
                            <Label>Architecture</Label>
                            <Input value={selectedFile.content.architecture} readOnly />
                          </div>
                          <div>
                            <Label>Max Frequency (MHz)</Label>
                            <Input value={selectedFile.content.max_frequency} readOnly />
                          </div>
                          <div>
                            <Label>Boards Count</Label>
                            <Input value={selectedFile.content.boards?.length || 0} readOnly />
                          </div>
                        </div>
                      )}
                      
                      {selectedFile.type === 'middleware' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Azure RTOS Version</Label>
                            <Input value={selectedFile.content.azure_rtos?.version} readOnly />
                          </div>
                          <div>
                            <Label>Enabled Components</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(selectedFile.content.azure_rtos?.components || {})
                                .filter(([, component]: [string, any]) => component.enabled)
                                .map(([name]) => (
                                  <Badge key={name} variant="secondary">
                                    {name}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedFile.type === 'build' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Available Toolchains</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.keys(selectedFile.content.toolchains || {}).map(toolchain => (
                                <Badge key={toolchain} variant="secondary">
                                  {toolchain.toUpperCase()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label>Output Format</Label>
                            <Input value={selectedFile.content.output?.format} readOnly />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Configuration Selected</h3>
              <p className="text-gray-500 mb-4">
                Choose a configuration file from the sidebar to start viewing or editing
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Import Configuration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
