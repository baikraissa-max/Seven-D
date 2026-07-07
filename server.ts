import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initialClassData } from "./src/data/initial-data.js";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "class-data.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure class-data.json exists with initial data if not present
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialClassData, null, 2), "utf-8");
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Static uploads serving (in both dev & prod)
app.use("/uploads", express.static(UPLOADS_DIR));

// Helper to read data
function readClassData() {
  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading class data, returning initial data:", err);
    return initialClassData;
  }
}

// Helper to write data
function writeClassData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Authorization check middleware
const ADMIN_TOKEN = "sevend-admin-super-token-2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin7d";

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized. Admin session required." });
  }
}

// API Routes
app.get("/api/class-data", (req, res) => {
  const data = readClassData();
  res.json(data);
});

app.post("/api/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN, success: true });
  } else {
    res.status(400).json({ error: "Password salah! Silakan coba lagi.", success: false });
  }
});

app.post("/api/class-data", checkAdminAuth, (req, res) => {
  try {
    const newData = req.body;
    writeClassData(newData);
    res.json({ success: true, message: "Data berhasil disimpan!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Gagal menyimpan data." });
  }
});

app.post("/api/upload", checkAdminAuth, (req, res) => {
  try {
    const { filename, base64 } = req.body;
    if (!filename || !base64) {
      return res.status(400).json({ error: "Filename and base64 string are required." });
    }

    // Clean base64 string from data URI prefix
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate unique name to prevent collisions
    const ext = path.extname(filename) || ".png";
    const nameWithoutExt = path.basename(filename, ext).replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const uniqueFilename = `${nameWithoutExt}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    res.json({ url: `/uploads/${uniqueFilename}`, success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Gagal mengunggah file." });
  }
});

async function startServer() {
  // Vite dev server middleware in non-production mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SEVEN D Backend] Server running on http://localhost:${PORT}`);
    console.log(`[SEVEN D Backend] Admin Password is: ${ADMIN_PASSWORD}`);
  });
}

startServer();
