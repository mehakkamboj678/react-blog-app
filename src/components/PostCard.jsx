import React from 'react'
import service from '../appwrite/Configuration'
import {Link} from 'react-router-dom'

function PostCard({$id,title,featuredImage}) {
  return (
    <Link to={`/post/${$id}`}>
    <div className='w-full bg-gray-100 rounded-xl p-4'>
      <div className='w-full justify-center mb-4'>
        <img src={service.getFilePreview(featuredImage)} alt={title} className='rounded-xl' />
      </div>
      <h2  className='text-xl font-bold'>{title}</h2>
    </div>
    </Link>
  )
}
// above here featuredImage is not an actual image → It is just the file ID of an uploaded image in Appwrite's storage system.
// 🔹 How getFilePreview(fileId) Works
// 📌 Appwrite Storage keeps files in a bucket, and each file has a unique fileId.
// 📌 getFilePreview(fileId) generates a public URL that can be used to display the image in an <img> tag.

export default PostCard
