
import { useState } from 'react';
import { FileItem } from '@/types/file-types';

export function useFileNavigation(files: FileItem[]) {
  const [currentDirectory, setCurrentDirectory] = useState<string | null>('root');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  return {
    currentDirectory,
    selectedFiles,
    searchTerm,
    setSearchTerm,
    navigateToDirectory,
    toggleSelectFile,
    clearSelectedFiles,
    selectAllFiles,
    getFile,
    getCurrentDirectoryFiles,
    searchFiles
  };
}
