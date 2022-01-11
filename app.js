const express=require('express');
const bodyParser=require('body-parser');

const jobDataExtracter=require('./jobData');

const app =express();
app.use(express.static("public"));

const port=process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/data',(req,res)=>{

    const {what,where}=req.body;
    console.log(what,where);
    jobDataExtracter(what,where).then((result)=>{
        res.send({
            status:result.status,
            path:result.path
        })
        console.log("Compeleted Extracted Data")
    }).catch((err)=>{
        console.log(err)
    })
})

app.listen(port,()=>{
    console.log("Server is working");                                                                                                                                                                         
})

