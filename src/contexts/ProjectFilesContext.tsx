
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fileUploadService, ProjectFiles, UploadedFile } from '@/services/fileUploadService';

interface ProjectFilesContextType {
  projectFiles: ProjectFiles;
  uploadFiles: (files: FileList) => Promise<UploadedFile[]>;
  createNewTemplate: (name: string, content?: string) => UploadedFile;
  updateFile: (id: string, updates: Partial<UploadedFile>) => boolean;
  deleteFile: (id: string) => boolean;
  getFileById: (id: string) => UploadedFile | undefined;
  isLoading: boolean;
}

const ProjectFilesContext = createContext<ProjectFilesContextType | undefined>(undefined);

export const ProjectFilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>({
    configs: [],
    templates: [],
    sources: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = fileUploadService.subscribe(setProjectFiles);
    return unsubscribe;
  }, []);

  const uploadFiles = async (files: FileList): Promise<UploadedFile[]> => {
    setIsLoading(true);
    try {
      const uploaded = await fileUploadService.uploadFiles(files);
      return uploaded;
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTemplate = (name: string, content?: string): UploadedFile => {
    return fileUploadService.createNewTemplate(name, content);
  };

  const updateFile = (id: string, updates: Partial<UploadedFile>): boolean => {
    return fileUploadService.updateFile(id, updates);
  };

  const deleteFile = (id: string): boolean => {
    return fileUploadService.deleteFile(id);
  };

  const getFileById = (id: string): UploadedFile | undefined => {
    return fileUploadService.getFileById(id);
  };

  return (
    <ProjectFilesContext.Provider value={{
      projectFiles,
      uploadFiles,
      createNewTemplate,
      updateFile,
      deleteFile,
      getFileById,
      isLoading
    }}>
      {children}
    </ProjectFilesContext.Provider>
  );
};

export const useProjectFiles = () => {
  const context = useContext(ProjectFilesContext);
  if (context === undefined) {
    throw new Error('useProjectFiles must be used within a ProjectFilesProvider');
  }
  return context;
};
