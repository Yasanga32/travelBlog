'use client'
import { assets, blog_data } from '@/Assets/assets';
import Image from 'next/image';
import React, { useEffect, useState, use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);

  const fetchBlogData = () => {
    const blog = blog_data.find((item) => String(item.id) === id);
    if (blog) {
      setData(blog);
    }
  }

  useEffect(() => {
    fetchBlogData();
  }, [id])

  return (
    data ? (
      <div className="bg-gray-200 py-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Blog Details</h1>
        </div>
        <div className="text-center my-24">
            <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">{data.title}</h1>
            <Image className="mx-auto mt-6 border-4 border-white" src={data.image} width={800} height={450} alt="" />
            <p className="mt-8 pb-9 text-lg max-w-[740px] mx-auto">{data.description}</p>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    )
  )
}