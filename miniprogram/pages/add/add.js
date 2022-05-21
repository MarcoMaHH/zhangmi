import SECRET from '../../utils/secret'
import CATEGORIES from '../../utils/categories'

const db = wx.cloud.database()
Page({
  data: {
    index: 0,
    name: '',
    account: '',
    password: '',
    note: ''
  },
  onLoad: function () {
    this.setData({
      type: CATEGORIES,
      classify: CATEGORIES[0].id
    })
  },
  PickerChange(e) {
    let that = this
    this.setData({
      index: e.detail.value,
      classify: that.data.type[e.detail.value].id
    })
  },
  onNameInput(e) {
    const { value } = e.detail
    this.setData({ name: value })
  },
  onAccountInput(e) {
    const { value } = e.detail
    this.setData({ account: value })
  },
  onPasswordInput(e) {
    const { value } = e.detail
    this.setData({ password: value })
  },
  onNoteInput(e) {
    const { value } = e.detail
    this.setData({ note: value })
  },
  onButtonTap() {
    const { name, account, password, note, classify } = this.data
    if (!name) {
      wx.showToast({ title: '名称不能为空', icon: 'none' })
    } else {
      wx.showLoading({ title: '保存中...' })
      const cloudData = {}
      if (name) {
        cloudData.name = SECRET.encrypt(name)
      }
      if (account) {
        cloudData.account = SECRET.encrypt(account)
      }
      if (password) {
        cloudData.password = SECRET.encrypt(password)
      }
      if (note) {
        cloudData.note = SECRET.encrypt(note)
      }
      cloudData.classify = classify
      cloudData.createdAt = db.serverDate()
      db.collection('accounts')
        .add({
          data: cloudData
        })
        .then(res => {
          wx.hideLoading()
          wx.showToast({ title: '创建成功' })
          this.resetInput()
        })
        .catch(err => {
          wx.hideLoading()
          wx.showToast({ title: '创建失败' })
        })
    }
  },
  resetInput() {
    this.setData({
      name: '',
      account: '',
      password: '',
      note: '',
      index: 0,
      classify: '0',
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