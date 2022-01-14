
const form=document.getElementById("form");


let what="";
let where="";

let status=0;
let path="";

let progressID;


form.addEventListener("submit", (event) => {

    event.preventDefault();

    what = document.getElementById("what").value;
    where = document.getElementById("where").value;

    if(what==""){
        document.getElementById("what").classList.add('inputError');
        return ;
    }else{
        document.getElementById("what").classList.remove('inputError');
    }

    const submitBtn=document.getElementById("submit-btn");
    submitBtn.innerText="Extracting...";
    submitBtn.style.backgroundColor="#103366";

    submitBtn.disabled="true";
    progressID=setInterval(startProgress,150);

    fetch("/data",{
        method:"POST",
        body:JSON.stringify({
            what,where
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((res)=>{
        return res.json();
    }).then((result)=>{
        status=result.status;
        path=result.path;
        submitBtn.innerText="Find jobs";
        submitBtn.style.backgroundColor="#164081";
        finishedWork(path);
    })
    .catch((err)=>{
        console.log(err);
        document.getElementById("errorWindow").style.display="block";

    })

})




let progress=0;
function startProgress(){
    let x=document.querySelector('.progress-value');
    x.style.width=`${progress}%`;
    if(progress>=50){
        clearInterval(progressID);
    }
    progress+=10;
}

function finishedWork(link){
    let x=document.querySelector('.progress-value');
    x.style.width="100%";
    console.log(link);
    displayLink(link);
    x.style.width="0";
}


function displayLink(link){
    let aTag=document.getElementById("download");
    let aTitle=document.getElementById("download-title");
    aTitle.innerText="Link :";
    aTag.innerText=link+'/jobData.xlsx';
}
