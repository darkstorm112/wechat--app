var postsData = require('../../../data/posts-data.js')
var app = getApp();

Page({

  data: {
    isPlayingMusic: false
  },

  onLoad: function(options) {
    var postId = options.id;
    var postData = postsData.postlist[postId];
    this.setData({
      postData: postData,
      'currentPostId': postId
    })
    var postsCollected = wx.getStorageSync('posts_Collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_Collected', postsCollected);
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },

  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_currentMusicPostId = that.data.currentPostId
      app.globalData.g_isPlayingMusic = true
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_currentMusicPostId = null
      app.globalData.g_isPlayingMusic = false
    });  
    //监听音乐停止时间
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_currentMusicPostId = null
      app.globalData.g_isPlayingMusic = false
    })
  },

  onCollectionTap: function(ev) {
    var postsCollected = wx.getStorageSync('posts_Collected')
    var postCollected = postsCollected[this.data.currentPostId]
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_Collected', postsCollected)
    // 更新数据绑定变量，实现切换图片
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  } ,

  // 播放音乐
  onMusicTap: function (ev) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postlist[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }

})