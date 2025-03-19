import React, { useEffect, useCallback } from "react";
import { ID } from "appwrite"; // ✅ Import ID
import { Button, Input, RTE } from "../index";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import service from "../../appwrite/Configuration";
import Select from "../Select";

function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  console.log("User Data in PostForm:", userData);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    watch,
    reset, // ✅ Add reset function
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  // ✅ Reset form when post data is available (Fix slug issue)
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        status: post.status || "active",
      });

      // ✅ Manually update the slug field
      setValue("slug", post.slug);
    }
  }, [post, reset, setValue]);

  const submit = async (data) => {
    if (!userData || !userData.$id) {
      console.error("User data is not available yet.");
      return;
    }

    try {
      let dbPost;
      let file = data.image && data.image[0] ? await service.uploadFile(data.image[0]) : null;

      if (post) {
        // ✅ If editing, update post
        if (file) {
          await service.deletePost(post.featuredImage); // Delete old image
        }

        dbPost = await service.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });
      } else {
        // ✅ If creating a new post, generate unique ID
        if (!file) {
          console.error("Image upload failed.");
          return;
        }

        dbPost = await service.createPost({
          $id: ID.unique(), // ✅ Ensuring unique ID only for new posts
          ...data,
          featuredImage: file.$id,
          userId: userData.$id,
        });
      }

      console.log("dbPost response:", dbPost);

      if (!dbPost || !dbPost.$id) {
        console.error("Post creation failed! dbPost is undefined or missing $id.");
        return;
      }

      console.log("Navigating to:", `/post/${dbPost.$id}`);
      navigate(`/post/${dbPost.$id}`);

    } catch (error) {
      console.error("Error in submit function:", error);
    }
  };

  // ✅ Fix Slug Transform
  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscribe = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => {
      subscribe.unsubscribe();
    };
  }, [watch, slugTransform, setValue]);

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input label="Title :" placeholder="Title" {...register("title", { required: true })} className="mb-4" />
        <Input
          label="Slug :"
          placeholder="Slug"
          {...register("slug", { required: true })}
          className="mb-4"
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
        />
        <RTE label="Content :" control={control} defaultValue={getValues("content")} name="content" />
      </div>

      <div className="w-1/3 px-2">
        <Input
          type="file"
          className="mb-4"
          label="FeaturedImage :"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && post.featuredImage && (
          <div className="w-full mb-4">
            <img src={service.getFilePreview(post.featuredImage)} alt={post.title} className="rounded-lg" />
          </div>
        )}

        <Select className="mb-4" options={["active", "inactive"]} label="Select" {...register("status", { required: true })} />
        <Button bgColor={post ? "bg-green-500" : undefined} className="w-full" type="submit">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm;
