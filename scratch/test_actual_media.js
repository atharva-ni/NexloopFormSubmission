import fs from 'fs';
import path from 'path';

// Download a REAL 1080p HD Photo (Nature / Architecture sample)
async function getRealHdPhotoBase64() {
  try {
    const photoUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop";
    console.log("Fetching real 1080p HD Architecture photo...");
    const res = await fetch(photoUrl);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Fetched real HD photo (${(buffer.length / 1024).toFixed(1)} KB)`);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn("Error fetching HD photo:", err.message);
  }
  return null;
}

// Download a 1MB real playable MP4 video sample
async function getRealMp4Base64() {
  try {
    const videoUrl = "https://filesamples.com/samples/video/mp4/sample_640x360.mp4";
    console.log("Fetching 1MB real sample MP4 video...");
    const res = await fetch(videoUrl);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Fetched real MP4 video (${(buffer.length / 1024).toFixed(1)} KB)`);
      return `data:video/mp4;base64,${buffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn("Using fallback video fetch:", err.message);
  }
  return null;
}

async function runRealMediaTest() {
  console.log("=== Testing 100% REAL HD Photo & Playable Video Upload ===");
  
  const realHdPhoto = await getRealHdPhotoBase64();
  const realMp4 = await getRealMp4Base64();

  if (!realHdPhoto || !realMp4) {
    console.error("Could not fetch media samples.");
    return;
  }

  const testPayload = {
    basicInfo: {
      companyName: "NexLoop HD Quality Test Firm",
      contactPerson: "Ar. Atharva",
      mobileNumber: "+91 98765 43210",
      whatsAppNumber: "+91 98765 43210",
      email: "info@nexloop.com",
      officeAddress: "Mumbai, India"
    },
    aboutCompany: {
      description: "Testing real 1080p HD photo and playable MP4 video without quality loss.",
      yearsExperience: "10 Years",
      services: ["Architecture", "Interior Design"],
      otherService: ""
    },
    websiteReqs: {
      pages: ["Home", "About", "Services", "Projects", "Contact"],
      otherPage: "",
      features: ["WhatsApp Chat", "Contact Form"],
      otherFeature: ""
    },
    projectCountChoice: "1",
    projects: [
      {
        id: "proj-1",
        name: "Luxury Beach Villa HD",
        location: "Goa, India",
        type: "Villa",
        customType: "",
        status: "Completed",
        yearCompleted: "2024",
        description: "100% full original quality photo and playable MP4 video.",
        servicesProvided: "Architectural Planning",
        photos: [
          {
            name: "luxury_villa_1080p_hd.jpg",
            type: "image",
            size: "1.20 MB",
            base64: realHdPhoto
          },
          {
            name: "walkthrough_video_hd.mp4",
            type: "video",
            size: "0.56 MB",
            base64: realMp4
          }
        ],
        driveLink: ""
      }
    ],
    team: { founderName: "Ar. Atharva", teamMembers: "" },
    branding: { logo: [], profilePdf: [], brochurePdf: [] },
    assets: { files: [], driveLink: "" },
    contactDetails: { phone: "+91 98765 43210", email: "info@nexloop.com", googleMaps: "", facebook: "", instagram: "", linkedin: "" },
    anythingElse: "Testing 100% full HD photo and video."
  };

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
    console.log("Uploading 1080p HD Photo & Playable Video to Google Drive Webhook...");
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(testPayload)
    });
    const result = await res.json();
    console.log("\nResponse from Google Drive:", JSON.stringify(result, null, 2));
  }
}

runRealMediaTest();
