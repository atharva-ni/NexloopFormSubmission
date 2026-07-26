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
            <p className="text-xs text-slate-500">Review your submitted responses or download JSON summary file.</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="gf-action-btn"
            title="Close summary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-3.5 text-xs text-slate-700 max-h-[60vh] overflow-y-auto pr-1">

          {/* Section 1: Basic Information */}
          <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-lg">
            <h3 className="font-bold text-purple-900 text-sm mb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong>Company Name:</strong> {formData.basicInfo.companyName || '—'}</div>
              <div><strong>Contact Person:</strong> {formData.basicInfo.contactPerson || '—'}</div>
              <div><strong>Mobile Number:</strong> {formData.basicInfo.mobileNumber || '—'}</div>
              <div><strong>WhatsApp Number:</strong> {formData.basicInfo.whatsAppNumber || '—'}</div>
              <div className="sm:col-span-2"><strong>Email:</strong> {formData.basicInfo.email || '—'}</div>
              <div className="sm:col-span-2"><strong>Address:</strong> {formData.basicInfo.officeAddress || '—'}</div>
            </div>
          </div>

          {/* Section 2: About Company */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-purple-900 text-sm mb-2">2. About Your Company</h3>
            <p className="mb-1"><strong>Description:</strong> {formData.aboutCompany.description || '—'}</p>
            <p className="mb-1"><strong>Years of Experience:</strong> {formData.aboutCompany.yearsExperience || '—'}</p>
            <p><strong>Services:</strong> {formData.aboutCompany.services.join(', ') || 'None'}</p>
          </div>

          {/* Section 3: Website Requirements */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-purple-900 text-sm mb-2">3. Website Requirements</h3>
            <p className="mb-1"><strong>Pages Requested:</strong> {formData.websiteReqs.pages.join(', ') || 'None'}</p>
            <p><strong>Special Features:</strong> {formData.websiteReqs.features.join(', ') || 'None'}</p>
          </div>

          {/* Section 4: Featured Projects */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-bold text-purple-900 text-sm mb-2">4. Featured Projects ({formData.projects.length})</h3>
            <div className="space-y-2">
              {formData.projects.map((p, i) => (
                <div key={p.id || i} className="p-2.5 bg-white border border-slate-200 rounded-md text-xs space-y-1">
                  <div className="font-semibold text-purple-950">Project #{i + 1}: {p.name} ({p.status})</div>
                  <div className="text-slate-600">Location: {p.location || '—'} | Type: {p.type}</div>
                  <div className="text-slate-600">Description: {p.description || '—'}</div>
                  {p.driveLink && <div className="text-purple-700 truncate font-mono">Drive Link: {p.driveLink}</div>}
                  {p.photos && p.photos.length > 0 && (
                    <div className="text-slate-500 font-medium">Uploaded Files: {p.photos.length} files</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Team & Founder Details */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
            <h3 className="font-bold text-purple-900 text-sm mb-2">5. Team & Founder Details</h3>
            <p><strong>Founder Name:</strong> {formData.team.founderName || '—'}</p>
            <p><strong>Designation:</strong> {formData.team.founderDesignation || '—'}</p>
            <p><strong>Founder Bio:</strong> {formData.team.founderBio || '—'}</p>
            <p><strong>Founder Photo:</strong> {formData.team.founderPhoto && formData.team.founderPhoto.length > 0 ? formData.team.founderPhoto[0].name : 'Not uploaded'}</p>
            <p><strong>Key Team Members:</strong> {formData.team.teamMembers || '—'}</p>
          </div>

          {/* Section 6: Branding & Assets */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
            <h3 className="font-bold text-purple-900 text-sm mb-2">6. Branding & Assets</h3>
            <p><strong>Company Logo:</strong> {formData.branding.logo.length > 0 ? formData.branding.logo[0].name : 'Not uploaded'}</p>
            <p><strong>Company Profile (PDF):</strong> {formData.branding.profilePdf.length > 0 ? formData.branding.profilePdf[0].name : 'Not uploaded'}</p>
            <p><strong>Brochure PDF:</strong> {formData.branding.brochurePdf.length > 0 ? formData.branding.brochurePdf[0].name : 'Not uploaded'}</p>
            <p><strong>General Assets Uploaded:</strong> {formData.assets.files.length} files</p>
          </div>

          {/* Section 7: Contact Details & Additional Notes */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs">
            <h3 className="font-bold text-purple-900 text-sm mb-2">7. Contact Details & Additional Notes</h3>
            <p><strong>Phone:</strong> {formData.contactDetails.phone || '—'} | <strong>Email:</strong> {formData.contactDetails.email || '—'}</p>
            <p><strong>Google Maps Link:</strong> {formData.contactDetails.googleMaps || '—'}</p>
            <p><strong>Instagram:</strong> {formData.contactDetails.instagram || '—'}</p>
            <p><strong>LinkedIn:</strong> {formData.contactDetails.linkedin || '—'}</p>
            <p><strong>Additional Preferences:</strong> {formData.anythingElse || '—'}</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={downloadJSON}
              type="button"
              className="gf-btn-primary text-xs"
            >
              <FileJson className="w-4 h-4" /> Download JSON
            </button>
            <button
              onClick={onCopyPrompt}
              type="button"
              className="gf-btn-secondary text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Response'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="gf-btn-secondary text-xs"
            >
              <Printer className="w-4 h-4" /> Print PDF
            </button>
            <button
              onClick={onClose}
              type="button"
              className="gf-btn-secondary text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
