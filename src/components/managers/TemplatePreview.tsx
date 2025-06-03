
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RefreshCw, 
  Copy, 
  Download,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TemplatePreviewProps {
  file: {
    id: string;
    name: string;
    path: string;
  };
  templateContent: string;
}

interface TemplateContext {
  [key: string]: any;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  file, 
  templateContent 
}) => {
  const [context, setContext] = useState<TemplateContext>({});
  const [renderedOutput, setRenderedOutput] = useState<string>('');
  const [renderError, setRenderError] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);

  // Default context based on STM32 board configuration
  const defaultContext = {
    // Board configuration
    board: {
      name: 'STM32F469I-Discovery',
      series: 'f4',
      has_led: true,
      has_button: true,
      flash_size: 2048,
      ram_size: 384
    },
    
    // Middleware configuration
    middleware: {
      threadx: true,
      filex: false,
      netxduo: false,
      usbx: false
    },
    
    // Memory configuration
    flash_size: 2048,
    ram_size: 384,
    
    // PLL configuration
    pll_m: 8,
    pll_n: 360,
    pll_p: 2,
    pll_q: 7,
    pll_r: 6,
    
    // ThreadX configuration
    tx_max_priorities: 32,
    tx_minimum_stack: 200,
    tx_thread_extension: 0,
    tx_timer_ticks: 1000,
    tx_byte_pool_size: 9120,
    tx_block_pool_size: 100
  };

  // Helper functions that would be available in the template context
  const templateFunctions = {
    get_led_pin: (color: string = 'green') => {
      const ledPins = {
        green: 'GPIO_PIN_12',
        red: 'GPIO_PIN_13',
        blue: 'GPIO_PIN_14',
        orange: 'GPIO_PIN_15'
      };
      return ledPins[color] || 'GPIO_PIN_12';
    },
    
    get_led_port: () => 'GPIOD',
    
    get_led_number: (color: string = 'green') => {
      const ledNumbers = {
        green: 12,
        red: 13,
        blue: 14,
        orange: 15
      };
      return ledNumbers[color] || 12;
    },
    
    get_button_pin: () => 'GPIO_PIN_0',
    get_button_port: () => 'GPIOA',
    
    get_flash_size: () => context.flash_size || defaultContext.flash_size,
    get_ram_size: () => context.ram_size || defaultContext.ram_size,
    
    get_clock_frequency: () => 180000000, // 180 MHz for F4 series
    
    get_peripheral_config: (peripheral: string) => {
      return `${peripheral.toUpperCase()}_CONFIG_DEFAULT`;
    }
  };

  useEffect(() => {
    setContext(defaultContext);
  }, []);

  useEffect(() => {
    if (templateContent.trim()) {
      renderTemplate();
    }
  }, [templateContent, context]);

  const renderTemplate = async () => {
    setIsRendering(true);
    setRenderError('');
    
    try {
      // Simple template rendering simulation
      let output = templateContent;
      
      // Process Jinja2-style variables {{ variable }}
      output = output.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, expression) => {
        try {
          // Handle function calls
          const functionCall = expression.match(/(\w+)\((.*?)\)/);
          if (functionCall) {
            const [, funcName, args] = functionCall;
            if (templateFunctions[funcName]) {
              const argsList = args ? args.split(',').map(arg => 
                arg.trim().replace(/['"]/g, '')
              ) : [];
              return templateFunctions[funcName](...argsList);
            }
            return `[Function ${funcName} not found]`;
          }
          
          // Handle filters like {{ variable | default("value") }}
          if (expression.includes('|')) {
            const [varName, filter] = expression.split('|').map(s => s.trim());
            const value = getNestedValue(context, varName);
            
            if (filter.includes('default')) {
              const defaultMatch = filter.match(/default\("([^"]+)"\)/);
              const defaultValue = defaultMatch ? defaultMatch[1] : '';
              return value !== undefined ? value : defaultValue;
            }
            
            return value !== undefined ? value : '';
          }
          
          // Simple variable replacement
          const value = getNestedValue(context, expression.trim());
          return value !== undefined ? value : `[${expression} not found]`;
        } catch (error) {
          return `[Error: ${error.message}]`;
        }
      });
      
      // Process conditional blocks {% if condition %}
      output = output.replace(/\{%\s*if\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g, 
        (match, condition, content) => {
          try {
            const conditionResult = evaluateCondition(condition.trim(), context);
            return conditionResult ? content : '';
          } catch (error) {
            return `[If block error: ${error.message}]`;
          }
        }
      );
      
      // Process for loops {% for item in items %}
      output = output.replace(/\{%\s*for\s+(\w+)\s+in\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g,
        (match, itemVar, arrayExpr, content) => {
          try {
            const array = getNestedValue(context, arrayExpr.trim());
            if (Array.isArray(array)) {
              return array.map(item => {
                return content.replace(new RegExp(`\\{\\{\\s*${itemVar}\\s*\\}\\}`, 'g'), item);
              }).join('');
            }
            return '';
          } catch (error) {
            return `[For loop error: ${error.message}]`;
          }
        }
      );
      
      // Remove comments {# comment #}
      output = output.replace(/\{#[\s\S]*?#\}/g, '');
      
      setRenderedOutput(output);
    } catch (error) {
      setRenderError(error.message);
    } finally {
      setIsRendering(false);
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  };

  const evaluateCondition = (condition: string, context: TemplateContext): boolean => {
    // Simple condition evaluation
    if (condition.includes('.')) {
      return !!getNestedValue(context, condition);
    }
    return !!context[condition];
  };

  const updateContextValue = (key: string, value: any) => {
    setContext(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(renderedOutput);
  };

  return (
    <div className="h-full flex">
      {/* Context Configuration Panel */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Template Context
            </h3>
            <Button 
              size="sm" 
              onClick={renderTemplate}
              disabled={isRendering}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRendering ? 'animate-spin' : ''}`} />
              Render
            </Button>
          </div>

          <Tabs defaultValue="board" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  value={context.board?.name || ''}
                  onChange={(e) => updateContextValue('board.name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="flash-size">Flash Size (KB)</Label>
                <Input
                  id="flash-size"
                  type="number"
                  value={context.flash_size || ''}
                  onChange={(e) => updateContextValue('flash_size', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="ram-size">RAM Size (KB)</Label>
                <Input
                  id="ram-size"
                  type="number"
                  value={context.ram_size || ''}
                  onChange={(e) => updateContextValue('ram_size', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Middleware</Label>
                <div className="space-y-2">
                  {['threadx', 'filex', 'netxduo', 'usbx'].map(mw => (
                    <label key={mw} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={context.middleware?.[mw] || false}
                        onChange={(e) => updateContextValue(`middleware.${mw}`, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{mw}</span>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="pll-m">PLL M</Label>
                  <Input
                    id="pll-m"
                    type="number"
                    value={context.pll_m || ''}
                    onChange={(e) => updateContextValue('pll_m', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="pll-n">PLL N</Label>
                  <Input
                    id="pll-n"
                    type="number"
                    value={context.pll_n || ''}
                    onChange={(e) => updateContextValue('pll_n', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tx-priorities">TX Max Priorities</Label>
                <Input
                  id="tx-priorities"
                  type="number"
                  value={context.tx_max_priorities || ''}
                  onChange={(e) => updateContextValue('tx_max_priorities', parseInt(e.target.value))}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-medium text-gray-900">Template Preview</h3>
              <p className="text-xs text-gray-500">{file.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {renderError ? (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Error
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Rendered
              </Badge>
            )}
            
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {renderError ? (
          <div className="flex-1 flex items-center justify-center bg-red-50">
            <Card className="w-96 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Render Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm">{renderError}</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-auto whitespace-pre-wrap">
                {renderedOutput || 'No output generated yet...'}
              </pre>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
