import React from 'react';
import { Download, Copy, Printer, Check, X, FileJson } from 'lucide-react';

export function ReviewModal({ formData, onClose, onCopyPrompt, copied }) {
  const downloadJSON = () => {
    const cleanData = JSON.parse(JSON.stringify(formData, (key, value) => {
      if (key === 'previewUrl') return undefined;
      return value;
    }));

    const jsonStr = JSON.stringify(cleanData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexLoop_Requirement_Form_${cleanData.basicInfo.companyName || 'Response'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="gf-modal-overlay">
      <div className="gf-modal-card">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-medium text-slate-900">Form Response Summary</h2>
            <p className="text-xs text-slate-500">Review your submitted responses or download JSON file.</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-1">

          {/* Basic Info */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><strong>Company Name:</strong> {formData.basicInfo.companyName || '—'}</div>
              <div><strong>Contact Person:</strong> {formData.basicInfo.contactPerson || '—'}</div>
              <div><strong>Mobile Number:</strong> {formData.basicInfo.mobileNumber || '—'}</div>
              <div><strong>WhatsApp Number:</strong> {formData.basicInfo.whatsAppNumber || '—'}</div>
              <div className="sm:col-span-2"><strong>Email:</strong> {formData.basicInfo.email || '—'}</div>
              <div className="sm:col-span-2"><strong>Address:</strong> {formData.basicInfo.officeAddress || '—'}</div>
            </div>
          </div>

          {/* About Company */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">2. About Your Company</h3>
            <p className="mb-1"><strong>Description:</strong> {formData.aboutCompany.description || '—'}</p>
            <p className="mb-1"><strong>Years of Experience:</strong> {formData.aboutCompany.yearsExperience || '—'}</p>
            <p><strong>Services:</strong> {formData.aboutCompany.services.join(', ') || 'None'}</p>
          </div>

          {/* Website Requirements */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">3. Website Requirements</h3>
            <p className="mb-1"><strong>Pages:</strong> {formData.websiteReqs.pages.join(', ') || 'None'}</p>
            <p><strong>Special Features:</strong> {formData.websiteReqs.features.join(', ') || 'None'}</p>
          </div>

          {/* Featured Projects */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">4. Featured Projects ({formData.projects.length})</h3>
            <div className="space-y-2">
              {formData.projects.map((p, i) => (
                <div key={p.id || i} className="p-2 bg-white border border-slate-200 rounded">
                  <div className="font-semibold text-slate-800">Project #{i + 1}: {p.name} ({p.status})</div>
                  <div className="text-slate-600">Location: {p.location || '—'} | Type: {p.type}</div>
                  <div className="text-slate-600">Description: {p.description || '—'}</div>
                  {p.driveLink && <div className="text-purple-700 truncate">Drive Link: {p.driveLink}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Team & Branding */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">5 & 6. Team & Branding</h3>
            <p><strong>Founder Name:</strong> {formData.team.founderName || '—'}</p>
            <p><strong>Team Members:</strong> {formData.team.teamMembers || '—'}</p>
            <p><strong>Company Logo File:</strong> {formData.branding.logo.length > 0 ? formData.branding.logo[0].name : 'Not uploaded'}</p>
          </div>

          {/* Assets & Contact */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <h3 className="font-bold text-purple-900 text-sm mb-2">7, 8 & 9. Assets, Contact & Notes</h3>
            <p><strong>Uploaded Assets:</strong> {formData.assets.files.length} files</p>
            <p><strong>Phone:</strong> {formData.contactDetails.phone || '—'} | <strong>Email:</strong> {formData.contactDetails.email || '—'}</p>
            <p><strong>Additional Notes:</strong> {formData.anythingElse || '—'}</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadJSON}
              type="button"
              className="gf-btn-submit text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <FileJson className="w-4 h-4" /> Download JSON
            </button>
            <button
              onClick={onCopyPrompt}
              type="button"
              className="gf-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Response'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="gf-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print PDF
            </button>
            <button
              onClick={onClose}
              type="button"
              className="gf-btn-secondary text-xs py-1.5 px-3"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
