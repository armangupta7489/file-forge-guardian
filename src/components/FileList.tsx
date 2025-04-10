
import { useState } from 'react';
import { useFiles, FileItem } from '@/contexts/FileContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon } from './FileIcon';
import { formatFileSize, formatModifiedDate } from '@/lib/file-utils';
import { Check } from 'lucide-react';

export function FileList() {
  const { 
    getCurrentDirectoryFiles, 
    toggleSelectFile, 
    selectedFiles, 
    navigateToDirectory,
    isLoading,
    searchTerm,
    searchFiles
  } = useFiles();
  
  // We'll show search results if there's a search term, otherwise show current directory
  const filesToShow = searchTerm ? searchFiles() : getCurrentDirectoryFiles();

  const handleFileClick = (file: FileItem, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Selection behavior
      toggleSelectFile(file.id);
    } else if (file.type === 'folder') {
      // Navigation behavior for folders
      navigateToDirectory(file.id);
    } else {
      // Regular click behavior for files - select only this file
      toggleSelectFile(file.id);
    }
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToDirectory(file.id);
    }
    // For files, we could implement preview functionality here
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse-gentle flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (filesToShow.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          {searchTerm ? 'No search results found' : 'This folder is empty'}
        </p>
        {searchTerm && (
          <Button 
            variant="link" 
            onClick={() => navigateToDirectory('root')}
            className="mt-2"
          >
            Return to root folder
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="file-grid p-4">
      {filesToShow.map((file) => (
        <Card
          key={file.id}
          className={`file-card p-3 cursor-pointer transition-all hover:shadow-md ${
            selectedFiles.includes(file.id) ? 'ring-2 ring-purple-500 bg-purple-50' : ''
          }`}
          onClick={(e) => handleFileClick(file, e)}
          onDoubleClick={() => handleFileDoubleClick(file)}
        >
          <div className="relative">
            <div className="file-icon-container mb-2">
              <FileIcon type={file.type} size={36} />
            </div>
            {selectedFiles.includes(file.id) && (
              <div className="absolute top-0 right-0 bg-purple-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-medium text-sm truncate" title={file.name}>
              {file.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {file.type !== 'folder' ? formatFileSize(file.size) : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatModifiedDate(file.modified)}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
