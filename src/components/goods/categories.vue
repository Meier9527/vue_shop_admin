<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCatediglog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag type="success" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[4, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="AddCatedialogVisible" width="50%" @close="AddCatedialogClosed">
      <el-form
        :model="AddCateruleForm"
        :rules="AddCaterules"
        ref="AddCateruleFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="AddCateruleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
            <!-- option指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="ParentCateList"
            :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            }"
            @change="ParentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SaveAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 7
      },
      // 商品分类的数据列表
      catelist: [],
      //   总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将此列设为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将此列设为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将此列设为模板列
          type: 'template',
          // 当前列使用的模板名称
          template: 'opt'
        }
      ],
      AddCatedialogVisible: false,
      //   添加分类的表单数据对象
      AddCateruleForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认一级分类
        cat_level: 0
      },
      AddCaterules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      ParentCateList: [],
      //   选中的父级分类id数组
      selectedKeys: []
    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    async getcatelist () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品类别数据失败')
      }
      //   把数据列表赋值给catelist
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getcatelist()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getcatelist()
    },
    showAddCatediglog () {
      this.getParentCateList()
      this.AddCatedialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.ParentCateList = res.data
    },
    // 选择项发生变化
    ParentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.AddCateruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.AddCateruleForm.cat_level = this.selectedKeys.length
        return true
      } else {
        this.AddCateruleForm.cat_pid = 0
        this.AddCateruleForm.cat_level = 0
      }
    },
    SaveAddCate () {
      this.$refs.AddCateruleFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.AddCateruleForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.AddCatedialogVisible = false
        this.getcatelist()
      })
    },
    AddCatedialogClosed () {
      this.$refs.AddCateruleFormRef.resetFields()
      this.selectedKeys = []
      this.AddCateruleForm.cat_pid = 0
      this.AddCateruleForm.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
