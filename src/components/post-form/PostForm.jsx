import React from 'react'
import {Button,Input,RTE} from '../index'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useEffect,useState,useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import service from '../../appwrite/Configuration'
import Select from '../Select'



function PostForm({post}) {
    
    const navigate=useNavigate();

    // const userDataFromRedux=useSelector((state)=>state.auth.userData)
    // const [userData,setUserData]=useState(userDataFromRedux)
    const userData=useSelector((state)=>state.auth.userData)
    console.log("User Data in PostForm:", userData);
    
    // useEffect(() => {
    //     const storedUserData = localStorage.getItem("userData");
    
    //     if (!userDataFromRedux) {
    //         if (storedUserData) {
    //             try {
    //                 setUserData(JSON.parse(storedUserData));
    //             } catch (error) {
    //                 console.error("Error parsing user data from localStorage:", error);
    //                 setUserData(null); // Fallback to null to prevent crashes
    //             }
    //         }
    //     } else {
    //         setUserData(userDataFromRedux);
    //     }
    // }, [userDataFromRedux]);
    
    
    const {handleSubmit,register,control,setValue,getValues,watch}=useForm({
        defaultValues:{
            title:post?.title || '',
            slug:post?.slug || '',
            content:post?.content || '',
            status:post?.status || 'active'
            // basically hum ye dekh rhe h ki jb user edit btn pr click krega agr usne pehle se kuch post kia h to post me sari values chli jaegi or jb hum us page pr jaenge jaha edition hona h vaha pehle se ye sari values dikhegi kuki humne yha defaulvalues me ye sb kuch dal dia h or agr ye b likha h agr post na b ho to sb kuch empty show krde
        }
    })
    const submit = async (data) => {
        if (!userData || !userData.$id) {
            console.error("User data is not available yet.");
            return;
        }
    
        try {
            let dbPost;
            
            if (post) {
                // Upload new image if provided
                const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;
                if (file) {
                    await service.deletePost(post.featuredImage); // Delete old image
                }
                
                // Update the post
                dbPost = await service.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage
                });
            } else {
                // Upload new image
                const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;
                if (!file) {
                    console.error("Image upload failed.");
                    return;
                }
    
                // Create a new post
                dbPost = await service.createPost({
                    ...data,
                    featuredImage: file.$id,
                    userId: userData.$id
                });
            }
    
            console.log("dbPost response:", dbPost);
    
            if (!dbPost || !dbPost.$id) {
                console.error("Post creation failed! dbPost is undefined or missing $id.");
                return;
            }
    
            console.log("Navigating to:", `/post/${dbPost.$id}`);
            navigate(`/post/${dbPost.$id}`); // ✅ Correct navigation
    
        } catch (error) {
            console.error("Error in submit function:", error);
        }
    };
    
    const slugTransform=useCallback((value)=>{
        if(value && typeof(value)==='string')
            return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g,'-')
        .replace(/\s/g,'-')

        return ''

    })
    useEffect(()=>{
        const subscribe=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug', slugTransform(value.title), { shouldValidate: true });
            }
        })
        return ()=>{
           subscribe.unsubscribe()
        }
    },[watch,slugTransform,setValue])
    // The unsubscribe() method is used when you call watch() without arguments, meaning you're watching all form fields. Since watching all fields can cause unnecessary re-renders, React Hook Form returns an unsubscribe function to stop watching when it's no longer needed.

// How It Works
// watch((data) => { ... }) → Watches all fields and runs whenever the user types.
// watch() returns an unsubscribe function.
// Inside useEffect(), we call unsubscribe() inside the cleanup function return () => unsubscribe();, so it stops watching when the component unmounts.

// Imagine you're listening to music:

// watch() = Starts playing the song 🎵
// unsubscribe() = Stops the song when you leave 🎧

// can we write is as const seeingyou= watch((data) => { 
//     console.log(data); 
// });
// return ()=>{seeingyou.unsubscribe()}

// ChatGPT said:
// Almost! But there's a small mistake in your code.
// 🔹 Corrected Version:

// const seeingyou = watch((data) => { 
//     console.log(data); 
// });
// return () => seeingyou(); // No need for `.unsubscribe()`

// Why?
// watch() itself returns an unsubscribe function.
// So, seeingyou is already the unsubscribe function.
// You just call it like seeingyou() to stop watching.
// means watch() returns a fun that is used to tell that stop watching and globally we call that fun unsbcribe() but we can catch that return fun in any var means const any-fun-name=watch()
if (!userData) {
    return <p>Loading user data...</p>;
}
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
       <div className="w-2/3 px-2">
        <Input label='Title :' placeholder='Title' {...register("title",{required:true})} className="mb-4"/>
        <Input label='Slug :' placeholder='Slug' {...register("slug",{required:true})} className="mb-4" onInput={(e)=>{setValue('slug',slugTransform(e.currentTarget.value),{shouldValidate:true})} }/>
        <RTE label='Content :' control={control} defaultValue={getValues("content")} name='content'/>

       </div>

       <div className="w-1/3 px-2">
        <Input type='file' className="mb-4" label='FeaturedImage :' accept="image/png, image/jpg, image/jpeg, image/gif" {...register('image',{required:!post})} />
        {post &&
        <div className="w-full mb-4">
            <img src={service.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg" />
            </div>
        }
       
       <Select className="mb-4" options={['active','inactive']} label='Select' {...register("status",{required:true})} />
       <Button bgColor={post ? "bg-green-500" : undefined} className="w-full" type='submit'>{post?"Update":"Submit"}</Button>
        
        </div> 
    </form>
  )
}

export default PostForm
