import React, { useEffect, useState } from 'react'
import { Container,PostCard } from '../components'
import service from '../appwrite/Configuration'
import store from '../store/store'
import { useSelector } from 'react-redux'

function Home() {
    const [posts,setPosts]=useState([])
    const userdata=useSelector((state)=>state.auth.userData)
    useEffect(()=>{
      service.getPosts([]).then((posts)=>{
        if(posts){
            setPosts(posts.documents)
        }
      })
    },[])
   if(posts.length===0){
    if(userdata){
        return(
            <div>
                <Container>
                <div className="flex flex-wrap">
                            <div className="p-2 w-full">
                                <h1 className="text-2xl font-bold hover:text-gray-500">
                                    Add Posts
                                </h1>
                            </div>
                        </div>
                </Container>
            </div>
        )
    }
    return(
        <div>
            <Container>
            <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
            </Container>
        </div>
    )
   }
   return (
    <div  className='w-full py-8'>
        <Container>
        <div className='flex flex-wrap'>
           {posts.map((post)=>(
            <div key={post.$id} className='p-2 w-1/4'>
                <PostCard {...post}/>
            </div>
           ))}
           </div>
        </Container>
    </div>
   )
}

export default Home
