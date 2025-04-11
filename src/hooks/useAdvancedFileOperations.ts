
import { FileItem } from '@/types/file-types';
import { toast } from '@/components/ui/use-toast';
import { encrypt, decrypt } from '@/lib/encryption';

interface AdvancedFileOpsProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  checkFileAccess: (fileId: string, action: 'read' | 'write' | 'delete' | 'encrypt') => boolean;
  getFile: (id: string) => FileItem | undefined;
  logOperation: (operation: string, fileName: string) => void;
}

export function useAdvancedFileOperations({
  files,
  setFiles,
  setIsLoading,
  checkFileAccess,
  getFile,
  logOperation
}: AdvancedFileOpsProps) {

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

  return {
    moveFiles,
    copyFiles,
    encryptFile,
    decryptFile,
    changeFilePermissions,
    backupFile
  };
}
