
import { useAuth } from '@/contexts/AuthContext';
import { FileProvider } from '@/contexts/FileContext';
import { FileList } from '@/components/FileList';
import { FileHeader } from '@/components/FileHeader';
import { FileOperations } from '@/components/FileOperations';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User, 
  Shield, 
  AlertTriangle,
  Settings,
  Activity
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <FileProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b shadow-sm py-3 px-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <h1 className="text-xl font-bold text-purple-600">File Forge Guardian</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">{user?.username}</span>
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                  {user?.role}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto p-4">
          <Tabs defaultValue="files" className="mb-4">
            <TabsList>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="files" className="h-full">
              <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
                <FileHeader />
                <div className="p-4 border-b">
                  <FileOperations />
                </div>
                <div className="flex-grow overflow-auto">
                  <FileList />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                      <Shield className="h-5 w-5 mr-2 text-purple-600" />
                      Security Features
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                        AES-256 File Encryption
                      </li>
                      <li className="flex items-center">
                        <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                        Role-Based Access Control
                      </li>
                      <li className="flex items-center">
                        <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                        Secure File Transmission
                      </li>
                      <li className="flex items-center">
                        <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                        File Permission Management
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                      <Activity className="h-5 w-5 mr-2 text-purple-600" />
                      Security Status
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">System Last Updated</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Encrypted Files</p>
                        <p className="font-medium">2 files</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Security Rating</p>
                        <div className="flex items-center">
                          <div className="w-32 h-2 rounded-full bg-gray-200 mr-2">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: '85%' }}></div>
                          </div>
                          <span className="text-green-600 font-medium">Strong</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Best Practices</AlertTitle>
                  <AlertDescription>
                    Always encrypt sensitive files and use strong passwords. Remember to log out when you're finished.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
            
            <TabsContent value="performance">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="flex items-center text-lg font-semibold mb-2">
                      <Settings className="h-5 w-5 mr-2 text-purple-600" />
                      System Performance
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Storage</p>
                        <div className="flex items-center mt-1">
                          <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                            <div className="h-2 rounded-full bg-blue-500" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-gray-600 text-sm">45%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Memory Usage</p>
                        <div className="flex items-center mt-1">
                          <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                            <div className="h-2 rounded-full bg-purple-500" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-gray-600 text-sm">30%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CPU Utilization</p>
                        <div className="flex items-center mt-1">
                          <div className="w-full h-2 rounded-full bg-gray-200 mr-2">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: '15%' }}></div>
                          </div>
                          <span className="text-gray-600 text-sm">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Total Files</p>
                        <p className="text-2xl font-semibold">6</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Folders</p>
                        <p className="text-2xl font-semibold">3</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Compressed</p>
                        <p className="text-2xl font-semibold">1</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Operations</p>
                        <p className="text-2xl font-semibold">24</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="py-4 border-t">
          <div className="container mx-auto text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} File Forge Guardian. All rights reserved.</p>
            <p className="text-xs mt-1">Secure File Management System - Version 1.0</p>
          </div>
        </footer>
      </div>
    </FileProvider>
  );
};

export default Dashboard;
