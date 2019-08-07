var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var baseUrl = app.globalData.g_baseUrl;
    var inTheatersUrl = baseUrl +"/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = baseUrl + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = baseUrl + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieList(inTheatersUrl, "inTheaters", "正在热映")
    this.getMovieList(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieList(top250Url, "top250", "豆瓣Top250");
  },

  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },

  onMovieTap:function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },

  getMovieList(url, setKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'json' // 默认值 application/json
      },
      success: function (res) {
        that.processDoubanDate(res.data, setKey,categoryTitle)
      }
    })
  },

  processDoubanDate: function (moviesDouban, setKey,categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx]
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[setKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData);   
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },
  
  onBindBlur: function (event) {
    var text = event.detail.value
    var searchUrl = app.globalData.g_baseUrl + "/v2/movie/search?q=" + text;
    this.getMovieList(searchUrl, "searchResult", "");
  },

})