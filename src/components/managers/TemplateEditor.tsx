
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Code, 
  Copy, 
  Download,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Palette
} from 'lucide-react';

interface TemplateEditorProps {
  file: {
    id: string;
    name: string;
    path: string;
    content?: string;
  };
  onSave: (content: string) => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ file, onSave }) => {
  const [content, setContent] = useState(file.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [syntaxErrors, setSyntaxErrors] = useState<string[]>([]);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(file.content || '');
    setHasChanges(false);
  }, [file]);

  useEffect(() => {
    const lines = content.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
    validateSyntax(content);
  }, [content]);

  const validateSyntax = (templateContent: string) => {
    const errors: string[] = [];
    
    // Basic Jinja2 syntax validation
    const jinjaBlocks = templateContent.match(/\{%[\s\S]*?%\}/g) || [];
    const openBlocks = templateContent.match(/\{%\s*(if|for|block|macro)\s/g) || [];
    const closeBlocks = templateContent.match(/\{%\s*end(if|for|block|macro)\s*%\}/g) || [];
    
    if (openBlocks.length !== closeBlocks.length) {
      errors.push('Mismatched Jinja2 blocks - check your if/for/block/macro statements');
    }

    // Check for undefined function calls
    const functionCalls = templateContent.match(/\{\{\s*(\w+)\(/g) || [];
    const undefinedFunctions = functionCalls
      .map(call => call.match(/\{\{\s*(\w+)\(/)?.[1])
      .filter(func => func && !isKnownFunction(func));
    
    if (undefinedFunctions.length > 0) {
      errors.push(`Undefined functions: ${undefinedFunctions.join(', ')}`);
    }

    setSyntaxErrors(errors);
  };

  const isKnownFunction = (funcName: string): boolean => {
    const knownFunctions = [
      'get_led_pin', 'get_led_port', 'get_led_number',
      'get_button_pin', 'get_button_port',
      'get_flash_size', 'get_ram_size',
      'get_clock_frequency', 'get_peripheral_config',
      'default', 'upper', 'lower', 'capitalize'
    ];
    return knownFunctions.includes(funcName);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== file.content);
  };

  const handleSave = () => {
    onSave(content);
    setHasChanges(false);
  };

  const insertSnippet = (snippet: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + snippet + content.substring(end);
      setContent(newContent);
      setHasChanges(true);
      
      // Set cursor position after the snippet
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + snippet.length, start + snippet.length);
      }, 0);
    }
  };

  const snippets = [
    { label: 'Variable', code: '{{ variable_name }}' },
    { label: 'If Block', code: '{% if condition %}\n    \n{% endif %}' },
    { label: 'For Loop', code: '{% for item in items %}\n    \n{% endfor %}' },
    { label: 'Comment', code: '{# This is a comment #}' },
    { label: 'Include', code: "{% include 'template.j2' %}" },
    { label: 'LED Pin', code: '{{ get_led_pin("green") }}' },
    { label: 'Button Pin', code: '{{ get_button_pin() }}' },
    { label: 'Flash Size', code: '{{ get_flash_size() }}' },
    { label: 'Default Value', code: '{{ variable | default("default_value") }}' }
  ];

  return (
    <div className="flex h-full">
      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Badge variant={hasChanges ? "destructive" : "secondary"}>
              {hasChanges ? 'Modified' : 'Saved'}
            </Badge>
            {syntaxErrors.length > 0 && (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                {syntaxErrors.length} Error(s)
              </Badge>
            )}
            {syntaxErrors.length === 0 && content.trim() && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Valid
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave} 
              disabled={!hasChanges}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex">
          {/* Line Numbers */}
          <div className="w-12 bg-gray-50 border-r border-gray-200 p-2 text-right text-xs text-gray-500 font-mono">
            {lineNumbers.map(num => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>
          
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className="flex-1 p-4 font-mono text-sm border-none outline-none resize-none leading-6"
            placeholder="Enter your Jinja2 template content here..."
            spellCheck={false}
            style={{
              minHeight: '100%',
              background: 'linear-gradient(to right, #f8f9fa 0%, #ffffff 100%)'
            }}
          />
        </div>

        {/* Error Panel */}
        {syntaxErrors.length > 0 && (
          <div className="border-t border-red-200 bg-red-50 p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm font-medium text-red-800">Syntax Errors</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {syntaxErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar - Snippets and Help */}
      <div className="w-80 border-l border-gray-200 bg-gray-50">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Template Snippets
          </h3>
          
          <ScrollArea className="h-80">
            <div className="grid grid-cols-2 gap-2">
              {snippets.map((snippet, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-2 h-auto"
                  onClick={() => insertSnippet(snippet.code)}
                >
                  {snippet.label}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Available Functions
            </h3>
            
            <Card className="p-3">
              <div className="space-y-2 text-xs">
                <div>
                  <code className="bg-blue-100 px-1 rounded">get_led_pin(color)</code>
                  <p className="text-gray-600 mt-1">Get LED pin for specified color</p>
                </div>
                <div>
                  <code className="bg-blue-100 px-1 rounded">get_button_pin()</code>
                  <p className="text-gray-600 mt-1">Get user button pin</p>
                </div>
                <div>
                  <code className="bg-blue-100 px-1 rounded">get_flash_size()</code>
                  <p className="text-gray-600 mt-1">Get flash memory size</p>
                </div>
                <div>
                  <code className="bg-blue-100 px-1 rounded">get_ram_size()</code>
                  <p className="text-gray-600 mt-1">Get RAM size</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Syntax Highlighting
            </h3>
            
            <div className="text-xs space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                <span>Jinja2 Blocks ({% %})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Variables ({{ }})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Comments ({# #})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                <span>Keywords</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
