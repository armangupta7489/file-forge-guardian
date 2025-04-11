
import { useState } from 'react';
import { FileItem, UserRole } from '@/types/file-types';
import { toast } from '@/components/ui/use-toast';

export function useFileOperations(
  files: FileItem[],
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  roles: UserRole[]
) {
  const [isLoading, setIsLoading] = useState(false);
  
  const logOperation = (operation: string, fileName: string) => {
    console.log(`[${new Date().toLocaleString()}] ${operation}: ${fileName}`);
  };
  
  const checkFileAccess = (fileId: string, action: 'read' | 'write' | 'delete' | 'encrypt') => {
    const userRole = roles.find(r => r.id === 'admin');
    return userRole?.permissions[action] || false;
  };
  
  const addFile = (file: Omit<FileItem, 'id'>) => {
    if (!checkFileAccess(file.parent || 'root', 'write')) {
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
      const newFile = { ...file, id: newId } as FileItem;
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

  return {
    isLoading,
    checkFileAccess,
    addFile,
    deleteFiles,
    renameFile,
    editFileContent,
    clearFileContent,
    logOperation
  };
}
