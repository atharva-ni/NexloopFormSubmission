# 📋 NexLoop Portfolio Website Requirement Form

A modern, responsive requirement intake form designed in an authentic **Google Forms light theme**.

## 📁 How Google Drive Storage Works

### 1. For Clients / Form Responders:
- **Section 4 (Featured Projects)**: Each project has a dedicated input field titled **"Google Drive / Cloud Folder Link (Optional - Unlimited File Size)"** where clients can paste their Google Drive folder URL (e.g., `https://drive.google.com/drive/folders/...`) for large project site photos, 3D renders, and video walk-throughs.
- **Section 7 (Assets)**: A general Google Drive folder link input for high-resolution brand photos, team pictures, CAD drawings, and raw media.

### 2. For Admins / Developers (Receiving Submissions into Google Drive):
- When a user submits the form, all responses (including all pasted Google Drive folder URLs and metadata) are compiled into a structured JSON payload.
- To automatically store submitted forms into your own Google Drive folder or Google Sheet:
  1. Open `src/App.jsx`.
  2. Locate the `handleSubmit` function (around line 170).
  3. Send `formData` to your **Google Apps Script Webhook URL**:
     ```javascript
     fetch('YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });
     ```

## 🚀 Running the App
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.
