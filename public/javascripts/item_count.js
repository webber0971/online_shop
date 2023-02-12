$(function(){
    var price=0;
    $("#cut").click(function(){
        price=$("#num").val();
        if($("#num").val()==0){
            return
        }else{
            price--
        }
        $("#num").val(price)
    })
    $("#add").click(function(){
        price=$("#num").val()
        price++
        $("#num").val(price)
    })
})