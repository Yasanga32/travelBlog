import { NextResponse } from "next/server";
import ConnectDB from "../../../lib/config/db";
import EmailModel from "../../../lib/models/EmailModel";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();

// GET subscriptions - protected by admin secret
export async function GET(request) {
    try {
        const adminSecret = request.headers.get("x-admin-secret");
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
        }

        const appId = process.env.APP_ID || 'standalone';
        const emails = await EmailModel.find({ appId });
        return NextResponse.json({ emails });
    } catch (error) {
        console.error("Error fetching emails:", error);
        return NextResponse.json({ success: false, msg: "Failed to fetch emails" }, { status: 500 });
    }
}

// POST subscribe - public route
export async function POST(request) {
    try {
        const appId = process.env.APP_ID || 'standalone';
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

// DELETE subscription - protected by admin secret
export async function DELETE(request) {
    try {
        const adminSecret = request.headers.get("x-admin-secret");
        if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ success: false, msg: "Unauthorized" }, { status: 401 });
        }

        const appId = process.env.APP_ID || 'standalone';
        const id = request.nextUrl.searchParams.get("id");
        await EmailModel.findOneAndDelete({ _id: id, appId });
        return NextResponse.json({ success: true, message: "Email Deleted" })
    } catch (error) {
        console.error("Error deleting email:", error);
        return NextResponse.json({ success: false, msg: "Failed to delete email" }, { status: 500 });
    }
}