<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="编号"
                    v-model="order_no"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form  label-position="left" inline class="demo-table-expand">
                            <el-form-item label="帽型:" >
                                <span>{{props.row.product_cat_name}}-{{props.row.product_code}}-{{props.row.color_code}} 数量{{props.row.sum}};</span>
                            </el-form-item>

                            <el-form-item label="材质:" >
                                <span v-for="(material, index)  in props.row.material" :key="index">{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>

                            </el-form-item>
                            <el-form-item label="装饰/辅料:" >
                                <span v-for="(material_sub, index)  in props.row.material_sub" :key="index">{{material_sub.name}};</span>
                            </el-form-item>
                            <el-form-item label="装饰说明:" >
                                <span>{{props.row.decoration}}</span>
                            </el-form-item>
                            <el-form-item label="样品图:" >
                                <img width="80" v-for="(img, index)  in props.row.sample_imgs" :key="index" :src="img">
                            </el-form-item>
                            <el-form-item label="备注说明:" >
                                <span>{{props.row.sample_info}}</span>
                            </el-form-item>

                            <el-form-item label="流程:" style="width: 100%">
                                <span>{{props.row.process_info}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="编号" prop="order_no"></el-table-column>
                <el-table-column label="包含业务单">
                    <template slot-scope="scope">

                        <span style="cursor: pointer;text-decoration: underline" @click="dialog_sales_order_visible = true;current=scope.row">{{scope.row.sales_order_nos}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="制单时间" prop="order_date"></el-table-column>
                <el-table-column label="交货时间" prop="delivery_date"></el-table-column>
                <el-table-column label="进度">
                    <template slot-scope="scope">
                        <p v-if="scope.row.process_state_id != 999999">当前流程:{{scope.row.process_state}}</p>
                     <el-tag v-if="scope.row.process_state_id == 999999" type="success" >{{scope.row.process_state}}</el-tag>
                        <p v-if="scope.row.process_state_id != 999999" >下一流程:{{scope.row.process_state_next}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0 && scope.row.can_handover_order" size="mini" type="success" @click="process_order(scope.row)">接单</el-button>
                        <el-tag v-if="scope.row.has_handover_order" type="success" >已接单</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="limit"
                        layout="total, prev, pager, next"
                        :total="count"
                        background>
                </el-pagination>
            </div>
        </div>

        <el-dialog title="包含业务单" :visible.sync="dialog_sales_order_visible" width="30%">
            <el-table
                    :data="current.sales_sub_orders"
                    style="width: 100%">

                <el-table-column label="编号" prop="order_code"></el-table-column>
                <el-table-column label="客户款式" prop="custom_model"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog_sales_order_visible = false">取 消</el-button>
            </div>
        </el-dialog>

        <div style="display: none">
            <div id="print" width="90%">
                <img :src="barcode_url" style='width: 90%;margin: 10px auto;display: block'/>
                <div style="width: 90%;text-align: center;margin: 0 auto">{{print_order_no}}</div>
                <p style="width: 90%;text-align: center;margin: 0 auto">{{order_info}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  process_produce_order,
  process_order
} from "@/api/getDataproduce_order";

import "@/assets/js/jquery-1.4.4.min";
import "@/assets/js/jquery.jqprint-0.3";
export default {
  data() {
    return {
      tableData: [],
      limit: 10,
      count: 0,
      currentPage: 1,
      dialogFormVisible: false,
      current: {},
      //                remark:'',
      //                choose_categories:[],
      //                categories:[],
      order_no: "",
      loadingBtn: -1,
      print_order_no: "",
      barcode_url: "",
      order_info: "",
      dialog_sales_order_visible: false
    };
  },
  components: {
    headTop
  },
  created() {
    this.list();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.list();
    });
  },
  methods: {
    list() {
      process_produce_order({
        page: this.currentPage,
        page_size: this.limit,
        order_no: this.order_no
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.tableData = res.data.list;
            this.count = parseInt(res.data.count);
          }
        }.bind(this)
      );
    },
    process_order(row) {
      this.$confirm("接单之后,流程将流转到下一阶段,确认此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        function() {
          process_order({ produce_order_id: row.id }).then(
            function(res) {
              if (res.code == this.$store.state.constant.status_success) {
                this.list();
                this.$message({
                  type: "success",
                  message: res.msg
                });
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg
                });
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.list();
    },
    search() {
      this.currentPage = 1;
      this.list();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.table_container {
  padding: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
