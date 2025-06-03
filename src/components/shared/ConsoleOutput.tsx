
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Terminal, 
  Trash2, 
  Copy, 
  Download,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useSTM } from '@/contexts/STMContext';

export const ConsoleOutput: React.FC = () => {
  const { consoleOutput, clearConsoleOutput, isGenerating } = useSTM();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleCopyAll = () => {
    const allOutput = consoleOutput.join('\n');
    navigator.clipboard.writeText(allOutput);
  };

  const handleDownloadLog = () => {
    const allOutput = consoleOutput.join('\n');
    const blob = new Blob([allOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stm32-builder-log-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMessageType = (message: string) => {
    if (message.includes('✅')) return 'success';
    if (message.includes('❌')) return 'error';
    if (message.includes('⚠️')) return 'warning';
    if (message.includes('📋') || message.includes('🚀')) return 'info';
    return 'default';
  };

  const getMessageColor = (type: string) => {
    const colors = {
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-orange-600',
      info: 'text-blue-600',
      default: 'text-gray-600'
    };
    return colors[type] || colors.default;
  };

  if (isCollapsed) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-3">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Console Output</span>
            <Badge variant="outline" className="text-xs">
              {consoleOutput.length} messages
            </Badge>
            {isGenerating && (
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                Running
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <Card className="rounded-none border-0 border-t">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Terminal className="w-4 h-4 mr-2 text-gray-500" />
                Console Output
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {consoleOutput.length} messages
              </Badge>
              {isGenerating && (
                <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                  Running
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyAll}
                disabled={consoleOutput.length === 0}
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownloadLog}
                disabled={consoleOutput.length === 0}
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearConsoleOutput}
                disabled={consoleOutput.length === 0}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(true)}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div 
            ref={scrollRef}
            className="h-48 bg-gray-900 text-green-400 font-mono text-xs overflow-auto p-4"
          >
            {consoleOutput.length === 0 ? (
              <div className="text-gray-500 italic">
                Console output will appear here...
              </div>
            ) : (
              <div className="space-y-1">
                {consoleOutput.map((message, index) => {
                  const messageType = getMessageType(message);
                  const colorClass = getMessageColor(messageType);
                  
                  return (
                    <div 
                      key={index} 
                      className={`${colorClass} whitespace-pre-wrap`}
                    >
                      {message}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
