

function addToCart(id){
    url = '/cart/add-to-cart/'+id
    var count = document.getElementById('Count')
    count.innerHTML = parseInt(count.innerHTML)+1
    axios.get(url)
      .then(function (response) {
          
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
} 