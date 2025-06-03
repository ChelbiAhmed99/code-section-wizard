
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
  Sparkles,
  Shield,
  Clock,
  Users,
  Award,
  ArrowRight,
  Star,
  Rocket,
  Database,
  Layers,
  Zap as Lightning
} from 'lucide-react';
import { FileUpload } from './shared/FileUpload';
import { CreateTemplateDialog } from './shared/CreateTemplateDialog';

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
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

const stats = [
  { label: 'Active Users', value: '10,000+', icon: Users },
  { label: 'Projects Created', value: '25,000+', icon: Rocket },
  { label: 'Code Generated', value: '1M+ Lines', icon: Code },
  { label: 'Success Rate', value: '99.8%', icon: Award }
];

const features = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with end-to-end encryption'
  },
  {
    icon: Lightning,
    title: 'Lightning Fast',
    description: 'Generate code in seconds, not hours'
  },
  {
    icon: Database,
    title: 'Rich Templates',
    description: 'Extensive library of battle-tested templates'
  },
  {
    icon: Layers,
    title: 'Modular Design',
    description: 'Mix and match components effortlessly'
  }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);

  const modes: ModeOption[] = [
    {
      id: 'generate-mx',
      title: 'Generate MX Files',
      description: 'Create STM32CubeMX configuration files with intelligent defaults and optimizations',
      icon: Cpu,
      features: ['Smart pin configuration', 'Optimized clock settings', 'Peripheral auto-init', 'Code generation'],
      color: 'from-blue-500 to-blue-600',
      badge: 'Quick Start',
      difficulty: 'Beginner'
    },
    {
      id: 'generate-pack',
      title: 'Generate Pack',
      description: 'Build comprehensive firmware packages with Azure RTOS integration and toolchain support',
      icon: Package,
      features: ['Multi-toolchain support', 'AZRTOS integration', 'Dependency management', 'Version control'],
      color: 'from-green-500 to-green-600',
      difficulty: 'Intermediate'
    },
    {
      id: 'generate-app',
      title: 'Generate Application',
      description: 'Create production-ready applications for specific STM32 boards with full middleware stack',
      icon: Code,
      features: ['Board-specific optimization', 'Middleware integration', 'Professional templates', 'Ready-to-deploy'],
      color: 'from-purple-500 to-purple-600',
      badge: 'Most Popular',
      difficulty: 'Intermediate'
    },
    {
      id: 'generate-full-pack',
      title: 'Generate Full Pack',
      description: 'Enterprise-grade solution generating complete development packs for entire STM32 series',
      icon: Zap,
      features: ['Complete ecosystem', 'All boards included', 'Professional documentation', 'Enterprise support'],
      color: 'from-orange-500 to-orange-600',
      badge: 'Enterprise',
      difficulty: 'Expert'
    },
    {
      id: 'config-manager',
      title: 'Configuration Manager',
      description: 'Advanced JSON configuration editor with intelligent validation and form-based editing',
      icon: Settings,
      features: ['Smart validation', 'Visual form editor', 'Version control', 'Import/Export'],
      color: 'from-teal-500 to-teal-600',
      difficulty: 'Intermediate'
    },
    {
      id: 'template-manager',
      title: 'Template Manager',
      description: 'Professional Jinja2 template editor with live preview, syntax highlighting, and debugging',
      icon: FileCode,
      features: ['Syntax highlighting', 'Live preview', 'Debug tools', 'Template library'],
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Pro Tools',
      difficulty: 'Advanced'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-orange-100 text-orange-800',
      'Expert': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="STM32 Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  STM32Cube Builder
                </h1>
                <p className="text-blue-200 text-xl font-medium">Professional Edition for Azure RTOS</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge className="bg-green-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Enterprise Ready
                  </Badge>
                  <Badge className="bg-purple-500 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-200">v2.0.0</div>
              <div className="text-sm text-blue-300">Professional Edition</div>
              <div className="flex items-center justify-end mt-2">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Last updated: Today</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-200" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Welcome Message */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Build the Future with 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> STM32</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Unleash the full potential of STM32 microcontrollers with our AI-powered development suite. 
            From rapid prototyping to enterprise deployment, we've got you covered.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-16">
          <div className="flex space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => setShowUpload(!showUpload)}
            >
              <Database className="w-5 h-5 mr-2" />
              Import Project Files
            </Button>
            <CreateTemplateDialog 
              trigger={
                <Button size="lg" variant="outline" className="border-2 border-purple-300 hover:bg-purple-50">
                  <FileCode className="w-5 h-5 mr-2" />
                  Create Template
                </Button>
              }
            />
          </div>
        </div>

        {/* File Upload Section */}
        {showUpload && (
          <div className="mb-16 animate-fade-in">
            <Card className="max-w-4xl mx-auto shadow-xl border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-center text-2xl">Import Your Project Files</CardTitle>
                <CardDescription className="text-center text-lg">
                  Upload your existing STM32 project files to get started quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <FileUpload onUploadComplete={() => setShowUpload(false)} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mode Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Card 
                key={mode.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-105 border-2 transform ${
                  hoveredMode === mode.id 
                    ? 'border-blue-400 shadow-2xl scale-105 bg-gradient-to-br from-white to-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode('')}
                onClick={() => onModeSelect(mode.id)}
              >
                <CardHeader className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-5 rounded-t-lg`}></div>
                  <div className="flex items-start justify-between relative">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${mode.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      {mode.badge && (
                        <Badge variant="secondary" className="text-xs font-bold">
                          {mode.badge}
                        </Badge>
                      )}
                      {mode.difficulty && (
                        <Badge className={`text-xs ${getDifficultyColor(mode.difficulty)}`}>
                          {mode.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mt-4">
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {mode.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModeSelect(mode.id);
                    }}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose STM32Cube Builder?
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Built for developers, by developers. Our platform combines cutting-edge AI with deep STM32 expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl shadow-xl p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Quick Start Guide
              </h3>
              <div className="space-y-6">
                {[
                  { step: 1, title: "Choose Your Path", desc: "Select the development mode that matches your project requirements" },
                  { step: 2, title: "Configure & Customize", desc: "Use our intelligent forms to configure your STM32 target and requirements" },
                  { step: 3, title: "Generate & Deploy", desc: "Let our AI generate optimized code and deploy to your development environment" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start">
                    <div className="w-8 h-8 bg-white text-blue-900 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-blue-200">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6">Latest Updates</h3>
              <div className="space-y-4">
                {[
                  "🚀 New AI-powered template generation",
                  "⚡ 50% faster code generation",
                  "🛡️ Enhanced security features",
                  "📊 Advanced project analytics",
                  "🔧 Improved debugging tools"
                ].map((update, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-sm">{update}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <img 
                src="/api/placeholder/40/40" 
                alt="STMicroelectronics" 
                className="w-10 h-10"
              />
              <div>
                <div className="font-bold">STMicroelectronics</div>
                <div className="text-sm text-gray-400">© 2024 - All Rights Reserved</div>
              </div>
            </div>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Community</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Enterprise</a>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};
