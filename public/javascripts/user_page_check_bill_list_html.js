let check_bill_list_page_info = document.querySelector(".check_bill_list_page_info")



get_all_bill_list_check()

async function get_all_bill_list_check(){
    let list = await fetch("/users/api/unfinished_bill",{method:"get"}).then((res)=>res.json()).then((data)=>{return data})
    bill_list = JSON.parse(list)
    let bill_list_keys=Object.keys(bill_list)
    console.log(bill_list_keys)
    let bill_list_value=Object.values(bill_list)
    console.log(bill_list_value)
    let bill_list_entries = Object.entries(bill_list)
    console.log(bill_list_entries)
    console.log(bill_list_entries[0])
    // for(let i=0;i<bill_list_entries.length;i++){
    for(let i=bill_list_entries.length-1;i>=0;i--){
        let one_bill_info = bill_list_entries[i]
        let list 
        if(one_bill_info[0].bill_status != "已完成"){
            list = check_bill_list_page_info
        }else{
            list = check_bill_list_page_info
        }
        build_one_bill_box_check(list,one_bill_info)
    }
    
}


function build_one_bill_box_check(list,one_bill_info){
    let one_bill_price=0
    let now_status = ""
    let one_bill = document.createElement("div")
    one_bill.setAttribute("class","check_one_bill")
    let bill_number = document.createElement("div")
    bill_number.textContent=one_bill_info[0]
    let bill_content = document.createElement("div")
    // bill_content.setAttribute("class","bill_content")
    for(let i=0;i<one_bill_info[1].length;i++){
        let one_order = document.createElement("div")
        one_order.textContent=one_bill_info[1][i].product_name +"*"+ one_bill_info[1][i].quantity
        one_bill_price=one_bill_price+one_bill_info[1][i].quantity*one_bill_info[1][i].price
        console.log(one_bill_info[1][i].bill_status)
        console.log("------_+++++-----")
        now_status = one_bill_info[1][i].bill_status
        bill_content.appendChild(one_order)
    }
    let bill_price = document.createElement("div")
    bill_price.textContent = "$"+one_bill_price
    let bill_status = document.createElement("div")
    bill_status.textContent=now_status

    list.appendChild(one_bill)
    one_bill.appendChild(bill_number)
    one_bill.appendChild(bill_content)
    one_bill.appendChild(bill_price)
    one_bill.appendChild(bill_status)
    let br = document.createElement("hr")
    br.setAttribute("class","br")
    list.appendChild(br)

}
