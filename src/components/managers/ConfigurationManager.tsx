
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Search, Plus, FileText, FolderOpen } from 'lucide-react';

export const ConfigurationManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-full p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Configuration Manager
          </CardTitle>
          <CardDescription>
            Manage and edit JSON configuration files for your projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search configuration files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Config
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'STM32F429ZI-Nucleo.json', type: 'Board Config', size: '2.4 KB' },
              { name: 'ThreadX.json', type: 'Middleware', size: '1.8 KB' },
              { name: 'f4.json', type: 'Series Config', size: '3.2 KB' },
              { name: 'NetXDuo.json', type: 'Middleware', size: '2.1 KB' },
              { name: 'USBX.json', type: 'Middleware', size: '1.9 KB' },
              { name: 'FileX.json', type: 'Middleware', size: '1.6 KB' }
            ].map((file, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-gray-500">{file.type}</div>
                        <div className="text-xs text-gray-400">{file.size}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
