var postsData = require('../../data/posts-data.js')

Page({
  data: {
    postlist: postsData.postlist
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
 
    wx:wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },

  onSwiperTap(event) {
    var postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
})