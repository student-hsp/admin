<template>
  <el-container class="layout-container">
    <el-aside
      class="aside"
      width="auto"
    >
      <sider
        class="aside-menu"
        :is-collapse="isCollapse"
      />
    </el-aside>

    <el-container>
      <el-header class="header">
        <div>
          <!--
              class 样式绑定
                {
                  class类名： 布尔值
                }
                true：作用类名
                false：不作用类名
             -->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse
            }"
            @click="isCollapse = !isCollapse"
          />
          <span> 后台管理 </span>
        </div>

        <el-dropdown>
          <div class="avatar-warp">
            <!-- 在线头像 src="https://avatars1.githubusercontent.com/u/9931457?s=400&u=e1f857a1f48f883cad6f6497a5d818f4bad47a61&v=4" -->
            <img
              class="avatar"
              :src="user.photo"
              alt=""
            >
            <span class="el-dropdown-link"> {{ user.name }} </span>
            <i class="el-icon-arrow-down el-icon--right" />
          </div>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toSettings">
              <i class="el-icon-user" />
              个人设置
            </el-dropdown-item>
            <el-dropdown-item
              @click.native="onLogout"
            >
              <i class="el-icon-lightning" />退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main class="main">
        <router-view :key="$route.path" />
      </el-main>
      <el-footer class="footer">@2020</el-footer>
    </el-container>
  </el-container>

</template>

<script>
import sider from './components/sider'
import { getUserProfile } from '@/api/v1/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  // 引用组件
  components: { sider },
  data() {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展示状态
    }
  },
  // 请求获取用户资料
  created() {
    this.loadUserProfile()
    globalBus.$on('update-user', (data) => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    async loadUserProfile() {
      const { data: res } = await getUserProfile()
      this.user = res.data
    },

    // 退出登录方法
    onLogout() {
      // console.log(this.onLogout)
      this.$confirm('此操作将退出用户登录, 是否继续?', '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除用户的登录状态
          window.localStorage.removeItem('user')

          // 跳转到登录页面
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },

    // 跳转到个人设置页面
    toSettings() {
      this.$router.push('/settings')
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0%;
  bottom: 0%;
}

.aside {
  background-color: #7e96c5;
  .aside-menu {
    height: 100%;
  }
}

.header {
  border-bottom: 2px solid #ccc;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-warp {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50px;
    margin-right: 10px;
  }
}

.main {
  background-color: #e9eef3;
}

.footer {
  background-color: #f2f6fc;
  text-align: center;
}
</style>
