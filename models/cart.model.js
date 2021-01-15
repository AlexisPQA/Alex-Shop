module.exports =function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.datebuy = new Date().toDateString()
    this.add = function(item, id){
        var storedItem = this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {item: item,Quantity: 0, Price:0};
        }
        storedItem.Quantity++;
        storedItem.Price = storedItem.Quantity*storedItem.item.basePrice
        this.totalQuantity++;
        this.totalPrice += parseInt(storedItem.item.basePrice)

    };
    this.remove = function(id){
        var removeItem = this.items[id]
        this.totalQuantity -= removeItem.Quantity
        this.totalPrice -= parseInt(removeItem.Price)
        delete this.items[id]
    }
    this.generateArr = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id])
        }
        return arr
    }

    this.update = function(Data,id){
        var updateItem = this.items[id]
        updateItem.Quantity = Data[id].quantity;
        updateItem.Price = Data[id].subprice;
        this.totalPrice = Data['totalPrice']
        this.totalQuantity = Data['totalQuantity']
        console.log(this.totalQuantity)
    }


}