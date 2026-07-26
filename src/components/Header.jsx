import React from 'react';
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react';

export function Header({ completionPercentage, onSaveDraft, onResetDraft, lastSavedTime }) {
  return (
    <div className="mb-3">
      {/* Google Banner Image Graphic */}
      <div className="gf-banner"></div>

      {/* Main Form Title Card */}
      <div className="gf-card gf-title-card">
        <h1 className="text-2xl sm:text-3xl font-normal text-slate-900 leading-tight mb-2">
          NexLoop Portfolio Website Requirement Form
        </h1>
        
        <p className="text-sm text-slate-600 leading-normal mb-4">
          Welcome! Thank you for choosing <strong>NexLoop</strong>.<br />
          Please fill out this short form. It takes only 10–15 minutes and helps us build your website.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
          <span className="text-rose-600 font-medium">* Indicates required question</span>

          <div className="flex items-center gap-2 no-print">
            {lastSavedTime && (
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved {lastSavedTime}
              </span>
            )}
            <button
              onClick={onSaveDraft}
              type="button"
              className="gf-btn-text text-xs flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button
              onClick={onResetDraft}
              type="button"
              className="gf-btn-text text-xs text-rose-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear form
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 no-print">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Form Progress</span>
            <span className="font-semibold text-purple-700">{completionPercentage}%</span>
          </div>
          <div className="gf-progress-bg">
            <div className="gf-progress-fill" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
