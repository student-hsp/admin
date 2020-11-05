<template>
  <el-menu
    :default-active="indexPage"
    background-color="#304156"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
    collapse-transition
  >
    <div class="imgAside">
      <div class="imgMin"><img v-show="isCollapse" src="./k8s.png" alt="" class="logomin"></div>
      <!-- <img v-show="!isCollapse" src="./logo_admin.png" alt="" class="logoAdmin"> -->
      <span
        v-show="!isCollapse"
        style="color:#fff"
      >
        <h2>后台管理</h2>
      </span>

    </div>
    <el-menu-item index="/">
      <i class="el-icon-s-home" />
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document" />
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-picture" />
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion" />
      <span slot="title">发布文章</span>
    </el-menu-item>
    <!-- <el-menu-item index="/comment">
      <i class="el-icon-receiving" />
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-male" />
      <span slot="title">粉丝管理</span>
    </el-menu-item> -->
    <el-menu-item index="/settings">
      <i class="el-icon-user-solid" />
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ['is-collapse'],
  methods: {
    updataIndex() {
      const inde = window.localStorage.getItem('pageIndex')
      if (inde && inde === this.$route.path) {
        console.log(this.$route.path)
        this.indexPage = window.localStorage.getItem('pageIndex')
      }
    }
  },
  created() {
    console.log(this.indexPage)
    this.updataIndex()
  },
  data() {
    return {
      indexPage: '/'
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: function(newV) {
      console.log(newV)
      this.indexPage = newV.path
      window.localStorage.setItem('pageIndex', this.indexPage)
    }
  }
}
</script>

<style lang='less' scoped>
  .imgAside {
    // text-align: center;
    width: 100%;
    margin-left: 20px;
    .imgMin {
      width: 100%;
      .logomin {
      width: 50px;
      margin: 12px 0 9px 0;
      margin-left: -7px;
      }
    }
    .logoAdmin {
      // display: none;
      // width: 140px;
      margin: 12px 0 9px 0;
  }
  }
  // 控制菜单栏宽度
  .el-menu-item {
    /*width: 150px;*/
    /*overflow: hidden;*/
  }
  .aside-menu{
    overflow: hidden;
  }

</style>
