
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertTriangle, 
  X,
  FolderOpen,
  FileText
} from 'lucide-react';
import { useProjectFiles } from '@/contexts/ProjectFilesContext';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete?: () => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  accept = ".json,.j2,.jinja2,.c,.h,.cpp,.md,.txt",
  multiple = true,
  className
}) => {
  const { uploadFiles, isLoading } = useProjectFiles();
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadedCount, setUploadedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    try {
      setUploadStatus('idle');
      const uploaded = await uploadFiles(files);
      setUploadedCount(uploaded.length);
      setUploadStatus('success');
      onUploadComplete?.();
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadedCount(0);
      }, 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragActive 
            ? "border-blue-500 bg-blue-50" 
            : "border-gray-300 hover:border-gray-400",
          uploadStatus === 'success' && "border-green-500 bg-green-50",
          uploadStatus === 'error' && "border-red-500 bg-red-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-lg font-medium text-gray-700">Uploading files...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <p className="text-lg font-medium text-green-700">Upload Successful!</p>
              <p className="text-sm text-green-600">{uploadedCount} file(s) uploaded</p>
            </div>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium text-red-700">Upload Failed</p>
            <Button onClick={() => setUploadStatus('idle')} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center transition-colors",
              dragActive ? "bg-blue-100" : "bg-gray-100"
            )}>
              <Upload className={cn(
                "h-8 w-8",
                dragActive ? "text-blue-500" : "text-gray-500"
              )} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">
                {dragActive ? "Drop files here" : "Upload Project Files"}
              </p>
              <p className="text-sm text-gray-500">
                Drag & drop files here, or click to browse
              </p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  JSON Configs
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <File className="w-3 h-3 mr-1" />
                  Jinja2 Templates
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  Source Files
                </Badge>
              </div>
            </div>

            <Button onClick={openFileDialog} className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Supported formats: JSON, Jinja2 (.j2), C/C++ source files, Markdown
        </p>
      </div>
    </div>
  );
};
