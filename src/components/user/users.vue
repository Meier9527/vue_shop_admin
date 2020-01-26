<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList()">
            <el-button slot="append" icon="el-icon-search" @click="SearchUsersList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="UserStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="primary"
                @click="editDialog(scope.row.id)"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="danger"
                @click="RemoveUser(scope.row.id)"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-user"
                @click="AllotRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
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
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="addDialogClosed" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改用户信息"
      @close="editUserFormClosed"
      :visible.sync="editUserdialogVisible"
      width="50%"
    >
      <el-form ref="editUserRef" :rules="addFormRules" :model="editUserForm" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="AllotRoledialog" width="50%" @close="AllotRoledislogClosed">
      <div>
        <p>当前的用户：{{UserInfo.username}}</p>
        <p>当前的角色：{{UserInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AllotRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="SaveAllotRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 自定义验证规则
    // 验证邮箱
    var checkemail = (rule, value, callback) => {
      const RegEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (RegEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确邮箱！'))
    }
    // 验证手机号
    var checkmobile = (rule, value, callback) => {
      const RegMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (RegMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确手机号！'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制用户添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '用户名长度在5~12之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '用户名长度在6~32之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editUserdialogVisible: false,
      // 查询到的用户信息对象
      editUserForm: {},
      // 分配角色对话框的显示与隐藏
      AllotRoledialog: false,
      // 需要被分配角色的用户信息
      UserInfo: {},
      // 角色列表
      roleslist: {},
      selectedRoleId: ''
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    async getUsersList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange (NewSize) {
      console.log(NewSize)
      this.queryInfo.pagesize = NewSize
      this.getUsersList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (NewPage) {
      console.log(NewPage)
      this.queryInfo.pagenum = NewPage
      this.getUsersList()
    },
    // 监听switch 开关状态的改变
    async UserStateChange (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态更新失败')
      }
      this.$message.success('状态更新成功')
    },
    SearchUsersList () {
      this.queryInfo.pagenum = 1
      this.getUsersList()
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确认按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUsersList()
      })
    },
    async editDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.editUserForm = res.data
      this.editUserdialogVisible = true
    },
    editUserFormClosed () {
      this.$refs.editUserRef.resetFields()
    },
    editUser () {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          { email: this.editUserForm.email, mobile: this.editUserForm.mobile }
        )
        if (res.meta.status !== 200) return this.$message.error('修改失败')
        this.$message.success('修改成功')
        this.getUsersList()
        this.editUserdialogVisible = false
      })
    },
    async RemoveUser (id) {
      const confirmres = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果返回值是confirm即提交，cancel即取消
      if (confirmres !== 'confirm') return this.$message.info('已取消删除操作')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.getUsersList()
    },
    async AllotRole (UserInfo) {
      this.UserInfo = UserInfo
      // 获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取角色信息失败') }
      this.roleslist = res.data

      this.AllotRoledialog = true
    },
    async SaveAllotRole () {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择！')
      }
      const { data: res } = await this.$http.put(`users/${this.UserInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功')
      this.getUsersList()
      this.AllotRoledialog = false
    },
    AllotRoledislogClosed () {
      this.UserInfo = {}
      this.selectedRoleId = ''
    }
  }
}
</script>
<style lang="less" scoped>
</style>
