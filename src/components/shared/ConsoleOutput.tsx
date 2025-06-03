
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Terminal } from 'lucide-react';
import { useSTM } from '../../contexts/STMContext';

export const ConsoleOutput: React.FC = () => {
  const { consoleOutput, clearConsoleOutput } = useSTM();

  return (
    <Card className="m-4 mt-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Terminal className="w-4 h-4 mr-2" />
            Console Output
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={clearConsoleOutput}
            disabled={consoleOutput.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-32 w-full">
          <div className="bg-gray-900 rounded p-3 font-mono text-sm">
            {consoleOutput.length === 0 ? (
              <div className="text-gray-500">No output yet...</div>
            ) : (
              consoleOutput.map((line, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {line}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
