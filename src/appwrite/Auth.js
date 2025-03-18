import confg from '../confg/confg.js'
import { Client, Account, ID } from "appwrite";


export class AuthService{
     client=new Client();
     account;
     constructor(){
        this.client
        .setEndpoint(confg.appwriteUrl)
        .setProject(confg.appwriteProjectId)
        // .setSelfSigned(true); // Enable self-signed SSL certs for local development

        // .setKey(confg.appwriteApiKey)
        this.account=new Account(this.client)
     }
     async createAcc({ email, password, name }) {
        try {
            const userAcc = await this.account.create(ID.unique(), email, password, name);
            if (userAcc) {
                try {
                    await this.login({ email, password });
                } catch (error) {
                    console.error("Login failed after signup:", error);
                }
            }
            return userAcc;
        } catch (error) {
            throw error;
        }
    }
    
//  above createAcc fun is actually for signup and we r saying that as soon as person signedup he/she should be logedin automatically he/she doesnt need to do login sepeartely after signup
     async login({email,password}){
        try {
          return  await this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            throw error;
        }
     }
    //  below fun is used for the cases like if i already have acc and i logined also so whenver homepage is opened we should check whether i am logined or not
    //  async getCurrentUser(){
    //     try {
    //         return await this.account.get()
    //     } catch (error) {
    //         console.log("appwrite service :: getCurrentUser :: error",error);
            
    //     }
    //     return null;
    //  }
   
    async getCurrentUser() {
        try {
            const session = await this.account.getSession('current'); // Check if user has session
            if (!session) {
                console.log("No active session found.");
                return null;
            }
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
            return null;
        }
    }
    

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("appwrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService()
 
export default authService