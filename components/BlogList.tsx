import { blog_data } from '@/Assets/assets'
import React, { useState } from 'react'
import BlogItem from './BlogItem'

function BlogList() {
  const [menu, setMenu] = useState("All");

  return (
    <div>
      {/* Buttons */}
      <div className='flex justify-center gap-6 my-10'>
        
        <button 
          onClick={() => setMenu('All')}
          className={`cursor-pointer py-1 px-4 rounded-sm 
            ${menu === "All" ? 'bg-black text-white' : ''}`}
        >
          All
        </button>

        <button 
          onClick={() => setMenu('Technology')}
          className={`cursor-pointer py-1 px-4 rounded-sm 
            ${menu === "Technology" ? 'bg-black text-white' : ''}`}
        >
          Technology
        </button>

        <button 
          onClick={() => setMenu('Startup')}
          className={`cursor-pointer py-1 px-4 rounded-sm 
            ${menu === "Startup" ? 'bg-black text-white' : ''}`}
        >
          Startup
        </button>

        <button 
          onClick={() => setMenu('Lifestyle')}
          className={`cursor-pointer py-1 px-4 rounded-sm 
            ${menu === "Lifestyle" ? 'bg-black text-white' : ''}`}
        >
          Lifestyle
        </button>

      </div>

      {/* Blog List */}
      <div className='flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24'>
        {blog_data
          .filter(item => menu === "All" ? true : item.category === menu)
          .map((item, index) => {
            return (
              <BlogItem 
                key={index}
                id={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                category={item.category}
              />
            )
          })}
      </div>
    </div>
  )
}

export default BlogList