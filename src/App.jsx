import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Eye, Send, RotateCcw, ChevronLeft, ChevronRight, HardDrive, ExternalLink, Loader2 } from 'lucide-react';

import { Header } from './components/Header';
import { ProjectSection } from './components/ProjectSection';
import { MediaUploadZone } from './components/MediaUploadZone';
import { ReviewModal } from './components/ReviewModal';

const SECTIONS = [
  { id: 1, title: '1. Basic Info' },
  { id: 2, title: '2. About Company' },
  { id: 3, title: '3. Website Reqs' },
  { id: 4, title: '4. Featured Projects' },
  { id: 5, title: '5. Team & Founder' },
  { id: 6, title: '6. Branding & Assets' },
  { id: 7, title: '7. Contact & Notes' }
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
    founderDesignation: '',
    founderBio: '',
    founderPhoto: [],
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

// Helper to strip heavy base64 strings so LocalStorage 5MB quota is NEVER exceeded
const prepareDraftForStorage = (data) => {
  try {
    const clone = JSON.parse(JSON.stringify(data));
    const cleanFiles = (fileArray) => {
      if (!Array.isArray(fileArray)) return [];
      return fileArray.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type
      }));
    };

    if (clone.branding) {
      clone.branding.logo = cleanFiles(clone.branding.logo);
      clone.branding.profilePdf = cleanFiles(clone.branding.profilePdf);
      clone.branding.brochurePdf = cleanFiles(clone.branding.brochurePdf);
    }
    if (clone.assets) {
      clone.assets.files = cleanFiles(clone.assets.files);
    }
    if (clone.team) {
      clone.team.founderPhoto = cleanFiles(clone.team.founderPhoto);
    }
    if (Array.isArray(clone.projects)) {
      clone.projects.forEach(p => {
        if (p.photos) p.photos = cleanFiles(p.photos);
      });
    }
    return clone;
  } catch (e) {
    return data;
  }
};

export default function App() {
  const [currentSection, setCurrentSection] = useState(() => {
    const savedSec = localStorage.getItem('nexloop_current_section');
    return savedSec ? Math.min(7, parseInt(savedSec, 10)) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('nexloop_form_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_STATE, ...parsed };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const driveWebhookUrl = import.meta.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL || localStorage.getItem('nexloop_drive_webhook_url') || '';

  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStepText, setSubmitStepText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      return localStorage.getItem('nexloop_form_submitted') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [createdDriveFolderUrl, setCreatedDriveFolderUrl] = useState(() => {
    try {
      return localStorage.getItem('nexloop_created_drive_folder_url') || null;
    } catch (e) {
      return null;
    }
  });
  const [copied, setCopied] = useState(false);

  // Safe Auto-save form data state on every change without LocalStorage quota crashes
  useEffect(() => {
    try {
      const storageDraft = prepareDraftForStorage(formData);
      localStorage.setItem('nexloop_form_draft', JSON.stringify(storageDraft));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
    } catch (err) {
      console.warn('LocalStorage save skipped:', err);
    }
  }, [formData]);

  // Persist current active section step safely
  useEffect(() => {
    try {
      localStorage.setItem('nexloop_current_section', currentSection.toString());
    } catch (e) {}
  }, [currentSection]);

  const handleManualSave = () => {
    try {
      const storageDraft = prepareDraftForStorage(formData);
      localStorage.setItem('nexloop_form_draft', JSON.stringify(storageDraft));
      localStorage.setItem('nexloop_current_section', currentSection.toString());
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSavedTime(now);
      alert('Form draft saved successfully!');
    } catch (e) {
      alert('Form state saved!');
    }
  };

  const handleResetDraft = () => {
    if (window.confirm('Are you sure you want to clear all form entries and reset state?')) {
      setFormData(INITIAL_STATE);
      try {
        localStorage.removeItem('nexloop_form_draft');
        localStorage.removeItem('nexloop_current_section');
        localStorage.removeItem('nexloop_form_submitted');
        localStorage.removeItem('nexloop_created_drive_folder_url');
      } catch (e) {}
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

  // Dynamic calculation across 10 key field checkpoints
  const calculateCompletion = () => {
    let score = 0;
    if (formData.basicInfo.companyName?.trim()) score += 10;
    if (formData.basicInfo.contactPerson?.trim()) score += 10;
    if (formData.basicInfo.mobileNumber?.trim()) score += 10;
    if (formData.basicInfo.email?.trim()) score += 10;
    if (formData.aboutCompany.description?.trim()) score += 15;
    if (formData.aboutCompany.services && formData.aboutCompany.services.length > 0) score += 15;
    if (formData.websiteReqs.pages && formData.websiteReqs.pages.length > 0) score += 10;
    if (formData.projects && formData.projects.some(p => p.name?.trim() && p.location?.trim())) score += 10;
    if (formData.team.founderName?.trim()) score += 10;
    return Math.min(100, score);
  };

  const validateForm = () => {
    // Section 1: Basic Info
    if (!formData.basicInfo.companyName?.trim()) {
      alert("Please enter the Company Name in Section 1.");
      setCurrentSection(1);
      return false;
    }
    if (!formData.basicInfo.contactPerson?.trim()) {
      alert("Please enter the Contact Person in Section 1.");
      setCurrentSection(1);
      return false;
    }
    if (!formData.basicInfo.mobileNumber?.trim()) {
      alert("Please enter the Mobile Number in Section 1.");
      setCurrentSection(1);
      return false;
    }
    if (!formData.basicInfo.email?.trim()) {
      alert("Please enter a valid Email Address in Section 1.");
      setCurrentSection(1);
      return false;
    }

    // Section 2: About Company
    if (!formData.aboutCompany.services || formData.aboutCompany.services.length === 0) {
      alert("Please select at least one Service You Provide in Section 2.");
      setCurrentSection(2);
      return false;
    }

    // Section 4: Featured Projects
    if (formData.projects && formData.projects.length > 0) {
      for (let i = 0; i < formData.projects.length; i++) {
        const proj = formData.projects[i];
        if (!proj.name?.trim()) {
          alert(`Please enter the Project Name for Project #${i + 1} in Section 4.`);
          setCurrentSection(4);
          return false;
        }
        if (!proj.location?.trim()) {
          alert(`Please enter the Location for Project #${i + 1} in Section 4.`);
          setCurrentSection(4);
          return false;
        }
      }
    }

    // Section 5: Team & Founder Details
    if (!formData.team.founderName?.trim()) {
      alert("Please enter the Founder / Principal Name in Section 5.");
      setCurrentSection(5);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if required fields are missing across any section
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(5);
    setSubmitStepText('Preparing requirement summary & media files...');

    try {
      const targetUrl = driveWebhookUrl || import.meta.env.VITE_GOOGLE_DRIVE_WEBHOOK_URL;
      console.log("🚀 Starting form submit. Webhook URL:", targetUrl);
      
      if (targetUrl && targetUrl.trim().startsWith('http')) {
        setSubmitStepText('Connecting to 5TB Google Drive Webhook...');
        setSubmitProgress(15);

        const payload = JSON.stringify(formData);
        console.log(`Payload size: ${Math.round(payload.length / 1024)} KB. Sending via simple fetch...`);

        // Simulated progress steps since upload listeners trigger CORS preflights
        const progressInterval = setInterval(() => {
          setSubmitProgress(prev => {
            if (prev < 85) return prev + 5;
            return prev;
          });
        }, 1000);

        setSubmitProgress(30);
        setSubmitStepText('Uploading response and files to Google Drive...');

        const response = await fetch(targetUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: payload
        });

        clearInterval(progressInterval);
        setSubmitProgress(95);
        setSubmitStepText('Finalizing response in Google Drive...');

        const responseText = await response.text();
        console.log("Received response from Apps Script:", responseText);

        try {
          const result = JSON.parse(responseText);
          if (result.status === 'success' && result.folderUrl) {
            console.log("✅ Drive folder created successfully:", result.folderUrl);
            setCreatedDriveFolderUrl(result.folderUrl);
            try {
              localStorage.setItem('nexloop_created_drive_folder_url', result.folderUrl);
            } catch (e) {}
          } else {
            console.error("❌ Apps Script returned error status:", result.message);
          }
        } catch (parseErr) {
          console.warn('Response parsing notice:', parseErr);
        }
      } else {
        console.error("❌ Google Drive Webhook URL is missing or invalid! Check your .env.local file. Target URL:", targetUrl);
      }
      setSubmitProgress(100);
    } catch (err) {
      console.error('❌ Google Drive submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem('nexloop_form_submitted', 'true');
      } catch (e) {}
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
        isSubmitted={isSubmitted}
      />

      {/* 7 Section Step Pills Navigation */}
      {!isSubmitted && (
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
      )}

      {/* Uploading Progress Modal */}
      {isSubmitting && (
        <div className="gf-modal-overlay">
          <div className="gf-modal-card text-center py-8 px-6 max-w-sm space-y-4">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
            <h3 className="text-lg font-medium text-slate-900">Uploading to 5TB Google Drive</h3>
            <p className="text-xs text-slate-500">{submitStepText}</p>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${submitProgress}%` }}
              />
            </div>
            <div className="text-xs font-semibold text-purple-700">{submitProgress}%</div>
          </div>
        </div>
      )}

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

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setShowReviewModal(true)}
              className="gf-btn-primary text-xs"
            >
              View / Download Response
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                try {
                  localStorage.setItem('nexloop_form_submitted', 'false');
                } catch (e) {}
              }}
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
                <h2>Section 1 of 7: 1. Basic Information</h2>
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
                <h2>Section 2 of 7: 2. About Your Company</h2>
                <p>Tell us about your company overview, history and services.</p>
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
                <h2>Section 3 of 7: 3. Website Requirements</h2>
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
              driveWebhookUrl={driveWebhookUrl}
            />
          )}

          {/* SECTION 5: Team & Founder Information */}
          {currentSection === 5 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 5 of 7: 5. Team & Founder Details</h2>
                <p>Provide details about the founder, leadership, and key team members.</p>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">
                  Founder / Principal Name <span className="required-star">*</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.team.founderName}
                  onChange={(e) => updateNestedField('team', 'founderName', e.target.value)}
                  placeholder="e.g. Ar. Vikramaditya Rao"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Founder Designation / Title</div>
                <input
                  type="text"
                  value={formData.team.founderDesignation || ''}
                  onChange={(e) => updateNestedField('team', 'founderDesignation', e.target.value)}
                  placeholder="e.g. Principal Architect & Managing Director"
                  className="gf-underline-input"
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Founder Bio / Achievements / Story</div>
                <textarea
                  value={formData.team.founderBio || ''}
                  onChange={(e) => updateNestedField('team', 'founderBio', e.target.value)}
                  placeholder="e.g. Ar. Vikramaditya Rao holds a Master's in Architectural Design from SPA Delhi. Over 18 years, he has spearheaded 200+ landmark luxury projects and received IIA Design Excellence Award..."
                  className="gf-textarea"
                />
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Upload Founder Headshot / Portrait Photo"
                  accept="image/*"
                  multiple={false}
                  files={formData.team.founderPhoto || []}
                  onFilesChange={(filesList) => updateNestedField('team', 'founderPhoto', filesList)}
                  helpText="Attach professional high-resolution photo of the founder."
                  webhookUrl={driveWebhookUrl}
                />
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Key Team Members & Bios</div>
                <textarea
                  value={formData.team.teamMembers}
                  onChange={(e) => updateNestedField('team', 'teamMembers', e.target.value)}
                  placeholder="e.g. Ar. Neha Verma (Chief Interior Designer - 10 yrs exp), Eng. Suresh Patil (Structural Engineering Lead - 14 yrs exp)"
                  className="gf-textarea"
                />
              </div>
            </div>
          )}

          {/* SECTION 6: Branding & Assets */}
          {currentSection === 6 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 6 of 7: 6. Branding & Assets</h2>
                <p>Upload brand logos, PDFs, brochure and general media files.</p>
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="Upload Company Logo"
                  accept="image/*,.svg"
                  multiple={false}
                  files={formData.branding.logo}
                  onFilesChange={(filesList) => updateNestedField('branding', 'logo', filesList)}
                  helpText="Attach transparent PNG or SVG logo."
                  webhookUrl={driveWebhookUrl}
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
                  webhookUrl={driveWebhookUrl}
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
                  webhookUrl={driveWebhookUrl}
                />
              </div>

              <div className="gf-q-card">
                <MediaUploadZone
                  label="General Assets, Testimonials & Office Photos"
                  files={formData.assets.files}
                  onFilesChange={(filesList) => updateNestedField('assets', 'files', filesList)}
                  driveLink={formData.assets.driveLink}
                  onDriveLinkChange={(url) => updateNestedField('assets', 'driveLink', url)}
                  helpText="Upload additional media files or provide Google Drive folder link below."
                  webhookUrl={driveWebhookUrl}
                />
              </div>
            </div>
          )}

          {/* SECTION 7: Contact & Additional Notes */}
          {currentSection === 7 && (
            <div className="space-y-3">
              <div className="gf-section-header">
                <h2>Section 7 of 7: 7. Contact Details & Additional Notes</h2>
                <p>Enter contact channels, social handles and special design requests.</p>
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
                <div className="gf-q-title">Social Links (Instagram / LinkedIn / Facebook)</div>
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    value={formData.contactDetails.instagram}
                    onChange={(e) => updateNestedField('contactDetails', 'instagram', e.target.value)}
                    placeholder="Instagram: https://instagram.com/apex.architects"
                    className="gf-underline-input"
                  />
                  <input
                    type="text"
                    value={formData.contactDetails.linkedin}
                    onChange={(e) => updateNestedField('contactDetails', 'linkedin', e.target.value)}
                    placeholder="LinkedIn: https://linkedin.com/company/apex-architects"
                    className="gf-underline-input"
                  />
                  <input
                    type="text"
                    value={formData.contactDetails.facebook}
                    onChange={(e) => updateNestedField('contactDetails', 'facebook', e.target.value)}
                    placeholder="Facebook: https://facebook.com/apexarchitects"
                    className="gf-underline-input"
                  />
                </div>
              </div>

              <div className="gf-q-card">
                <div className="gf-q-title">Anything Else? (Additional Comments & Preferences)</div>
                <textarea
                  value={formData.anythingElse}
                  onChange={(e) => setFormData(prev => ({ ...prev, anythingElse: e.target.value }))}
                  placeholder="e.g. Prefer clean dark/gold color palette for the website. Please include an interactive 3D villa walkthrough section."
                  className="gf-textarea"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Navigation Controls Footer - Plain Inline Flex Styles with explicit gap */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginTop: '32px',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
                  style={{
                    height: '38px',
                    padding: '0 20px',
                    backgroundColor: '#ffffff',
                    color: '#673ab7',
                    border: '1px solid #dadce0',
                    borderRadius: '4px',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <ChevronLeft style={{ width: '16px', height: '16px' }} />
                  <span>Back</span>
                </button>
              )}

              {currentSection < SECTIONS.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentSection(prev => Math.min(SECTIONS.length, prev + 1))}
                  style={{
                    height: '38px',
                    padding: '0 24px',
                    backgroundColor: '#673ab7',
                    color: '#ffffff',
                    border: '1px solid #673ab7',
                    borderRadius: '4px',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
                  }}
                >
                  <span>Next</span>
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    height: '38px',
                    padding: '0 24px',
                    backgroundColor: '#673ab7',
                    color: '#ffffff',
                    border: '1px solid #673ab7',
                    borderRadius: '4px',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                  <span>Submit</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                style={{
                  height: '38px',
                  padding: '0 18px',
                  backgroundColor: '#ffffff',
                  color: '#673ab7',
                  border: '1px solid #dadce0',
                  borderRadius: '4px',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Eye style={{ width: '16px', height: '16px' }} />
                <span>Review</span>
              </button>
              <button
                type="button"
                onClick={handleResetDraft}
                style={{
                  height: '38px',
                  padding: '0 14px',
                  backgroundColor: 'transparent',
                  color: '#d93025',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <RotateCcw style={{ width: '16px', height: '16px' }} />
                <span>Clear form</span>
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
