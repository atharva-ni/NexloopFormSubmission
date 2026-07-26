import fs from 'fs';
import path from 'path';

// Valid 200x200 Red PNG Image
const realPngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAZSURBVHic3EExAQAAAMKg9U9tDQ8gAAAAAAC+BhuAAAE49Q3cAAAAAElFTkSuQmCC";

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
  console.log("=== Testing 100% REAL Playable Image & Video Upload ===");
  
  const realPng = realPngBase64;
  const realMp4 = await getRealMp4Base64();

  if (!realMp4) {
    console.error("Could not fetch sample video.");
    return;
  }

  const testPayload = {
    basicInfo: {
      companyName: "NexLoop Real Playable Video Firm",
      contactPerson: "Ar. Atharva",
      mobileNumber: "+91 98765 43210",
      whatsAppNumber: "+91 98765 43210",
      email: "info@nexloop.com",
      officeAddress: "Mumbai, India"
    },
    aboutCompany: {
      description: "Testing real playable MP4 video and high-res PNG image uploads.",
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
        name: "Playable Video Villa",
        location: "Goa, India",
        type: "Villa",
        customType: "",
        status: "Completed",
        yearCompleted: "2024",
        description: "Full resolution photos and playable walkthrough MP4 video.",
        servicesProvided: "Architectural Planning",
        photos: [
          {
            name: "real_villa_photo_hd.png",
            type: "image",
            size: "0.50 MB",
            base64: realPng
          },
          {
            name: "playable_walkthrough.mp4",
            type: "video",
            size: "1.10 MB",
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
    anythingElse: "Testing real playable MP4 video."
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
    console.log("Uploading 1MB real playable image & video to Google Drive Webhook...");
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
