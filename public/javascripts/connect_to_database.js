
// connect to databases check if the email exists
function check_account(connection_pool,email){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }
            else{
                sql = "select * from member where email = (?)"
                val = email
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }

                })
            }
        })
    })
    
}
//build a new account
function build_new_account(connection_pool,name,email,password){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }
            else{
                sql = "insert into member(name,email,password) values (?)"
                val = [name,email,password]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get member table information with email and password
function get_member_info(connection_pool,email){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from member where email = (?)"
                val = email
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

// upload new product to products table
function upload_product(connection_pool,product_name,product_image_url,product_information){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "insert into products(product_name,image_url,information) values (?)"
                val = [product_name,product_image_url,product_information]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all products information where status == "上架"
function get_products_information_their_status_is_selling(connection_pool){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from products where status = '上架中' "
                connection.query(sql,(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}





//upload new order_list to order_list table
function upload_order_list(connection_pool,member_id,product_id,quantity,bill_number){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "insert into order_list(member_id,product_id,quantity,bill_number) values (?)"
                bill_number=0
                val = [member_id,product_id,quantity,bill_number]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

// get all order_list by member_id
function get_order_list_with_memeber_id(connection_pool,member_id){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from order_list where member_id = (?)"
                bill_number=0
                val = [member_id]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}


// get all order_list by member_id and bill_number=0(not pay)
function get_order_list_inner_join_products_with_memeber_id_and_bill_number(connection_pool,member_id,billnumber="0"){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                console.log(billnumber)
                sql = "select * from order_list inner join products on order_list.product_id = products.product_id where order_list.member_id = (?) and order_list.bill_number = (?)"
                val = [member_id,billnumber]
                connection.query(sql,val,(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}



// get all order_list join prodicts by member_id
function get_info_order_list_inner_join_products_with_memeber_id(connection_pool,member_id){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from order_list inner join products on order_list.product_id = products.product_id where order_list.member_id = (?)"
                bill_number=0
                val = [member_id]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}


function update_bill_number(connection_pool,order_list_id,bill_number){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "update order_list set bill_number = (?) where order_list_id = (?)"
                val = [bill_number,order_list_id]
                connection.query(sql,val,(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

function insert_bill_list(connection_pool,bill_number,member_id){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "insert into bill_list(bill_number,member_id) values (?)"
                val = [bill_number,member_id]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}





async function check_and_build_new_account(connection_pool,name,email,password){
    let check_account1=await check_account(connection_pool,email)
    console.log(check_account1.length)
    if(check_account1.length != 0){
      response.json({
      "error":true,
      "message": "email重複，帳號建立失敗"
      })
    }else{
      let build_account = await build_new_account(connection_pool,name,email,password)
      console.log(build_account)
      response.json({
        "message":build_account
      })
    }
}

function get_bill_list(connection_pool,member_id){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from order_list inner join bill_list on order_list.bill_number = bill_list.bill_number  inner join products on order_list.product_id = products.product_id where bill_list.member_id = (?)"
                bill_number=0
                val = [member_id]
                connection.query(sql,[val],(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}

function get_chat_message(connection_pool,member_id,get_id){
    return new Promise((resolve,reject)=>{
        connection_pool.getConnection((err,connection)=>{
            if(err){
                console.log("連線失敗")
                reject("連線失敗")
            }else{
                sql = "select * from chat_message where (send_id = (?) or send_id = (?)) and (get_id = (?) or get_id = (?)) order by message_id asc"
                bill_number=0
                val = [member_id,get_id,member_id,get_id]
                connection.query(sql,val,(err,res)=>{
                    connection.release()
                    if(err){
                        reject("sql錯誤")
                    }else{
                        resolve(res)
                    }
                })
            }
        })
    })
}






module.exports.check_account=check_account
module.exports.build_new_account=build_new_account
module.exports.get_member_info=get_member_info
module.exports.upload_product=upload_product
module.exports.get_products_information_their_status_is_selling=get_products_information_their_status_is_selling
module.exports.upload_order_list=upload_order_list
module.exports.get_order_list_with_memeber_id=get_order_list_with_memeber_id
module.exports.check_and_build_new_account=check_and_build_new_account
module.exports.get_info_order_list_inner_join_products_with_memeber_id=get_info_order_list_inner_join_products_with_memeber_id
module.exports.get_order_list_inner_join_products_with_memeber_id_and_bill_number=get_order_list_inner_join_products_with_memeber_id_and_bill_number
module.exports.update_bill_number=update_bill_number
module.exports.insert_bill_list=insert_bill_list
module.exports.get_bill_list=get_bill_list
module.exports.get_chat_message=get_chat_message