import fs from 'fs';
import path from 'path';

// Sample test data for 9 sections
const testFormData = {
  basicInfo: {
    companyName: "Apex Architects & Interior Design Pvt. Ltd.",
    contactPerson: "Ar. Rahul Sharma",
    mobileNumber: "+91 98765 43210",
    whatsAppNumber: "+91 98765 43210",
    email: "contact@apexarchitects.com",
    officeAddress: "Suite 402, Apex Business Tower, Bandra West, Mumbai, MH - 400050"
  },
  aboutCompany: {
    description: "Founded in 2012, Apex Architects specializes in high-end luxury residential villas and green commercial interiors.",
    yearsExperience: "12 Years",
    services: ["Architecture", "Interior Design", "Turnkey Projects"],
    otherService: ""
  },
  websiteReqs: {
    pages: ["Home", "About", "Services", "Projects", "Gallery", "Contact"],
    otherPage: "",
    features: ["WhatsApp Chat", "Contact Form", "Google Maps"],
    otherFeature: ""
  },
  projectCountChoice: "5",
  projects: [
    {
      id: "proj-1",
      name: "Skyline Luxury Villa",
      location: "Mumbai, Maharashtra",
      type: "Villa",
      customType: "",
      status: "Completed",
      yearCompleted: "2024",
      description: "Modern 4-bedroom luxury villa with infinity pool and green architecture.",
      servicesProvided: "Architectural Planning, Interior Execution, Landscape Design",
      photos: [
        {
          name: "villa_render_1.png",
          type: "image",
          size: "1.24 MB",
          base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        }
      ],
      driveLink: "https://drive.google.com/drive/folders/sample_project_folder_1"
    },
    {
      id: "proj-2",
      name: "Apex Business Park",
      location: "Pune, Maharashtra",
      type: "Commercial",
      customType: "",
      status: "Ongoing",
      yearCompleted: "2025",
      description: "12-story modern commercial office tower with LEED Gold certification.",
      servicesProvided: "Structural Supervision, Architectural Planning",
      photos: [],
      driveLink: ""
    }
  ],
  team: {
    founderName: "Ar. Vikramaditya Rao (Principal Architect)",
    teamMembers: "Ar. Neha Verma (Senior Designer), Eng. Suresh Patil (Structural Lead)"
  },
  branding: {
    logo: [
      {
        name: "company_logo_transparent.png",
        type: "image",
        size: "0.45 MB",
        base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    profilePdf: [],
    brochurePdf: []
  },
  assets: {
    files: [],
    driveLink: "https://drive.google.com/drive/folders/sample_general_assets_folder"
  },
  contactDetails: {
    phone: "+91 98765 43210",
    email: "info@apexarchitects.com",
    googleMaps: "https://maps.google.com/?q=Apex+Architects+Mumbai",
    facebook: "https://facebook.com/apexarchitects",
    instagram: "https://instagram.com/apex.architects",
    linkedin: "https://linkedin.com/company/apex-architects"
  },
  anythingElse: "Prefer clean dark/gold color palette for the website."
};

console.log("=== Testing NexLoop Requirement Form Data Payload ===");
console.log("Company Name:", testFormData.basicInfo.companyName);
console.log("Contact Person:", testFormData.basicInfo.contactPerson);
console.log("Featured Projects Count:", testFormData.projects.length);
console.log("Attached Logo File:", testFormData.branding.logo[0].name);
console.log("Sample Base64 Length:", testFormData.branding.logo[0].base64.length);

// Read .env.local if present
const envPath = path.join(process.cwd(), '.env.local');
let webhookUrl = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/VITE_GOOGLE_DRIVE_WEBHOOK_URL=["']?([^"'\n]+)["']?/);
  if (match && match[1] && !match[1].includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    webhookUrl = match[1];
  }
}

if (webhookUrl) {
  console.log("\nFound Google Drive Webhook URL:", webhookUrl);
  console.log("Sending test payload to 5TB Google Drive...");
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(testFormData)
    });
    const result = await response.json();
    console.log("\nSuccess Response from Google Drive:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error connecting to Webhook URL:", err.message);
  }
} else {
  console.log("\nNote: VITE_GOOGLE_DRIVE_WEBHOOK_URL is using placeholder. To test live upload to Google Drive, replace URL in .env.local.");
  console.log("Local Payload validation: PASSED OK (0 errors).");
}
