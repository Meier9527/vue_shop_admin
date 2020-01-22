<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/initial.png" alt />
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '请确认用户名长度在5~12位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 32, message: '请确认密码长度在6~32位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登陆成功')
        // 1. 将登陆成功后的token，保存到客户端的sessionStorage中
        //   1.1 项目中除了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token 保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(55, 53, 68);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    background-color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #ccc;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
