
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export type FileType = 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'pdf' | 'unknown';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  modified: Date;
  content?: string;
  parent: string | null;
}

interface FileContextType {
  files: FileItem[];
  currentDirectory: string | null;
  selectedFiles: string[];
  isLoading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addFile: (file: Omit<FileItem, 'id'>) => void;
  deleteFiles: (ids: string[]) => void;
  renameFile: (id: string, newName: string) => void;
  editFileContent: (id: string, content: string) => void;
  moveFiles: (ids: string[], targetDirectory: string | null) => void;
  copyFiles: (ids: string[], targetDirectory: string | null) => void;
  navigateToDirectory: (directoryId: string | null) => void;
  toggleSelectFile: (id: string) => void;
  clearSelectedFiles: () => void;
  selectAllFiles: () => void;
  getFile: (id: string) => FileItem | undefined;
  getCurrentDirectoryFiles: () => FileItem[];
  searchFiles: () => FileItem[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

const DEFAULT_FILES: FileItem[] = [
  {
    id: 'root',
    name: 'Root',
    type: 'folder',
    size: 0,
    modified: new Date(),
    parent: null
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    size: 0,
    modified: new Date(),
    parent: 'root'
  },
  {
    id: 'images',
    name: 'Images',
    type: 'folder',
    size: 0,
    modified: new Date(),
    parent: 'root'
  },
  {
    id: 'readme',
    name: 'README.md',
    type: 'document',
    size: 1024,
    modified: new Date(),
    content: '# File Forge Guardian\n\nA secure file management system',
    parent: 'root'
  },
  {
    id: 'profile',
    name: 'profile.jpg',
    type: 'image',
    size: 5242880,
    modified: new Date(),
    parent: 'images'
  },
  {
    id: 'report',
    name: 'Annual Report.pdf',
    type: 'pdf',
    size: 3145728,
    modified: new Date(),
    parent: 'documents'
  }
];

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const savedFiles = localStorage.getItem('files');
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);
      return parsedFiles.map((file: any) => ({
        ...file,
        modified: new Date(file.modified)
      }));
    }
    return DEFAULT_FILES;
  });
  
  const [currentDirectory, setCurrentDirectory] = useState<string | null>('root');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);
  
  const logOperation = (operation: string, fileName: string) => {
    console.log(`[${new Date().toLocaleString()}] ${operation}: ${fileName}`);
  };
  
  const addFile = (file: Omit<FileItem, 'id'>) => {
    setIsLoading(true);
    setTimeout(() => {
      const newId = Date.now().toString();
      const newFile = { ...file, id: newId };
      setFiles(prev => [...prev, newFile]);
      logOperation('Create', file.name);
      toast({
        title: "File Created",
        description: `${file.name} has been created successfully.`
      });
      setIsLoading(false);
    }, 500);
  };
  
  const deleteFiles = (ids: string[]) => {
    setIsLoading(true);
    setTimeout(() => {
      // Get files to delete for logging purposes
      const filesToDelete = files.filter(f => ids.includes(f.id));
      
      // Delete files and their children recursively
      const getAllChildIds = (parentId: string): string[] => {
        const children = files.filter(f => f.parent === parentId);
        const childrenIds = children.map(c => c.id);
        return [
          ...childrenIds,
          ...childrenIds.flatMap(cid => getAllChildIds(cid))
        ];
      };
      
      const allIdsToDelete = [
        ...ids,
        ...ids.flatMap(id => getAllChildIds(id))
      ];
      
      setFiles(prev => prev.filter(f => !allIdsToDelete.includes(f.id)));
      setSelectedFiles([]);
      
      filesToDelete.forEach(file => {
        logOperation('Delete', file.name);
      });
      
      toast({
        title: "Files Deleted",
        description: `${filesToDelete.length} ${filesToDelete.length === 1 ? 'file' : 'files'} deleted successfully.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const renameFile = (id: string, newName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Rename', `${f.name} to ${newName}`);
          return { ...f, name: newName };
        }
        return f;
      }));
      
      toast({
        title: "File Renamed",
        description: `File renamed to ${newName} successfully.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const editFileContent = (id: string, content: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Edit', f.name);
          return { ...f, content, modified: new Date() };
        }
        return f;
      }));
      
      toast({
        title: "File Edited",
        description: "File content has been updated successfully."
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const moveFiles = (ids: string[], targetDirectory: string | null) => {
    setIsLoading(true);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (ids.includes(f.id)) {
          logOperation('Move', `${f.name} to ${targetDirectory || 'root'}`);
          return { ...f, parent: targetDirectory };
        }
        return f;
      }));
      
      toast({
        title: "Files Moved",
        description: `${ids.length} ${ids.length === 1 ? 'file' : 'files'} moved successfully.`
      });
      
      setSelectedFiles([]);
      setIsLoading(false);
    }, 500);
  };
  
  const copyFiles = (ids: string[], targetDirectory: string | null) => {
    setIsLoading(true);
    setTimeout(() => {
      const filesToCopy = files.filter(f => ids.includes(f.id));
      const newFiles = filesToCopy.map(f => ({
        ...f,
        id: `${f.id}-copy-${Date.now()}`,
        name: `${f.name} (copy)`,
        parent: targetDirectory,
        modified: new Date()
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      
      filesToCopy.forEach(file => {
        logOperation('Copy', `${file.name} to ${targetDirectory || 'root'}`);
      });
      
      toast({
        title: "Files Copied",
        description: `${ids.length} ${ids.length === 1 ? 'file' : 'files'} copied successfully.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const navigateToDirectory = (directoryId: string | null) => {
    setCurrentDirectory(directoryId);
    setSelectedFiles([]);
  };
  
  const toggleSelectFile = (id: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };
  
  const selectAllFiles = () => {
    const currentFiles = getCurrentDirectoryFiles();
    setSelectedFiles(currentFiles.map(f => f.id));
  };
  
  const getFile = (id: string) => {
    return files.find(f => f.id === id);
  };
  
  const getCurrentDirectoryFiles = () => {
    return files.filter(f => f.parent === currentDirectory);
  };
  
  const searchFiles = () => {
    if (!searchTerm) return [];
    
    return files.filter(f => 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.content && f.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return (
    <FileContext.Provider
      value={{
        files,
        currentDirectory,
        selectedFiles,
        isLoading,
        searchTerm,
        setSearchTerm,
        addFile,
        deleteFiles,
        renameFile,
        editFileContent,
        moveFiles,
        copyFiles,
        navigateToDirectory,
        toggleSelectFile,
        clearSelectedFiles,
        selectAllFiles,
        getFile,
        getCurrentDirectoryFiles,
        searchFiles
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
