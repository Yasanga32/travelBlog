'use client'
import { assets, blog_data } from '@/Assets/assets';
import Image from 'next/image';
import React, { useEffect, useState, use } from 'react'
import Footer from '@/components/Footer';
import Link from 'next/link';

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
      <>
        <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
          <div className="flex justify-between items-center">
            <Link href='/'>
              <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto' />
            </Link>
            <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
              Get started <Image src={assets.arrow} alt='' />
            </button>
          </div>
          <div className="text-center my-24">
            <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">{data.title}</h1>
            <Image className='mx-auto mt-6 border-4 border-white rounded-full' src={data.author_img} width={60} height={60} alt='' />
            <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
          </div>
        </div>
        <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
          <Image className='border-4 border-white' src={data.image} width={1280} height={720} alt='' />
          <h1 className='my-8 text-[26px] font-semibold'>Introduction</h1>
          <p>{data.description}</p>
          <h3 className='my-5 text-[18px] font-semibold'>Step 1: Self-Reflection and Goal Setting</h3>
          <p className='my-3'>Before you can begin to manage your lifestyle, you must first understand what you want to achieve. Take the time to reflect on your current habits and identify areas for improvement.</p>
          <p className='my-3'>Whether it is your health, career, or personal relationships, setting clear and achievable goals is the first step towards a more organized and fulfilling life.</p>
          <h3 className='my-5 text-[18px] font-semibold'>Step 2: Prioritization and Time Management</h3>
          <p className='my-3'>Once you have set your goals, it is time to prioritize them. Not all goals are created equal, and some will require more time and effort than others.</p>
          <p className='my-3'>Learn to manage your time effectively by breaking down large tasks into smaller, more manageable ones. Use tools like calendars and to-do lists to keep yourself on track.</p>
          <h3 className='my-5 text-[18px] font-semibold'>Step 3: Consistency and Adaptation</h3>
          <p className='my-3'>The key to long-term lifestyle management is consistency. It is not about making massive changes overnight, but rather about making small, sustainable improvements every day.</p>
          <p className='my-3'>Be prepared to adapt your plan as you go along. Life is unpredictable, and being flexible will help you stay on course even when things do not go as planned.</p>
          <h3 className='my-5 text-[18px] font-semibold'>Conclusion:</h3>
          <p className='my-3'>Managing your lifestyle is a continuous journey, not a destination. By following these steps and staying committed to your goals, you can create a life that is balanced, productive, and truly exceptional.</p>
          
          <div className='my-24'>
            <p className='text-black font-semibold my-4'>Share this article on social media</p>
            <div className='flex gap-2'>
              <Image src={assets.facebook_icon} width={50} alt='' />
              <Image src={assets.twitter_icon} width={50} alt='' />
              <Image src={assets.googleplus_icon} width={50} alt='' />
            </div>
          </div>
        </div>
        <Footer />
      </>
    ) : (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    )
  )
}