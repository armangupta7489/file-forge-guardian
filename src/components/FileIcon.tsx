
import {
  File,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  FilePdf,
  Folder,
  FileText
} from 'lucide-react';
import { FileType } from '@/contexts/FileContext';
import { cn } from '@/lib/utils';

interface FileIconProps {
  type: FileType;
  size?: number;
  className?: string;
}

export function FileIcon({ type, size = 40, className }: FileIconProps) {
  const getIcon = () => {
    switch (type) {
      case 'folder':
        return <Folder size={size} className="text-yellow-500" />;
      case 'image':
        return <FileImage size={size} className="text-file-image" />;
      case 'video':
        return <FileVideo size={size} className="text-file-video" />;
      case 'audio':
        return <FileAudio size={size} className="text-file-audio" />;
      case 'archive':
        return <FileArchive size={size} className="text-file-archive" />;
      case 'code':
        return <FileCode size={size} className="text-file-code" />;
      case 'pdf':
        return <FilePdf size={size} className="text-file-pdf" />;
      case 'document':
        return <FileText size={size} className="text-file-document" />;
      default:
        return <File size={size} className="text-gray-500" />;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
}
