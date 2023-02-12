init()

async function init(){
    let x = await fetch("/api/bill_list",{
        method:"get"
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data)
    })
}