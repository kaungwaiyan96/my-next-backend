import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import cookie from "cookie";
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";
export function verifyJWT(req) {
  try {
    const cookies = req.headers.get("cookie") || "";
    const { token } = cookie.parse(cookies);
    if (!token) {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.log("JWT verification error", err )
    return null;
  }
}
