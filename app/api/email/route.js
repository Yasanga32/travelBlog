import { NextResponse } from "next/server";
import ConnectDB from "../../../lib/config/db";
import EmailModel from "../../../lib/models/EmailModel";
import { getAuthContext, isAdmin } from "../../../lib/config/auth";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

export async function GET(request) {
    try {
        const { appId, error } = getAuthContext(request);
        if (error) return error;

        const emails = await EmailModel.find({ appId });
        return NextResponse.json({ emails });
    } catch (error) {
        console.error("Error fetching emails:", error);
        return NextResponse.json({ success: false, msg: "Failed to fetch emails" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // Public subscription route
        let appId = process.env.APP_ID || 'standalone';
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        
        if (token) {
            try {
                const jwt = require("jsonwebtoken");
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.appId) appId = decoded.appId;
            } catch (error) {
                console.error("Optional token verification failed:", error.message);
            }
        }

        const formData = await request.formData();
        const emailData = {
            email: `${formData.get("email")}`,
            appId
        }

        await EmailModel.create(emailData);
        return NextResponse.json({ success: true, message: "Successfully Subscribed" })
    } catch (error) {
        console.error("Error subscribing email:", error);
        return NextResponse.json({ success: false, msg: "Failed to subscribe" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { decoded, appId, error } = getAuthContext(request);
        if (error) return error;

        if (!isAdmin(decoded)) {
            return NextResponse.json({ success: false, msg: "Forbidden: Admin access required" }, { status: 403 });
        }

        const id = request.nextUrl.searchParams.get("id");
        await EmailModel.findOneAndDelete({ _id: id, appId });
        return NextResponse.json({ success: true, message: "Email Deleted" })
    } catch (error) {
        console.error("Error deleting email:", error);
        return NextResponse.json({ success: false, msg: "Failed to delete email" }, { status: 500 });
    }
}
