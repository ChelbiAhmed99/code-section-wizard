
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Save, 
  Trash2, 
  FolderOpen,
  RefreshCw,
  Upload,
  Download,
  Copy
} from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { FileUpload } from '../shared/FileUpload';
import { CreateTemplateDialog } from '../shared/CreateTemplateDialog';
import { useProjectFiles } from '@/contexts/ProjectFilesContext';
import { UploadedFile } from '@/services/fileUploadService';

export const TemplateManager: React.FC = () => {
  const { projectFiles, createNewTemplate, deleteFile, updateFile } = useProjectFiles();
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('browser');
  const [showUpload, setShowUpload] = useState(false);

  // Use uploaded templates from the project files context
  const templates = projectFiles.templates;

  const filteredTemplates = templates.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (file: UploadedFile) => {
    setSelectedFile(file);
    setActiveTab('browser');
  };

  const handleSave = (content: string) => {
    if (selectedFile) {
      updateFile(selectedFile.id, { content });
      console.log('Template saved:', selectedFile.name);
    }
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteFile(fileId);
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
      }
    }
  };

  const handleTemplateCreated = (templateId: string) => {
    const newTemplate = projectFiles.templates.find(t => t.id === templateId);
    if (newTemplate) {
      setSelectedFile(newTemplate);
    }
  };

  const handleExport = (file: UploadedFile) => {
    const dataBlob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDuplicate = (file: UploadedFile) => {
    const newName = `${file.name.replace('.j2', '')}_copy.j2`;
    createNewTemplate(newName, file.content);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar - Template Browser */}
      <div className="w-1/3 border-r border-gray-200 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Template Manager</h2>
              <p className="text-sm text-gray-600">Manage Jinja2 templates</p>
            </div>
            <div className="flex space-x-2">
              <CreateTemplateDialog 
                trigger={
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                }
                onTemplateCreated={handleTemplateCreated}
              />
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
              placeholder="Search templates..."
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
              accept=".j2,.jinja2,.template"
              className="min-h-0"
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2 p-1 m-4">
            <TabsTrigger value="browser">
              <FolderOpen className="w-4 h-4 mr-2" />
              Templates ({templates.length})
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Search ({filteredTemplates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browser" className="m-0 h-full">
            <ScrollArea className="h-[calc(100%-120px)] p-4">
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <FileCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first template or import existing ones
                  </p>
                  <div className="space-y-2">
                    <CreateTemplateDialog 
                      trigger={
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Template
                        </Button>
                      }
                      onTemplateCreated={handleTemplateCreated}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowUpload(true)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Templates
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((file) => (
                    <Card
                      key={file.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedFile?.id === file.id 
                          ? 'bg-purple-50 border-purple-300 shadow-md' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <FileCode className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {file.path}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(file.lastModified).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExport(file);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(file);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(file.id);
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="secondary" className="text-xs">
                            {file.type}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="search" className="m-0 h-full">
            <ScrollArea className="h-[calc(100%-120px)] p-4">
              {searchTerm ? (
                filteredTemplates.length > 0 ? (
                  <div className="space-y-2">
                    {filteredTemplates.map((file) => (
                      <Card
                        key={file.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedFile?.id === file.id 
                            ? 'bg-purple-50 border-purple-300 shadow-md' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleFileSelect(file)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <FileCode className="w-4 h-4 text-purple-500" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {file.path}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {file.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No templates match your search</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Enter a search term to find templates</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center space-x-4">
                <FileCode className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h3>
                  <p className="text-sm text-gray-500">{selectedFile.path}</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  Jinja2 Template
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Last modified: {new Date(selectedFile.lastModified).toLocaleString()}
                </div>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="editor" className="flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="editor" className="flex-1 m-0">
              <TemplateEditor 
                file={selectedFile}
                onSave={handleSave}
              />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0">
              <TemplatePreview 
                file={selectedFile}
                templateContent={selectedFile.content}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileCode className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Template Editor</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Select a template from the sidebar to start editing, or create a new one to get started.
              </p>
              <div className="space-y-3">
                <CreateTemplateDialog 
                  trigger={
                    <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Plus className="w-5 h-5 mr-2" />
                      Create New Template
                    </Button>
                  }
                  onTemplateCreated={handleTemplateCreated}
                />
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Import Templates
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
