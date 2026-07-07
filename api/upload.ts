import fs from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ADMIN_TOKEN = "sevend-admin-super-token-2026";
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized. Admin session required." });
  }

  try {
    const { filename, base64 } = req.body || {};
    if (!filename || !base64) {
      return res.status(400).json({ error: "Filename and base64 string are required." });
    }

    const UPLOADS_DIR = path.join(process.cwd(), "uploads");

    // Let's check if the uploads directory exists, if not try to create it
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
    } catch (e) {
      console.log("Uploads directory creation bypassed:", e);
    }

    // Clean base64 string from data URI prefix
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const ext = path.extname(filename) || ".png";
    const nameWithoutExt = path.basename(filename, ext).replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const uniqueFilename = `${nameWithoutExt}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    // Try to write to disk (local dev)
    try {
      fs.writeFileSync(filePath, buffer);
      return res.status(200).json({ url: `/uploads/${uniqueFilename}`, success: true });
    } catch (writeErr) {
      // If disk is read-only (like Vercel), return the base64 data URL itself!
      // This is incredibly robust as it embeds the image directly in the database, working 100% on serverless.
      console.log("Writing upload to disk failed, returning base64 URL instead:", writeErr);
      return res.status(200).json({ url: base64, success: true });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Gagal mengunggah file." });
  }
}
