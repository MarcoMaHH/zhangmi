import SECRET from '../../utils/secret'
import CATEGORIES from '../../utils/categories'

const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    categories: CATEGORIES,
    classify: undefined
  },
  onLoad: function (options) {
    if (options.classify) {
      this.setData({
        classify: options.classify
      })
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      list: this.data.originalList
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      list: this.data.originalList
    });
  },
  inputTyping: function (e) {
    let searchData = this.data.originalList.filter(function (item) {
      let reg = new RegExp(e.detail.value, 'i');
      if (reg.test(item.name)) {
        return item
      }
      // if (item.name.indexOf(e.detail.value) !== -1) {
      //   return item;
      // }
    });
    this.setData({
      inputVal: e.detail.value,
      list: searchData
    });
  },
  onShow() {
    this.init()
    this.setData({
      inputShowed: false,
      inputVal: ""
    })
  },
  init() {
    const { classify } = this.data
    const openId = app.globalData.openId
    db.collection("accounts")
      .where({              //查询的条件操作符where
        _openid: openId,
        classify: classify
      })
      .field({             //显示哪些字段
        // _id: false,         //默认显示_id，这个隐藏
        classify: true,
        name: true,
        account: true,
        note: true,
        password: true
      })
      .get()                   //获取根据查询条件筛选后的集合数据  
      .then(res => {
        this.decryptList(res.data)
      })
      .catch(err => {
        wx.showToast({ title: '加载失败', mask: true, icon: 'error' })
        console.error('初始化init()：', err)
      })
  },
  decryptList(list) {
    if (!Array.isArray(list)) return
    wx.showLoading({ title: '解密中...' })
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const { name, account, password, note } = item
      if (name) {
        item.name = SECRET.decrypt(name)
      }
      if (account) {
        item.account = SECRET.decrypt(account)
      }
      if (password) {
        item.password = SECRET.decrypt(password)
      }
      if (note) {
        item.note = SECRET.decrypt(note)
      }
    }
    wx.hideLoading()
    this.setData({
      list: list,
      originalList: list
    })
  },
  onCopy(e) {
    const { data } = e.currentTarget.dataset
    wx.setClipboardData({
      data,
      success: () => {
        wx.showToast({ title: '复制成功' })
      }
    })
  },
  onModify(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/modify/modify?id=${id}`,
    })
  },
  onRemove(e) {
    const that = this
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '是否删除当前账号？',
      success: ({ confirm }) => {
        if (confirm) {
          wx.showLoading({ title: '删除中...' })
          db.collection('accounts').doc(id).remove({
            success: function (res) {
              wx.hideLoading()
              wx.showToast({ title: '删除成功', mask: true })
              that.onShow()
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({ title: '删除失败', mask: true, icon: 'error' })
              console.error('[数据库] [删除记录] 失败：', err)
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '老黄狗账密',
      path: '/pages/login/login',//这里是被分享的人点击进来之后的页面
      imageUrl: '/images/share.jpg'//这里是图片的路径
    }
  }
})