<template>
  <div class="login-container">
    <div class="login-form-warp">
      <div class="login-head">
        <!-- <img src="./logo_index.png" alt="" /> -->
        <h3>后台管理</h3>
      </div>

      <el-form ref="loginFormRef" :model="user" :rules="formRules">
        <el-form-item prop="mobile">
          <el-input
            v-model="user.mobile"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
          />
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="user.code"
            placeholder="请输入验证码"
            prefix-icon="el-icon-loading"
          />
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree"> 同意登录协议 </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            :loading="loginLoading"
            @click="onLogin"
          >登录</el-button>

          <!-- <el-button>取消</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/v1/user.js'

export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '13922222222',
        code: '246810',
        agree: true // 是否同意协议
      },

      loginLoading: false, // 登录的 loading 状态
      // 表单验证规则
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                // 验证通过
                callback()
              } else {
                // 验证失败
                callback(new Error('请同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    onLogin() {
      this.$refs.loginFormRef.validate(async(valid) => {
        if (!valid) return this.$message.error('登录验证失败,账号或密码错误')

        // 将按钮变成加载状态
        this.loginLoading = true

        // 判断登录 成功 or 失败
        try {
          // 如果验证通过就发送数据到后端;{ data: res } 结构赋值')
          const { data: res } = await login(this.user)
          // console.log(res)
          // console.log('token', res.data.token)

          window.localStorage.setItem('token', JSON.stringify(res.data.token))

          this.$router.push({
            name: 'home'
          })
        } catch {
          this.$message.error('登陆失败')
          // 按钮取消加载状态
          this.loginLoading = false
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-form-warp {
    box-sizing: border-box;
    width: 400px;
    background-color: #fff;
    padding: 0 30px;
    .login-head {
      margin: 20px 0;
      text-align: center;
      img {
        width: 150px;
      }
    }
  }
  .login-btn {
    width: 100%;
  }
}
</style>
