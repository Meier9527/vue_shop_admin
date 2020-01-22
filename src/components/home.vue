<template>
    <div>
        <el-button type="info" @click="logout">注销</el-button>
    </div>
</template>
<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message.warning('您已注销')
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
