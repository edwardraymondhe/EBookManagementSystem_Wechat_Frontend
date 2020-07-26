// pages/order/order.js
Page({

  /**
   * Page initial data
   */
  data: {
    active: 0,
    orderItems: [],
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
    var _this = this;
    if (wx.getStorageSync('Login') != 'True'){
      wx.redirectTo({
        url: '../index/index'
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/purchase/getPurchase',
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
            orderItems: res.data
          });
          wx.setStorageSync('Order', JSON.stringify(res.data));
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
    var _this = this;
    wx.request({
      url: 'http://localhost:8080/purchase/getPurchase',
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
          orderItems: res.data
        });
        wx.setStorageSync('Order', JSON.stringify(res.data));
      }
    });
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {  
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