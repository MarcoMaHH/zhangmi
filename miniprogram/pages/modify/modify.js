import SECRET from '../../utils/secret'
import CATEGORIES from '../../utils/categories'

const db = wx.cloud.database()
Page({
  data: {},
  onLoad: function (options) {
    this.setData({
      type: CATEGORIES,
      id: options.id
    })
    this.init()
  },
  init() {
    const that = this
    const { id } = this.data
    db.collection('accounts').doc(id).get({
      success: function (res) {
        const { account = '', classify = '', name = '', note = '', password = '' } = res.data
        let index = classify === '99' ? CATEGORIES.length - 1 : classify
        that.setData({
          account: SECRET.decrypt(account),
          classify: classify,
          index: index,
          name: SECRET.decrypt(name),
          note: SECRET.decrypt(note),
          password: SECRET.decrypt(password),
        })
      }
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
    const { name, account, password, note, classify, id } = this.data
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
      cloudData.modifiedAt = db.serverDate()
      db.collection('accounts').doc(id).set({
        // data 传入需要局部更新的数据
        data: cloudData,
        success: function (res) {
          wx.hideLoading()
          wx.showToast({ title: '修改成功', mask: true })
          wx.navigateBack({ changed: true });
        },
        fail: function (err) {
          wx.hideLoading()
          wx.showToast({ title: '修改失败', mask: true })
          console.error('[数据库] [更新记录] 失败：', err)
        }
      })
    }
  },
})