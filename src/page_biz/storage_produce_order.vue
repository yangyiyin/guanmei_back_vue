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
                                <span>{{props.row.product_cat_name}}-{{props.row.product_code}}-{{props.row.color_code}} 数量{{props.row.sum}}</span>
                            </el-form-item>
                            <el-form-item label="" >
                            </el-form-item>
                            <el-form-item label="材料:" >
                                <p v-for="(_material,index2) in props.row.material" :key='index2'>
                                    <!--<span>{{_material.material.name}}</span>&nbsp;&nbsp;-->
                                    <!--<span>数量:{{_material.sum}}(默认单位)</span>-->

                                    {{_material.material ? _material.material.name : _material.name}}[{{_material.sub ? _material.sub.name : _material.color_name}}]数量{{_material.num}};
                                </p>
                            </el-form-item>
                            <el-form-item label="装饰/辅料:">
                                <p v-for="(_material,index2) in props.row.material_sub" :key='index2'>
                                    <span>{{_material.material.name}}</span>&nbsp;&nbsp;
                                    <span>来源:{{_material.from.name}}</span>&nbsp;&nbsp;
                                    <span>数量:{{_material.sum}}</span>
                                </p>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column label="编号" prop="order_no"></el-table-column>

                <el-table-column label="制单时间" prop="order_date"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">

                        <el-tag v-if="scope.row.status == 1 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" type="warning">待提交仓库</el-tag>
                        <el-tag v-if="scope.row.status == 2 && scope.row.process_state_id == 0" >待仓库确认</el-tag>
                        <el-tag v-if="scope.row.status == 3" type="success" >已完成</el-tag>
                        <el-tag v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" >已确认</el-tag>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 2 && scope.row.process_state_id == 0 && scope.row.process_state_next_id == 0" size="mini" type="success" @click="confirm_storage(scope.row)">确认接单</el-button>
                        <el-button v-if="scope.row.status == 1 && scope.row.process_state_next_id > 0" size="mini" type="success" @click="print_barcode(scope.row)">打印条形码({{scope.row.print_count}})</el-button>
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
  storage_produce_order_list,
  gen_barcode_html
} from "@/api/getDataproduce_order";
import { confirm_storage } from "@/api/getDatastorage";
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
      storage_produce_order_list({
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
    confirm_storage(row) {
      this.$confirm("确认接单,将自动扣减库存,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(
        function() {
          confirm_storage({ produce_order_id: row.id }).then(
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
    handleEdit(row) {
      this.dialogFormVisible = true;
      if (row) {
        this.current_entity = row;
      } else {
        this.current_entity = {};
      }
    },
    search() {
      this.currentPage = 1;
      this.list();
    },
    goto_edit_produce_order(id) {
      if (id) {
        this.$router.push({
          path: "add_produce_order",
          query: { id: id, active: 1, way: 1 }
        });
      } else {
        this.$router.push({
          path: "add_produce_order",
          query: { id: id, is_new: 1 }
        });
      }
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
          produce_order_verify({ id: item.id, status: status })
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
          produce_order_del({ id: item.id }).then(
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
      produce_order_sort({
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
    print_barcode(row) {
      this.print_order_no = row.order_no;
      this.order_info =
        row.product_cat_name +
        "-" +
        row.product_code +
        "-" +
        row.color_code +
        " " +
        "数量" +
        row.sum;
      gen_barcode_html({
        code: row.order_no,
        id: row.id
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.barcode_url = res.data;
            setTimeout(function() {
              $("#print").jqprint();
              row.print_count++;
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
