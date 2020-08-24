<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="buyername">
            <el-input v-model="queryParams.buyername" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="电话" prop="buyermobile">
            <el-input v-model="queryParams.buyermobile" placeholder="请输入电话" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="买家" prop="orderBuyer">
            <el-input v-model="queryParams.orderBuyer" placeholder="请输入买家" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="发货单号" prop="deliveryNumber">
            <el-input v-model="queryParams.deliveryNumber" placeholder="请输入发货单号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5"><el-button v-permisaction="['orders:orders:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button></el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['orders:orders:edit']" type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['orders:orders:remove']" type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="ordersList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" width="55" align="center" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="名称" align="center" prop="buyername" :show-overflow-tooltip="true" />
          <el-table-column label="电话" align="center" prop="buyermobile" :show-overflow-tooltip="true" />
          <el-table-column label="发货地址" align="center" prop="buyeraddr" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" width="100">
            <template slot-scope="scope">
              {{ statusFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="是否结算" align="center" prop="rebate" :formatter="rebateFormat" width="100">
            <template slot-scope="scope">
              {{ rebateFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="买家" align="center" prop="orderBuyer" :show-overflow-tooltip="true" />
          <el-table-column label="卖家" align="center" prop="orderOwnerId" :show-overflow-tooltip="true" />
          <el-table-column label="发货单号" align="center" prop="deliveryNumber" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-permisaction="['orders:orders:edit']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-permisaction="['orders:orders:remove']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="名称" prop="buyername"><el-input v-model="form.buyername" placeholder="名称" /></el-form-item>
            <el-form-item label="电话" prop="buyermobile"><el-input v-model="form.buyermobile" placeholder="电话" /></el-form-item>
            <el-form-item label="发货地址" prop="buyeraddr"><el-input v-model="form.buyeraddr" placeholder="发货地址" /></el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否结算" prop="rebate">
              <el-select v-model="form.rebate" placeholder="请选择">
                <el-option v-for="dict in rebateOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="买家" prop="orderBuyer"><el-input v-model="form.orderBuyer" placeholder="买家" /></el-form-item>

            <el-form-item label="发货单号" prop="deliveryNumber"><el-input v-model="form.deliveryNumber" placeholder="发货单号" /></el-form-item>

            <el-form-item label="购买数量" prop="deliveryName"><el-input v-model="form.count" placeholder="购买数量" /></el-form-item>

            <el-form-item label="购物车" prop="companyId">
              <el-select v-model="form.goodid" placeholder="请选择商品" @change="currentSel">
                <el-option v-for="item in goodsOptions" :key="item.goodid" :label="item.name" :value="item.goodid" />
              </el-select>
            </el-form-item>

            <el-form-item label="购买清单" prop="deliveryName">
              <el-table v-loading="loading" :data="orderGoodList" @selection-change="handleSelectionChange">
                <el-table-column label="商品id" align="center" prop="goodid" />
                <el-table-column label="商品" align="center" prop="name" />
                <el-table-column label="价格" align="center" prop="price" />
                <el-table-column label="个数" align="center" prop="count" />
                <el-table-column label="税率" align="center" prop="taxRato" />
                <el-table-column label="合计" align="center" prop="sum" />
                合计
                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="delorderGoodList(scope.row, scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
                   <el-button @click="addOrdergood">添加到购物车</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import { addOrders, delOrders, getOrders, listOrders, updateOrders } from '@/api/orders';
import { listGoods } from '@/api/goods';

export default {
  name: 'Config',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      ordersList: [],
      statusOptions: [],
      rebateOptions: [],
      orderGoodList: [], //订单购物车的信息
      goodsOptions: [], //商品配置
      ordergood: undefined,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        buyername: undefined,
        buyermobile: undefined,
        orderBuyer: undefined,
        deliveryNumber: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        buyername: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        buyermobile: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
        orderBuyer: [{ required: true, message: '买家不能为空', trigger: 'blur' }],

        rebate: [{ required: true, message: '结算状态不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '发货状态不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts('sys_order_status').then(response => {
      this.statusOptions = response.data;
    });

    this.getDicts('sys_rebate').then(response => {
      this.rebateOptions = response.data;
    });

    listGoods({ pageIndex: 0, pageSize: 1000000 }).then(response => {
      this.goodsOptions = response.data.list;
      for(var i=0;i<this.goodsOptions.length;i++){
       this.goodsOptions[i]["goodsTax"]=parseFloat(this.goodsOptions[i]["taxRato"])

      }

    });

  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listOrders(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.ordersList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    delorderGoodList(row, index) {
      if (row) {
        if (!row.goodid) {
          this.$message.error('获取数据失败');
          return false;
        }else{
          this.orderGoodList.splice(index,1)
          this.$message.success('删除成功');
        }
      }
    },
    // 表单重置
    reset() {
      //重置表单就重置购物车
      this.orderGoodList=[]
      this.form = {
        id: undefined,
        buyername: undefined,
        buyermobile: undefined,
        buyeraddr: undefined,
        status: undefined,
        rebate: undefined,
        orderBuyer: undefined,
        orderOwnerId: undefined,
        deliveryNumber: undefined
      };
      this.resetForm('form');
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    rebateFormat(row) {
      return this.selectDictLabel(this.rebateOptions, row.rebate);
    },
    /** 添加购物车的相关操作 */
    addOrdergood() {
      this.ordergood = undefined;
      this.ordergood = this.goodsOptions.find(item => {
        return item.goodid === this.form.goodid;
      });
      this.ordergood['count'] = parseInt(this.form.count);
      this.ordergood['taxRato'] = parseFloat(this.ordergood.taxRato) / 100;
      this.ordergood['sum'] = parseFloat(this.form.count) * parseFloat(this.ordergood.price) * (1.0 + this.ordergood['taxRato']);
      this.ordergood['price'] = parseFloat(this.ordergood['price'])
      this.orderGoodList.push(this.ordergood);
      console.log(this.orderGoodList);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加订单';
      this.isEdit = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOrders(id).then(response => {
        this.form = response.data;
        for(var i=0;i<response.data.ordergoodlist.length;i++){
          response.data.ordergoodlist[i]["name"]=response.data.ordergoodlist[i]["Good"]["name"]
          response.data.ordergoodlist[i]["goodid"]=response.data.ordergoodlist[i]["Good"]["goodid"]
          response.data.ordergoodlist[i]["taxRato"]=response.data.ordergoodlist[i]["goodsTax"]
        }
        this.orderGoodList=response.data.ordergoodlist
        console.log(this.orderGoodList,"---")
        this.open = true;
        this.title = '修改订单';
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
           this.form.orderGoodList=this.orderGoodList
          if (this.form.id !== undefined) {
            updateOrders(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOrders(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const Ids = row.id || this.ids;
      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delOrders(Ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function() {});
    }
  }
};
</script>
