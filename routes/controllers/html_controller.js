module.exports = (router)=>{
    router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    });

    router.get("/cart",(request,response)=>{
    response.render("cart_page",{})
    })
}