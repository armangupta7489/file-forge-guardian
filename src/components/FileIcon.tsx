
import {
  File,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  FileText,
  Folder,
  Lock,
  Shield,
  FileJson
} from 'lucide-react';
import { FileType } from '@/types/file-types';
import { cn } from '@/lib/utils';

interface FileIconProps {
  type: FileType;
  size?: number;
  className?: string;
  isEncrypted?: boolean;
}

export function FileIcon({ type, size = 40, className, isEncrypted = false }: FileIconProps) {
  const getIcon = () => {
    let icon;
    
    switch (type) {
      case 'folder':
        icon = <Folder size={size} className="text-yellow-500" />;
        break;
      case 'image':
        icon = <FileImage size={size} className="text-file-image" />;
        break;
      case 'video':
        icon = <FileVideo size={size} className="text-file-video" />;
        break;
      case 'audio':
        icon = <FileAudio size={size} className="text-file-audio" />;
        break;
      case 'archive':
        icon = <FileArchive size={size} className="text-file-archive" />;
        break;
      case 'code':
        icon = <FileCode size={size} className="text-file-code" />;
        break;
      case 'pdf':
        icon = <FileText size={size} className="text-red-500" />; // Using FileText with red color for PDFs
        break;
      case 'document':
        icon = <FileText size={size} className="text-file-document" />;
        break;
      default:
        icon = <File size={size} className="text-gray-500" />;
    }
    
    return (
      <div className="relative">
        {icon}
        {isEncrypted && (
          <div className="absolute -top-1 -right-1 bg-purple-100 rounded-full p-0.5">
            <Lock size={size/3} className="text-purple-700" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
}
