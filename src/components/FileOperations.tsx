
import { useState } from 'react';
import { useFiles } from '@/contexts/FileContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Trash2,
  Copy,
  FileText,
  Edit,
  MoreHorizontal,
  FilePlus,
  FolderPlus,
  Lock,
  Unlock,
  Archive,
  FileArchive,
  FileCog,
  FileMinus,
  FileSearch,
  SortAsc,
  FileX,
  FileCheck,
  History
} from 'lucide-react';
import { getFileTypeFromName } from '@/lib/file-utils';

export function FileOperations() {
  const {
    selectedFiles,
    deleteFiles,
    renameFile,
    editFileContent,
    moveFiles,
    copyFiles,
    addFile,
    getFile,
    currentDirectory,
    encryptFile,
    decryptFile,
    changeFilePermissions,
    backupFile,
    compressFile,
    decompressFile,
    clearFileContent,
    sortFileContent,
    searchFileContent
  } = useFiles();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEncryptDialogOpen, setIsEncryptDialogOpen] = useState(false);
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isSearchContentDialogOpen, setIsSearchContentDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newFileName, setNewFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState('644');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleDelete = () => {
    if (selectedFiles.length > 0) {
      const confirmation = window.confirm(
        `Are you sure you want to delete ${selectedFiles.length} ${selectedFiles.length === 1 ? 'item' : 'items'}?`
      );
      if (confirmation) {
        deleteFiles(selectedFiles);
      }
    }
  };

  const handleRename = () => {
    if (selectedFiles.length === 1) {
      const file = getFile(selectedFiles[0]);
      if (file) {
        setNewFileName(file.name);
        setIsRenameDialogOpen(true);
      }
    }
  };

  const handleEdit = () => {
    if (selectedFiles.length === 1) {
      const file = getFile(selectedFiles[0]);
      if (file && file.type !== 'folder') {
        setFileContent(file.content || '');
        setIsEditDialogOpen(true);
      }
    }
  };

  const handleRenameSubmit = () => {
    if (selectedFiles.length === 1 && newFileName) {
      renameFile(selectedFiles[0], newFileName);
      setIsRenameDialogOpen(false);
    }
  };

  const handleEditSubmit = () => {
    if (selectedFiles.length === 1) {
      editFileContent(selectedFiles[0], fileContent);
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateSubmit = () => {
    if (newFileName) {
      addFile({
        name: newFileName,
        type: createType === 'folder' ? 'folder' : getFileTypeFromName(newFileName),
        size: 0,
        modified: new Date(),
        content: createType === 'file' ? '' : undefined,
        parent: currentDirectory,
      });
      setIsCreateDialogOpen(false);
      setNewFileName('');
    }
  };

  const handleOpenCreateDialog = (type: 'file' | 'folder') => {
    setCreateType(type);
    setNewFileName('');
    setIsCreateDialogOpen(true);
  };

  const handleEncrypt = () => {
    if (selectedFiles.length === 1) {
      setPassword('');
      setIsEncryptDialogOpen(true);
    }
  };

  const handleEncryptSubmit = () => {
    if (selectedFiles.length === 1 && password) {
      encryptFile(selectedFiles[0], password);
      setIsEncryptDialogOpen(false);
      setPassword('');
    }
  };

  const handleDecrypt = () => {
    if (selectedFiles.length === 1) {
      setPassword('');
      setIsDecryptDialogOpen(true);
    }
  };

  const handleDecryptSubmit = () => {
    if (selectedFiles.length === 1 && password) {
      decryptFile(selectedFiles[0], password);
      setIsDecryptDialogOpen(false);
      setPassword('');
    }
  };

  const handleChangePermissions = () => {
    if (selectedFiles.length === 1) {
      const file = getFile(selectedFiles[0]);
      if (file) {
        setPermissions(file.permissions || '644');
        setIsPermissionsDialogOpen(true);
      }
    }
  };

  const handlePermissionsSubmit = () => {
    if (selectedFiles.length === 1) {
      changeFilePermissions(selectedFiles[0], permissions);
      setIsPermissionsDialogOpen(false);
    }
  };

  const handleBackup = () => {
    if (selectedFiles.length === 1) {
      backupFile(selectedFiles[0]);
    }
  };

  const handleCompress = () => {
    if (selectedFiles.length === 1) {
      compressFile(selectedFiles[0]);
    }
  };

  const handleDecompress = () => {
    if (selectedFiles.length === 1) {
      decompressFile(selectedFiles[0]);
    }
  };

  const handleClearContent = () => {
    if (selectedFiles.length === 1) {
      clearFileContent(selectedFiles[0]);
    }
  };

  const handleSortContent = () => {
    if (selectedFiles.length === 1) {
      sortFileContent(selectedFiles[0]);
    }
  };

  const handleSearchContent = () => {
    if (selectedFiles.length === 1) {
      setSearchTerm('');
      setSearchResults([]);
      setIsSearchContentDialogOpen(true);
    }
  };

  const handleSearchContentSubmit = () => {
    if (selectedFiles.length === 1 && searchTerm) {
      const results = searchFileContent(selectedFiles[0], searchTerm);
      setSearchResults(results);
    }
  };

  const hasSelection = selectedFiles.length > 0;
  const hasSingleSelection = selectedFiles.length === 1;
  const selectedFile = hasSingleSelection ? getFile(selectedFiles[0]) : undefined;
  const canEdit = hasSingleSelection && selectedFile && selectedFile.type !== 'folder';
  const isFileEncrypted = hasSingleSelection && selectedFile?.isEncrypted;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => handleOpenCreateDialog('file')}>
          <FilePlus className="h-4 w-4 mr-2" />
          New File
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleOpenCreateDialog('folder')}>
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>

        {hasSelection && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>

            {hasSingleSelection && (
              <>
                <Button variant="outline" size="sm" onClick={handleRename}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </Button>
                
                {canEdit && (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <FileText className="h-4 w-4 mr-2" />
                      Edit Content
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4 mr-2" />
                          File Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Security</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleEncrypt}>
                          <Lock className="h-4 w-4 mr-2" />
                          Encrypt File
                        </DropdownMenuItem>
                        {isFileEncrypted && (
                          <DropdownMenuItem onClick={handleDecrypt}>
                            <Unlock className="h-4 w-4 mr-2" />
                            Decrypt File
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleChangePermissions}>
                          <FileCog className="h-4 w-4 mr-2" />
                          Change Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuLabel>File Operations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleBackup}>
                          <History className="h-4 w-4 mr-2" />
                          Create Backup
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCompress}>
                          <Archive className="h-4 w-4 mr-2" />
                          Compress File
                        </DropdownMenuItem>
                        {selectedFile?.type === 'archive' && (
                          <DropdownMenuItem onClick={handleDecompress}>
                            <FileArchive className="h-4 w-4 mr-2" />
                            Decompress File
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleClearContent}>
                          <FileX className="h-4 w-4 mr-2" />
                          Clear Content
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSortContent}>
                          <SortAsc className="h-4 w-4 mr-2" />
                          Sort Content
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSearchContent}>
                          <FileSearch className="h-4 w-4 mr-2" />
                          Search in File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (hasSingleSelection && currentDirectory !== null) {
                      copyFiles([selectedFiles[0]], currentDirectory);
                    }
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New {createType === 'folder' ? 'Folder' : 'File'}</DialogTitle>
            <DialogDescription>
              Enter a name for your new {createType === 'folder' ? 'folder' : 'file'}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder={`Enter ${createType} name`}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
            <DialogDescription>Enter a new name for your file.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter new name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit File Content</DialogTitle>
            <DialogDescription>
              {selectedFile ? `Editing: ${selectedFile.name}` : 'Edit file content'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter file content"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              className="w-full min-h-[300px] font-mono"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Encrypt Dialog */}
      <Dialog open={isEncryptDialogOpen} onOpenChange={setIsEncryptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encrypt File</DialogTitle>
            <DialogDescription>
              Enter a password to encrypt {selectedFile?.name}. Remember this password as you'll need it to decrypt the file later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter encryption password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEncryptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEncryptSubmit}>Encrypt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decrypt Dialog */}
      <Dialog open={isDecryptDialogOpen} onOpenChange={setIsDecryptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decrypt File</DialogTitle>
            <DialogDescription>
              Enter the password to decrypt {selectedFile?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Enter decryption password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDecryptDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDecryptSubmit}>Decrypt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change File Permissions</DialogTitle>
            <DialogDescription>
              Enter the new permissions for {selectedFile?.name} (e.g., 644, 755).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter permissions (e.g., 644)"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePermissionsSubmit}>Change Permissions</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Content Dialog */}
      <Dialog open={isSearchContentDialogOpen} onOpenChange={setIsSearchContentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search in File</DialogTitle>
            <DialogDescription>
              Search for text in {selectedFile?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter search term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
                autoFocus
              />
              <Button onClick={handleSearchContentSubmit}>Search</Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="border rounded-md p-4 max-h-[300px] overflow-auto">
                <h3 className="text-sm font-medium mb-2">Search Results:</h3>
                {searchResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))}
              </div>
            )}
            
            {searchResults.length === 0 && searchTerm && (
              <p className="text-sm text-gray-500">No results found for "{searchTerm}"</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSearchContentDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
