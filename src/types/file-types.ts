
import { FileType } from '@/contexts/FileContext';

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

export interface UserRole {
  id: string;
  name: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    encrypt: boolean;
  };
}

export interface FileContextType {
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
