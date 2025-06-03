
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Package, 
  Code, 
  Settings, 
  FileCode, 
  Zap, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface WelcomeScreenProps {
  onModeSelect: (mode: string) => void;
}

interface ModeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  badge?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<string>('');

  const modes: ModeOption[] = [
    {
      id: 'generate-mx',
      title: 'Generate MX Files',
      description: 'Create STM32CubeMX configuration files for your STM32 series',
      icon: Cpu,
      features: ['Pin configuration', 'Clock settings', 'Peripheral initialization', 'Code generation'],
      color: 'from-blue-500 to-blue-600',
      badge: 'Quick Start'
    },
    {
      id: 'generate-pack',
      title: 'Generate Pack',
      description: 'Build firmware packages for STM32 microcontrollers with AZRTOS',
      icon: Package,
      features: ['Firmware packaging', 'Series support', 'AZRTOS integration', 'Custom builds'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'generate-app',
      title: 'Generate Application',
      description: 'Create complete applications for specific STM32 boards',
      icon: Code,
      features: ['Board-specific apps', 'Middleware integration', 'Toolchain support', 'Ready-to-compile'],
      color: 'from-purple-500 to-purple-600',
      badge: 'Popular'
    },
    {
      id: 'generate-full-pack',
      title: 'Generate Full Pack',
      description: 'Generate comprehensive packs with all applications for a series',
      icon: Zap,
      features: ['Complete solution', 'All boards included', 'Batch generation', 'Professional grade'],
      color: 'from-orange-500 to-orange-600',
      badge: 'Advanced'
    },
    {
      id: 'config-manager',
      title: 'Configuration Manager',
      description: 'Manage and edit JSON configuration files for your projects',
      icon: Settings,
      features: ['JSON editing', 'Form interface', 'Validation', 'File management'],
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'template-manager',
      title: 'Template Manager',
      description: 'Create and edit Jinja2 templates for code generation',
      icon: FileCode,
      features: ['Template editing', 'Syntax highlighting', 'Live preview', 'Function helpers'],
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Pro'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="/api/placeholder/64/64" 
                  alt="STM32 Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">STM32Cube Builder</h1>
                <p className="text-blue-200 text-lg">for Azure RTOS</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200">Version 1.0.0</div>
              <div className="text-xs text-blue-300">Professional Edition</div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to STM32Cube Builder
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your development path to get started with STM32 microcontrollers and Azure RTOS. 
            Our professional tools will guide you through the entire development process.
          </p>
        </div>

        {/* Mode Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Card 
                key={mode.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                  hoveredMode === mode.id ? 'border-blue-400 shadow-xl' : 'border-gray-200 hover:border-blue-300'
                }`}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode('')}
                onClick={() => onModeSelect(mode.id)}
              >
                <CardHeader className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-5 rounded-t-lg`}></div>
                  <div className="flex items-start justify-between relative">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${mode.color} text-white`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {mode.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {mode.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Sparkles className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full group-hover:bg-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModeSelect(mode.id);
                    }}
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Start Guide
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Your Mode</h4>
                    <p className="text-gray-600 text-sm">Select the development mode that best fits your project needs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Configure Settings</h4>
                    <p className="text-gray-600 text-sm">Fill in the required parameters for your STM32 target</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Generate & Build</h4>
                    <p className="text-gray-600 text-sm">Let the tool generate your code and project files automatically</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What's New in v1.0.0
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Enhanced template management with live preview
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Improved JSON configuration editor
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Better error handling and validation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Professional UI with dark mode support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <img 
                src="/api/placeholder/32/32" 
                alt="STMicroelectronics" 
                className="w-8 h-8"
              />
              <span className="text-sm">© 2024 STMicroelectronics - All Rights Reserved</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
