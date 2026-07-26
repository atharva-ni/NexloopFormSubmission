import React, { useState, useRef } from 'react';
import { Upload, File, Film, Image as ImageIcon, Trash2, Eye, X } from 'lucide-react';

export function MediaUploadZone({
  label,
  description,
  accept = "image/*,video/*,application/pdf",
  files = [],
  onFilesChange,
  driveLink = "",
  onDriveLinkChange,
  multiple = true,
  helpText = "Upload images (PNG, JPG, WebP), videos (MP4, MOV), or documents (PDF)."
}) {
  const [activeMediaPreview, setActiveMediaPreview] = useState(null);
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

  const processFiles = async (newFilesList) => {
    const formatted = await Promise.all(
      newFilesList.map(async (file) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isPdf = file.type === 'application/pdf';
        const previewUrl = URL.createObjectURL(file);
        
        // Convert to Base64 for 5TB Google Drive direct uploads
        const base64 = await readFileAsBase64(file);

        return {
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: isImage ? 'image' : isVideo ? 'video' : isPdf ? 'pdf' : 'doc',
          previewUrl,
          base64
        };
      })
    );

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
    <div className="space-y-4 w-full">
      {/* Question Title & Description */}
      {label && <div className="gf-q-title text-base font-normal text-slate-900 mb-1">{label}</div>}
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      {helpText && <p className="text-xs text-slate-500 mb-3">{helpText}</p>}

      {/* Google Forms "Add file" Button */}
      <div className="my-2">
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

      {/* Uploaded files list */}
      {files.length > 0 && (
        <div className="space-y-2 my-3 w-full">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                {f.type === 'image' && <ImageIcon className="w-4 h-4 text-purple-600 shrink-0" />}
                {f.type === 'video' && <Film className="w-4 h-4 text-indigo-600 shrink-0" />}
                {(f.type === 'pdf' || f.type === 'doc') && <File className="w-4 h-4 text-blue-600 shrink-0" />}
                <span className="font-medium text-slate-800 truncate">{f.name}</span>
                <span className="text-slate-400">({f.size})</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {(f.type === 'image' || f.type === 'video') && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaPreview(f)}
                    className="p-1 text-slate-600 hover:text-purple-700"
                    title="Preview file"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(f.id)}
                  className="p-1 text-slate-500 hover:text-rose-600"
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
        <div className="mt-6 pt-4 border-t border-slate-200 w-full">
          <div className="text-sm font-normal text-slate-900 mb-1">
            Google Drive / Cloud Folder Link (Optional - Unlimited File Size)
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Uploading large raw videos or high-res CAD/3D files? Paste your Google Drive folder link below.
          </p>
          <input
            type="url"
            value={driveLink}
            onChange={(e) => onDriveLinkChange(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="gf-underline-input w-full text-sm"
          />
        </div>
      )}

      {/* Lightbox / Video Modal */}
      {activeMediaPreview && (
        <div className="gf-modal-overlay" onClick={() => setActiveMediaPreview(null)}>
          <div className="gf-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="font-medium text-slate-800 text-sm truncate">{activeMediaPreview.name}</span>
              <button
                type="button"
                onClick={() => setActiveMediaPreview(null)}
                className="p-1 text-slate-500 hover:text-slate-800"
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
