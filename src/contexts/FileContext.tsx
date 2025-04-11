
import React, { createContext, useState, useContext, useEffect } from 'react';
import { FileItem, UserRole, FileContextType } from '@/types/file-types';
import { DEFAULT_FILES, DEFAULT_ROLES } from '@/constants/file-constants';
import { useFileOperations } from '@/hooks/useFileOperations';
import { useFileNavigation } from '@/hooks/useFileNavigation';
import { useAdvancedFileOperations } from '@/hooks/useAdvancedFileOperations';
import { useFileContentOperations } from '@/hooks/useFileContentOperations';

// Remove the old types as they're now in their own file
export type { FileType } from '@/types/file-types';

const FileContext = createContext<FileContextType | undefined>(undefined);

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
  
  const [roles] = useState<UserRole[]>(DEFAULT_ROLES);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our custom hooks
  const fileOps = useFileOperations(files, setFiles, roles);
  
  const {
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
  } = useFileNavigation(files);
  
  const advancedFileOps = useAdvancedFileOperations({
    files,
    setFiles,
    setIsLoading,
    checkFileAccess: fileOps.checkFileAccess,
    getFile,
    logOperation: fileOps.logOperation
  });
  
  const contentOps = useFileContentOperations({
    files,
    setFiles,
    setIsLoading,
    checkFileAccess: fileOps.checkFileAccess,
    getFile,
    logOperation: fileOps.logOperation
  });
  
  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);
  
  return (
    <FileContext.Provider
      value={{
        files,
        currentDirectory,
        selectedFiles,
        isLoading: fileOps.isLoading || isLoading,
        searchTerm,
        roles,
        setSearchTerm,
        addFile: fileOps.addFile,
        deleteFiles: fileOps.deleteFiles,
        renameFile: fileOps.renameFile,
        editFileContent: fileOps.editFileContent,
        moveFiles: advancedFileOps.moveFiles,
        copyFiles: advancedFileOps.copyFiles,
        navigateToDirectory,
        toggleSelectFile,
        clearSelectedFiles,
        selectAllFiles,
        getFile,
        getCurrentDirectoryFiles,
        searchFiles,
        encryptFile: advancedFileOps.encryptFile,
        decryptFile: advancedFileOps.decryptFile,
        changeFilePermissions: advancedFileOps.changeFilePermissions,
        backupFile: advancedFileOps.backupFile,
        compressFile: contentOps.compressFile,
        decompressFile: contentOps.decompressFile,
        clearFileContent: fileOps.clearFileContent,
        checkFileAccess: fileOps.checkFileAccess,
        sortFileContent: contentOps.sortFileContent,
        searchFileContent: contentOps.searchFileContent
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
