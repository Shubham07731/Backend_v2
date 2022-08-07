const express=require("express");
const app=express();
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.username}:${process.env.password}@cluster0.bjkgo7k.mongodb.net/?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true}).then(res=>{
    console.log("connected")
}).catch(error=>{
    console.log("something wrong",error)
})
const customer=mongoose.Schema({
    firstName:String,
    lastName:String,
    phoneNumber:String
})
const cors = require('cors');

app.options('*', cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json()) 
const Student=mongoose.model("customer",customer)


app.post("/", (req,res)=>{
    console.log(req.body)
if(req.body.phoneNumber && req.body.firstName && req.body.lastName)
{
    Student.findOne({phoneNumber:req.body.phoneNumber},(err,respo)=>{
        if(err)
    {
        return res.json({
            success: 0,
            data: "Something Went Wrong",
          });
    }
    else{
    console.log(respo)
        if(respo)
        {
            console.log("Already Exist")
            return res.json({
                success: 0,
                data: "Contact Already Exist",
              });
        }
        else{
            console.log("response")
    
            Student.insertMany(req.body,(error,response)=>{
                if(error)
                {
                    return res.json({
                        success: 0,
                        data: "Something Went Wrong",
                      });
                }
                else{
                    return res.json({
                        success: 1,
                        data: "Contact Added Successfully",
                      });
                }
               })        
        }
    }
    })
}
else{
    return res.json({
        success: 0,
        data: "Contact Form Should not be Empty",
      });
}



})
app.get("/edit/:id",(req,res)=>{
Student.findById({_id:req.params.id},(err,response)=>{
    if(err)
    {
        return res.json({
            success:0,
            data:"Something Went Wrong"
        })
    }
    else{
        
        return res.json({
            success:1,
            data:response
    
})   
    } 
})
})
app.post("/Update/:id",(req,res)=>{
    console.log("req",req.body,req.params.id)
    Student.findByIdAndUpdate({_id:req.params.id},{$set:{firstName:req.body.firstName,lastName:req.body.lastName,phoneNumber:req.body.phoneNumber}},{multi:true},(error,response)=>{
        if(error)
        {
            return res.json({
                success:0,
                data:"Something Went Wrong"
            })
        }
        else{
            console.log("response",response)
            return res.json({
                success:1,
                data:response
            })
        }
    })
})
app.get("/",(req,res)=>{
    Student.find({},(err,response)=>{
        if(err)
        {
            return res.json({
                success:0,
                data:"Something Went Wrong"
            })
        }
        else{
            return res.json({
                success:1,
                data:response
            })
        }
    })
})
app.post("/delete/:id",(req,res)=>{
Student.findByIdAndDelete({_id:req.params.id},(err,response)=>{
    if(err)
    {
        return res.json({
            success:0,
            data:"Something Went Wrong"
        })
    }
    else {
        return res.json({
            success:1,
            data:"Row Deleted Successfully"
        })
    }
})
})

app.listen(process.env.PORT,()=>{
    console.log("server is working")
})