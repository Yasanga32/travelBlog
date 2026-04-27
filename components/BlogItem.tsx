import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogItem({title,description,category,image,id}) {
  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border-black hover:shadow-[-7px_7px_0px_#000000]'>
        <Link href={`/blogs/${id}`} className='block cursor-pointer'>
            <Image src={image} alt='' width={400} height={400} className='border-b border-black'/>
            <div className='p-5'>
                <p className='inline-block bg-black text-white text-sm px-1 mb-2'>{category}</p>
                <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
                <p className='mb-3 text-sm tracking-tight text-gray-700'>{description}</p>
                <div className='inline-flex items-center py-2 font-semibold text-center'>
                    Read more <Image src={assets.arrow} alt='' width={12} className='ml-2'/>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default BlogItem