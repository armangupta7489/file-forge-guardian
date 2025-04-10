
import { useAuth } from '@/contexts/AuthContext';
import { FileProvider } from '@/contexts/FileContext';
import { FileList } from '@/components/FileList';
import { FileHeader } from '@/components/FileHeader';
import { FileOperations } from '@/components/FileOperations';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <FileProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b shadow-sm py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-purple-600">File Forge Guardian</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
            <FileHeader />
            <div className="p-4 border-b">
              <FileOperations />
            </div>
            <div className="flex-grow overflow-auto">
              <FileList />
            </div>
          </div>
        </main>
        
        <footer className="py-4 border-t">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>&copy; 2025 File Forge Guardian. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </FileProvider>
  );
};

export default Dashboard;
