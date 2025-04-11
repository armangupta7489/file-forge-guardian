import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { encrypt, decrypt } from '@/lib/encryption';

export type FileType = 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'pdf' | 'unknown';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  modified: Date;
  content?: string;
  parent: string | null;
  isEncrypted?: boolean;
  permissions?: string;
  owner?: string;
  lastAccessedBy?: string;
  version?: number;
}

interface UserRole {
  id: string;
  name: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    encrypt: boolean;
  };
}

interface FileContextType {
  files: FileItem[];
  currentDirectory: string | null;
  selectedFiles: string[];
  isLoading: boolean;
  searchTerm: string;
  roles: UserRole[];
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
  encryptFile: (id: string, password: string) => void;
  decryptFile: (id: string, password: string) => void;
  changeFilePermissions: (id: string, permissions: string) => void;
  backupFile: (id: string) => void;
  compressFile: (id: string) => void;
  decompressFile: (id: string) => void;
  clearFileContent: (id: string) => void;
  checkFileAccess: (fileId: string, action: 'read' | 'write' | 'delete' | 'encrypt') => boolean;
  sortFileContent: (id: string) => void;
  searchFileContent: (id: string, searchTerm: string) => string[];
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

const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    permissions: {
      read: true,
      write: true,
      delete: true,
      encrypt: true
    }
  },
  {
    id: 'editor',
    name: 'Editor',
    permissions: {
      read: true,
      write: true,
      delete: false,
      encrypt: false
    }
  },
  {
    id: 'viewer',
    name: 'Viewer',
    permissions: {
      read: true,
      write: false,
      delete: false,
      encrypt: false
    }
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
  
  const [roles] = useState<UserRole[]>(DEFAULT_ROLES);
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
  
  const checkFileAccess = (fileId: string, action: 'read' | 'write' | 'delete' | 'encrypt') => {
    const userRole = roles.find(r => r.id === 'admin');
    return userRole?.permissions[action] || false;
  };
  
  const addFile = (file: Omit<FileItem, 'id'>) => {
    if (!checkFileAccess(currentDirectory || 'root', 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create files in this directory.",
        variant: "destructive"
      });
      return;
    }
    
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
    for (const id of ids) {
      if (!checkFileAccess(id, 'delete')) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to delete one or more selected files.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const filesToDelete = files.filter(f => ids.includes(f.id));
      
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
    const file = files.find(f => f.id === id);
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to rename this file.",
        variant: "destructive"
      });
      return;
    }
    
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
    const file = files.find(f => f.id === id);
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit this file.",
        variant: "destructive"
      });
      return;
    }
    
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
    for (const id of ids) {
      if (!checkFileAccess(id, 'write')) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to move one or more selected files.",
          variant: "destructive"
        });
        return;
      }
    }
    
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
    for (const id of ids) {
      if (!checkFileAccess(id, 'read')) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to copy one or more selected files.",
          variant: "destructive"
        });
        return;
      }
    }
    
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
  
  const encryptFile = (id: string, password: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'encrypt')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to encrypt this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.content) {
      toast({
        title: "Encryption Failed",
        description: "Cannot encrypt a file without content.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const encryptedContent = encrypt(file.content, password);
      
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Encrypt', f.name);
          return { 
            ...f, 
            content: encryptedContent, 
            isEncrypted: true,
            modified: new Date() 
          };
        }
        return f;
      }));
      
      toast({
        title: "File Encrypted",
        description: `${file.name} has been encrypted successfully.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const decryptFile = (id: string, password: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'encrypt')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to decrypt this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.content || !file.isEncrypted) {
      toast({
        title: "Decryption Failed",
        description: "This file is not encrypted.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      try {
        const decryptedContent = decrypt(file.content, password);
        
        setFiles(prev => prev.map(f => {
          if (f.id === id) {
            logOperation('Decrypt', f.name);
            return { 
              ...f, 
              content: decryptedContent, 
              isEncrypted: false,
              modified: new Date() 
            };
          }
          return f;
        }));
        
        toast({
          title: "File Decrypted",
          description: `${file.name} has been decrypted successfully.`
        });
      } catch (error) {
        toast({
          title: "Decryption Failed",
          description: "Incorrect password or corrupted file.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 500);
  };
  
  const changeFilePermissions = (id: string, permissions: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file) {
      toast({
        title: "File Not Found",
        description: "The selected file could not be found.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Change Permissions', `${f.name} to ${permissions}`);
          return { ...f, permissions, modified: new Date() };
        }
        return f;
      }));
      
      toast({
        title: "Permissions Changed",
        description: `${file.name} permissions updated to ${permissions}.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const backupFile = (id: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'read')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to backup this file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const backupFile = {
        ...file,
        id: `${file.id}-backup-${Date.now()}`,
        name: `${file.name}.bak`,
        modified: new Date(),
        parent: file.parent
      };
      
      setFiles(prev => [...prev, backupFile]);
      
      logOperation('Backup', file.name);
      
      toast({
        title: "File Backed Up",
        description: `${file.name} has been backed up as ${backupFile.name}.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const compressFile = (id: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to compress this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.content || file.type === 'folder') {
      toast({
        title: "Compression Failed",
        description: "Cannot compress this type of file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const compressedFile: FileItem = {
        ...file,
        id: `${file.id}-compressed-${Date.now()}`,
        name: `${file.name}.gz`,
        type: 'archive' as FileType,
        size: Math.ceil(file.size * 0.7),
        modified: new Date(),
        parent: file.parent,
        content: `[Compressed content of ${file.name}]`
      };
      
      setFiles(prev => [...prev, compressedFile]);
      
      logOperation('Compress', file.name);
      
      toast({
        title: "File Compressed",
        description: `${file.name} has been compressed as ${compressedFile.name}.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const decompressFile = (id: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to decompress this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (file.type !== 'archive') {
      toast({
        title: "Decompression Failed",
        description: "This file is not an archive.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const originalName = file.name.endsWith('.gz') 
        ? file.name.slice(0, -3) 
        : `decompressed_${file.name}`;
      
      const originalFile = getFile(id.replace('-compressed-', ''));
      const fileType: FileType = originalFile?.type || 'document';
      
      const decompressedFile: FileItem = {
        ...file,
        id: `${file.id}-decompressed-${Date.now()}`,
        name: originalName,
        type: fileType,
        size: Math.ceil(file.size * 1.3),
        modified: new Date(),
        parent: file.parent,
        content: `[Decompressed content of ${file.name}]`
      };
      
      setFiles(prev => [...prev, decompressedFile]);
      
      logOperation('Decompress', file.name);
      
      toast({
        title: "File Decompressed",
        description: `${file.name} has been decompressed as ${decompressedFile.name}.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const clearFileContent = (id: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to clear this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (file.type === 'folder') {
      toast({
        title: "Operation Failed",
        description: "Cannot clear the content of a folder.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Clear', f.name);
          return { ...f, content: '', modified: new Date() };
        }
        return f;
      }));
      
      toast({
        title: "File Cleared",
        description: `${file.name} content has been cleared.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const sortFileContent = (id: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'write')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to sort this file.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.content || file.type === 'folder') {
      toast({
        title: "Sort Failed",
        description: "Cannot sort this type of file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      const lines = file.content.split('\n');
      lines.sort();
      const sortedContent = lines.join('\n');
      
      setFiles(prev => prev.map(f => {
        if (f.id === id) {
          logOperation('Sort', f.name);
          return { ...f, content: sortedContent, modified: new Date() };
        }
        return f;
      }));
      
      toast({
        title: "File Sorted",
        description: `${file.name} content has been sorted alphabetically.`
      });
      
      setIsLoading(false);
    }, 500);
  };
  
  const searchFileContent = (id: string, searchTerm: string) => {
    const file = files.find(f => f.id === id);
    
    if (!file || !checkFileAccess(id, 'read')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to search this file.",
        variant: "destructive"
      });
      return [];
    }
    
    if (!file.content) {
      return [];
    }
    
    const results: string[] = [];
    const lines = file.content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
        results.push(`Line ${index + 1}: ${line}`);
      }
    });
    
    return results;
  };

  return (
    <FileContext.Provider
      value={{
        files,
        currentDirectory,
        selectedFiles,
        isLoading,
        searchTerm,
        roles,
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
        searchFiles,
        encryptFile,
        decryptFile,
        changeFilePermissions,
        backupFile,
        compressFile,
        decompressFile,
        clearFileContent,
        checkFileAccess,
        sortFileContent,
        searchFileContent
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
