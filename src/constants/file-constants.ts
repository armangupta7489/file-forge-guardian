
import { FileItem, UserRole } from "@/types/file-types";

export const DEFAULT_FILES: FileItem[] = [
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

export const DEFAULT_ROLES: UserRole[] = [
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
