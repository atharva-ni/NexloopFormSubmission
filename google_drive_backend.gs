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

function saveFilesToFolder(filesArray, folder) {
  if (!filesArray || !Array.isArray(filesArray)) return;
  filesArray.forEach(function(fileObj) {
    if (fileObj.base64) {
      let base64String = fileObj.base64;
      let contentType = "application/octet-stream";
      
      if (base64String.indexOf(",") !== -1) {
        const parts = base64String.split(",");
        contentType = parts[0].split(";")[0].replace("data:", "");
        base64String = parts[1];
      }
      
      const decodedData = Utilities.base64Decode(base64String);
      const blob = Utilities.newBlob(decodedData, contentType, fileObj.name);
      folder.createFile(blob);
    }
  });
}
