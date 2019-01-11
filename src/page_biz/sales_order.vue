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
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_sales_order(0)">新增业务单</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form style="border: 1px dashed #ddd;margin-top: 5px;padding: 0 5px;"  v-for="(sub_order, index)  in props.row.sales_order_sub" label-position="left" inline :key='index' class="demo-table-expand">
                            <el-form-item label="帽型:" >
                                <span>{{sub_order.product_cat_name}}-{{sub_order.product_code}}-{{sub_order.color_code}} 数量{{sub_order.sum}}</span>
                                <el-tag size="mini" v-if="sub_order.status == 1" type="warning">待安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 2" >已安排生产</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 3" type="success">已完成</el-tag>
                                <el-tag size="mini" v-if="sub_order.status == 4" type="danger">生成单已删除</el-tag>
                            </el-form-item>

                            <el-form-item label="材质:" >
                                <span v-for="(material, index)  in sub_order.material" :key='index'>{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>
                            </el-form-item>
                            <el-form-item label="装饰说明:" >
                                <span>{{sub_order.decoration}}</span>
                            </el-form-item>
                            <el-form-item label="样品图:" >
                                <img width="80" v-for="(img, index)  in sub_order.sample_imgs" :key='index' :src="img">
                            </el-form-item>
                            <el-form-item label="备注说明:" >
                                <span>{{sub_order.sample_info}}</span>
                            </el-form-item>
                            <el-form-item label="客户款式:" >
                                <span>{{sub_order.custom_model}}</span>
                            </el-form-item>
                            <el-form-item label="客户姓名:" >
                                <span>{{props.row.custom_name}}</span>
                            </el-form-item>
                            <el-form-item label="当前进度:" >
                                <span style="font-weight: bold;color: #000">{{sub_order.process_state ? sub_order.process_state : '暂无'}}</span>
                            </el-form-item>


                        </el-form>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="编号" type="index" width="50" :index="typeIndex" align="center"></el-table-column> -->
                <el-table-column label="编号" prop="order_no">
                    <template slot-scope="scope">
                        <!-- <span v-if="scope.row.custom_order_no"> {{scope.row.order_no}}({{scope.row.custom_order_no}})</span>
                        <span v-if="!scope.row.custom_order_no"> {{scope.row.order_no}}</span> -->
                        <span>{{scope.row.custom_order_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="制单日期" prop="order_date"></el-table-column>
                <el-table-column label="交货日期" prop="delivery_date"></el-table-column>
                <el-table-column label="业务员" prop="sales_man"></el-table-column>

                <el-table-column label="状态">
                    <template slot-scope="scope">

                        <el-tag v-if="scope.row.status == 5" type="warning">草稿，待提交</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="warning">待安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 2" >已安排生产</el-tag>
                        <el-tag v-if="scope.row.status == 3" type="success">已完成</el-tag>
                        <el-tag v-if="scope.row.status == 4" type="danger">生成单已删除</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 5" size="mini" @click="goto_edit_sales_order(scope.row.id)">编辑</el-button>
                        <el-button size="mini" @click="goto_edit_sales_order(scope.row.id,'clone')">克隆</el-button>
                        <el-button size="mini" type="success" @click="print_barcode(scope.row)">打印业务单({{scope.row.id}})</el-button>
                        <!--<el-button size="mini" v-if="scope.row.status == 1" @click="verify(scope, 0)" :loading="loadingBtn == scope.$index">下架</el-button>-->
                        <el-button size="mini" v-if="scope.row.status == 5" @click="verify(scope, 1)" type="warning" :loading="loadingBtn == scope.$index">提交</el-button>
                        <el-button v-if="scope.row.status == 1 || scope.row.status == 5" size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible" width="30%">
            <el-form :model="current">
                <el-form-item label="排序值(越大越靠前)">
                    <el-input v-model="current.sort" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="sort">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 打印div -->
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
  sales_order_list,
  sales_order_del,
  sales_order_verify,
  sales_order_sort
} from "@/api/getDatasales_order";
import "@/assets/js/jquery-1.4.4.min";
import "@/assets/js/jquery.jqprint-0.3";
// import { gen_barcode_html } from "@/api/getDataproduce_order";

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
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      dateTime: "",
      startDate: "",
      endDate: "",

      // 临时的
      barcode_url: "",
      print_order_no: "",
      order_info: ""
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
      sales_order_list({
        page: this.currentPage,
        page_size: this.limit,
        order_no: this.order_no,
        name: this.name
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.tableData = res.data.list;
            this.count = parseInt(res.data.count);
          }
        }.bind(this)
      );
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.list();
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      if (row) {
        this.current_entity = row;
      } else {
        this.current_entity = {};
      }
    },
    // 时间转换 start
    formatTen(num) {
      return num > 9 ? num + "" : "0" + num;
    },
    formatDate(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
    },
    // 时间转换 end
    search() {
      if (!this.dateTime) {
        this.$message.error("请选择日期！");
        return;
      }
      this.startDate = this.formatDate(this.dateTime[0]);
      this.endDate = this.formatDate(this.dateTime[1]);
      console.log(this.startDate, "开始日期");
      console.log(this.endDate, "结束日期");

      this.currentPage = 1;
      this.list();
    },
    goto_edit_sales_order(id, clone) {
      this.$router.push({
        path: "add_sales_order",
        query: { id: id, clone: clone }
      });
    },
    verify(scope, status) {
      this.$confirm("确认此操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        function() {
          var item = scope.row;
          this.loadingBtn = scope.$index;
          sales_order_verify({ id: item.id, status: status })
            .then(
              function(res) {
                if (res.code == this.$store.state.constant.status_success) {
                  item.status = status;
                  this.$message({
                    type: "success",
                    message: "操作成功"
                  });
                } else {
                  this.$message({
                    type: "warning",
                    message: res.msg
                  });
                }
              }.bind(this)
            )
            .finally(
              function() {
                this.loadingBtn = -1;
              }.bind(this)
            );
        }.bind(this)
      );
    },
    del(item, index) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        function() {
          sales_order_del({ id: item.id }).then(
            function(res) {
              if (res.code == this.$store.state.constant.status_success) {
                this.tableData.splice(index, 1);
                this.count--;
                this.$message({
                  type: "success",
                  message: "操作成功"
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
    handleSort(row) {
      this.dialogFormVisible = true;
      this.current = row;
    },
    sort() {
      sales_order_sort({
        id: this.current.id,
        sort: this.current.sort
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "操作成功"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: "warning"
            });
          }
        }.bind(this)
      );
      this.dialogFormVisible = false;
    },
    // 序号根据数据增加
    // typeIndex(index) {
    //   return index + (this.currentPage - 1) * 10 + 1;
    // },

    // 打印
    print_barcode(row) {
      console.log(row);
      // return;
      this.print_order_no = row.order_no;
      this.order_info = "礼帽-58/60-牛仔蓝58 数量352";
      this.barcode_url = "http://api.yixsu.com/barcode.png?r=1547022822";
      setTimeout(function() {
        $("#print").jqprint();
        row.id++;
        console.log(row.id);
      });
      // gen_barcode_html({
      //   code: row.order_no,
      //   id: row.id
      // }).then(
      //   function(res) {
      //     if (res.code == 100) {
      //       this.barcode_url = "http://api.yixsu.com/barcode.png?r=1547022822";
      //       setTimeout(function() {
      //         $("#print").jqprint();
      //         row.print_count++;
      //       });
      //     } else {
      //       this.$message({
      //         showClose: true,
      //         message: res.msg,
      //         type: "warning"
      //       });
      //     }
      //   }.bind(this)
      // );
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
