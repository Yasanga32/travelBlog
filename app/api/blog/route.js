import { NextResponse } from "next/server"
import ConnectDB from "../../../lib/config/db"
import BlogModel from "../../../lib/models/BlogModel";
import cloudinary from "../../../lib/config/cloudinary";

const LoadDB = async () => {
    await ConnectDB();
}

LoadDB();


//api endpoint to get all blogs
export async function GET(request) {

    const blogId = request.nextUrl.searchParams.get("id");
    if (blogId) {
        const blog = await BlogModel.findById(blogId);
        return NextResponse.json({ blog });
    }
    else {
        const blogs = await BlogModel.find({});
        return NextResponse.json({ blogs });
    }

}


//api endpoint for upload blogs
export async function POST(request) {
    try {
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

        const blogData = {
            title: `${formData.get('title')}`,
            description: `${formData.get('description')}`,
            category: `${formData.get('category')}`,
            author: `${formData.get('author')}`,
            image: `${imgUrl}`,
            authorImg: `${formData.get('authorImg')}`
        }

        await BlogModel.create(blogData);
        console.log("Blog created successfully", blogData);

        return NextResponse.json({ success: true, msg: "Blog Added" })
    } catch (error) {
        console.error("Error adding blog:", error);
        return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
    }
}

// Creating API Endpoint to delete Blog
export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get('id');
        const blog = await BlogModel.findById(id);

        if (!blog) {
            return NextResponse.json({ success: false, msg: "Blog not found" }, { status: 404 });
        }

        // Only try to delete from Cloudinary if it's a Cloudinary URL
        if (blog.image && blog.image.includes('res.cloudinary.com')) {
            try {
                const publicId = blog.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (clError) {
                console.error("Cloudinary delete error:", clError);
                // Continue with DB deletion even if Cloudinary fails
            }
        }

        await BlogModel.findByIdAndDelete(id);
        return NextResponse.json({ success: true, msg: "Blog Deleted" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json({ success: false, msg: "Failed to delete blog" }, { status: 500 });
    }
}
