
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
  Scissors,
  Edit,
  MoreHorizontal,
  FilePlus,
  FolderPlus,
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
  } = useFiles();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newFileName, setNewFileName] = useState('');
  const [fileContent, setFileContent] = useState('');

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

  const hasSelection = selectedFiles.length > 0;
  const hasSingleSelection = selectedFiles.length === 1;
  const selectedFile = hasSingleSelection ? getFile(selectedFiles[0]) : undefined;
  const canEdit = hasSingleSelection && selectedFile && selectedFile.type !== 'folder';

  return (
    <>
      <div className="flex items-center gap-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>File Operations</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleRename}>
                    <Edit className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  {canEdit && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Content
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => {
                      if (hasSelection && currentDirectory !== null) {
                        copyFiles(selectedFiles, currentDirectory);
                      }
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    </>
  );
}
