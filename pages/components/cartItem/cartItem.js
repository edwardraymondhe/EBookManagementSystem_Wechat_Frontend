// pages/components/cartItem/cartItem.js
Component({
  properties: {
    itemInfo: Object,
  },
  data:{
    quantity: 0,
    bookId: 0,
    selected: false,
    bookInfo: null,
    selectedBg: 'rgb(255,255,255)'
  },
  lifetimes:{
    attached: function()
    {
      this.setData({quantity: this.properties.itemInfo.quantity});
      this.setData({bookId: this.properties.itemInfo.bookId});
      console.log(this.properties.itemInfo.bookColl);
      let _this = this;
      wx.request({
        url: 'http://localhost:8080/book/getBook',
        method: "GET",
        data: {
          bookId: _this.data.bookId
        },
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res.data);
          _this.setData({
            bookInfo: res.data
          })
        }
      });
    }
  },
  methods: {
    onClick: function(){
      this.setData({selected: !this.data.selected});
      if(this.data.selected)
      {
        this.setData({selectedBg: 'rgb(240,240,240)'}); 
      }else{
        this.setData({selectedBg: 'rgb(255,255,255)'});
      }
      this.triggerEvent('selectItem', this.properties.itemInfo.bookId);
    },
    inc(){
      if(this.data.quantity < this.data.bookInfo.stock)
      {
        this.setData({quantity: this.data.quantity + 1});
        this.watchQuantity();
      }else{
        wx.showToast({
          title: "We currently don't have that much in stock.",
          icon: 'none',
          duration: 1500
        });
      }
    },
    dec(){
      this.setData({quantity: this.data.quantity - 1});
      this.watchQuantity();
    },
    watchQuantity(){
      let _this = this;
      wx.request({
        url: 'http://localhost:8080/cart/updateCart',
        method: "GET",
        data: {
          userId: wx.getStorageSync('UserId'),
          bookId: _this.properties.itemInfo.bookId,
          quantity: _this.data.quantity
        },
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res.data);
          wx.setStorageSync('Cart', JSON.stringify(res.data));
          if(_this.data.quantity != 0)
            _this.triggerEvent('reCalc', 0);
          else
            _this.triggerEvent('reCalc', 1);
        }
      });
    }
  }
})
