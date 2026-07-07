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
    return res.status(405).json({ error: "Method not allowed", success: false });
  }

  try {
    const { password } = req.body || {};
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin7d";
    const ADMIN_TOKEN = "sevend-admin-super-token-2026";

    if (password === ADMIN_PASSWORD) {
      return res.status(200).json({ token: ADMIN_TOKEN, success: true });
    } else {
      return res.status(400).json({ error: "Password salah! Silakan coba lagi.", success: false });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Internal server error", success: false });
  }
}
