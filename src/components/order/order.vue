<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="OrderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="editOrderAddress"></el-button>
            <el-button
              icon="el-icon-location-information"
              size="mini"
              type="success"
              @click="ShowProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="提示" :visible.sync="EditVisible" width="50%" @close="AddressFormClosed">
      <el-form
        :model="AddressForm"
        :rules="AddressFormRules"
        ref="AddressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="AddressForm.address1" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="AddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流进度" :visible.sync="ProgressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in ProgressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      OrderList: [],
      EditVisible: false,
      AddressForm: {
        address1: [],
        address2: ''
      },
      AddressFormRules: {
        address1: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        address2: [
          { required: true, message: '请填写完整地址', trigger: 'blur' },
          { min: 3, message: '请填写完整地址', trigger: 'blur' }
        ]
      },
      citydata,
      ProgressVisible: false,
      ProgressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求订单数据失败')
      }
      console.log(res.data)
      this.total = res.data.total
      this.OrderList = res.data.goods
    },
    handleSizeChange (NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getOrdersList()
    },
    handleCurrentChange (NewPage) {
      this.queryInfo.pagenum = NewPage
      this.getOrdersList()
    },
    editOrderAddress () {
      this.EditVisible = true
    },
    AddressFormClosed () {
      this.$refs.AddressFormRef.resetFields()
    },
    async ShowProgressBox () {
      const { data: res } = await this.$http.get(`/kuaidi/1106975712662`)
      if (res.meta.status !== 200) { return this.$message.error('获取物流信息失败') }
      console.log(res.data)
      this.ProgressInfo = res.data
      this.ProgressVisible = true
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
