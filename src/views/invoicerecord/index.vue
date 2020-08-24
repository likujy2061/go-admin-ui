<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">


          <el-form-item label="买家" prop="recordbuyer">
            <el-input v-model="queryParams.recordbuyer" placeholder="请输入买家" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="发货单号" prop="number">
            <el-input v-model="queryParams.number" placeholder="请输入发货单号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="收货人电话" prop="telephone">
            <el-input v-model="queryParams.telephone" placeholder="请输入收货人电话" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button v-permisaction="['invoicerecord:invoicerecord:add']" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['invoicerecord:invoicerecord:edit']" type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">
              修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button v-permisaction="['invoicerecord:invoicerecord:remove']" type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">
              删除
            </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="invoicerecordList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="id" align="center" width="80" prop="id"  />
          <el-table-column label="买家" align="center" prop="recordbuyer" :show-overflow-tooltip="true" />
          <el-table-column label="开票类型" align="center" prop="type" :formatter="typeFormat" width="100">
            <template slot-scope="scope">
              {{ typeFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="是否已经开具发票" align="center" prop="status" :formatter="statusFormat" width="100">
            <template slot-scope="scope">
              {{ statusFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="发货单号" align="center" prop="number" :show-overflow-tooltip="true" />
          <el-table-column label="付款方式" align="center" prop="paymentTypeId" :formatter="paymentTypeIdFormat" width="100">
            <template slot-scope="scope">
              {{ paymentTypeIdFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="发票邮寄收货人" align="center" prop="deliveryName" :show-overflow-tooltip="true" />
          <el-table-column label="收货人电话" align="center" prop="telephone" :show-overflow-tooltip="true" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-permisaction="['invoicerecord:invoicerecord:edit']" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button v-permisaction="['invoicerecord:invoicerecord:remove']" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageIndex" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" class="abow_dialog">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="买家" prop="recordbuyer"><el-input v-model="form.recordbuyer" placeholder="买家" /></el-form-item>

            <el-form-item label="开票类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开具发票" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="邮寄发票" prop="deliveryStatus">
              <el-radio-group v-model="form.deliveryStatus">
                <el-radio v-for="dict in deliveryStatusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发货单号" prop="number"><el-input v-model="form.number" placeholder="发货单号" /></el-form-item>
            <el-form-item label="备注信息" prop="remark"><el-input v-model="form.remark" placeholder="备注信息" /></el-form-item>
            <el-form-item label="付款方式" prop="paymentTypeId">
              <el-select v-model="form.paymentTypeId" placeholder="请选择">
                <el-option v-for="dict in paymentTypeIdOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="收货人" prop="deliveryName"><el-input v-model="form.deliveryName" placeholder="发票邮寄收货人" /></el-form-item>
            <el-form-item label="邮寄地址" prop="registeraddr"><el-input v-model="form.registeraddr" placeholder="发票邮寄地址" /></el-form-item>
            <el-form-item label="电话" prop="telephone"><el-input v-model="form.telephone" placeholder="收货人电话" /></el-form-item>
            <el-form-item label="所属公司" prop="companyId">
              <el-select v-model="form.companyId" placeholder="请选择"><el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id" /></el-select>
            </el-form-item>

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
import { addInvoicerecord, delInvoicerecord, getInvoicerecord, listInvoicerecord, updateInvoicerecord } from '@/api/invoicerecord';
import { DictCompanys } from '@/api/companys';
import { listGoods } from '@/api/goods';
// import '@/assets/css/eldialog.scss';
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
      orderGoodList: [], //订单购物车的信息
      invoicerecordList: [],
      statusOptions: [],
      deliveryStatusOptions: [],
      paymentTypeIdOptions: [],
      goodsOptions: [],
      //公司的参数
      companyOptions: [],
      ordergood: undefined,
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        recordbuyer: undefined,
        number: undefined,
        telephone: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        recordbuyer: [{ required: true, message: '买家不能为空', trigger: 'blur' }],
       
        telephone: [{ required: true, message: '收货人电话不能为空', trigger: 'blur' }],
         status: [{ required: true, message: '必须选择开具发票状态', trigger: 'blur' }],
         paymentTypeId: [{ required: true, message: '必须选择付款方式', trigger: 'blur' }],
         status: [{ required: true, message: '必须选择开具发票状态', trigger: 'blur' }],
         deliveryStatus: [{ required: true, message: '必须选择邮寄状态', trigger: 'blur' }],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts('sys_Invoicerecord_type').then(response => {
      this.typeOptions = response.data;
    });

    this.getDicts('sys_Invoicerecord_status').then(response => {
      this.statusOptions = response.data;
    });

    this.getDicts('sys_Invoicerecord_deliverystatus').then(response => {
      this.deliveryStatusOptions = response.data;
    });

    this.getDicts('sys_paymenttypeId').then(response => {
      this.paymentTypeIdOptions = response.data;
    });

    this.getDicts('sys_Invoicerecord_type').then(response => {
      this.typeOptions = response.data;
    });

    listGoods({ pageIndex: 0, pageSize: 1000000 }).then(response => {
      this.goodsOptions = response.data.list;
    });
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listInvoicerecord(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.invoicerecordList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      //重置表单就重置购物车
      this.orderGoodList=[]
      this.form = {
        id: undefined,
        recordbuyer: undefined,
        attachment: undefined,
        type: undefined,
        status: undefined,
        deliveryStatus: undefined,
        number: undefined,
        remark: undefined,
        paymentTypeId: undefined,
        deliveryName: undefined,
        registeraddr: undefined,
        telephone: undefined,
        companyId: undefined,
        count: undefined
      };
      //拉取哈公司的信息
      DictCompanys().then(response => {
        this.companyOptions = response.data;
      });
      this.resetForm('form');
    },
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    deliveryStatusFormat(row) {
      return this.selectDictLabel(this.deliveryStatusOptions, row.deliveryStatus);
    },
    paymentTypeIdFormat(row) {
      return this.selectDictLabel(this.paymentTypeIdOptions, row.paymentTypeId);
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
      this.title = '添加发票';
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
      getInvoicerecord(id).then(response => {
        this.form = response.data;
        for(var i=0;i<response.data.ordergoodlist.length;i++){
          response.data.ordergoodlist[i]["name"]=response.data.ordergoodlist[i]["Good"]["name"]
          response.data.ordergoodlist[i]["goodid"]=response.data.ordergoodlist[i]["Good"]["goodid"]
        }
        this.orderGoodList=response.data.ordergoodlist
        console.log(this.orderGoodList,"---")
        this.open = true;
        this.title = '修改发票';
        this.isEdit = true;
      });
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
      this.ordergood['price'] = parseFloat(this.ordergood['price'])
      this.ordergood['price'] = parseFloat(this.ordergood['price'])
      this.orderGoodList.push(this.ordergood);
      console.log(this.orderGoodList);
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
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.orderGoodList=this.orderGoodList
          if (this.form.id !== undefined) {
            updateInvoicerecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInvoicerecord(this.form).then(response => {
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
          return delInvoicerecord(Ids);
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
