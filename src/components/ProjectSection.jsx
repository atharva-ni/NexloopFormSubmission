import React, { useState } from 'react';
import { Plus, X, Info } from 'lucide-react';
import { MediaUploadZone } from './MediaUploadZone';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Villa',
  'Apartment',
  'Industrial',
  'Other'
];

export function ProjectSection({
  projectCountChoice,
  onProjectCountChoiceChange,
  projects,
  onProjectsChange,
  driveWebhookUrl = ""
}) {
  const [activeProjectTab, setActiveProjectTab] = useState(0);

  const handleDropdownCountChange = (value) => {
    onProjectCountChoiceChange(value);
    let targetNum = 5;
    if (value === '5') targetNum = 5;
    else if (value === '10') targetNum = 10;
    else if (value === '15') targetNum = 15;
    else if (value === '20') targetNum = 20;
    else if (value === '1') targetNum = 1;
    else if (value === '2') targetNum = 2;
    else if (value === '3') targetNum = 3;
    else if (value === 'All') targetNum = 10;

    adjustProjectsArray(targetNum);
  };

  const adjustProjectsArray = (targetCount) => {
    let updated = [...projects];
    if (updated.length < targetCount) {
      for (let i = updated.length; i < targetCount; i++) {
        updated.push(createNewProjectObject(i + 1));
      }
    } else if (updated.length > targetCount) {
      updated = updated.slice(0, targetCount);
    }
    onProjectsChange(updated);
    if (activeProjectTab >= targetCount) {
      setActiveProjectTab(Math.max(0, targetCount - 1));
    }
  };

  const createNewProjectObject = (indexNum) => ({
    id: Math.random().toString(36).substring(2, 9),
    name: `Project ${indexNum}`,
    location: '',
    type: 'Residential',
    customType: '',
    status: 'Completed',
    yearCompleted: '',
    description: '',
    servicesProvided: '',
    photos: [],
    driveLink: ''
  });

  const addSingleProject = () => {
    const updated = [...projects, createNewProjectObject(projects.length + 1)];
    onProjectsChange(updated);
    setActiveProjectTab(updated.length - 1);
  };

  const removeProjectTab = (index, e) => {
    e.stopPropagation();
    if (projects.length <= 1) return;
    const updated = projects.filter((_, i) => i !== index);
    onProjectsChange(updated);
    if (activeProjectTab >= updated.length) {
      setActiveProjectTab(updated.length - 1);
    }
  };

  const updateCurrentProjectField = (field, value) => {
    const updated = [...projects];
    updated[activeProjectTab] = {
      ...updated[activeProjectTab],
      [field]: value
    };
    onProjectsChange(updated);
  };

  const currentProject = projects[activeProjectTab] || createNewProjectObject(1);

  return (
    <div className="space-y-3">
      {/* Section 4 Header Banner Card */}
      <div className="gf-section-header">
        <h2>Section 4 of 7: 4. Featured Projects</h2>
        <p>Specify details for each project you wish to showcase.</p>
      </div>

      {/* Question Card: Showcase Count */}
      <div className="gf-q-card">
        <div className="gf-q-title">
          Approximately how many projects do you want to showcase?
        </div>
        <select
          value={projectCountChoice}
          onChange={(e) => handleDropdownCountChange(e.target.value)}
          className="gf-select mt-2"
        >
          <option value="1">1 Project</option>
          <option value="2">2 Projects</option>
          <option value="3">3 Projects</option>
          <option value="5">5 Projects</option>
          <option value="10">10 Projects</option>
          <option value="15">15 Projects</option>
          <option value="20">20 Projects</option>
          <option value="All">All Projects</option>
        </select>
      </div>

      {/* Project Selector Tab Bar */}
      <div className="gf-q-card">
        <div className="gf-q-title mb-2">
          Select Project to Edit ({activeProjectTab + 1} of {projects.length})
        </div>

        {/* Visual Instruction Callout Box */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-950 mb-3.5 flex items-start gap-2">
          <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-purple-900">Important Instruction: </span> 
            Please click on each project tab below (e.g. <b>Project 1</b>, <b>Project 2</b>, etc.) to enter details and upload photos for every project.
          </div>
        </div>

        <div className="gf-tab-bar mb-0 border-b-0 pb-0">
          {projects.map((proj, idx) => {
            const isActive = activeProjectTab === idx;
            return (
              <div
                key={proj.id || idx}
                onClick={() => setActiveProjectTab(idx)}
                className={`gf-tab ${isActive ? 'active' : ''}`}
              >
                <span>{proj.name || `Project ${idx + 1}`}</span>
                {projects.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => removeProjectTab(idx, e)}
                    className="gf-tab-close-btn"
                    title="Remove project"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Project Inline Tab Button */}
          <button
            type="button"
            onClick={addSingleProject}
            className="gf-tab bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Individual Question Cards for Current Selected Project */}
      {/* 1. Project Name */}
      <div className="gf-q-card">
        <div className="gf-q-title">
          Project Name <span className="required-star">*</span>
        </div>
        <input
          type="text"
          value={currentProject.name}
          onChange={(e) => updateCurrentProjectField('name', e.target.value)}
          placeholder="e.g. Skyline Luxury Villa / Apex Business Park"
          className="gf-underline-input"
        />
      </div>

      {/* 2. Location */}
      <div className="gf-q-card">
        <div className="gf-q-title">
          Location <span className="required-star">*</span>
        </div>
        <input
          type="text"
          value={currentProject.location}
          onChange={(e) => updateCurrentProjectField('location', e.target.value)}
          placeholder="e.g. Mumbai, Maharashtra"
          className="gf-underline-input"
        />
      </div>

      {/* 3. Project Type */}
      <div className="gf-q-card">
        <div className="gf-q-title">Project Type</div>
        <select
          value={currentProject.type}
          onChange={(e) => updateCurrentProjectField('type', e.target.value)}
          className="gf-select mt-2"
        >
          {PROJECT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {currentProject.type === 'Other' && (
          <div className="mt-3">
            <input
              type="text"
              value={currentProject.customType || ''}
              onChange={(e) => updateCurrentProjectField('customType', e.target.value)}
              placeholder="e.g. Heritage Renovation / Mixed-Use Complex"
              className="gf-underline-input"
            />
          </div>
        )}
      </div>

      {/* 4. Project Status */}
      <div className="gf-q-card">
        <div className="gf-q-title">Project Status</div>
        <div className="gf-options-group">
          <label className="gf-option-row">
            <input
              type="radio"
              name={`status-${activeProjectTab}`}
              value="Completed"
              checked={currentProject.status === 'Completed'}
              onChange={(e) => updateCurrentProjectField('status', e.target.value)}
            />
            <span>Completed</span>
          </label>
          <label className="gf-option-row">
            <input
              type="radio"
              name={`status-${activeProjectTab}`}
              value="Ongoing"
              checked={currentProject.status === 'Ongoing'}
              onChange={(e) => updateCurrentProjectField('status', e.target.value)}
            />
            <span>Ongoing</span>
          </label>
        </div>
      </div>

      {/* 5. Year Completed */}
      <div className="gf-q-card">
        <div className="gf-q-title">Year Completed</div>
        <input
          type="text"
          value={currentProject.yearCompleted}
          onChange={(e) => updateCurrentProjectField('yearCompleted', e.target.value)}
          placeholder="e.g. 2024"
          className="gf-underline-input"
        />
      </div>

      {/* 6. Short Description */}
      <div className="gf-q-card">
        <div className="gf-q-title">Short Description</div>
        <textarea
          value={currentProject.description}
          onChange={(e) => updateCurrentProjectField('description', e.target.value)}
          placeholder="e.g. Modern 4-bedroom luxury villa featuring sustainable green architecture, infinity pool, and custom interior woodwork..."
          className="gf-textarea"
        />
      </div>

      {/* 7. Services Provided */}
      <div className="gf-q-card">
        <div className="gf-q-title">Services Provided</div>
        <textarea
          value={currentProject.servicesProvided}
          onChange={(e) => updateCurrentProjectField('servicesProvided', e.target.value)}
          placeholder="e.g. Architectural Planning, Interior Execution, Landscape Design, Structural Supervision"
          className="gf-textarea"
          rows={2}
        />
      </div>

      {/* 8. Project Photos */}
      <div className="gf-q-card">
        <MediaUploadZone
          label={`Project Photos (${currentProject.name || 'Project ' + (activeProjectTab + 1)})`}
          files={currentProject.photos || []}
          onFilesChange={(filesList) => updateCurrentProjectField('photos', filesList)}
          driveLink={currentProject.driveLink || ''}
          onDriveLinkChange={(url) => updateCurrentProjectField('driveLink', url)}
          helpText="Upload site photos, renders, videos or paste Google Drive folder link below."
          webhookUrl={driveWebhookUrl}
        />
      </div>
    </div>
  );
}
