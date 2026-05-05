import { NextResponse } from "next/server"
import ConnectDB from "../../../lib/config/db"
import BlogModel from "../../../lib/models/BlogModel";
import cloudinary from "../../../lib/config/cloudinary";
import { getAuthContext, isAdmin } from "../../../lib/config/auth";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();


//api endpoint to get all blogs
export async function GET(request) {
    try {
        const { appId, error } = getAuthContext(request);
        if (error) return error;

        const blogId = request.nextUrl.searchParams.get("id");

        if (blogId) {
            const blog = await BlogModel.findOne({ _id: blogId, appId });
            if (!blog) {
                return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
            }
            return NextResponse.json({ blog });
        }
        else {
            const blogs = await BlogModel.find({ appId });
            return NextResponse.json({ blogs });
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ success: false, msg: "Failed to fetch blogs" }, { status: 500 });
    }
}


//api endpoint for upload blogs
export async function POST(request) {
    try {
        const { decoded, appId, error } = getAuthContext(request);
        if (error) return error;

        if (!isAdmin(decoded)) {
            return NextResponse.json({ success: false, msg: "Forbidden: Admin access required" }, { status: 403 });
        }

        const formData = await request.formData();
        
        const image = formData.get('image');
        if (!image) {
            return NextResponse.json({ success: false, msg: "No image provided" }, { status: 400 });
        }

        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);

        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                }
                else resolve(result);
            }).end(buffer);
        });

        const imgUrl = uploadResponse.secure_url;
        const publicId = uploadResponse.public_id;

        const blogData = {
            title: `${formData.get('title')}`,
            description: `${formData.get('description')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            image: `${imgUrl}`,
            publicId: `${publicId}`,
            authorImg: `${formData.get('authorImg')}`,
            appId
        }

        await BlogModel.create(blogData);
        console.log("Blog created successfully for appId:", appId, blogData);

        return NextResponse.json({ success: true, msg: "Blog Added" })
    } catch (error) {
        console.error("Error adding blog:", error);
        return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
    }
}

// Creating API Endpoint to delete Blog
export async function DELETE(request) {
    try {
        const { decoded, appId, error } = getAuthContext(request);
        if (error) return error;

        if (!isAdmin(decoded)) {
            return NextResponse.json({ success: false, msg: "Forbidden: Admin access required" }, { status: 403 });
        }

        const id = request.nextUrl.searchParams.get('id');
        const blog = await BlogModel.findOne({ _id: id, appId });

        if (!blog) {
            return NextResponse.json({ success: false, msg: "Blog not found or unauthorized" }, { status: 404 });
        }

        // Only try to delete from Cloudinary if it's a Cloudinary URL
        if (blog.publicId) {
            try {
                await cloudinary.uploader.destroy(blog.publicId);
            } catch (clError) {
                console.error("Cloudinary delete error:", clError);
                // Continue with DB deletion even if Cloudinary fails
            }
        }

        await BlogModel.findOneAndDelete({ _id: id, appId });
        return NextResponse.json({ success: true, msg: "Blog Deleted" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ success: false, msg: "Failed to delete blog" }, { status: 500 });
    }
}
