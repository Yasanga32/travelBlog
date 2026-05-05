import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const getAuthContext = (request) => {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
        return { error: NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 }) };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { decoded, appId: decoded.appId };
    } catch (error) {
        return { error: NextResponse.json({ success: false, msg: "Invalid token" }, { status: 401 }) };
    }
}

export const isAdmin = (decoded) => {
    return decoded && decoded.role === 'admin';
}
