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
                                <span v-for="(material, index)  in props.row.material">{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>

                            </el-form-item>
                            <el-form-item label="装饰/辅料:" >
                                <span v-for="(material_sub, index)  in props.row.material_sub">{{material_sub.name}};</span>
                            </el-form-item>
                            <el-form-item label="装饰说明:" >
                                <span>{{props.row.decoration}}</span>
                            </el-form-item>
                            <el-form-item label="样品图:" >
                                <img width="80" v-for="(img, index)  in props.row.sample_imgs" :src="img">
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
                <el-table-column label="已完成数量">
                    <template slot-scope="scope">
                        {{scope.row.completed_num}}/{{scope.row.sum}}
                    </template>
                </el-table-column>
                <el-table-column label="已交接数量">
                    <template slot-scope="scope">
                        {{scope.row.handed_num}}/{{scope.row.sum}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1 && scope.row.can_handover_order" size="mini" type="success" @click="cur_order=scope.row;process_order(scope.row)">接单</el-button>
                        <el-button v-if="scope.row.status == 1 && scope.row.can_set_complete" size="mini" type="success" @click="cur_order=scope.row;complete_num_order(scope.row);">设置进度</el-button>
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

        <el-dialog :title="'订单编号:'+cur_order.order_no" :visible.sync="dialog_processoption_visible" width="20%">
            <p v-for="(process_option,index) in process_options" style="text-align: center;padding:5px;">

                <el-button v-if="process_options_type==1" @click="dialog_processoption_visible = false;dialog_handover_visible = true;cur_process_option=process_option;" type="primary">{{process_option.from.name}}->{{process_option.to.name}}</el-button>
                <el-button v-if="process_options_type==2" @click="dialog_processoption_visible = false;dialog_set_complete_visible = true;cur_process_option=process_option;" type="primary">{{process_option.from.name}}->{{process_option.to.name}}</el-button>
            </p>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="process_order(cur_order,true)">确 定</el-button>-->
                <el-button @click="dialog_processoption_visible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'订单编号:'+cur_order.order_no" :visible.sync="dialog_handover_visible" width="20%">
            <p v-if="cur_process_option.from">
                流程走向:{{cur_process_option.from.name}}->{{cur_process_option.to.name}}
            </p>
            <p>
                请输入交接数量({{cur_process_option.handed_num}}/{{cur_order.sum}}):<el-input v-model="cur_order.handover_num" auto-complete="off"></el-input>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="process_order(cur_order,true)">确 定</el-button>
                <el-button @click="dialog_handover_visible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'订单编号:'+cur_order.order_no" :visible.sync="dialog_set_complete_visible" width="20%">
            <p v-if="cur_process_option.from">
                流程走向:{{cur_process_option.from.name}}->{{cur_process_option.to.name}}
            </p>
            <p>
                请输入完成数量({{cur_process_option.completed_num}}/{{cur_order.sum}}):<el-input v-model="cur_order.complete_num" auto-complete="off"></el-input>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="complete_num_order(cur_order,true)">确 定</el-button>
                <el-button @click="dialog_set_complete_visible = false">取 消</el-button>
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
  process_order,
        complete_order_num,get_my_order_handover_processes
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
      dialog_sales_order_visible: false,
        dialog_handover_visible: false,
        dialog_set_complete_visible: false,
        dialog_processoption_visible: false,
      cur_order: {},
        process_options:[],
        cur_process_option:{},
        process_options_type:0
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
      complete_num_order(row,do_process,process_option){

          if (!do_process) {
              this.get_my_order_handover_processes(row.id,2);return;
          }

          if (parseInt(row.complete_num) + parseInt(row.completed_num) > parseInt(row.sum)) {
              this.$message({
                  type: "warning",
                  message: '完成数量超过订单总数,请重新输入正确的数量'
              });
              return;
          } else {
              var msg_tip = "本次完成数量为"+row.complete_num+",确认此操作?";
          }

          this.$confirm(msg_tip, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
          }).then(
                  function() {
                      complete_order_num({ produce_order_id: row.id , complete_num:row.complete_num,from_process_id:this.cur_process_option.from.id}).then(
                              function(res) {
                                  if (res.code == this.$store.state.constant.status_success) {
                                      this.list();
                                      this.$message({
                                          type: "success",
                                          message: res.msg
                                      });
                                      this.dialog_set_complete_visible = false;
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

      get_my_order_handover_processes(produce_order_id,type){

          get_my_order_handover_processes({ produce_order_id: produce_order_id}).then(
                  function(res) {
                      if (res.code == this.$store.state.constant.status_success) {
//                          this.list();
//                          this.$message({
//                              type: "success",
//                              message: res.msg
//                          });
                          this.process_options_type=type;
                          this.process_options = res.data;
                          this.dialog_processoption_visible = true;
                      } else {
                          this.$message({
                              type: "warning",
                              message: res.msg
                          });
                      }
                  }.bind(this)
          );
      },
    process_order(row,do_process,process_option) {
          if (!do_process) {
              this.get_my_order_handover_processes(row.id,1);return;
          }

        if (parseInt(row.handover_num) + parseInt(row.handed_num) > parseInt(row.sum)) {
            this.$message({
                type: "warning",
                message: '交接数量超过订单总数,请重新输入正确的交接数量'
            });
            return;
        } else if (parseInt(row.handover_num) + parseInt(row.handed_num) == parseInt(row.sum)) {
            var msg_tip = "本次交接数量为"+row.handover_num+",本次交接完成,流程将流转至下一流程,确认此操作?";
        } else {
            var msg_tip = "本次交接数量为"+row.handover_num+",确认此操作?";
        }


      this.$confirm(msg_tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        function() {
          process_order({ produce_order_id: row.id , handover_num:row.handover_num,from_process_id:this.cur_process_option.from.id}).then(
            function(res) {
              if (res.code == this.$store.state.constant.status_success) {
                this.list();
                this.$message({
                  type: "success",
                  message: res.msg
                });
                  this.dialog_handover_visible = false;
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
