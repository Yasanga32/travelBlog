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
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get('image');
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) reject(error);
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

}

// Creating API Endpoint to delete Blog

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get('id');
    const blog = await BlogModel.findById(id);

    const publicId = blog.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Blog Deleted" });
}
