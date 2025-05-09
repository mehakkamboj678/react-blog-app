import React, { useEffect, useState } from 'react'
import { Container, PostForm } from '../components'
import service from '../appwrite/Configuration'
import { useNavigate, useParams } from 'react-router-dom'
function EditPost() {
    const [post,setPost]=useState(null)
    const {slug}=useParams()
    const navigate=useNavigate()
    useEffect(()=>{
        if (slug){
            service.getPost(slug).then((post)=>{
                setPost(post)
            })
        }
        else{
            navigate('/')
        }
    },[slug,navigate])
  return post?(
    <div className='py-8'>
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  ):null
}

export default EditPost
