
import { useFiles } from '@/contexts/FileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Search, X, RefreshCcw } from 'lucide-react';
import { getBreadcrumbPath } from '@/lib/file-utils';
import { useEffect, useState } from 'react';

export function FileHeader() {
  const { 
    navigateToDirectory,
    currentDirectory,
    files, 
    searchTerm, 
    setSearchTerm,
    clearSelectedFiles
  } = useFiles();
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  
  const breadcrumbs = getBreadcrumbPath(currentDirectory, files);
  
  const handleBack = () => {
    if (currentDirectory && currentDirectory !== 'root') {
      const currentFolder = files.find(f => f.id === currentDirectory);
      if (currentFolder && currentFolder.parent) {
        navigateToDirectory(currentFolder.parent);
      }
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };
  
  const handleClearSearch = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
  };
  
  return (
    <div className="border-b p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleBack}
            disabled={!currentDirectory || currentDirectory === 'root'}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center">
                {index > 0 && (
                  <ChevronLeft className="h-3 w-3 rotate-180 mx-1 text-gray-400" />
                )}
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateToDirectory(crumb.id)}
                  className={index === breadcrumbs.length - 1 ? "font-bold" : ""}
                >
                  {crumb.name}
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              clearSelectedFiles();
              navigateToDirectory(currentDirectory);
            }}
            title="Refresh"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSearch} className="w-full md:w-auto flex">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search files..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-9 w-full md:w-[300px]"
            />
            {localSearchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit" className="ml-2">Search</Button>
        </form>
      </div>
    </div>
  );
}
