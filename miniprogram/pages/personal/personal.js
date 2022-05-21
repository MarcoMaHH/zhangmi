Page({
  data: {

  },
  onChangePasswordTap() {
    wx.navigateTo({
      url: '/pages/login/login?mode=change'
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '老黄狗账密',
      path: '/pages/login/login',//这里是被分享的人点击进来之后的页面
      imageUrl: '/images/share.jpg'//这里是图片的路径
    }
  },
  onIndependentDeployTap() {
    wx.showModal({
      title: '提示',
      content: '请添加微信：nrqzdhlsc_cc',
      confirmText: '复制微信',
      success: ({ confirm }) => {
        if (confirm) {
          wx.setClipboardData({
            data: 'nrqzdhlsc_cc',
            success: () => {
              wx.showToast({ title: '复制成功' })
            }
          })
        }
      },
    })
  },
  onAboutTap() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  // 婚礼邀请函
  onInvitationdTap() {
    wx.navigateToMiniProgram({
      appId: 'wx3c5d5ba2e97c2fd6',
      path: 'pages/index/index',
      // extraData: {
      //   from: 'xxxxx'
      // },
      envVersion: 'release'
    })
  },
  // 阿里云盘
  onCloudTap() {
    wx.navigateToMiniProgram({
      appId: 'wxfce7797523932261',
      path: 'pages/index/index',
      // extraData: {
      //   from: 'xxxxx'
      // },
      envVersion: 'release'
    })
  },
  // 工具箱
  onToolTap() {
    wx.navigateToMiniProgram({
      appId: 'wxef8253d7590fb490',
      path: 'pages/index/index',
      // extraData: {
      //   from: 'xxxxx'
      // },
      envVersion: 'release'
    })
  }
});
