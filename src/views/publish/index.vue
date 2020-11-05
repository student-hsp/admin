<template>
  <div class="publish-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>
          <!-- 面包屑路径导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- / 面包屑路径导航 -->
        </span>
      </div>
      <el-form
        ref="publishFormRef"
        :model="article"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- 普通文本编辑器 -->
          <el-input v-model="article.content" type="textarea" />

        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">

            <el-option v-for="(channel, index) in channels" :key="index" :label="channel.name" :value="channel.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发布</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/v1/article'

export default {
  name: 'PublishIndex',
  // 引入组件
  components: {

  },
  data() {
    return {
      channels: [], // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1、自动，0、无图，1、1张，3、3张
          images: [] // 封面图片的地址
        },
        channel_id: null // 频道id
      },

      // 验证规则
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'change' }
          {
            validator(rule, value, callback) {
              console.log('content validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  created() {
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    // 加载文章频道
    async loadChannels() {
      const { data: res } = await getArticleChannels()
      this.channels = res.data.channels
    },

    // 新增 或者 修改 文章
    onPublish(draft = false) {
      // 验证表单规则
      this.$refs.publishFormRef.validate(async(valid) => {
        // 验证失败，停止提交表单
        if (!valid) {
          return false
        }
        const editId = this.$route.query.id
        // id 存在执行添加操作
        if (editId) {
          await updateArticle(editId, this.article, draft)
          // 编辑成功
          this.$message({
            message: `${draft ? '存入草稿' : '发布'}成功`,
            type: 'success'
          })
          // 执行修改操作后跳转到内容列表页面
          this.$router.push('/article')
          return
        }

        // id 不存在执行添加操作
        await addArticle(this.article, draft)
        this.$message({
          message: `${draft ? '存入草稿' : '发布'}成功`,
          type: 'success'
        })
        // 添加成功之后跳转到内容列表页面
        this.$router.push('article')
      })
    },

    // 修改文章： 加载文章内容
    async loadArticle() {
      // console.log('loadArticle')
      // 根据文章 id 请求获取数据
      const articleId = this.$route.query.id
      const { data: res } = await getArticle(articleId)
      // 模板绑定展示
      this.article = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
