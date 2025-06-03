
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
  FolderOpen,
  Search,
  Plus
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';
import { useProjectFiles } from '@/contexts/ProjectFilesContext';
import { FileUpload } from '../shared/FileUpload';
import { UploadedFile } from '@/services/fileUploadService';

export const ConfigurationManager: React.FC = () => {
  const { addConsoleOutput } = useSTM();
  const { projectFiles, updateFile, createNewTemplate } = useProjectFiles();
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  // Use uploaded config files from the project files context
  const configFiles = projectFiles.configs;

  const filteredFiles = configFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (file: UploadedFile) => {
    setSelectedFile(file);
    try {
      const content = typeof file.content === 'string' ? file.content : JSON.stringify(file.content, null, 2);
      setEditContent(content);
    } catch (error) {
      setEditContent(file.content.toString());
    }
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
        updateFile(selectedFile.id, { content: editContent });
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
      try {
        const content = typeof selectedFile.content === 'string' ? selectedFile.content : JSON.stringify(selectedFile.content, null, 2);
        setEditContent(content);
      } catch (error) {
        setEditContent(selectedFile.content.toString());
      }
    }
    setIsEditing(false);
    setValidationErrors([]);
    addConsoleOutput('❌ Cancelled editing');
  };

  const handleExport = () => {
    if (selectedFile) {
      const dataStr = editContent;
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;
      link.click();
      URL.revokeObjectURL(url);
      addConsoleOutput(`📥 Exported ${selectedFile.name}`);
    }
  };

  const getFileTypeColor = (type: string) => {
    const colors = {
      config: 'bg-blue-100 text-blue-800',
      series: 'bg-green-100 text-green-800',
      middleware: 'bg-purple-100 text-purple-800',
      build: 'bg-orange-100 text-orange-800',
      board: 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const createNewConfig = () => {
    const defaultConfig = {
      name: "New Configuration",
      version: "1.0.0",
      description: "Configuration file created with STM32Cube Builder",
      settings: {
        // Add default settings here
      }
    };
    
    const configName = `config_${Date.now()}.json`;
    // Using createNewTemplate for now as it handles file creation
    // In a real implementation, you'd want a createNewConfig method
    const newFile = createNewTemplate(configName, JSON.stringify(defaultConfig, null, 2));
    setSelectedFile(newFile);
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar - File Browser */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configuration Manager</h2>
              <p className="text-sm text-gray-600">Manage JSON configurations</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={createNewConfig}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowUpload(!showUpload)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* File Upload Section */}
        {showUpload && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <FileUpload 
              onUploadComplete={() => setShowUpload(false)}
              accept=".json,.config"
              className="min-h-0"
            />
          </div>
        )}

        <ScrollArea className="h-[calc(100%-200px)]">
          {configFiles.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Configurations</h3>
              <p className="text-gray-500 mb-4 text-sm">
                Import existing configurations or create a new one
              </p>
              <div className="space-y-2">
                <Button onClick={createNewConfig} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Config
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Configs
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedFile?.id === file.id 
                      ? 'bg-blue-50 border-blue-300 shadow-md' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {file.path}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Modified: {new Date(file.lastModified).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={`text-xs ${getFileTypeColor(file.type)}`}>
                        {file.type}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center space-x-4">
                <FileText className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">{selectedFile.path}</p>
                </div>
                <Badge className={getFileTypeColor(selectedFile.type)}>
                  {selectedFile.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {validationErrors.length === 0 && !isEditing && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Valid JSON
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
                  <Button size="sm" onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Tabs defaultValue="editor" className="flex-1 flex flex-col">
              <TabsList className="mx-6 mt-4 bg-gray-100">
                <TabsTrigger value="editor" className="flex items-center">
                  {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {isEditing ? 'JSON Editor' : 'JSON Viewer'}
                </TabsTrigger>
                <TabsTrigger value="form" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Form View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="flex-1 m-6">
                <div className="h-full border rounded-lg overflow-hidden shadow-inner">
                  {isEditing ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="h-full font-mono text-sm resize-none border-none outline-none bg-gray-50"
                      placeholder="Enter JSON configuration..."
                    />
                  ) : (
                    <ScrollArea className="h-full">
                      <pre className="p-6 text-sm font-mono whitespace-pre-wrap bg-gray-50">
                        {editContent}
                      </pre>
                    </ScrollArea>
                  )}
                </div>
                
                {validationErrors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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

              <TabsContent value="form" className="flex-1 m-6">
                <ScrollArea className="h-full">
                  <Card className="shadow-inner">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                      <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Configuration Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium">File Name</Label>
                          <Input value={selectedFile.name} readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">File Type</Label>
                          <Input value={selectedFile.type} readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">File Size</Label>
                          <Input value={`${(selectedFile.size / 1024).toFixed(1)} KB`} readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Last Modified</Label>
                          <Input value={new Date(selectedFile.lastModified).toLocaleString()} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-4">JSON Structure Preview</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                            {editContent.substring(0, 500)}
                            {editContent.length > 500 && '...\n\n[Content truncated]'}
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Configuration Manager</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Select a configuration file from the sidebar to start editing, or create a new one.
              </p>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={createNewConfig}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Configuration
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Import Configurations
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
