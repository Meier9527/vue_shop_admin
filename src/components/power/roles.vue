<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 按钮单独一行 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['alignItemCenter', 'border-bottom', i1 === 0 ? 'border-top' : '']"
            >
              <el-col :span="5">
                <el-tag closable @close="RemoveRights(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="['alignItemCenter', i2 === 0 ? '' : 'border-top']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="RemoveRights(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="RemoveRights(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="warning" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDiallog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="提示" :visible.sync="SetRightdialogVisible" width="50%" @close="cleardefkey">
      <!-- 树型控件 -->
      <el-tree
        :data="rightList"
        :props="TreeProps"
        show-checkbox
        node-key="id"
        :default-checked-keys="defkey"
        ref="TreeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AllotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleslist: [],
      SetRightdialogVisible: false,
      rightList: [],
      //   树型控件的绑定对象
      TreeProps: {
        label: 'authName',
        children: 'children'
      },
      //   默认选中的节点Id值
      defkey: [],
      // 即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRoles()
  },
  methods: {
    async getRoles () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('角色获取失败')
      this.roleslist = res.data
    },
    // 根据Id删除对应的权限
    async RemoveRights (role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      role.children = res.data
      this.$message.success('删除权限成功')
    },
    // 展示分配权限的对话框
    async showSetRightDiallog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
      this.getLeafKeys(role, this.defkey)
      this.SetRightdialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defkey数组中
    getLeafKeys (node, arr) {
      // 如果当前node节点不包括children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    cleardefkey () {
      this.defkey = []
    },
    // 点击确认为角色分配权限
    async AllotRights () {
      const keys = [
        ...this.$refs.TreeRef.getCheckedKeys(),
        ...this.$refs.TreeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功')
      this.getRoles()
      this.SetRightdialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.alignItemCenter {
  display: flex;
  align-items: center;
}
</style>
