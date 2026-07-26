import React, { useState, useRef } from 'react';
import { Upload, File, Film, Image as ImageIcon, Trash2, Eye, X, Loader2 } from 'lucide-react';

export function MediaUploadZone({
  label,
  description,
  accept = "image/*,video/*,audio/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip,application/x-zip-compressed,application/x-rar-compressed,text/plain,.dwg,.dxf,.rvt,.skp,.obj,.fbx,.psd,.ai,.fig",
  files = [],
  onFilesChange,
  driveLink = "",
  onDriveLinkChange,
  multiple = true,
  helpText = "Upload images, videos, audio, PDF, office documents, CAD/3D designs, or ZIP archives.",
  webhookUrl = ""
}) {
  const [activeMediaPreview, setActiveMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const uploadFileToDrive = async (file, base64, targetUrl, onProgress) => {
    // Simulate upload progress over time since upload listeners trigger CORS preflights
    let progress = 10;
    const progressInterval = setInterval(() => {
      progress = Math.min(90, progress + 10);
      onProgress(progress);
    }, 300);

    try {
      const response = await fetch(targetUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: "uploadFile",
          file: {
            name: file.name,
            base64: base64
          }
        })
      });

      clearInterval(progressInterval);

      if (response.status >= 200 && response.status < 300) {
        const text = await response.text();
        try {
          const res = JSON.parse(text);
          if (res.status === 'success') {
            onProgress(100);
            return res;
          } else {
            throw new Error(res.message || 'Apps Script error');
          }
        } catch (e) {
          throw new Error('Invalid JSON response');
        }
      } else {
        throw new Error(`Server status ${response.status}`);
      }
    } catch (err) {
      clearInterval(progressInterval);
      throw err;
    }
  };

  const processFiles = async (newFilesList) => {
    const formatted = [];
    
    for (let i = 0; i < newFilesList.length; i++) {
      const file = newFilesList[i];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';
      const previewUrl = URL.createObjectURL(file);
      
      setUploadProgress({
        current: i + 1,
        total: newFilesList.length,
        filename: file.name,
        percentage: 5
      });
      
      const base64 = await readFileAsBase64(file);
      
      let driveFileId = null;
      let driveFileUrl = null;
      
      if (webhookUrl && webhookUrl.trim().startsWith('http')) {
        console.log(`🚀 Attempting immediate upload of ${file.name} to Drive...`);
        try {
          setUploadProgress({
            current: i + 1,
            total: newFilesList.length,
            filename: file.name,
            percentage: 10
          });
          
          const uploadResult = await uploadFileToDrive(file, base64, webhookUrl, (percent) => {
            setUploadProgress({
              current: i + 1,
              total: newFilesList.length,
              filename: file.name,
              // Map percentage to 10% - 95% range
              percentage: 10 + Math.round(percent * 0.85)
            });
          });
          
          driveFileId = uploadResult.fileId;
          driveFileUrl = uploadResult.fileUrl;
          console.log(`✅ Immediate upload succeeded for ${file.name}. File ID: ${driveFileId}`);
          
          setUploadProgress({
            current: i + 1,
            total: newFilesList.length,
            filename: file.name,
            percentage: 100
          });
        } catch (uploadErr) {
          console.warn(`⚠️ Immediate Drive upload failed for ${file.name}, will fallback to submit-time upload:`, uploadErr);
        }
      } else {
        console.warn(`⚠️ Immediate upload skipped for ${file.name} (Webhook URL is not configured or invalid).`);
      }
      
      formatted.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: isImage ? 'image' : isVideo ? 'video' : isPdf ? 'pdf' : 'doc',
        previewUrl,
        base64,
        driveFileId,
        driveFileUrl
      });
    }

    setUploadProgress(null);

    if (multiple) {
      onFilesChange([...files, ...formatted]);
    } else {
      onFilesChange(formatted);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  return (
    <div className="w-full">
      {/* Question Title & Description */}
      {label && <div className="gf-q-title text-base font-normal text-slate-900 mb-1">{label}</div>}
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      {helpText && <p className="text-xs text-slate-500 mb-3">{helpText}</p>}

      {/* Google Forms "Add file" Button */}
      <div className="my-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="gf-file-btn"
        >
          <Upload className="w-4 h-4 text-purple-700 inline-block mr-1.5" />
          <span>Add file</span>
        </button>
      </div>

      {/* Animated File Processing Progress Bar */}
      {uploadProgress && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-xs space-y-2.5 my-3">
          <div className="flex items-center justify-between text-purple-900 font-medium">
            <span className="flex items-center gap-2 truncate">
              <Loader2 className="w-4 h-4 text-purple-700 animate-spin shrink-0" />
              Processing & preparing {uploadProgress.filename}...
            </span>
            <span className="shrink-0 font-semibold">{uploadProgress.percentage}%</span>
          </div>
          <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all duration-200"
              style={{ width: `${uploadProgress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="space-y-2.5 my-3 w-full">
          {files.map((f) => (
            <div key={f.id} className="gf-file-box">
              <div className="gf-file-info">
                {/* Purple Icon Badge */}
                <div className="gf-file-icon-badge">
                  {f.type === 'image' && <ImageIcon className="w-5 h-5" />}
                  {f.type === 'video' && <Film className="w-5 h-5 text-indigo-700" />}
                  {(f.type === 'pdf' || f.type === 'doc') && <File className="w-5 h-5 text-blue-700" />}
                </div>

                {/* File Title */}
                <span className="gf-file-name">{f.name}</span>

                {/* Size Badge */}
                <span className="gf-file-size">({f.size})</span>
              </div>

              {/* Action Buttons */}
              <div className="gf-file-actions">
                {(f.type === 'image' || f.type === 'video') && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaPreview(f)}
                    className="gf-action-btn"
                    title="Preview media file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="gf-action-btn danger"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Google Drive / Cloud Link Input Section */}
      {onDriveLinkChange !== undefined && (
        <div className="mt-8 pt-5 border-t border-slate-200 w-full space-y-2">
          <div className="text-sm font-normal text-slate-900">
            Google Drive / Cloud Folder Link (Optional - Unlimited File Size)
          </div>
          <p className="text-xs text-slate-500">
            Uploading large raw videos or high-res CAD/3D files? Paste your Google Drive folder link below.
          </p>
          <input
            type="url"
            value={driveLink}
            onChange={(e) => onDriveLinkChange(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="gf-underline-input w-full text-sm mt-2"
          />
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {activeMediaPreview && (
        <div className="gf-modal-overlay" onClick={() => setActiveMediaPreview(null)}>
          <div className="gf-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <span className="font-medium text-slate-800 text-sm truncate">{activeMediaPreview.name}</span>
              <button
                type="button"
                onClick={() => setActiveMediaPreview(null)}
                className="gf-action-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center bg-slate-900 rounded overflow-hidden max-h-[60vh]">
              {activeMediaPreview.type === 'image' && (
                <img
                  src={activeMediaPreview.previewUrl}
                  alt={activeMediaPreview.name}
                  className="max-h-[60vh] object-contain"
                />
              )}
              {activeMediaPreview.type === 'video' && (
                <video
                  src={activeMediaPreview.previewUrl}
                  controls
                  autoPlay
                  className="max-h-[60vh] w-full"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
