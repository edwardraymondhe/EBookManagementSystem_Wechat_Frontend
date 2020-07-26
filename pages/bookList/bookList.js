const app = getApp()
// pages/bookList/bookList.js
Page({

  data: {
    bookInfos:[],
    searchValue:"",
    showBook: null,
    show: false,
    active:0,
    loading: true,
  },

  onChange(event) {
    console.log(event.detail);
    this.setData({
      searchValue: event.detail
    });
  },

  onSearch() {
    var _this = this;
    console.log(this.searchValue);
    wx.request({
      url: 'http://localhost:8080/book/getBooksBy',
      method: "GET",
      data: {
        search: _this.data.searchValue
      },
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data);
        _this.setData({
          bookInfos: res.data
        })
      }
    });
  },

  onLoad: function (options) {
    wx.setTabBarStyle({
      color: '#1B1C1E',
      selectedColor: '#2289DC',
      backgroundColor: '#FFFFFF',
      borderStyle: 'white'
    });
    var _this = this;
    if (wx.getStorageSync('Login') != 'True'){
      wx.redirectTo({
        url: '../index/index'
      })
    }else{
      wx.request({
        url: 'http://localhost:8080/book/getBooks',
        method: "GET",
        header: {
          'content-type': 'application/json',
        },
        success(res) {
          console.log(res.data);
          _this.setData({
            bookInfos: res.data
          })
        }
      });
    }
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