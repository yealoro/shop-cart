import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("BODY RECEIVED:", req.body); // Debug log

  const { email, password } = req.body;

  if (email === "admin@admin.com" && password === "admin123") {
    // Set a cookie named "auth"
    res.setHeader(
      "Set-Cookie",
      "auth=true; Path=/; HttpOnly; SameSite=Lax"
    );
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
}