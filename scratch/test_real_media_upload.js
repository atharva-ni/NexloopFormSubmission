import fs from 'fs';
import path from 'path';

// Valid 100x100 Red PNG Image (Full valid binary PNG file)
const realPngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAK8AAACvABQqw0mAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEGSURBVHic7dAxAQAACAMg+5d2ggv4gA20Vw5sF8gP8gP5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kB/kB/lBfpAf5Af5QX6QH+QH+UF+kF8l+4sADtH+iQAAAABJRU5ErkJggg==";

// Valid MP4 Video header (Small valid MP4 container buffer)
const realMp4Base64 = "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAs1tZGF0AAACrgYF//+/hAAAAZ3dlYm0BhkYAAAAAAAAAc6oBAAAAAAAATYpCgAAAZGVmYXVsdAAAAAAAWK5CgAAAZGF1ZGlvAAAAAACKc3RyZWFtczIAAAAAACe0AUK6gQA4mQAAAAAAAAAAaGVhZGVyAAAAYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY3ODkwAAAAAA==";

const testFormData = {
  basicInfo: {
    companyName: "NexLoop Real Media Test Firm",
    contactPerson: "Atharva Test Admin",
    mobileNumber: "+91 98765 43210",
    whatsAppNumber: "+91 98765 43210",
    email: "test@nexloopbrand.com",
    officeAddress: "Main Office Tower, Mumbai"
  },
  aboutCompany: {
    description: "Testing real image and video uploads directly into 5TB Google Drive.",
    yearsExperience: "10 Years",
    services: ["Architecture", "Interior Design", "Construction"],
    otherService: ""
  },
  websiteReqs: {
    pages: ["Home", "About", "Services", "Projects", "Gallery", "Contact"],
    otherPage: "",
    features: ["WhatsApp Chat", "Contact Form", "Google Maps"],
    otherFeature: ""
  },
  projectCountChoice: "2",
  projects: [
    {
      id: "proj-1",
      name: "Villa Ocean View",
      location: "Goa, India",
      type: "Villa",
      customType: "",
      status: "Completed",
      yearCompleted: "2024",
      description: "Luxury 5-bedroom beach villa featuring modern tropical architecture.",
      servicesProvided: "Architectural Planning, Interior Execution",
      photos: [
        {
          name: "real_villa_photo.png",
          type: "image",
          size: "2.40 MB",
          base64: realPngBase64
        },
        {
          name: "villa_walkthrough_video.mp4",
          type: "video",
          size: "8.50 MB",
          base64: realMp4Base64
        }
      ],
      driveLink: "https://drive.google.com/drive/folders/sample_villa_drive"
    }
  ],
  team: {
    founderName: "Ar. Atharva Rao",
    teamMembers: "Lead Architects & Interior Designers"
  },
  branding: {
    logo: [
      {
        name: "real_company_logo.png",
        type: "image",
        size: "1.10 MB",
        base64: realPngBase64
      }
    ],
    profilePdf: [],
    brochurePdf: []
  },
  assets: {
    files: [
      {
        name: "real_office_photo.png",
        type: "image",
        size: "3.20 MB",
        base64: realPngBase64
      }
    ],
    driveLink: ""
  },
  contactDetails: {
    phone: "+91 98765 43210",
    email: "info@nexloopbrand.com",
    googleMaps: "https://maps.google.com",
    facebook: "",
    instagram: "",
    linkedin: ""
  },
  anythingElse: "Real image and video payload upload test."
};

console.log("=== Testing Real Image & Video Upload to 5TB Google Drive ===");

const envPath = path.join(process.cwd(), '.env.local');
let webhookUrl = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_GOOGLE_DRIVE_WEBHOOK_URL=["']?([^"'\n]+)["']?/);
  if (match && match[1]) {
    webhookUrl = match[1];
  }
}

if (webhookUrl) {
  console.log("Using Webhook URL:", webhookUrl);
  console.log("Uploading Real Image (real_company_logo.png & real_villa_photo.png) and Video (villa_walkthrough_video.mp4)...");
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(testFormData)
    });
    const result = await response.json();
    console.log("\nResponse from Google Drive:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error connecting to Webhook URL:", err.message);
  }
} else {
  console.error("No Webhook URL found in .env.local!");
}
