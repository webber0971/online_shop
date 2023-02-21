

let selling_chart = document.querySelector(".selling_chart")
let my_chart = document.querySelector(".my_chart")
drow_chart()

async function drow_chart() {
    let dic = await fetch("/users/api/all_bill", { method: "get" }).then((res) => res.json()).then((data) => { return data })
    dic = Object.entries(JSON.parse(dic))
    console.log(dic)
    let product_quantity = []
    let product_name = []
    for (let i = 0; i < dic.length; i++) {
        product_quantity.push(dic[i][1])
        product_name.push(dic[i][0])
    }
    console.log(product_quantity)

    let color_array = generate_random_rgba(dic.length)

    var myPieChart = new Chart(my_chart, {
        type: "pie",
        // data: product_quantity,
        // options: product_name
        data: {
            labels: product_name,
            datasets: [{
                label: '# test', //標籤
                data: product_quantity, //資料
                //圖表背景色
                backgroundColor: color_array,
                //圖表外框線色
                borderColor: color_array,
                //外框線寬度
                borderWidth: 1
            }]
        }
    });


}


function generate_random_rgba(number) {
    let result = []
    for (let i = 0; i < number; i++) {
        let r = Math.floor(Math.random() * 256)
        let g = Math.floor(Math.random() * 256)
        let b = Math.floor(Math.random() * 256)
        let a = Math.floor(Math.random() * 256)
        let rgba = "rgba(" + r + "," + g + "," + b + "," + a + ")"
        result.push(rgba)
    }
    return result
}
