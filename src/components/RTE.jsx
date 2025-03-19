import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import { Controller } from 'react-hook-form'
import confg from '../confg/confg'
console.log("TinyMCE API Key in Vercel:", confg.appwriteApiKey);
// RTE means rich text editor
function RTE({label,name,control,defaultValue=''}) {
  return (
    <div className='w-full'> 
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
      {/* What is Controller in React Hook Form?
Normally, register from React Hook Form works with basic inputs like <input> or <select>. But some complex components (like third-party UI libraries) don't work directly with register.

👉 Controller is used to wrap such inputs, so React Hook Form can control them properly. */}
      <Controller
      name={name || 'content'}
      control={control}
    //   control ek attribute h jaise ref h or hum chahte h ki humare editor ko jo b call kre uske pass iska control ho means refrence ho to {control} means jo b ise call krega jo ki actual me react hook form krega dusri file ke ander to uske pass iska control jana chahiye to uske pass b ek property h const {handleSubmit , control}=useForm to ise call krte time hum aise likenge <RTE control={control}==ye vala useForm se h or =se pehle vala prop h
   
      //   control ek attribute (prop) hai jo RTE component me bhej rahe hain.
// {control} useForm() se aata hai, jo form ko manage karta hai.
// Jab RTE component ko call karte hain, hum control={control} likhte hain.
// = ke baad wala control useForm() se aata hai.
// = se pehle wala control RTE component ka prop hai.
// control ka kaam Controller ko manage karna hai, taki React Hook Form TinyMCE editor ka state track kar sake.
// Ye waise hi hai jaise ref kisi element ka reference deta hai, waise hi control React Hook Form ko batata hai ki is field ko track karna hai.
// 🔥 Short Summary:
// Jo bhi RTE component ko use karega, usko control ka access dena padega (jo useForm() ka hissa hai), taki React Hook Form editor ki state track kar sake.

    // since editor is inside controller so its whole control is controlled  by control={control}  and when we call RTE we pass its value as control={control}  and here {control} comes from rhf(useForm) and that's how they gonna take control over it u can see its calling in  
      render={({field : {onChange}})=>(
        <Editor 
        initialValue={defaultValue}
        apiKey="xy88b81cue5aab6t1v675xq04f1qe9fmo40kmxqafo3dg1nq"
        init={
            { 
               branding:false,
               menubar:true,
               plugins:[
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
               ],
               toolbar:"undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
        }}
        onEditorChange={onChange}
        />
      )}
      />
    </div>
  )
}

export default RTE
