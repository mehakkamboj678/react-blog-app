const confg={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteCollectionId:String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteDatabaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteBucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteApiKey:String(import.meta.env.VITE_APPWRITE_API_KEY),
    editorApiKey:String(import.meta.env.VITE_APPWRITE_EDITOR_API_KEY)
}

export default confg

// env should be string so that's why for safty reason we convert all the envs in string