import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Eye, Send, RotateCcw, ChevronLeft, ChevronRight, HardDrive, ExternalLink, Settings } from 'lucide-react';

import { Header } from './components/Header';
import { ProjectSection } from './components/ProjectSection';
import { MediaUploadZone } from './components/MediaUploadZone';
import { ReviewModal } from './components/ReviewModal';

const SECTIONS = [
  { id: 1, title: '1. Basic Info' },
  { id: 2, title: '2. About Company' },
  { id: 3, title: '3. Website Reqs' },
  { id: 4, title: '4. Featured Projects' },
  { id: 5, title: '5. Team' },
  { id: 6, title: '6. Branding' },
  { id: 7, title: '7. Assets' },
  { id: 8, title: '8. Contact' },
  { id: 9, title: '9. Anything Else?' }
];

const SERVICE_OPTIONS = [
  'Architecture',
  'Interior Design',
  'Construction',
  'Renovation',
  'Turnkey Projects',
  'Landscape',
  'Project Management',
  'Other'
];

const PAGE_OPTIONS = [
  'Home',
  'About',
  'Services',
  'Projects',
  'Gallery',
  'Team',
  'Contact',
  'Other'
];

const FEATURE_OPTIONS = [
  'WhatsApp Chat',
  'Contact Form',
  'Google Maps',
  'Download Brochure',
  'Blog',
  'Other'
];

const INITIAL_STATE = {
  basicInfo: {
    companyName: '',
    contactPerson: '',
    mobileNumber: '',
    whatsAppNumber: '',
    email: '',
    officeAddress: ''
  },
  aboutCompany: {
    description: '',
    yearsExperience: '',
    services: [],
    otherService: ''
  },
  websiteReqs: {
    pages: ['Home', 'About', 'Services', 'Projects', 'Contact'],
    otherPage: '',
    features: ['WhatsApp Chat', 'Contact Form', 'Google Maps'],
    otherFeature: ''
  },
  projectCountChoice: '5',
  projects: [
    {
      id: 'proj-1',
      name: 'Project 1',
      location: '',
      type: 'Residential',
      customType: '',
      status: 'Completed',
      yearCompleted: '',
      description: '',
      servicesProvided: '',
      photos: [],
      driveLink: ''
    },
    {
      id: 'proj-2',
      name: 'Project 2',
      location: '',
      type: 'Commercial',
      customType: '',
      status: 'Completed',
      yearCompleted: '',
      description: '',
      servicesProvided: '',
      photos: [],
      driveLink: ''
    },
    {
      id: 'proj-3',
      name: 'Project 3',
      location: '',
      type: 'Villa',
      customType: '',
      status: 'Ongoing',
      yearCompleted: '',
      description: '',
      servicesProvided: '',
      photos: [],
      driveLink: ''
    },
    {
      id: 'proj-4',
      name: 'Project 4',
      location: '',
      type: 'Apartment',
      customType: '',
      status: 'Completed',
      yearCompleted: '',
      description: '',
      servicesProvided: '',
      photos: [],
      driveLink: ''
    },
    {
      id: 'proj-5',
      name: 'Project 5',
      location: '',
      type: 'Industrial',
      customType: '',
      status: 'Completed',
      yearCompleted: '',
      description: '',
      servicesProvided: '',
      photos: [],
      driveLink: ''
    }
  ],
  team: {
    founderName: '',
    teamMembers: ''
  },
  branding: {
    logo: [],
    profilePdf: [],
    brochurePdf: []
  },
  assets: {
    files: [],
    driveLink: ''
  },
  contactDetails: {
    phone: '',
    email: '',
    googleMaps: '',
    facebook: '',
    instagram: '',
    linkedin: ''
  },
  anythingElse: ''
};

export default function App() {
  const [currentSection, setCurrentSection] = useState(() => {
    const savedSec = localStorage.getItem('nexloop_current_section');
    return savedSec ? parseInt(savedSec, 10) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('nexloop_form_draft');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_STATE; }
    }
    return INITIAL_STATE;
  });

  // Automatically load from .env.local (VITE_GOOGLE_DRIVE_WEBHOOK_URL) or LocalStorage
  const [driveWebhookUrl, setDriveWebhookUrl] = useState(() => {
    return (
      import.meta.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL ||
      localStorage.getItem('nexloop_drive_webhook_url') ||
      ''
    );
  });

  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdDriveFolderUrl, setCreatedDriveFolderUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showDriveConfig, setShowDriveConfig] = useState(false);

  // Auto-save form data state on every single change
  useEffect(() => {
    localStorage.setItem('nexloop_form_draft', JSON.stringify(formData));
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);
  }, [formData]);

  // Persist current active section step
  useEffect(() => {
    localStorage.setItem('nexloop_current_section', currentSection.toString());
  }, [currentSection]);

  useEffect(() => {
    if (driveWebhookUrl) {
      localStorage.setItem('nexloop_drive_webhook_url', driveWebhookUrl);
    }
  }, [driveWebhookUrl]);

  const handleManualSave = () => {
    localStorage.setItem('nexloop_form_draft', JSON.stringify(formData));
    localStorage.setItem('nexloop_current_section', currentSection.toString());
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(now);
    alert('Form state saved successfully!');
  };

  const handleResetDraft = () => {
    if (window.confirm('Are you sure you want to clear all form entries and reset state?')) {
      setFormData(INITIAL_STATE);
      localStorage.removeItem('nexloop_form_draft');
      localStorage.removeItem('nexloop_current_section');
      setCurrentSection(1);
      setIsSubmitted(false);
      setCreatedDriveFolderUrl(null);
    }
  };

  const updateNestedField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (section, field, item) => {
    setFormData(prev => {
      const currentList = prev[section][field] || [];
      const updated = currentList.includes(item)
        ? currentList.filter(i => i !== item)
        : [...currentList, item];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: updated
        }
      };
    });
  };

  const calculateCompletion = () => {
    let filled = 0;
    let total = 10;
    if (formData.basicInfo.companyName) filled++;
    if (formData.basicInfo.contactPerson) filled++;
    if (formData.basicInfo.mobileNumber) filled++;
    if (formData.basicInfo.email) filled++;
    if (formData.aboutCompany.description) filled++;
    if (formData.aboutCompany.services.length > 0) filled++;
    if (formData.websiteReqs.pages.length > 0) filled++;
    if (formData.projects.length > 0 && formData.projects[0].name) filled++;
    if (formData.contactDetails.phone || formData.contactDetails.email) filled++;
    if (formData.team.founderName || formData.branding.logo.length > 0) filled++;
    return Math.min(100, Math.round((filled / total) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const targetUrl = driveWebhookUrl || import.meta.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL;
      if (targetUrl && targetUrl.trim().startsWith('http')) {
        const response = await fetch(targetUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.status === 'success' && result.folderUrl) {
          setCreatedDriveFolderUrl(result.folderUrl);
        }
      }
    } catch (err) {
      console.warn('Google Drive submission notice:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCopySummary = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="gf-container">
      {/* Title Card */}
      <Header
        completionPercentage={calculateCompletion()}
        onSaveDraft={handleManualSave}
        onResetDraft={handleResetDraft}
        lastSavedTime={lastSavedTime}
      />

      {/* 5TB Google Drive Configuration Button Bar */}
      <div className="mb-4 text-right no-print">
        <button
          type="button"
          onClick={() => setShowDriveConfig(!showDriveConfig)}
          className="gf-btn-secondary text-xs px-3 py-1.5 inline-flex items-center gap-2"
        >
          <span>{driveWebhookUrl ? '5TB Google Drive Connected' : 'Connect 5TB Google Drive Storage'}</span>
          <Settings className="w-3.5 h-3.5 text-purple-700 shrink-0" />
        </button>

        {showDriveConfig && (
          <div className="p-4 bg-white border border-purple-300 rounded-lg shadow-md text-left mt-2 space-y-2 text-xs">
            <div className="font-semibold text-purple-900 flex items-center justify-between">
              <span>Connect 5TB Google Drive Webhook URL</span>
              <button onClick={() => setShowDriveConfig(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <p className="text-slate-600">
              Set <code>VITE_GOOGLE_DRIVE_WEBHOOK_URL</code> in <code>.env.local</code> or paste your Google Apps Script Web App URL below:
            </p>
            <input
              type="url"
              value={driveWebhookUrl}
              onChange={(e) => setDriveWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="gf-underline-input w-full text-xs font-mono"
            />
            <div className="text-[11px] text-slate-500">
              * Environment file created at <code>c:\Form\.env.local</code>
            </div>
          </div>
        )}
      </div>

      {/* Section Step Pills Navigation */}
      <div className="gf-step-pills no-print">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setCurrentSection(sec.id)}
            type="button"
            className={`gf-step-pill ${currentSection === sec.id ? 'active' : ''}`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Confirmation View */}
      {isSubmitted ? (
        <div className="gf-card text-center py-10 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-normal text-slate-800">
            Your response has been recorded.
          </h2>
          <p className="text-xs text-slate-500">
            Thank you for filling out the NexLoop Portfolio Website Requirement Form.
          </p>

          {createdDriveFolderUrl && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg max-w-md mx-auto my-3 text-xs text-purple-900 space-y-2">
              <div className="font-semibold flex items-center justify-center gap-1.5 text-purple-800">
                <HardDrive className="w-4 h-4 text-purple-700" />
                Response Folder Created in 5TB Google Drive
              </div>
              <a
                href={createdDriveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="gf-btn-primary text-xs inline-flex items-center gap-1.5 py-1.5 px-3"
              >
                Open Client Folder in Google Drive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowReviewModal(true)}
              className="gf-btn-primary text-xs"
            >
              View / Download Response
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="gf-btn-secondary text-xs"
            >
              Edit response
            </button>
          </div>
        </div>
      ) : (
        /* Form Content */
        <form onSubmit={handleSubmit}>

          {/* SECTION 1: Basic Information */}
          {currentSection === 1 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 1 of 9: 1. Basic Information</h2>
                <p>Please enter your company contact details.</p>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Company Name <span className="required-star">*</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.basicInfo.companyName}
                  onChange={(e) => updateNestedField('basicInfo', 'companyName', e.target.value)}
                  placeholder="e.g. Apex Architects & Interior Design Pvt. Ltd."
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Contact Person <span className="required-star">*</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.basicInfo.contactPerson}
                  onChange={(e) => updateNestedField('basicInfo', 'contactPerson', e.target.value)}
                  placeholder="e.g. Ar. Rahul Sharma"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Mobile Number <span className="required-star">*</span>
                </div>
                <input
                  type="tel"
                  required
                  value={formData.basicInfo.mobileNumber}
                  onChange={(e) => updateNestedField('basicInfo', 'mobileNumber', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">WhatsApp Number</div>
                <input
                  type="tel"
                  value={formData.basicInfo.whatsAppNumber}
                  onChange={(e) => updateNestedField('basicInfo', 'whatsAppNumber', e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Email Address <span className="required-star">*</span>
                </div>
                <input
                  type="email"
                  required
                  value={formData.basicInfo.email}
                  onChange={(e) => updateNestedField('basicInfo', 'email', e.target.value)}
                  placeholder="e.g. contact@apexarchitects.com"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Office Address</div>
                <textarea
                  value={formData.basicInfo.officeAddress}
                  onChange={(e) => updateNestedField('basicInfo', 'officeAddress', e.target.value)}
                  placeholder="e.g. Suite 402, Apex Business Tower, Bandra West, Mumbai, MH - 400050"
                  className="gf-textarea"
                />
              </div>
            </div>
          )}

          {/* SECTION 2: About Your Company */}
          {currentSection === 2 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 2 of 9: 2. About Your Company</h2>
                <p>Tell us about your company.</p>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Tell us about your company</div>
                <textarea
                  value={formData.aboutCompany.description}
                  onChange={(e) => updateNestedField('aboutCompany', 'description', e.target.value)}
                  placeholder="e.g. Founded in 2012, Apex Architects specializes in high-end luxury residential villas, commercial high-rises, and sustainable green interiors with over 150+ completed turnkey projects..."
                  className="gf-textarea"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Years of Experience</div>
                <input
                  type="text"
                  value={formData.aboutCompany.yearsExperience}
                  onChange={(e) => updateNestedField('aboutCompany', 'yearsExperience', e.target.value)}
                  placeholder="e.g. 12 Years"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Services You Provide <span className="required-star">*</span>
                </div>
                <div className="gf-options-group">
                  {SERVICE_OPTIONS.map((service) => {
                    const isChecked = formData.aboutCompany.services.includes(service);
                    return (
                      <label key={service} className="gf-option-row">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArrayItem('aboutCompany', 'services', service)}
                        />
                        <span>{service}</span>
                      </label>
                    );
                  })}
                </div>

                {formData.aboutCompany.services.includes('Other') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.aboutCompany.otherService}
                      onChange={(e) => updateNestedField('aboutCompany', 'otherService', e.target.value)}
                      placeholder="e.g. 3D Architectural Visualization & VR Walkthroughs"
                      className="gf-underline-input"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: Website Requirements */}
          {currentSection === 3 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 3 of 9: 3. Website Requirements</h2>
                <p>Select the pages and features you want on your website.</p>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Which pages do you want?</div>
                <div className="gf-options-group">
                  {PAGE_OPTIONS.map((page) => {
                    const isChecked = formData.websiteReqs.pages.includes(page);
                    return (
                      <label key={page} className="gf-option-row">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArrayItem('websiteReqs', 'pages', page)}
                        />
                        <span>{page}</span>
                      </label>
                    );
                  })}
                </div>

                {formData.websiteReqs.pages.includes('Other') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.websiteReqs.otherPage}
                      onChange={(e) => updateNestedField('websiteReqs', 'otherPage', e.target.value)}
                      placeholder="e.g. Press & Media, Client Testimonials Page"
                      className="gf-underline-input"
                    />
                  </div>
                )}
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Any special features?</div>
                <div className="gf-options-group">
                  {FEATURE_OPTIONS.map((feat) => {
                    const isChecked = formData.websiteReqs.features.includes(feat);
                    return (
                      <label key={feat} className="gf-option-row">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArrayItem('websiteReqs', 'features', feat)}
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>

                {formData.websiteReqs.features.includes('Other') && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={formData.websiteReqs.otherFeature}
                      onChange={(e) => updateNestedField('websiteReqs', 'otherFeature', e.target.value)}
                      placeholder="e.g. Interactive 360 Villa Viewer, Project Cost Estimator"
                      className="gf-underline-input"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION 4: Featured Projects */}
          {currentSection === 4 && (
            <ProjectSection
              projectCountChoice={formData.projectCountChoice}
              onProjectCountChoiceChange={(val) => setFormData(prev => ({ ...prev, projectCountChoice: val }))}
              projects={formData.projects}
              onProjectsChange={(updatedProjects) => setFormData(prev => ({ ...prev, projects: updatedProjects }))}
            />
          )}

          {/* SECTION 5: Team */}
          {currentSection === 5 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 5 of 9: 5. Team</h2>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Founder Name</div>
                <input
                  type="text"
                  value={formData.team.founderName}
                  onChange={(e) => updateNestedField('team', 'founderName', e.target.value)}
                  placeholder="e.g. Ar. Vikramaditya Rao (Principal Architect & Founder)"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Team Members (Optional)</div>
                <textarea
                  value={formData.team.teamMembers}
                  onChange={(e) => updateNestedField('team', 'teamMembers', e.target.value)}
                  placeholder="e.g. Ar. Neha Verma (Senior Interior Designer), Eng. Suresh Patil (Chief Structural Engineer)"
                  className="gf-textarea"
                />
              </div>
            </div>
          )}

          {/* SECTION 6: Branding */}
          {currentSection === 6 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 6 of 9: 6. Branding</h2>
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Upload Company Logo"
                  accept="image/*,.svg"
                  multiple={false}
                  files={formData.branding.logo}
                  onFilesChange={(filesList) => updateNestedField('branding', 'logo', filesList)}
                  helpText="Attach transparent PNG or SVG logo."
                />
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Company Profile (PDF)"
                  accept="application/pdf,.doc,.docx"
                  multiple={false}
                  files={formData.branding.profilePdf}
                  onFilesChange={(filesList) => updateNestedField('branding', 'profilePdf', filesList)}
                  helpText="Attach company profile PDF document."
                />
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Brochure (Optional)"
                  accept="application/pdf"
                  multiple={false}
                  files={formData.branding.brochurePdf}
                  onFilesChange={(filesList) => updateNestedField('branding', 'brochurePdf', filesList)}
                  helpText="Attach company brochure PDF."
                />
              </div>
            </div>
          )}

          {/* SECTION 7: Assets */}
          {currentSection === 7 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 7 of 9: 7. Assets</h2>
                <p>Upload if available: Project Photos, Team Photos, Office Photos, Client Testimonials, Certificates.</p>
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Asset Files & Photos"
                  files={formData.assets.files}
                  onFilesChange={(filesList) => updateNestedField('assets', 'files', filesList)}
                  driveLink={formData.assets.driveLink}
                  onDriveLinkChange={(url) => updateNestedField('assets', 'driveLink', url)}
                  helpText="Upload media files or provide Google Drive folder link below."
                />
              </div>
            </div>
          )}

          {/* SECTION 8: Contact Details */}
          {currentSection === 8 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 8 of 9: 8. Contact Details</h2>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Phone Number</div>
                <input
                  type="text"
                  value={formData.contactDetails.phone}
                  onChange={(e) => updateNestedField('contactDetails', 'phone', e.target.value)}
                  placeholder="e.g. +91 98765 43210 / +91 22 6789 0000"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Email</div>
                <input
                  type="email"
                  value={formData.contactDetails.email}
                  onChange={(e) => updateNestedField('contactDetails', 'email', e.target.value)}
                  placeholder="e.g. info@apexarchitects.com"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Google Maps Link</div>
                <input
                  type="url"
                  value={formData.contactDetails.googleMaps}
                  onChange={(e) => updateNestedField('contactDetails', 'googleMaps', e.target.value)}
                  placeholder="e.g. https://maps.google.com/?q=Apex+Architects+Mumbai"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Facebook</div>
                <input
                  type="text"
                  value={formData.contactDetails.facebook}
                  onChange={(e) => updateNestedField('contactDetails', 'facebook', e.target.value)}
                  placeholder="e.g. https://facebook.com/apexarchitects"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Instagram</div>
                <input
                  type="text"
                  value={formData.contactDetails.instagram}
                  onChange={(e) => updateNestedField('contactDetails', 'instagram', e.target.value)}
                  placeholder="e.g. https://instagram.com/apex.architects"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">LinkedIn</div>
                <input
                  type="text"
                  value={formData.contactDetails.linkedin}
                  onChange={(e) => updateNestedField('contactDetails', 'linkedin', e.target.value)}
                  placeholder="e.g. https://linkedin.com/company/apex-architects"
                  className="gf-underline-input"
                />
              </div>
            </div>
          )}

          {/* SECTION 9: Anything Else? */}
          {currentSection === 9 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 9 of 9: 9. Anything Else?</h2>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Additional Comments / Notes</div>
                <textarea
                  value={formData.anythingElse}
                  onChange={(e) => setFormData(prev => ({ ...prev, anythingElse: e.target.value }))}
                  placeholder="e.g. Prefer clean dark/gold color palette for the website. Please include a 3D model viewer on the projects showcase page."
                  className="gf-textarea"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls Footer */}
          <div className="gf-footer-nav">
            <div className="flex items-center gap-2">
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
                  className="gf-btn-secondary text-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}

              {currentSection < SECTIONS.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentSection(prev => Math.min(SECTIONS.length, prev + 1))}
                  className="gf-btn-primary text-xs"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gf-btn-primary text-xs"
                >
                  <Send className="w-4 h-4" /> {isSubmitting ? 'Uploading to 5TB Drive...' : 'Submit'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="gf-btn-secondary text-xs"
              >
                <Eye className="w-3.5 h-3.5" /> Review
              </button>
              <button
                type="button"
                onClick={handleResetDraft}
                className="gf-btn-text text-slate-500 hover:text-slate-700 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear form
              </button>
            </div>
          </div>

        </form>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          formData={formData}
          onClose={() => setShowReviewModal(false)}
          onCopyPrompt={handleCopySummary}
          copied={copied}
        />
      )}
    </div>
  );
}
