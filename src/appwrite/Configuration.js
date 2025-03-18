import confg from '../confg/confg.js'
import { Client,Databases, Query,Storage,ID } from 'appwrite'

// in below code we are using field name as featuredImage info abt that field is as follow must read to avoid confusion in future
// createPost() & updatePost() use featuredImage to store the image file ID when creating/updating a post.
// uploadFile(): When a file is uploaded, Appwrite generates a unique fileId, which we store as featuredImage in the database.
// deleteFile(fileId): Uses fileId (same as featuredImage) to remove an image from Appwrite storage.

// 🔥 How It Works Step by Step
// User Uploads an Image → uploadFile(file) stores the image and returns a fileId.
// This fileId is stored as featuredImage in the database via createPost().
// When fetching posts, the UI gets the stored featuredImage (fileId).
// To display the image, getFilePreview(featuredImage) generates a URL to show the image in <img>.

// we can get confused btw slug and featuredImage as while deleting post in PostForm we are giving featuredImage but here we r saying that deleteFile(slug) so diff is that 

// as we know that slug is for doc id means entire row so with slug we can get title,content,image and if we just want to get image than we use featuredImage ryt
// ChatGPT said:
// Yes, exactly!

// Slug (Document ID) → Retrieves the entire row (blog post), which includes title, content, and featuredImage.
// FeaturedImage (File ID) → Retrieves only the image, since it directly refers to the uploaded file in storage.
// ✅ When to Use What?
// 1️⃣ Get full blog post (title, content, image, etc.)

// const post = await service.getPost(slug);  // Fetch entire post
// console.log(post.title, post.content, post.featuredImage);

// 2️⃣ Get only the image
// const imageUrl = service.getFilePreview(featuredImage);  // Fetch only the image

// 🔥 Conclusion
// Use slug when you need everything (title, content, and image).
// Use featuredImage when you need just the image. 
// bcz in PostForm when we r dlting we just want to dlt image not untire blog so that's why we r giving featuredImage

export class Service{
    client=new Client;
    databases;
    bucket; 
    // bucket is for storage
    // bucketId is a unique identifier for a storage bucket in Appwrite.
    // A bucket is a container where you store files (e.g., images, videos, PDFs).
    // Just like databaseId is for databases and collectionId is for tables, bucketId is for file storage in Appwrite.
    constructor(){
        this.client
        .setEndpoint(confg.appwriteUrl)
        .setProject(confg.appwriteProjectId)
        // .setKey(confg.appwriteApiKey)
        this.databases=new Databases(this.client)
        this.bucket=new Storage(this.client);

    }

    // from now onwards slug is gonna used as document id and  we have to take it from user only
    // documentId is a unique identifier for a specific document (row) inside a collection (table) in an Appwrite database.
    // Just like databaseId identifies a database, and collectionId identifies a table, documentId identifies a specific entry (record) in that table.

    async createPost({title,slug,content,featuredImage,status,userId}){
        try {
            return await this.databases.createDocument(confg.appwriteDatabaseId,confg.appwriteCollectionId,slug,{title,content,featuredImage,status,userId})
            
        } catch (error) {
            console.log("appwrite service :: createPost :: error",error);
        }

    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(confg.appwriteDatabaseId,confg.appwriteCollectionId,slug,{title,content,featuredImage,status})
        } catch (error) {
            console.log("appwrite service :: updatePost :: error",error);

        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(confg.appwriteDatabaseId,confg.appwriteCollectionId,slug)
            return true;
        } catch (error) {
            console.log("appwrite service :: deletePost :: error",error);
            return false;

        }

    }
    // below fun is to get a single post only

    async getPost(slug){
        try {
          return  await this.databases.getDocument(confg.appwriteDatabaseId,confg.appwriteCollectionId,slug)
        } catch (error) {
            console.log("appwrite service :: getPost :: error",error);
            return false;
        }
    }
    // below code is to get all the posts but if we dont apply any filtering than we got those posts also whose status is inactive and we dont want that so we are gonna use Query read syntax from documentation
    // to apply query we make sure that we create an index and for this table we made status as index 
    // query sholud be in array so instaed of writing them in listDocuments ([1 query,2query]) we can pass them as default arguments so that we dont need to do that and as here we only use one query still we gonna keep it in array
    // here synatx will be Query.equal('key(see from index)','value ') inspite of equal we can use other methods also depend upon our need

    async getPosts(query=[Query.equal('status','active')]){
        try {
            return await this.databases.listDocuments(confg.appwriteDatabaseId,confg.appwriteCollectionId,query)
        } catch (error) {
            console.log("appwrite service :: getPosts :: error",error);
            return false

        }
    }
    // file uplaoding 

    async uploadFile(file){
        try {
            return await this.bucket.createFile(confg.appwriteBucketId,ID.unique(),file)
        } catch (error) {
            console.log("appwrite service :: uploadFile :: error",error);
            return false
        }
    }
    // the below fileid we goona get from the return of above uploadFile fun goona understand later infact wherever we passed featuredImage is also the fileId only
    // bucketId → A specific folder (e.g., "My Photos").
    // fileId → A specific file inside the folder (e.g., "profile.jpg").
    async deletFile(fileId){
        try {
            await this.bucket.deleteFile(confg.appwriteBucketId,fileId);
            return true;
        } catch (error) {
            console.log("appwrite service :: deleteFile :: error",error);
            return false
        }

    }
    // getFilePreview is very fast so we dont need to use async-await here
    // If a user uploads 10 different images, then each image will have a unique fileId (which is used as featuredImage in your code).

// How It Works in Appwrite Storage
// 📌 When a user uploads an image using uploadFile(), Appwrite generates a unique file ID for that image.
// 📌 Each uploaded image will have a different fileId (even if the same image is uploaded multiple times).
// 📌 This fileId is stored in the database and used later to fetch/display the image.
// 

    getFilePreview(fileId){
        return this.bucket.getFilePreview(confg.appwriteBucketId,fileId)
    }
    // The getFilePreview(fileId) method of Appwrite returns a URL that points to a preview version of the file stored in Appwrite's storage.
    // Yes! In your code, featuredImage is actually the fileId of the uploaded image.
}

const service=new Service();
export default service;