/**
 * 🚀 NexLoop 5TB Google Drive Response-Wise Storage Script
 * 
 * INSTRUCTIONS:
 * 1. Open https://script.google.com/ and create a "New Project".
 * 2. Copy and paste this entire code into your Google Apps Script editor.
 * 3. Select 'testDriveAppPermission' in the top dropdown and click 'Run' ▶️ ONCE to grant Drive permissions.
 * 4. Replace 'YOUR_PARENT_FOLDER_ID_HERE' with your 5TB Google Drive Folder ID (optional).
 * 5. Click "Deploy" -> "New Deployment":
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 6. Copy the deployed Web App URL and paste it into .env.local or the form.
 */

const PARENT_FOLDER_ID = "YOUR_PARENT_FOLDER_ID_HERE"; // Replace with your 5TB Drive Folder ID

// Helper function to trigger Google Drive Authorization popup in 1 click!
function testDriveAppPermission() {
  const root = DriveApp.getRootFolder();
  Logger.log("Drive Permission OK! Root Folder Name: " + root.getName());
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Check if it's a single file upload action
    if (data.action === "uploadFile") {
      const fileObj = data.file;
      if (!fileObj || !fileObj.base64) {
        throw new Error("No file content provided for uploadFile action");
      }
      
      let parentFolder;
      if (PARENT_FOLDER_ID && PARENT_FOLDER_ID !== "YOUR_PARENT_FOLDER_ID_HERE") {
        parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
      } else {
        parentFolder = DriveApp.getRootFolder();
      }
      
      // Get or create a Temp Uploads folder to keep things tidy
      let tempFolder;
      const tempFolderName = "NexLoop_Temp_Uploads";
      const folders = parentFolder.getFoldersByName(tempFolderName);
      if (folders.hasNext()) {
        tempFolder = folders.next();
      } else {
        tempFolder = parentFolder.createFolder(tempFolderName);
      }
      
      // Save file to temp folder
      const savedFile = saveSingleBase64File(fileObj, tempFolder);
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        fileId: savedFile.getId(),
        fileUrl: savedFile.getUrl(),
        name: fileObj.name
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default action: full form submission
    const companyName = data.basicInfo?.companyName || "Unnamed_Company";
    const contactPerson = data.basicInfo?.contactPerson || "Client";
    const timestamp = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd_HH-mm");
    
    // Get target parent folder in your 5TB Drive
    let parentFolder;
    if (PARENT_FOLDER_ID && PARENT_FOLDER_ID !== "YOUR_PARENT_FOLDER_ID_HERE") {
      parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
    } else {
      parentFolder = DriveApp.getRootFolder();
    }
    
    // Create Response Folder for this client
    const responseFolderName = companyName.replace(/[^a-zA-Z0-9_\- ]/g, "") + " - " + contactPerson + " (" + timestamp + ")";
    const responseFolder = parentFolder.createFolder(responseFolderName);
    
    // Subfolder 1: Branding
    const brandingFolder = responseFolder.createFolder("01_Branding");
    if (data.branding?.logo) {
      saveFilesToFolder(data.branding.logo, brandingFolder);
    }
    if (data.branding?.profilePdf) {
      saveFilesToFolder(data.branding.profilePdf, brandingFolder);
    }
    if (data.branding?.brochurePdf) {
      saveFilesToFolder(data.branding.brochurePdf, brandingFolder);
    }
    
    // Subfolder 2: Featured Projects
    const projectsFolder = responseFolder.createFolder("02_Featured_Projects");
    if (data.projects && data.projects.length > 0) {
      data.projects.forEach(function(proj, index) {
        const projName = (proj.name || ("Project_" + (index + 1))).replace(/[^a-zA-Z0-9_\- ]/g, "");
        const singleProjFolder = projectsFolder.createFolder((index + 1) + "_" + projName);
        
        if (proj.photos && proj.photos.length > 0) {
          saveFilesToFolder(proj.photos, singleProjFolder);
        }
        
        if (proj.driveLink) {
          singleProjFolder.createFile("External_Drive_Link.txt", "Client provided link: " + proj.driveLink);
        }
      });
    }
    
    // Subfolder 3: General Assets
    const assetsFolder = responseFolder.createFolder("03_Assets");
    if (data.assets?.files) {
      saveFilesToFolder(data.assets.files, assetsFolder);
    }
    if (data.assets?.driveLink) {
      assetsFolder.createFile("External_Drive_Link.txt", "Client provided link: " + data.assets.driveLink);
    }
    
    // Create Full Requirement Summary JSON in Drive
    const cleanJson = JSON.stringify(data, null, 2);
    responseFolder.createFile("Requirement_Summary_" + companyName + ".json", cleanJson, "application/json");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Form response and all files saved to 5TB Google Drive successfully!",
      folderUrl: responseFolder.getUrl(),
      folderName: responseFolderName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveSingleBase64File(fileObj, folder) {
  let base64String = fileObj.base64;
  let contentType = "application/octet-stream";
  
  // Extract MIME type if data URL header is present
  if (base64String.indexOf(",") !== -1) {
    const parts = base64String.split(",");
    const headerMime = parts[0].split(";")[0].replace("data:", "");
    if (headerMime) contentType = headerMime;
    base64String = parts[1];
  }
  
  // Comprehensive mapping by file extension
  const fileName = fileObj.name || "file";
  const ext = fileName.split('.').pop().toLowerCase();
  
  const mimeTypes = {
    // Images
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jpe': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    'ico': 'image/x-icon',
    'heic': 'image/heic',
    'heif': 'image/heif',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'rtf': 'application/rtf',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'odt': 'application/vnd.oasis.opendocument.text',
    
    // Spreadsheets
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',
    
    // Presentations
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'odp': 'application/vnd.oasis.opendocument.presentation',
    
    // Videos
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'webm': 'video/webm',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'mpeg': 'video/mpeg',
    'mpg': 'video/mpeg',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'm4a': 'audio/mp4',
    'ogg': 'audio/ogg',
    'aac': 'audio/aac',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    
    // CAD / 3D / Design
    'dwg': 'image/vnd.dwg',
    'dxf': 'image/vnd.dxf',
    'rvt': 'application/octet-stream', // Autodesk Revit
    'rfa': 'application/octet-stream',
    'skp': 'application/octet-stream', // SketchUp
    'obj': 'model/obj',
    'fbx': 'application/octet-stream',
    '3ds': 'application/x-3ds',
    'max': 'application/x-3ds',
    'psd': 'image/vnd.adobe.photoshop',
    'ai': 'application/postscript',
    'indd': 'application/x-indesign',
    'fig': 'application/x-figma'
  };
  
  if (mimeTypes.hasOwnProperty(ext)) {
    contentType = mimeTypes[ext];
  }
  
  const bytes = Utilities.base64Decode(base64String);
  const blob = Utilities.newBlob(bytes, contentType, fileName);
  return folder.createFile(blob);
}

function saveFilesToFolder(filesArray, folder) {
  if (!filesArray || !Array.isArray(filesArray)) return;
  filesArray.forEach(function(fileObj) {
    if (fileObj) {
      // 1. If the file is already uploaded to Drive, move it to the subfolder!
      if (fileObj.driveFileId) {
        try {
          const file = DriveApp.getFileById(fileObj.driveFileId);
          file.moveTo(folder);
          return;
        } catch (e) {
          Logger.log("Failed to move file " + fileObj.driveFileId + ": " + e.toString());
          // Fall through to base64 upload if it failed to move
        }
      }
      
      // 2. Fallback to base64 decoding if the file has not been uploaded to Drive yet
      if (fileObj.base64) {
        saveSingleBase64File(fileObj, folder);
      }
    }
  });
}
