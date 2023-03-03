console.log("-=-=-=-=-=-=-=-=-=-=-=-===")
console.log(client_id)
let user_id=""
init_entrance_page()
let entrance_online_shop_home_page = "客人專用頁面，可以訂購、刪除餐點，以及購物車與查詢歷史訂單。此外右下角還有聊天功能，可以即時與店家聯繫 !"
let entrance_user_page_text = "店長、員工可以從後台查詢 訂單列表、銷售統計、上傳新品、更改品項狀態、員工回報訂單進度 !"
let entrance_chat_room = "聊天室，方便店家可以同時回復所有顧客訊息，類似 line official account manager 的聊天功能。同時會員們也可以互加好友聊天 !"
let entrance_1v1_video_call = "1 對 1 即時視訊功能 !"
let entrance_welcome_text = document.querySelector(".entrance_welcome_text")

function init_entrance_page(){
    use_member_info_to_build_top_right()
    add_entrance_button_listener()
}


async function use_member_info_to_build_top_right(){
    let member_info 
    member_info = await get_member_information_by_access_token_in_cookie()
    console.log(member_info)
    if(member_info.error){
        user_id="none"
    }else{
        user_id=member_info
    }
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


function add_entrance_button_listener(){
    let home_page = document.querySelector(".home_page")
    let user_page = document.querySelector(".user_page")
    let chat_room_entrance = document.querySelector(".chat_room_entrance")
    let video_chat = document.querySelector(".video_chat_entrance")


    home_page.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            location.href = "/"
        }
    })
    home_page.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_online_shop_home_page
    })


    user_page.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            location.href = "/users"
        }
    })
    user_page.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_user_page_text
    })


    chat_room_entrance.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            location.href = "/users/users_chat_page"
        }
    })
    chat_room_entrance.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_chat_room
    })

    video_chat.addEventListener("click",()=>{
        console.log("user_id = ",user_id)
        if(user_id == "none"){
            console.log("使用者尚未登入")
            register_page.style.display="none"
            login_page.style.display="block"
        }else{
            let room_name = _uuid()
            console.log(room_name)
            let url = "/users/video_room/"+String(room_name)
            OpenInNewTab(url)
        }
    })
    video_chat.addEventListener("mouseenter",()=>{
        entrance_welcome_text.textContent = entrance_1v1_video_call
    })
}

function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
function OpenInNewTab(url) {
    var newTab = window.open(url, '_blank');
    newTab.location;
}