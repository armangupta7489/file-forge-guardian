
import { FileType } from '@/contexts/FileContext';
import { formatDistanceToNow } from 'date-fns';

export function getFileTypeFromName(filename: string): FileType {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'unknown';
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return 'image';
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
      return 'video';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'audio';
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz':
      return 'archive';
    case 'js':
    case 'ts':
    case 'html':
    case 'css':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'java':
    case 'c':
    case 'cpp':
      return 'code';
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
      return 'document';
    default:
      return 'unknown';
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatModifiedDate(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getBreadcrumbPath(fileId: string | null, files: any[]): { id: string; name: string }[] {
  if (!fileId || fileId === 'root') {
    return [{ id: 'root', name: 'Root' }];
  }
  
  const file = files.find(f => f.id === fileId);
  if (!file) return [];
  
  const parentPath = getBreadcrumbPath(file.parent, files);
  return [...parentPath, { id: file.id, name: file.name }];
}
