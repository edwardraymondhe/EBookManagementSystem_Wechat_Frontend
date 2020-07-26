// pages/cart/cart.js
Page({

  /**
   * Page initial data
   */
  data: {
    active: 0,
    cartItems: [],
    checkedItem: [],
    show: false
  },

  checkout(){
    let _this = this;

    if(_this.data.checkedItem.length <= 0)
    {
      wx.showToast({
        title: "You brought an empty bucket with you...?",
        icon: 'none',
        duration: 1500
      });
      return;
    }

    _this.setData({sent: true});

    let checkedItem = JSON.stringify(_this.data.checkedItem);
    console.log("Before request:");
    console.log(checkedItem);
    let userId = JSON.stringify(wx.getStorageSync('UserId'));
    wx.request({
      url: 'http://localhost:8080/purchase/updatePurchaseItems',
      method: "GET",
      data: {
        userId: userId,
        checkedItems: checkedItem
      },
      header: {
        'content-type': 'application/json',
      },
      success(response) {
        let fetchOrder = JSON.stringify(response.data);
        wx.setStorageSync('Order', fetchOrder);
        console.log("After success1");
        wx.request({
          url: 'http://localhost:8080/cart/getCart',
          method: "GET",
          data: {
            userId: wx.getStorageSync('UserId')
          },
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            console.log("After ssuccess2");
            console.log(res);
            if(res.statusCode == 200) {
              let fetchCart = JSON.stringify(res.data);
              wx.setStorageSync('Cart', fetchCart);
              _this.setData({cartItems: res.data, sent: false, checkedItem: []});
              wx.showToast({
                title: "Congrats, you've just ordered what you might like.",
                icon: 'none',
                duration: 2000
              });
            }else if(res.status === 500)
            {
              wx.showToast({
                title: "Oops, we believe your order was more than we could afford, please try again.",
                icon: 'none',
                duration: 2000
              });
            }
          }
        });
      }
    });
  },

  reCalc(calcType){
    if (calcType === 1) {
      this.setData({refresh:true});
      setTimeout(() => {
          this.setData({refresh:false});
      }, 1000);
      this.setData({cartItems: JSON.parse(wx.getStorageSync('Cart'))});
  }
  this.setData({cartItems: JSON.parse(wx.getStorageSync('Cart'))});
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log("On Load");
    var _this = this;
    if (wx.getStorageSync('Login') != 'True'){
      wx.redirectTo({
        url: '../index/index'
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/cart/getCart',
        method: "GET",
        data: {
          userId: wx.getStorageSync('UserId')
        },
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res.data);
          _this.setData({
            cartItems: res.data
          });
          wx.setStorageSync('Cart', JSON.stringify(res.data));
        }
      });
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.reCalc(1);
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    console.log("On Hide");
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  selectItem: function(value){
    let tmp = this.data.checkedItem;
    let has = tmp.indexOf(value.detail);
    console.log("Has: ");
    console.log(has);
    if(has >= 0){
      tmp.splice(has, 1);
      this.data.checkedItem = tmp;
    }else{
      tmp.push(value.detail);
      this.data.checkedItem = tmp;
    }
    console.log(JSON.stringify(this.data.checkedItem));
  },

  onTabChange(event){
    this.setData({ active: event.detail });
    console.log(event.detail);
    if(event.detail == 0)
    {
      wx.switchTab({
        url: '../bookList/bookList',
      })
    }else if(event.detail == 1)
    {
      wx.switchTab({
        url: '../cart/cart',
      })
    }else if(event.detail == 2)
    {
      wx.switchTab({
        url: '../order/order',
      })
    }else if(event.detail == 3)
    {
      wx.switchTab({
        url: '../profile/profile',
      })
    }
  }
})