<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container" style="padding-bottom: 0">
            <el-select v-model="type" placeholder="类型">
                <el-option
                        v-for="item in types"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-input
                    style="display: inline-block;width: 250px;"
                    placeholder="名称"
                    v-model="name"
                    clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button style="float: right" type="primary" @click="goto_edit_storage(0)">新增库存</el-button>

        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form  v-for="(sub, index)  in props.row.subs" :key='index' style="border-bottom: 1px dashed #ddd;margin-top: 5px;padding: 0 5px;" label-position="left" inline class="demo-table-expand">
                            <el-form-item label="颜色:" >
                                <span>{{sub.color_name}}</span>
                            </el-form-item>
                            <el-form-item label="数量:" >
                                <span>{{sub.sum}}</span>
                            </el-form-item>

                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="总数量(默认单位)" prop="sum"></el-table-column>
                <el-table-column label="存放位置" prop="place"></el-table-column>
                <el-table-column label="图片" prop="img">
                <template slot-scope="scope">
                <img style="width: 40px;border-radius: 40rpx;" v-bind:src="scope.row.img"/>
                </template>
                </el-table-column>
                <!--<el-table-column label="排序">-->
                    <!--<template slot-scope="scope">-->
                        <!--{{scope.row.sort}}-->
                        <!--<el-button size="mini" @click="handleSort(scope.row)">设置</el-button>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
                <el-table-column label="出入库" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="stock_out(scope.row)">出库</el-button>
                        <el-button size="mini" @click="stock_in(scope.row)">入库</el-button>
                        <el-button size="mini" @click="storage_flow_list(scope.row)">查看明细</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="goto_edit_storage(scope.row.id)">编辑</el-button>
                        <el-button size="mini" @click="del(scope.row, scope.$index)">删除</el-button>
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

        <el-dialog :title="'出入库明细--'+current_stock_name" :visible.sync="dialogFormVisible_flow" width="80%">

            <div class="table_container">
                <el-select v-model="flow_sub_id" placeholder="颜色">
                    <el-option
                            v-for="item in current.subs"
                            :key="item.id"
                            :label="item.color_name"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="search_flow">搜索</el-button>

                <el-table
                        v-loading="table_flow_loading"
                        :data="tableData_flow"
                        style="width: 100%;"
                        height="500">
                    <el-table-column label="出入库数量" prop="sum"></el-table-column>
                    <el-table-column  v-if="current.type==0" label="颜色" prop="color_name"></el-table-column>
                    <el-table-column label="生产单号" prop="out_code"></el-table-column>
                    <el-table-column label="备注" prop="remark"></el-table-column>
                    <el-table-column label="操作人" prop="opt_show_name"></el-table-column>
                    <el-table-column label="创建日期" prop="create_time"></el-table-column>
                </el-table>
                <div class="Pagination" style="text-align: left;margin-top: 10px;">
                    <el-pagination
                            @current-change="handleCurrentChange_flow"
                            :current-page="currentPage_flow"
                            :page-size="limit"
                            layout="total, prev, pager, next"
                            :total="count_flow"
                            background>
                    </el-pagination>
                </div>
            </div>

        </el-dialog>

        <el-dialog :title="'出库--'+current.name" :visible.sync="dialogFormVisible_stock_out" width="30%">
            <el-form :model="current">
                <el-form-item v-if="current.type==0" label="选择颜色:">
                    <el-select style="width: 100%" v-model="current.stock_sub_id" >
                        <el-option
                                v-for="item in current.subs"
                                :key="item.id"
                                :label="item.color_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="出库数量:">
                    <el-input v-model="current.stock_sum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="current.remark" auto-complete="off"></el-input>
                </el-form-item>
                <p style="color: #999">出库数量单位为默认单位,即库存标准单位</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_stock_out = false">取 消</el-button>
                <el-button type="primary" @click="stock_change(-1)">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog :title="'入库--'+current.name" :visible.sync="dialogFormVisible_stock_in" width="30%">
            <el-form :model="current">
                <el-form-item  v-if="current.type==0" label="选择颜色:">
                    <el-select style="width: 100%" v-model="current.stock_sub_id" >
                        <el-option
                                v-for="item in current.subs"
                                :key="item.id"
                                :label="item.color_name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入库数量:">
                    <el-input type="number" v-model="current.stock_sum" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="current.remark" auto-complete="off"></el-input>
                </el-form-item>
                <p style="color: #999">入库数量单位为默认单位,即库存标准单位</p>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_stock_in = false">取 消</el-button>
                <el-button type="primary" @click="stock_change(1)">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  storage_list,
  storage_del,
  storage_verify,
  storage_sort,
  storage_flow_list,
  stock_change
} from "@/api/getDatastorage";
import { deepCopy } from "@/config/mUtils";
export default {
  data() {
    return {
      tableData: [],
      tableData_flow: [],
      table_flow_loading: false,
      limit: 10,
      count: 0,
      currentPage: 1,
      count_flow: 0,
      currentPage_flow: 1,
      dialogFormVisible: false,
      dialogFormVisible_flow: false,
      dialogFormVisible_stock_out: false,
      dialogFormVisible_stock_in: false,
      current_stock_id: "",
      current_stock_name: "",
      current: {},
      type: -1,
      types: [
        { id: -1, name: "全部" },
        { id: 0, name: "主料" },
        { id: 1, name: "装饰、辅料" }
      ],
      name: "",
      loadingBtn: -1,
      flow_sub_id: "0"
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
      storage_list({
        page: this.currentPage,
        page_size: this.limit,
        name: this.name,
        type: this.type
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
    handleCurrentChange_flow(val) {
      this.currentPage_flow = val;
      this.storage_flow_list();
    },
    search_flow() {
      this.storage_flow_list();
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
    goto_edit_storage(id) {
      this.$router.push({ path: "add_storage", query: { id: id } });
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
          storage_verify({ id: item.id, status: status })
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
          storage_del({ id: item.id }).then(
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
      storage_sort({
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
    storage_flow_list(row) {
      if (!row) {
        var row = {
          id: this.current_stock_id
        };
      } else {
        this.flow_sub_id = "0";
        this.current = deepCopy(row);
        if (this.current.subs) {
          this.current.subs.unshift({ id: "0", color_name: "全部" });
        }

        this.current_stock_id = row.id;
        this.current_stock_name = row.name;
      }
      this.dialogFormVisible_flow = true;
      this.table_flow_loading = true;
      storage_flow_list({
        id: row.id,
        sub_id: this.flow_sub_id,
        page: this.currentPage_flow,
        page_size: this.limit
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.tableData_flow = res.data.list;
            this.count_flow = parseInt(res.data.count);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          this.table_flow_loading = false;
        }.bind(this)
      );
    },

    stock_out(row) {
      this.current = row;
      this.dialogFormVisible_stock_out = true;
    },
    stock_in(row) {
      this.current = row;
      this.dialogFormVisible_stock_in = true;
    },
    stock_change(in_or_out) {
      if (in_or_out > 0) {
        //入库
        var sum = this.current.stock_sum;
      } else if (in_or_out < 0) {
        var sum = -this.current.stock_sum;
      } else {
        this.$message({
          message: "参数错误",
          type: "warning"
        });
        return;
      }
      if (this.current.type == 1) {
        this.current.stock_sub_id = 0;
      }
      if (this.current.type == 0 && !this.current.stock_sub_id) {
        this.$message({
          message: "请选择颜色",
          type: "warning"
        });
        return;
      }

      if (!sum || sum == 0) {
        this.$message({
          message: "数量不能为0",
          type: "warning"
        });
        return;
      }

      stock_change({
        id: this.current.id,
        name: this.current.name,
        sum: sum,
        sub_id: this.current.stock_sub_id,
        remark: this.current.remark
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.list();
            this.$message({
              message: res.msg,
              type: "success"
            });
            if (in_or_out > 0) {
              //入库
              this.dialogFormVisible_stock_in = false;
            } else if (in_or_out < 0) {
              this.dialogFormVisible_stock_out = false;
            }
          } else {
            this.$message({
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
