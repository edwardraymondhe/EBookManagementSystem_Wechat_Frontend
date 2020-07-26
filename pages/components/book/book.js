// pages/components/book/book.js
Component({
  
  properties: {
    bookInfo: Object,
  },

  data: {
  },

  methods: {
    onClick: function(){
      console.log(this.data.bookInfo.bookId);
      wx.navigateTo({
        url: '../bookDetail/bookDetail?bookId=' + this.data.bookInfo.bookId
      })
    }
  },

  lifetimes:{
    attached: function()
    {}
  }
})
