//index.js
const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    loginFeedBack: 0,
    fetchUser: null,
    mode: true,
  },
  
  bindUsername: function(event){
    this.setData({username: event.detail.value})
  },
  bindPassword: function(event){
    this.setData({password: event.detail.value})
  },
  bindRegister: function(){
    this.setData({mode : false , username: '', password: ''});
  },
  bindLogin: function(){
    this.setData({mode : true , username: '', password: ''});
  },
  bindSkip: function()
  {
    wx.switchTab({
      url: '../bookList/bookList'
    })
  },
  bindLogTap: function() {
    var _this = this;
    wx.request({
      url: 'http://localhost:8080/auth/login', 
      method: "GET",
      data: {
        username: this.data.username,
        password: this.data.password
      },
      header: { 
        'content-type': 'application/json' 
      },
      success(res) {
        _this.loginFeedBack = res.data;
        if(_this.loginFeedBack != -1 && _this.loginFeedBack != -2){
          wx.setStorageSync('Login', 'True');
          wx.request({
            url: 'http://localhost:8080/user/getUser', 
            method: "GET",
            data: {
              userId: _this.loginFeedBack
            },
            header: {
              'content-type': 'application/json'
            },
            success(res) {
              _this.fetchUser = JSON.stringify(res.data);
              wx.setStorageSync('User', _this.fetchUser);
              wx.setStorageSync('UserId', _this.loginFeedBack);
              wx.getStorageSync('User');
              wx.getStorageSync('UserId');
              wx.showToast({
                title: "Welcome to\nLiterature-World.",
                icon: 'none',
                duration: 2000
              })
              wx.switchTab({
                url: '../bookList/bookList'
              })
            }
          }); 
        }else{
          wx.showToast({
            title: "You're not\nauthorized to be here.",
            icon: 'none',
            duration: 2000
          })
          wx.removeStorageSync('Login');
        }
      }
    }); 
  },
  bindRegTap: function() {
    var _this = this;
    wx.request({
      url: 'http://localhost:8080/auth/register', 
      method: "GET",
      data: {
        username: this.data.username,
        password: this.data.password
      },
      header: { 
        'content-type': 'application/json'
      },
      success(res) {
        if(res.data.status != 500)
        {
          _this.fetchUser = res.data;
          wx.setStorageSync('Login', 'True');
          _this.fetchUser = JSON.stringify(res.data);
          wx.setStorageSync('User', _this.fetchUser);
          wx.setStorageSync('UserId', (JSON.parse(wx.getStorageSync('User'))).userId);
          console.log(_this.fetchUser);
          wx.showToast({
            title: "Welcome to\nLiterature-World.",
            icon: 'none',
            duration: 2000
          })
          wx.switchTab({
            url: '../bookList/bookList'
          })
        }else{
          wx.showToast({
            title: "User exists.",
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail(res){
        wx.showToast({
          title: "User exists.",
          icon: 'none',
          duration: 2000
        })
      }
    }); 
  },
  onShow(){
    this.setData({username: 'Edward'});
    this.bindLogTap();
    wx.removeStorageSync('Login');
  }
})
