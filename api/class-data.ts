import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "class-data.json");
const TMP_FILE = path.join("/tmp", "class-data.json");
const ADMIN_TOKEN = "sevend-admin-super-token-2026";

async function getKVData() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["GET", "class_data"]),
      });
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.result) {
          return JSON.parse(payload.result);
        }
      }
    } catch (e) {
      console.error("Error reading from Vercel KV:", e);
    }
  }
  return null;
}

async function setKVData(data: any) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(process.env.KV_REST_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["SET", "class_data", JSON.stringify(data)]),
      });
      return res.ok;
    } catch (e) {
      console.error("Error writing to Vercel KV:", e);
    }
  }
  return false;
}

function readLocalData() {
  // First, check if there is edited data in /tmp (ephemeral container storage)
  if (fs.existsSync(TMP_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(TMP_FILE, "utf-8"));
    } catch (e) {
      console.error("Failed to read from /tmp/class-data.json:", e);
    }
  }
  // Fallback to project root file
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read from root class-data.json:", e);
  }
  return null;
}

function writeLocalData(data: any) {
  // Always try to write to /tmp first since it's always writable on Vercel
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write to /tmp/class-data.json:", e);
  }

  // Also try to write to project root (works in local dev, fails gracefully on Vercel)
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    // Fail silently or log
    console.log("Root write bypassed (expected in Vercel environment):", e);
  }
}

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

  if (req.method === "GET") {
    try {
      // 1. Try Vercel KV
      let data = await getKVData();
      if (!data) {
        // 2. Fallback to local files
        data = readLocalData();
      }
      if (!data) {
        return res.status(404).json({ error: "Class data not found" });
      }
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Gagal mengambil data" });
    }
  }

  if (req.method === "POST") {
    // Authorization Check
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ error: "Unauthorized. Admin session required." });
    }

    try {
      const newData = req.body;
      if (!newData) {
        return res.status(400).json({ error: "Invalid data body" });
      }

      // 1. Save to Vercel KV if available
      await setKVData(newData);

      // 2. Save locally
      writeLocalData(newData);

      return res.status(200).json({ success: true, message: "Data berhasil disimpan!" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Gagal menyimpan data." });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
