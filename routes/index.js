var express = require('express');
var router = express.Router();
var mysql = require('mysql');

require("dotenv").config()
const S3_ID= process.env.S3_ID
console.log(S3_ID)


// nodejs jwt -- https://cloud.tencent.com/developer/article/1540741
// nodejs jsonwebtoken -- https://hackmd.io/@Aquamay/Sy9WtWDQq
//导入 express-jwt 包
const { expressjwt: expressJwt } = require('express-jwt')
const jwt = require("jsonwebtoken")
// 使用cookie-parser取得與解析request
const cookieParser = require("cookie-parser");
router.use(cookieParser())
// .unless({用正则指定不需要访问权限的路径}) 
const jwt_secretkey = "secret123"
router.use(expressJwt({
  secret:jwt_secretkey, 
  algorithms: ['HS256'],
  //用 getToken 屬性，設定從 cookie 中取得 要比對的 access_token
  getToken:(request)=>{
    if("access_token" in  request.cookies){
      return request.cookies["access_token"]
    }else{
      return null
    }
  }
}).unless({ path:["/paypal","/api/member","/","/test/cookie","/api/selling_products_info","/auth/google","/auth/google/callback","/success","/auth/facebook","/cart"] }))


// 使用 node-cache isomorphic-fetch 加速存取，降低訪問rds頻率
const nodecache = require('node-cache');
// const appCache = new nodecache({ stdTTL : 3599}); stdTTL 為快取存在時間，單位為秒
const appCache = new nodecache();



var connection_pool = mysql.createPool({
    connectionLimit:10,
    host     : process.env.RDS_HOST,
    user     : process.env.RDS_USER,
    password : process.env.RDS_PASSWORD,
    database : process.env.RDS_DATABASE
});
console.log("連接上資料庫")

//安裝 multer 解析 mutlipart bodies , 數據安裝在 body 中可以用 body-parser 包及 multer包
const multer = require("multer");
let upload = multer()


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/cart",(request,response)=>{
  response.render("cart_page",{})
})

router.get("/test",(req,res)=>{
  res.render("test",{})
})

router.get("/paypal",(request,response)=>{
  response.render("paypal",{})
})
router.post("/api/orders",upload.array(),(request,response)=>{
  console.log(request.body["prime"])
  let prime=request.body.prime
  let temp_token = request.cookies.access_token
  let member_email=""
  let member_id=""
  let member_name=""
  let amount=request.body.order.price
  let order_list=request.body.order.trip
  let address= request.body.order.contact.address
  let member_phone=request.body.order.contact.phone
  let order_list_string=""
  console.log(order_list)
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      member_id=payload.member_id
      member_name=payload.name
      member_email=payload.email
    }
  })
  for(let i=0;i<order_list.length;i++){
    order_list_string=order_list_string+" "+order_list[i]
  }
  console.log(order_list_string)
  let url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
  let headers={
    'Content-Type': 'application/json',
    'x-api-key': 'partner_GhEedd0oFO42dBxPBp7qWJzRM6Qb6V4h5WPnKkDw0PbYRlTofSamRqEq'
  }
  console.log("+++++++++++")
  console.log(prime)
  console.log(order_list_string)
  console.log(member_phone)
  console.log(member_name)
  console.log(member_email)


  let post_data = {
    "prime":prime,
    "partner_key": "partner_GhEedd0oFO42dBxPBp7qWJzRM6Qb6V4h5WPnKkDw0PbYRlTofSamRqEq",
    "merchant_id": "webber0971_ESUN",
    "amount": amount,
    "currency": "TWD",
    "details": order_list_string,
    "cardholder": {
      "phone_number": member_phone,
      "name": member_name,
      "email": member_email
    },
    "remember": false
  }
  console.log("---------")

  
  update_bill_number_flow(connection_pool,order_list,response)

  async function update_bill_number_flow(connection_pool,order_list,response){
    console.log("rrrrrrrrrrr")
    let ans =await fetch(url,{method:"post",headers:headers,body:JSON.stringify(post_data)})
    .then((res)=>res.json())
    .then((data)=>{
      // console.log(data)
      return data
    }).catch((err)=>{
      return err
    })
    console.log("jeejejejej")
    console.log(ans)
    if(ans.status == 0){
      let bill_number= ans.rec_trade_id
      console.log(order_list)
      console.log(ans.rec_trade_id)
      let check_account=await connect_to_database.insert_bill_list(connection_pool,bill_number,member_id)
      for(let i=0;i<order_list.length;i++){
        console.log(order_list[i])
        //更新訂單狀態
        let check_account=await connect_to_database.update_bill_number(connection_pool,order_list[i],bill_number)
      }
      response.statusCode=200
      response.json({"msg":"success","payment":{"status":0,"bill_number":bill_number}})
    }else{
      response.statusCode=500
      response.json({"error":true,"message":ans})
    }
  }
})




  // response.json({"eee":"dkdk"})



router.get("/member_info",(req,res)=>{
  connection_pool.getConnection((err,connection)=>{
    if(err){
      console.log("get_member_info連接資料庫失敗")
    }else{
      sql="select * from member"
      connection.query(sql,(err,res)=>{
        console.log(err)
        console.log(res)
        connection.release()
      })
    }
  })
})

router.get("/add_member_info",(req,res)=>{
  connection_pool.getConnection((err,connection)=>{
    if(err){
      console.log("get_member_info連接資料庫失敗")
    }else{
      sql="insert into member(name,email,password) values ?"
      val=[2,3,4]
      connection.query(sql,(err,res)=>{
        console.log(err)
        console.log(res)
        connection.release()
      })
    }
  })
})


let connect_to_database = require("../public/javascripts/connect_to_database");
const { response, request } = require('express');
//建立新帳號
router.post("/api/member",upload.array(),(request,response)=>{
  let name=request.body["name"]
  let email = request.body["email"]
  let password = request.body["password"]

  check_and_build_new_account(connection_pool,name,email,password)

  async function check_and_build_new_account(connection_pool,name,email,password){
    let check_account=await connect_to_database.check_account(connection_pool,email)
    console.log(check_account.length)
    if(check_account.length != 0){
      response.json({
      "error":true,
      "message": "email重複，帳號建立失敗"
      })
    }else{
      let build_account = await connect_to_database.build_new_account(connection_pool,name,email,password)
      console.log(build_account)
      response.json({
        "message":build_account
      })
    }
  }
})

//帳號登入
router.put("/api/member",upload.array(),(request,response)=>{
  let email = request.body["email"]
  let password = request.body["password"]
  login(connection_pool,email,password)
  //use email to get member info from table and check password
  async function login(connection_pool,email){
     let get_member_info = await connect_to_database.get_member_info(connection_pool,email)
     console.log(get_member_info)
     if(get_member_info.length == 0){
      response.json({
        "message":"login fail"
      })
     }else{
      if(get_member_info[0].password == password){
        const payload = {
          email:get_member_info[0].email,
          member_id:get_member_info[0].member_id,
          name:get_member_info[0].name
        }
        const token=jwt.sign(payload,jwt_secretkey,{expiresIn : "1d"})
        console.log(token)
        response
        .cookie("access_token",token)
        .json({
          "status":"ok",
          data:{
            data:{token:token}
          }
        })
      }else{
        response.json({
          "message":"password error"
        })
      }
     }
  }
})
////////////////////////////////
// login with google
const googleRouter = require('../public/javascripts/google_auth');
router.use('/auth/google', googleRouter);
// login with fb
const facebookRouter = require('../public/javascripts/facebook_auth');
router.use('/auth/facebook', facebookRouter);


// use access token 取得會員資料
router.get("/api/member",(request,response)=>{
  let temp_token = request.cookies.access_token
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      console.log(payload)
      response.statusCode=200
      response.json(payload)
    }
  })
})
// logout and delete cookie in web
router.delete("/api/member",(request,response)=>{
  // request.logout()
  response
  .cookie("access_token",{expires: Date.now()}) // 間到期時間設為現在
  .json({
    "message":"登出成功"
  })  
})

// get products_information from table products where status = 上架中
router.get("/api/selling_products_info",(request,response)=>{
  if(appCache.has("selling_products_info")){
    console.log("info from cache")
    response.json({"info":appCache.get("selling_products_info")})
  }else{
      get_products_information_their_status_is_selling_1(connect_to_database,request,response)
  }
  async function get_products_information_their_status_is_selling_1(connect_to_database,request,response){
    let all_products_information = await connect_to_database.get_products_information_their_status_is_selling(connection_pool)
    console.log(all_products_information.length)
    appCache.set("selling_products_info",all_products_information)
    response.json({"info":all_products_information})
  }
})
const url = require("url")
const querystring=require("querystring");
const { copyFileSync } = require('fs');

// 取得所有購物清單
router.get("/api/cart",upload.array(),(request,response)=>{
  console.log("kfoefke")
  console.log(request.url)
  let rawurl = request.url
  let parserUrl = url.parse(rawurl)
  console.log(parserUrl)
  let parsedQs = querystring.parse(parserUrl.query)
  console.log(parsedQs)
  console.log("-------")
  let bill_number=0
  if("billNumber" in parsedQs){
    console.log(parsedQs.billNumber)
    bill_number=parsedQs.billNumber
  }
  let temp_token = request.cookies.access_token
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      let member_id=payload.member_id
      get_all_order_in_cart(connection_pool,member_id,bill_number,response)

      async function get_all_order_in_cart(connection_pool,member_id,bill_number,response){
        let get_order_list = await connect_to_database.get_order_list_inner_join_products_with_memeber_id_and_bill_number(connection_pool,member_id,bill_number)
        response.statusCode=200
        response.json({message:get_order_list})
      }
    }
  })
})

//取得 bill_list by member_id
router.get("/api/bill_list",upload.array(),(request,response)=>{
  let temp_token = request.cookies.access_token
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      let member_id=payload.member_id
      console.log(member_id)
      get_bill_list_by_memberId(connection_pool,member_id,response)

      async function get_bill_list_by_memberId(connection_pool,member_id,response){
        let get_order_list = await connect_to_database.get_bill_list(connection_pool,member_id)
        console.log(get_order_list)
        let bill_number_array=[]
        for(let i=0;i<get_order_list.length;i++){
          if(!bill_number_array.includes(get_order_list[i].bill_number)){
            bill_number_array.push(get_order_list[i].bill_number)
          }
        }
        let myMap = new Map()
        for(let i=0;i<bill_number_array.length;i++){
          myMap.set(bill_number_array[i],[])
        }
        for(let i=0;i<get_order_list.length;i++){
          console.log(get_order_list[i].bill_number)
          myMap.get(String(get_order_list[i].bill_number)).push(get_order_list[i])
        }
        let obj = Object.fromEntries(myMap)
        let jsonString = JSON.stringify(obj)
        response.statusCode=200
        response.json(jsonString)
      }
    }
  })
})


// 取得未付款的購物清單
router.get("/api/cart/:billNumber",upload.array(),(request,response)=>{
  let bill_number=request.query.billNumber
  console.log(bill_number)
  console.log("doo")
  let temp_token = request.cookies.access_token
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      let member_id=payload.member_id
      get_all_order_in_cart(connection_pool,member_id,response)

      async function get_all_order_in_cart(connection_pool,member_id,response){
        let get_order_list = await connect_to_database.get_order_list_inner_join_products_with_memeber_id_and_bill_number(connection_pool,member_id)
        response.statusCode=200
        response.json({message:get_order_list})
      }
    }
  })
})




// 加入購物車
router.post("/api/cart",upload.array(),(request,response)=>{
  let temp_token = request.cookies.access_token
  jwt.verify(temp_token,jwt_secretkey,(err,payload)=>{
    if(err){
      console.log(403,"token無效，解開jwt失敗")
      response.json({
        error:true,
        "message":"token無效，解開jwt失敗"
      })
    }else{
      let member_id=payload.member_id
      let product_id=request.body["product_id"]
      let quantity = request.body["quantity"]
      console.log()
      let bill_number=""

      add_order_list_into_cart(connection_pool,member_id,product_id,quantity,bill_number,response)

      async function add_order_list_into_cart(connection_pool,member_id,product_id,quantity,bill_number,response){
        let upload_order_list = await connect_to_database.upload_order_list(connection_pool,member_id,product_id,quantity,bill_number)
        response.statusCode=200
        response.json({message:upload_order_list})
      }
    }
  })
})

router.get("/test/cookie",(request,response)=>{
  console.log(request.cookies.access_token)
  response.json({
    "message":request.cookies
  })
})




module.exports = router;
