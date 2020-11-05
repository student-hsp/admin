<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header">
        <span>
          <!-- 面包屑路径导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- / 面包屑路径导航 -->
        </span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <el-row :gutter='20'>
        <div>
          <el-radio-group v-model="radio1">
            <el-radio-button @click.native="getAllImageList()" label="全部" />
            <el-radio-button @click.native="getAllImageList(true)" label="收藏" />
          </el-radio-group>
        </div>
        <div id="imgcontainer">
          <el-col :span="6" v-for="item in imgList" :key="item.id">
            <div id="mask">
              <div class="mask-center">
                <div class="delete">
                  <i @click="deleteImg(item.id)" class="el-icon-delete"/>
                </div>
                <div class="selectImg">
                  <i @click="sele(item.id, !item.is_collected)" v-show="!item.is_collected" class="el-icon-folder-add"/>
                  <i @click="sele(item.id, !item.is_collected)" v-show="item.is_collected" class="el-icon-folder-delete"/>
                </div>
              </div>
            </div>
            <el-image :src="item.url">
              <div style="text-align: center;line-height: 200px" slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </el-col>
        </div>
      </el-row>
      <el-pagination
        :current-page.sync="pageIndex"
        style="float: right"
        @current-change="getIndexImg"
        background
        layout="prev, pager, next"
        hide-on-single-page
        :page-size="pageSize"
        :total="pageLength"/>
    </el-card>
  </div>
</template>
<script>
import { getImages, deleteImage, collectImage } from '@/api/v1/image'
import { Loading } from 'element-ui'
export default {
  name: 'ImageIndex',
  data() {
    return {
      pageSize: 12,
      radio1: '全部',
      imgList: [],
      statusImg: false,
      pageIndex: 1,
      pageLength: 0
    }
  },
  created() {
    this.getAllImageList()
  },
  methods: {
    sele(id, status) {
      collectImage(id, status).then(res => {
        this.$message({
          message: status ? '收藏成功' : '移除收藏',
          type: status ? 'success' : 'warning'
        })
        this.getIndexImg()
      })
    },
    deleteImg(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        deleteImage(id).then(res => {
          this.getIndexImg()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getIndexImg() {
      if (this.statusImg) {
        this.getAllImageList(this.statusImg, this.pageIndex)
      } else {
        this.getAllImageList(false, this.pageIndex)
      }
    },
    getAllImageList(status = false, pageIndex = 1, option = {}) {
      option.page = pageIndex
      if (pageIndex === 1) {
        this.pageIndex = 1
      }
      option.per_page = this.pageSize
      if (status) {
        option.is_collected = true
        this.statusImg = true
      } else {
        this.statusImg = false
      }
      const message = status ? '收藏' : '全部'
      console.log(message)
      const loadingInstance = Loading.service({ target: document.getElementById('imgcontainer'), background: 'rgba(255,255,255,.7)' })
      getImages(option).then(res => {
        console.log('获取素材')
        const { results, total_count } = res.data.data
        this.pageLength = total_count
        loadingInstance.close()
        this.imgList = []
        this.imgList = results
      })
    }
  }
}
</script>

<style lang="less">
  .el-col:hover #mask{
    display: block !important;
  }
  #imgcontainer{
    margin-bottom: 20px;
    overflow: hidden;
    .el-col{
      position: relative;
      #mask{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 96%;
        background-color: rgba(65,105,225,.5);
        z-index: 99999;
        margin-left: 8px;
        margin-top: 8px;
        -webkit-transition: all 1s;
        -moz-transition: all 1s;
        -o-transition: all 1s;
        -ms-transition: all 1s;
        .mask-center{
          width: 150px;
          height: 120px;
          /*background-color: red;*/
          margin: auto;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          font-size: 40px;
          color: white;
          .delete{
            height: 50px;
            /*background-color: green;*/
            text-align: center;
            line-height: 50px;
          }
          .delete:hover,.selectImg:hover{
            color: red;
          }
          .selectImg{
            height: 50px;
            /*background-color: green;*/
            text-align: center;
            line-height: 50px;
          }
        }
      }
      .el-image{
        position:relative;
        width: 100%;
        height: 200px;
        overflow:hidden;
        margin-top: 10px;
        border: 8px solid white;
        box-shadow: 1px 2px 3px darkgray;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          min-width: 100%;
          min-height: 100%;
          transform:translate(-50%,-50%);
        }
      }
    }
  }

</style>
