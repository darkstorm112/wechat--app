var util = require('../../../utils/util.js')
var app = getApp();
Page({
  data:{
    categoryTitle: '',
    movies: {},
    requsetUrl: '',
    isEmpty: true,
    totalCount: 0
  },
  onLoad: function (options) {
    var category = options.category;
    this.data.categoryTitle = category;
    var dataUrl = ''
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.g_baseUrl + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.g_baseUrl + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.g_baseUrl + "/v2/movie/top250";
        break;
    }
    this.data.requsetUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData) 
  },

  onScrollLower: function (event) {
    var nextUrl = this.data.requsetUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requsetUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData:function(data){
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx]
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.categoryTitle,
    })
  },
})