use_member_info_to_build_top_right()

let header_wrap = document.getElementById("header_wrap")
let h1 = document.createElement("h1")
h1.setAttribute("class","image_to_home_page")
let ul = document.createElement("ul")
ul.setAttribute("class","menu")
let number_hint = document.createElement("span")
number_hint.setAttribute("class","number_hint")
number_hint.textContent=""

let chat_room = document.createElement("li")
chat_room.setAttribute("class","chat_room")
chat_room.textContent="聊天室"

let li_cart = document.createElement("li")
li_cart.setAttribute("class","li_cart")
li_cart.textContent="購物車"

let li_register = document.createElement("li")
li_register.setAttribute("id","register")
li_register.textContent="註冊"
li_register.style.display="none"

let li_login = document.createElement("li")
li_login.setAttribute("id","login")
li_login.textContent="登入"
li_login.style.display="none"

let li_logout = document.createElement("li")
li_logout.setAttribute("id","logout")
li_logout.textContent="登出"
li_logout.style.display="none"


header_wrap.appendChild(h1)
header_wrap.appendChild(ul)
ul.appendChild(chat_room)
ul.appendChild(li_cart)
li_cart.appendChild(number_hint)
ul.appendChild(li_register)
ul.appendChild(li_login)
ul.appendChild(li_logout)

go_to_cart_page()
go_to_home_page()
go_to_chat_room_page()
function go_to_cart_page(){
    let li_cart = document.querySelector(".li_cart")
    li_cart.addEventListener("click",()=>{
        location = location.href="/cart" 
    })
}

function go_to_home_page(){
    let image_to_home_page = document.querySelector(".image_to_home_page")
    image_to_home_page.addEventListener("click",()=>{
        location = location.href="/" 
    })
}

function go_to_chat_room_page(){
    let go_to_chat_page = document.querySelector(".chat_room")
    go_to_chat_page.addEventListener("click",()=>{
        console.log("elle")
        console.log("user_id = ",client_id)
        if(client_id == undefined){
            let login_page = document.querySelector(".login_page")
            login_page.style.display="block"
        }else{
            let url = "/users/users_chat_page"
            OpenInNewTab(url)
            // location.href = "https://test8812.foodpass.club/users/users_chat_page"
            function OpenInNewTab(url) {
                var newTab = window.open(url, '_blank');
                newTab.location;
            }
        }
    })
}


function get_member_information_by_access_token_in_cookie(){
    return new Promise((resolve,reject)=>{
        fetch("/api/member",{
            method:"get",
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data)
            get_order_list_number_in_cart()
            resolve(data)
        }).catch(error=>{
            console.log("error",error)
            reject(error)
        })
    })
}

async function use_member_info_to_build_top_right(){
    let member_info 
    member_info = await get_member_information_by_access_token_in_cookie()
    console.log(member_info)
    if(member_info.error){
        li_register.style.display="block"
        li_login.style.display="block"
    }else{
        li_logout.style.display="block"
    }
}

function get_order_list_number_in_cart(){
    fetch("/api/cart/?billNumber=0",{
        method:"get"
    }).then((res)=>res.json())
    .then((data)=>{
        console.log(data.message)
        console.log(data.message[0])
        // console.log(data.message[0].quantity)
        let count= 0 
        if(data.message.length>0){
            for (let i=0;i<data.message.length;i++){
                count=count+data.message[i].quantity
                console.log(count)
            }
            number_hint.textContent=count      
        }else{
            number_hint.textContent=""
        }
    })
}
