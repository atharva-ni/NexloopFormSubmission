import React from 'react';
import { 
  UserCheck, 
  Building, 
  Layout, 
  FolderKanban, 
  Users, 
  Palette, 
  Image, 
  PhoneCall, 
  FileText 
} from 'lucide-react';

export function StepIndicator({ steps, currentStep, setCurrentStep }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user': return <UserCheck className="w-4 h-4" />;
      case 'building': return <Building className="w-4 h-4" />;
      case 'layout': return <Layout className="w-4 h-4" />;
      case 'folder': return <FolderKanban className="w-4 h-4" />;
      case 'users': return <Users className="w-4 h-4" />;
      case 'palette': return <Palette className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'phone': return <PhoneCall className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="glass-card p-4 mb-8 no-print overflow-x-auto">
      <div className="flex items-center min-w-max justify-between gap-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(stepNum)}
              type="button"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : isCompleted
                  ? 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700'
                  : 'text-slate-500 hover:text-slate-400 hover:bg-slate-900/40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {stepNum}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
