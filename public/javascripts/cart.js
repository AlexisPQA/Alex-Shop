function changeQuantity(id) {
    Data ={}
    var quantity = parseInt(document.getElementById(id).value);
    var price = parseInt(document.getElementById(id+"price").innerHTML.split('Price: ')[1]);
    var subprice = document.getElementById(id+"subprice");
    var totalQty = document.getElementById("totalQty");
    var totalPrice = document.getElementById("totalPrice");

    subprice.innerHTML = price* quantity;
    var allSubPrice = document.querySelectorAll("td.subPrice");
    var allQty = document.querySelectorAll("input.Qty");

    totalQty.innerHTML = 0
    totalPrice.innerHTML = 0
    for (val of allSubPrice){
        totalPrice.innerHTML = parseInt(val.innerHTML )+parseInt(totalPrice.innerHTML)
    }

    for (val of allQty){
        totalQty.innerHTML = parseInt(val.value)+parseInt(totalQty.innerHTML)
    }
    var count = document.getElementById('Count')
    count.innerHTML = totalQty.innerHTML
    subprice =subprice.innerHTML
    Data['id'] = id
    Data[id] = {quantity,subprice}
    Data['totalQuantity'] = totalQty.innerHTML
    Data['totalPrice'] = totalPrice.innerHTML
    axios.post('/cart/update-cart', Data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
