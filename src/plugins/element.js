import Vue from 'vue'
// 导入按钮、表单、表单行、输入框、消息弹框组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
