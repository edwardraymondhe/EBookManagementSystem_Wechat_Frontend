// pages/bookDetail/bookDetail.js
Page({

  /**
   * Page initial data
   */
  data: {
    bookId: null,
    bookInfo: null,
    screenWidth: null
  },
  onClickCart()
  {
    wx.switchTab({
      url: '../cart/cart'
    })
  },
  onClickAdd()
  {
    let cart = (JSON.parse(wx.getStorageSync('Cart')));
    let flag = false;
    let exist = false;
    let _this = this;
    for(let i in cart)
    {
        if(cart[i].bookId === this.data.bookInfo.bookId) {
          exist = true;
            if (cart[i].quantity === this.data.bookInfo.stock) {
              wx.showToast({
                title: "We currently don't have that much in stock.",
                icon: 'none',
                duration: 1500
              });
              flag = true;
            }
        }
    }
    if(!exist && this.data.bookInfo.stock <= 0)
    {
      wx.showToast({
        title: "We currently don't have that much in stock.",
        icon: 'none',
        duration: 1500
      });
      flag = true;
    }
    if(!flag) {
        wx.request({
          url: 'http://localhost:8080/cart/updateCart',
          method: "GET",
          data: {
            userId: wx.getStorageSync('UserId'),
            bookId: _this.data.bookInfo.bookId,
            quantity: -1
          },
          header: {
            'content-type': 'application/json',
          },
          success(res) {
            console.log("In adding");
            console.log(res);
            let fetchCart = JSON.stringify(res.data);
            wx.setStorageSync('Cart', fetchCart);
          }
        });
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let _this = this;

    wx.getSystemInfo({
      complete: (res) => {
        console.log(res);
        this.setData({screenWidth: res.screenWidth})
      },
    })

    _this.setData({
      bookId:options.bookId
    })
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

  }
})