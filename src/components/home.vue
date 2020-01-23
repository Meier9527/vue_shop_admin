<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/initial.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse"><i class="el-icon-s-grid"></i></div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse='iscollapse'
          :collapse-transition='false'
          router
          :default-active="$route.path"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id +''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path + ''" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-promotion',
        '101': 'el-icon-s-shop',
        '102': 'el-icon-s-claim',
        '145': 'el-icon-s-data'
      },
      iscollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message.warning('您已注销')
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse () {
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(47, 46, 56);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    img {
      height: 60px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: rgb(87, 87, 88);
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eee;
}
.el-footer {
  background-color: rgb(51, 51, 51);
}
.toggle-button {
  background-color: #4a4a4a;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing:0.2em;
  cursor: pointer;
}
</style>
