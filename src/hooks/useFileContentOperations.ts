
import { FileItem, FileType } from '@/types/file-types';
import { toast } from '@/components/ui/use-toast';

interface FileContentOpsProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  checkFileAccess: (fileId: string, action: 'read' | 'write' | 'delete' | 'encrypt') => boolean;
  getFile: (id: string) => FileItem | undefined;
  logOperation: (operation: string, fileName: string) => void;
}

export function useFileContentOperations({
  files,
  setFiles,
  setIsLoading,
  checkFileAccess,
  getFile,
  logOperation
}: FileContentOpsProps) {
  
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

  return {
    compressFile,
    decompressFile,
    sortFileContent,
    searchFileContent
  };
}
