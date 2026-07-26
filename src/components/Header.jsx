import React from 'react';
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react';

export function Header({ completionPercentage, onSaveDraft, onResetDraft, lastSavedTime, isSubmitted = false }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Google Banner Image Graphic */}
      <div className="gf-banner"></div>

      {/* Main Form Title Card */}
      <div className="gf-card gf-title-card">
        <h1 style={{ fontSize: '26px', fontWeight: 400, color: '#202124', lineHeight: 1.3, marginBottom: '8px' }}>
          NexLoop Portfolio Website Requirement Form
        </h1>
        
        <p style={{ fontSize: '14px', color: '#5f6368', lineHeight: 1.5, marginBottom: '16px' }}>
          Welcome! Thank you for choosing <strong>NexLoop</strong>.<br />
          Please fill out this short form. It takes only 10–15 minutes and helps us build your website.
        </p>

        {/* Toolbar row with explicit inline flex & vertical centering */}
        {!isSubmitted && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '14px',
            borderTop: '1px solid #dadce0',
            fontSize: '12px'
          }}>
            <span style={{ color: '#d93025', fontWeight: 500 }}>* Indicates required question</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="no-print">
              {lastSavedTime && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#137333',
                  backgroundColor: '#e6f4ea',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ceead6',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: 1
                }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                  <span style={{ display: 'inline-block', lineHeight: '15px' }}>Saved {lastSavedTime}</span>
                </span>
              )}

              <button
                onClick={onSaveDraft}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#673ab7',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}
              >
                <Save style={{ width: '15px', height: '15px' }} />
                <span>Save</span>
              </button>

              <button
                onClick={onResetDraft}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#d93025',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}
              >
                <RotateCcw style={{ width: '15px', height: '15px' }} />
                <span>Clear form</span>
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar Container with explicit spacing */}
        {!isSubmitted && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f3f4' }} className="no-print">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#5f6368',
              marginBottom: '6px',
              fontWeight: 500
            }}>
              <span>Form Progress</span>
              <span style={{ fontWeight: 700, color: '#673ab7' }}>{completionPercentage}%</span>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: '#e8eaed', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${completionPercentage}%`,
                height: '100%',
                backgroundColor: '#673ab7',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
