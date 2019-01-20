<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px;">

            <el-steps v-if="!id" :active="active" align-center finish-status="success" style="margin-bottom: 20px;">
                <el-step title="选择方式"></el-step>
                <el-step title="填写生产单信息"></el-step>
                <el-step title="完成"></el-step>

            </el-steps>
            <div v-if="active == 0 && way == -1" style="display: block;margin: 100px auto;text-align: center">
                <el-button type="success" style="margin: 20px auto;display: inline-block;width: 150px;height:150px;" v-on:click="$router.push({path:'add_produce_order',query:{active:0,way:1}});" >选择业务单制单</el-button>
                <el-button type="success" style="margin: 20px auto;margin-left:50px;display: inline-block;width: 150px;height:150px;" v-on:click="$router.push({path:'add_produce_order',query:{active:1,way:2}});" >直接制单</el-button>

            </div>

            <div v-if="active == 0 && way == 1" class="table_container">
                <el-table
                        v-loading="table_loading"
                        ref="multipleTable"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form  label-position="left" inline class="demo-table-expand">
                                <el-form-item label="材质:" >
                                    <span v-for="(material, index)  in props.row.material">{{material.material ? material.material.name : material.name}}[{{material.sub ? material.sub.name : material.color_name}}]数量{{material.num}};</span>
                                </el-form-item>
                                <el-form-item label="装饰说明:" >
                                    <span>{{props.row.decoration}}</span>
                                </el-form-item>
                                <el-form-item label="样品图:" >
                                    <img width="80" v-for="(img, index)  in props.row.sample_imgs_final" :src="img">
                                </el-form-item>
                                <el-form-item label="备注说明:" >
                                    <span>{{props.row.sample_info}}</span>
                                </el-form-item>
                                <el-form-item label="流程:" >
                                    <span v-for="(process, index)  in props.row.process"><span v-if="index!=0">-></span>{{process.name}}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="帽型" prop="product_cat_name"></el-table-column>
                    <el-table-column label="型号" prop="product_code"></el-table-column>
                    <el-table-column label="颜色" prop="color_code"></el-table-column>
                    <el-table-column label="数量" prop="sum"></el-table-column>
                    <el-table-column label="业务单号" prop="sales_order.order_no"></el-table-column>
                    <el-table-column label="交货时间" prop="sales_order.delivery_date"></el-table-column>

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

            <div v-if="active == 1" class="table_container">

                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>生产单自定义名称:</span>
                    <el-input clearable placeholder="请输入自定义名称" v-model="set_name" style="width: 350px"></el-input>
                </div>

                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>制单日期:</span>
                    <el-date-picker
                            v-model="order_date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>

                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>交货日期:</span>
                    <el-date-picker
                            v-model="delivery_date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                    </el-date-picker>
                </div>

                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>生产统筹员:</span>
                    <el-input clearable placeholder="请输入生产统筹员姓名" v-model="produce_man" style="width: 350px">

                    </el-input>
                </div>
                <div class="block" v-for="(sub_order, index)  in sub_orders">
                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>帽型:</span>
                        <el-select :disabled="way!=2" v-model="sub_order.product_cat" placeholder="请选择" @change="change_product_cat(sub_order)" value-key="id">
                            <el-option
                                    v-for="item in options.options_product_cat"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-select :disabled="way!=2" v-model="sub_order.product" placeholder="请选择"  @change="change_product(sub_order)" value-key="id">
                            <el-option
                                    v-for="item in sub_order.options_product_cat_product"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>颜色:</span>
                        <div style="display: inline-block;vertical-align: top">
                            <div style="margin-bottom: 3px;" v-for="(color, index2)  in sub_order.colors">
                                <el-select :disabled="way!=2" v-model="color.color" placeholder="请选择" value-key="id" @change="change_color(color)">
                                    <el-option
                                            v-for="item in options.options_color"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <el-input :disabled="way!=2" v-if="color.id == -1" clearable placeholder="颜色" v-model="color.name" style="width: 120px"></el-input>
                                <el-input :disabled="way!=2" clearable placeholder="数量" type="number" v-model="color.sum" style="width: 120px"></el-input>
                                <el-tooltip v-if="color.order_codes"  placement="top">
                                    <div slot="content">
                                        包含业务订单:<br/>
                                        <p v-for="(order_code, index)  in color.order_codes">{{order_code}}</p>
                                    </div>
                                    <i class="iconfont">&#xe601;</i>
                                </el-tooltip>
                                <!--<el-button v-if="way==2" type="danger" @click="del_color(index, index2)" round size="mini">删除</el-button>-->

                            </div>
                            <!--<el-button v-if="way==2" @click="add_color(index)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多颜色</el-button>-->
                        </div>

                    </div>


                    <!--<div class="search_item">-->
                        <!--<span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>材质:</span>-->
                        <!--<el-select multiple v-model="sub_order.material" placeholder="请选择" value-key="id">-->
                            <!--<el-option-->
                                    <!--v-for="item in options.options_material"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</div>-->


                    <!--<div class="search_item">-->
                        <!--<span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>材料:</span></span>-->
                        <!--<div style="display: inline-block;vertical-align: top">-->
                            <!--<div style="margin-bottom: 3px;" v-for="(material, index2)  in sub_order.material">-->

                                <!--<el-select v-model="material.material" value-key="id" placeholder="请选择材料">-->
                                    <!--<el-option-->
                                            <!--v-for="item in options.options_material"-->
                                            <!--:key="item.id"-->
                                            <!--:label="item.name"-->
                                            <!--:value="item">-->
                                    <!--</el-option>-->
                                <!--</el-select>-->

                                <!--<el-input clearable placeholder="数量" v-model="material.num" style="width: 120px"></el-input>-->

                                <!--<el-button type="danger" @click="del_material(index, index2)" round size="mini">删除</el-button>-->

                            <!--</div>-->
                            <!--<el-button @click="add_material(index)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多材料</el-button>-->
                        <!--</div>-->

                    <!--</div>-->
                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>材料:
                          <el-tooltip v-if="sub_order.sales_order_sub_diff_data && sub_order.sales_order_sub_diff_data.length && sub_order.sales_order_sub_diff_data.length > 1"  placement="top">
                            <div slot="content">
                                <!--<p v-for="(sub_sub_order, index)  in sub_order.sales_order_sub_diff_data">-->
                                    <!--订单{{index}}:-->
                                    <!--<span v-if="sub_sub_order.material && sub_sub_order.material.length" v-for="(_material, index2) in sub_sub_order.material" >-->
                                        <!--<div style="border-bottom: 1px dashed #999;margin: 5px;display: inline-block;">名称:{{_material.material.name}};颜色:{{_material.sub.name}};数量:{{_material.num}}</div>-->
                                    <!--</span>-->
                                <!--</p>-->
                                 <p v-for="(sub_sub_order, index)  in sub_order.sales_order_sub_diff_data">
                                    订单{{index}}:
                                    <span>
                                        {{sub_sub_order.raw_material}}
                                    </span>
                                </p>
                            </div>
                            <i class="iconfont">&#xe601;</i>
                        </el-tooltip>
                            <el-tooltip v-else placement="top">
                            <div slot="content">
                              <p>{{sub_order.raw_material}}</p>
                            </div>
                            <i class="iconfont">&#xe601;</i>
                        </el-tooltip>
                        </span>
                        </span>
                        <div style="display: inline-block;vertical-align: top">
                            <div style="margin-bottom: 3px;" v-for="(material, index2)  in sub_order.material">

                                <el-select v-model="material.material" value-key="id" placeholder="请选择材料" @change="change_material(material)">
                                    <el-option
                                            v-for="item in options.options_material"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>

                                <el-select v-model="material.sub" value-key="id" placeholder="请选择颜色">
                                    <el-option
                                            v-for="item in material.sub_options"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>

                                <el-input clearable placeholder="数量" v-model="material.num" style="width: 120px"></el-input>

                                <el-button type="danger" @click="del_material(index, index2)" round size="mini">删除</el-button>

                            </div>
                            <el-button @click="add_material(index)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多材料</el-button>
                        </div>

                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>流程:</span>
                        <el-select multiple v-model="sub_order.process" placeholder="请选择" value-key="id" @change="change_process(sub_order)">
                            <el-option
                                    v-for="item in options.options_process"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;">装饰说明:<span>
                             <el-tooltip v-if="sub_order.sales_order_sub_diff_data && sub_order.sales_order_sub_diff_data.length && sub_order.sales_order_sub_diff_data.length > 1"  placement="top">
                            <div slot="content">
                                <p v-for="(sub_sub_order, index)  in sub_order.sales_order_sub_diff_data" style="border-bottom: 1rpx dashed #999">
                                    订单{{index}}:装饰说明:{{sub_sub_order.decoration}};

                                </p>
                            </div>
                            <i class="iconfont">&#xe601;</i>
                        </el-tooltip>
                        </span>

                        </span>
                        <el-input type="textarea" clearable placeholder="请输入装饰说明" v-model="sub_order.decoration" style="width: 350px;vertical-align: middle"></el-input>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;">装饰\辅料:</span>
                        <div style="display: inline-block;vertical-align: top">
                            <div style="margin-bottom: 3px;" v-for="(material_sub, index2)  in sub_order.material_sub">

                                <el-select v-model="material_sub.material" value-key="id" placeholder="请选择装饰/辅料">
                                    <el-option
                                            v-for="item in options.options_material_sub"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <el-select v-model="material_sub.from" value-key="id" placeholder="请选择来源">
                                    <el-option
                                            v-for="item in material_sub_froms"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>
                                <el-input clearable placeholder="数量" v-model="material_sub.sum" style="width: 120px"></el-input>

                                <el-button type="danger" @click="del_material_sub(index, index2)" round size="mini">删除</el-button>

                            </div>
                            <el-button @click="add_material_sub(index)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多辅料</el-button>
                        </div>

                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;">样品图片:

                          <el-tooltip v-if="sub_order.sales_order_sub_diff_data && sub_order.sales_order_sub_diff_data.length && sub_order.sales_order_sub_diff_data.length > 1"  placement="top">
                            <div slot="content">
                                <p v-for="(sub_sub_order, index)  in sub_order.sales_order_sub_diff_data">
                                    订单{{index}}:
                                    <span v-if="sub_sub_order.sample_imgs_final && sub_sub_order.sample_imgs_final.length" v-for="(img, index2) in sub_sub_order.sample_imgs_final" >
                                        <img style="margin: 5px;display: inline-block;width: 50px;" :src="img"/>
                                    </span>
                                </p>
                            </div>
                            <i class="iconfont">&#xe601;</i>
                        </el-tooltip>

                        </span>

                        <el-upload

                                class="avatar-uploader"
                                :class="(!sub_order.sample_imgs || sub_order.sample_imgs.length < img_upload_limit) ? 'show_plus' : 'hide_plus'"
                                :action="upload_url"
                                multiple
                                list-type="picture-card"
                                :file-list="sub_order.sample_imgs"
                                :on-success="(res,file,fileList)=>{return handleAvatarSuccess(res,file, fileList,sub_order)}"
                                :before-upload="beforeAvatarUpload"
                                :on-preview="handlePictureCardPreview"
                                :on-exceed="handleExceed"
                                :limit="img_upload_limit"
                                :on-remove="(file,fileList)=>{return handleRemove(file, fileList,index)}">
                            <i  class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>

                    <div class="search_item">
                        <span class="pre_info" style="font-size: 14px;">备注说明:
                           <el-tooltip v-if="sub_order.sales_order_sub_diff_data && sub_order.sales_order_sub_diff_data.length && sub_order.sales_order_sub_diff_data.length > 1"  placement="top">
                            <div slot="content">
                                <p v-for="(sub_sub_order, index)  in sub_order.sales_order_sub_diff_data" style="border-bottom: 1rpx dashed #999">
                                    订单{{index}}:备注说明:{{sub_sub_order.sample_info}};

                                </p>
                            </div>
                            <i class="iconfont">&#xe601;</i>
                        </el-tooltip>
                        </span>
                        <el-input  type="textarea" clearable placeholder="请输入备注说明" v-model="sub_order.sample_info" style="width: 350px;vertical-align: middle"></el-input>
                    </div>
                    <i class="iconfont del_block" v-if="way==2" @click="del_block(index)">&#xe603;</i>
                    <el-badge class="mark" :value="index+1" style="position: absolute;bottom: 0;right: 0"/>
                </div>

                <div class="search_item add_block"  v-if="way==2" @click="add_block"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>增加订单子项</div>

            </div>
            <div v-if="active == 2" class="table_container" style="text-align: center">
                <p>已成功生成如下订单:</p>
                <p v-for="(order, index)  in success_orders">{{order.order_no}}</p>

            </div>
            <el-button v-if="active == 0 && way == 1" type="success" style="margin: 20px auto;display: flex" v-on:click="go_make" :loading="loading">下一步</el-button>
            <el-button v-if="active == 1" type="success" style="margin: 20px auto;display: flex" v-on:click="submit" :loading="loading">提交</el-button>
            <el-button v-if="active == 2" type="success" style="margin: 20px auto;display: flex" v-on:click="$router.replace({path:'produce_order'});" :loading="loading">返回列表</el-button>


        </div>

    </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  produce_order_edit,
  produce_order_info
} from "@/api/getDataproduce_order";
import {
  sales_order_edit,
  sales_order_info,
  init_select_options,
  sales_sub_orders
} from "@/api/getDatasales_order";
import {
  beforeAvatarUpload,
  setStore,
  getStore,
  deepCopy
} from "@/config/mUtils";
export default {
  data() {
    return {
      id: 0,
      tableData: [],
      table_loading: false,
      limit: 20,
      count: 0,
      currentPage: 1,
      loading: false,
      active: 0,
      way: -1,
      multipleSelection: {},

      upload_url: this.$store.state.constant.upload_url,
      dialogImageUrl: "",
      dialogVisible: false,
      order_date: "",
      delivery_date: "",
      produce_man: "",
        set_name: "",
      sub_orders: [],
      file_list: [],
      img_upload_limit: 3,
      options: {},
      material_sub_froms: [
        { id: 1, name: "厂内" },
        { id: 2, name: "客户自带" }
      ],
      success_orders: []
    };
  },
  components: {
    headTop
  },
  created() {
    this.user_info = JSON.parse(getStore("user_info"));
  },
  mounted() {},

  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.id = to.query.id ? to.query.id : 0;
      vm.is_new = to.query.is_new ? to.query.is_new : 0;
      vm.way = to.query.way ? parseInt(to.query.way) : -1;
      vm.active = to.query.active ? parseInt(to.query.active) : 0;

      vm.init_select_options().then(function() {
        if (vm.id && vm.id > 0) {
          vm.get_info();
        } else {
          vm.init();
        }
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.way = to.query.way ? parseInt(to.query.way) : -1;
    this.active = to.query.active ? parseInt(to.query.active) : 0;
    if (this.active == 0 && this.way == 1) {
      this.get_sales_sub_order_list();
    }

    if (this.active == 1 && this.way == 1) {
      var cache_sales_order_selection = JSON.parse(
        getStore("cache_sales_order_selection")
      );
      if (!cache_sales_order_selection) {
        this.$message({
          message: "请选择业务订单",
          type: "warning"
        });
        this.$router.replace({
          path: "add_produce_order",
          query: { active: 0, way: 1 }
        });
      }
      this.sub_orders = cache_sales_order_selection;
      this.gen_options_product_cat_product();
      this.gen_material_color();
    }

    next();
  },
  methods: {
    init() {
      this.loading = false;
      this.active = this.active ? this.active : 0;
      this.way = this.way ? this.way : -1;

      if (this.active == 1 && this.way == 1) {
        //销售单制单,刷新页面从缓存拿数据
        var cache_sales_order_selection = JSON.parse(
          getStore("cache_sales_order_selection")
        );
        //console.log(cache_sales_order_selection);
        if (!cache_sales_order_selection) {
          this.$message({
            message: "请选择业务订单",
            type: "warning"
          });
          this.$router.replace({
            path: "add_produce_order",
            query: { active: 0, way: 1 }
          });
        }
        this.sub_orders = cache_sales_order_selection;
        this.gen_options_product_cat_product();
        this.gen_material_color();
      }
      if (this.active == 0 && this.way == 1) {
        //选择销售单制单,拉取销售单列表
        this.get_sales_sub_order_list();
      }

      if (this.active == 0 && this.way == -1 && this.is_new) {
        //初始化
        this.multipleSelection = {};
        setStore("cache_sales_order_selection", "");

        this.order_date = new Date().toLocaleDateString();
        this.delivery_date = "";
        this.produce_man = "";
        this.set_name = "";
        this.sub_orders = [];
        this.handleCurrentChange(1);
      }
      this.produce_man = this.user_info.show_name;
      this.set_name = new Date().toLocaleDateString()+'生产单';
    },
    get_sales_sub_order_list() {
      this.table_loading = true;
      sales_sub_orders({
        page: this.currentPage,
        page_size: this.limit,
        status: 1
      }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.tableData = res.data.list;
            this.count = parseInt(res.data.count);
            setTimeout(
              function() {
                this.toggleSelection(
                  this.multipleSelection["page" + this.currentPage]
                );
              }.bind(this)
            );
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          this.table_loading = false;
        }.bind(this)
      );
    },
    go_make() {
      //                if (!this.check_is_same_orders()) {
      //                    this.$message({
      //                        message: '对不起,您所选的订单中包含了 "帽型+型号+颜色" 的组合已超过1种,请检查并确保只包含1种组合',
      //                        type: 'warning'
      //                    });
      //                    return;
      //                }

      //                var sales_order_selection = {
      //                    order_codes:[],
      //                    order_sub_ids:[],
      //                    data:{}
      //                };
      var sales_order_selection;
      for (var i in this.multipleSelection) {
        if (!sales_order_selection) sales_order_selection = {};
        if (this.multipleSelection[i] && this.multipleSelection[i].length) {
          this.multipleSelection[i].forEach(
            function(val, index) {
              if (!this.delivery_date) {
                // console.log(val);
                this.delivery_date = val.delivery_date;
              }
              var unique =
                val.product_cat_id +
                "|" +
                val.product_id +
                "|" +
                val.color_id +
                "|" +
                val.color_code;
              //var unique = val.product_cat_id + '|' + val.product_id;

              //判断流程是否存在并一致
              var extra_id = index;
              if (val.process) {
                extra_id = "";
                val.process.forEach(function(val1) {
                  extra_id += "|" + val1.id;
                });
              }
              unique += extra_id;

              if (!sales_order_selection[unique]) {
                sales_order_selection[unique] = {};
              }

              var color_unique = val.color_id + "|" + val.color_code;
              if (!sales_order_selection[unique][color_unique]) {
                sales_order_selection[unique][color_unique] = {
                  order_codes: [], //主业务员单号
                  order_sub_ids: [], //业务子单号
                  order_sub: [], //业务子单
                  data: {}, //业务单数据
                  sales_order_sub_diff_data: [] //业务单数据
                };
              }

              if (
                sales_order_selection[unique][
                  color_unique
                ].order_sub_ids.indexOf(val.id) == -1
              ) {
                sales_order_selection[unique][color_unique].order_sub_ids.push(
                  val.id
                );
                sales_order_selection[unique][color_unique].order_sub.push({
                  sub_id: val.id,
                  order_id: val.order_id
                }); //用于提交
              }
              if (
                sales_order_selection[unique][color_unique].order_codes.indexOf(
                  val.sales_order.order_no
                ) == -1
              ) {
                sales_order_selection[unique][color_unique].order_codes.push(
                  val.sales_order.order_no
                );
              }

              if (sales_order_selection[unique][color_unique].data.product_id) {
                //合并
                sales_order_selection[unique][color_unique].data.sum =
                  parseInt(
                    sales_order_selection[unique][color_unique].data.sum
                  ) + parseInt(val.sum);
                //合并情况下,其他杂项清空
                sales_order_selection[unique][color_unique].data.material = [];
                sales_order_selection[unique][
                  color_unique
                ].data.material_sub = [];
                sales_order_selection[unique][color_unique].data.decoration =
                  "";
                sales_order_selection[unique][
                  color_unique
                ].data.sample_imgs = [];
                sales_order_selection[unique][
                  color_unique
                ].data.sample_imgs_final = [];
                sales_order_selection[unique][color_unique].data.sample_info =
                  "";
                sales_order_selection[unique][color_unique].data.custom_model =
                  "";
              } else {
                sales_order_selection[unique][color_unique].data = deepCopy(
                  val
                );
              }
              sales_order_selection[unique][
                color_unique
              ].sales_order_sub_diff_data.push(val);
            }.bind(this)
          );
        }
      }
      if (!sales_order_selection) {
        this.$message({
          message: "请选择订单进行下一步操作",
          type: "warning"
        });
        return;
      }
      var data = [];
      for (i in sales_order_selection) {
        var block = {};
        for (var j in sales_order_selection[i]) {
          if (block.product_id) {
            block.colors.push({
              color: {
                id: sales_order_selection[i][j].data.color_id,
                name: sales_order_selection[i][j].data.color_code
              },
              id: sales_order_selection[i][j].data.color_id,
              name: sales_order_selection[i][j].data.color_code,
              sum: sales_order_selection[i][j].data.sum,
              order_codes: sales_order_selection[i][j].order_codes,
              order_sub: sales_order_selection[i][j].order_sub
            });
          } else {
            block = sales_order_selection[i][j].data;
            (block.material_sub = []),
              (block.colors = [
                {
                  color: { id: block.color_id, name: block.color_code },
                  id: block.color_id,
                  name: block.color_code,
                  sum: block.sum,
                  order_codes: sales_order_selection[i][j].order_codes,
                  order_sub: sales_order_selection[i][j].order_sub
                }
              ]);
            block.sales_order_sub_diff_data = deepCopy(
              sales_order_selection[i][j].sales_order_sub_diff_data
            );
          }
        }
        data.push(block);
      }

      setStore("cache_sales_order_selection", data);
      this.$router.push({
        path: "add_produce_order",
        query: { active: 1, way: 1 }
      });
    },
    check_is_same_orders() {
      var is_same = true;
      var check = "";
      for (var i in this.multipleSelection) {
        if (this.multipleSelection[i] && this.multipleSelection[i].length) {
          this.multipleSelection[i].forEach(function(val) {
            if (!check) {
              check =
                val.product_cat_id +
                "|" +
                val.product_id +
                "|" +
                val.color_id +
                "|" +
                val.color_code;
            } else {
              var current_check =
                val.product_cat_id +
                "|" +
                val.product_id +
                "|" +
                val.color_id +
                "|" +
                val.color_code;
              if (check != current_check) {
                is_same = false;
                return;
              }
            }
          });
        }
        if (!is_same) {
          break;
        }
      }
      return is_same;
    },
    handleCurrentChange(val) {
      this.currentPage = val;

      this.get_sales_sub_order_list();
    },
    handleSelectionChange(val) {
      // console.log(val)
      setTimeout(
        function() {
          //                    this.multipleSelection['page'+this.currentPage]= [];
          //                    val.forEach(row => {
          //                        this.multipleSelection['page'+this.currentPage].push({id:row.id});
          //
          //                    });
          this.multipleSelection["page" + this.currentPage] = val;
        }.bind(this)
      );
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.tableData.forEach(li => {
            if (li.id == row.id) {
              this.$refs.multipleTable.toggleRowSelection(li, true);
            }
          });
        });
      } else {
        //                    this.$refs.multipleTable.clearSelection();
      }
    },

    get_info() {
      produce_order_info({ id: this.id }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.order_date = res.data.order_date;
            this.delivery_date = res.data.delivery_date;
            this.produce_man = res.data.produce_man;
            this.set_name = res.data.set_name;
            this.sub_orders = res.data.sales_order_sub;
            this.gen_options_product_cat_product();
            this.gen_material_color();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        }.bind(this)
      );
    },
    submit: function() {
      var data = {
        id: this.id,
        order_date: this.order_date,
        delivery_date: this.delivery_date,
        produce_man: this.produce_man,
          set_name: this.set_name,
        sub_orders: this.sub_orders
      };
      var error_msg = "";
        if (!data.set_name) error_msg = "请填写生产单自定义名称";
        if (!data.order_date) error_msg = "请填写制单日期";
      if (!data.delivery_date) error_msg = "请填写交货日期";
      if (!data.produce_man) error_msg = "请填写生产统筹员姓名";

      if (!data.sub_orders || data.sub_orders.length < 1)
        error_msg = "请添加订单子项";

      var order_num = 0;
      data.sub_orders.forEach(
        function(val, index) {
          if (!val.material || !val.material.length) {
            error_msg = "第" + (index + 1) + "个子项,请添加材料";
          } else {
            val.material.forEach(function(item) {
              if (!item.material || !item.sub || !item.num) {
                error_msg =
                  "第" + (index + 1) + "个子项,请检查材料是否设置完整";
              }
            });
          }
          if (!val.process || !val.process.length)
            error_msg = "第" + (index + 1) + "个子项,请选择流程";

          if (!val.product_cat_id)
            error_msg = "第" + (index + 1) + "个子项,请选择帽型类别";
          if (!val.product_id)
            error_msg = "第" + (index + 1) + "个子项,请选择帽型型号";
          if (!val.colors || !val.colors.length) {
            error_msg = "第" + (index + 1) + "个子项,请添加颜色";
          } else {
            val.colors.forEach(function(color) {
              order_num++;
              if (!color.id || !color.name || !color.sum) {
                error_msg =
                  "第" + (index + 1) + "个子项,请检查颜色是否设置完整";
              }
            });
          }

          var sample_imgs = [];
          if (val.sample_imgs && val.sample_imgs.length > 0) {
            val.sample_imgs.forEach(function(img) {
              sample_imgs.push(img.url);
            });
          }
          val.sample_imgs_final = sample_imgs;
        }.bind(this)
      );

      if (error_msg) {
        this.$message({
          type: "warning",
          message: error_msg
        });
        return;
      }
      if (data.id) {
        var tip = "确认无误, 是否继续?";
      } else {
        var tip = "确认无误, 将会生产" + order_num + "个子订单, 是否继续?";
      }
        this.loading = true;
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(
          function() {
            produce_order_edit(data).then(
              function(res) {
                if (res.code == this.$store.state.constant.status_success) {
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  if (data.id) {
                    this.$router.replace({ path: "produce_order" });
                  } else {
                    this.success_orders = res.data;
                    this.active = 2;
                  }
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
                  this.loading = false;
              }.bind(this)
            );
          }.bind(this)
        )
        .catch(() => {})
        .finally(
          function() {
            //this.loading = false;
          }.bind(this)
        );
    },

    /**
     * 获取各下拉框的options
     */
    init_select_options() {
      return init_select_options().then(
        function(res) {
          return new Promise(
            function(resolve, reject) {
              if (res.code == this.$store.state.constant.status_success) {
                this.options = res.data;
                this.options.options_color.push({ id: "-1", name: "其他" });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
              resolve();
            }.bind(this)
          );
        }.bind(this)
      );
    },

    handleRemove(file, fileList, index) {
      //                console.log(file, fileList);
      this.sub_orders[index].sample_imgs = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList, sub_order) {
      if (fileList) {
        var is_success = true;
        var file_list = [];
        fileList.forEach(
          function(val) {
            if (val.status == "success") {
              if (val.response && val.response.data && val.response.data[0]) {
                file_list.push({ name: "", url: val.response.data[0] });
              } else if (val.url) {
                file_list.push({ name: "", url: val.url });
              }
            } else {
              is_success = false;
            }
          }.bind(this)
        );
        if (is_success) {
          //                        this.sub_orders[index].sample_imgs = file_list;
          sub_order.sample_imgs = file_list;
        }
      }
    },
    beforeAvatarUpload(file) {
      return beforeAvatarUpload(file, this);
    },
    handleExceed() {
      this.$message({
        message: "最多上传3张图片哦",
        type: "warning"
      });
    },
    add_block() {
      var sub_order = {
        product_cat: {},
        product: {},
        colors: [
          {
            color: { id: "", name: "" },
            id: "",
            name: "",
            sum: ""
          }
        ],
        material: [],
        decoration: "",
        material_sub: [],
        process: [],
        sample_imgs: [],
        sample_info: ""
      };
      this.sub_orders.push(sub_order);
    },
    del_block(index) {
      this.sub_orders.splice(index, 1);
    },
    add_color(index) {
      var color = {
        id: "",
        name: "",
        sum: "",
        color: {}
      };
      this.sub_orders[index].colors.push(color);
    },
    del_color(index1, index2) {
      this.sub_orders[index1].colors.splice(index2, 1);
    },

    add_material(index) {
      var material = {
        material: "",
        sum: ""
      };
      this.sub_orders[index].material.push(material);
    },
    del_material(index1, index2) {
      this.sub_orders[index1].material.splice(index2, 1);
    },

    add_material_sub(index) {
      var material_sub = {
        material: "",
        from: "",
        sum: ""
      };
      this.sub_orders[index].material_sub.push(material_sub);
    },
    del_material_sub(index1, index2) {
      this.sub_orders[index1].material_sub.splice(index2, 1);
    },
    change_product_cat(sub_order) {
      sub_order.product_cat_id = sub_order.product_cat.id;
      sub_order.product_cat_name = sub_order.product_cat.name;

      sub_order.options_product_cat_product = [];
      sub_order.product = {};
      this.options.options_product.forEach(
        function(val) {
          if (val.cid == sub_order.product_cat.id) {
            sub_order.options_product_cat_product = val.options;
            sub_order.product =
              val.options && val.options.length ? val.options[0] : {};
            this.change_product(sub_order);
          }
        }.bind(this)
      );
    },
    gen_options_product_cat_product() {
      this.sub_orders.forEach(
        function(sub_order) {
          this.options.options_product.forEach(
            function(val) {
              if (val.cid == sub_order.product_cat.id) {
                sub_order.options_product_cat_product = val.options;
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },

    change_material(material) {
      material.sub_options = [];
      material.sub = {};
      this.options.options_material_colors.forEach(
        function(val) {
          if (val.cid == material.material.id) {
            material.sub_options = deepCopy(val.options);
            material.sub =
              material.sub_options && material.sub_options.length
                ? material.sub_options[0]
                : {};
          }
        }.bind(this)
      );
    },
    gen_material_color() {
      this.sub_orders.forEach(
        function(sub_order) {
          sub_order.material.forEach(
            function(val1) {
              this.options.options_material_colors.forEach(
                function(val) {
                  if (val.cid == val1.material.id) {
                    val1.sub_options = deepCopy(val.options);
                  }
                }.bind(this)
              );
            }.bind(this)
          );
        }.bind(this)
      );
    },

    change_product(sub_order) {
      sub_order.product_id = sub_order.product.id;
      sub_order.product_name = sub_order.product.name;
    },
    change_color(color) {
      color.id = color.color.id;
      color.name = color.color.name;
    },
    change_process(sub_order) {
      //排序
      var compare = function(obj1, obj2) {
        var val1 = parseInt(obj1.sort);
        var val2 = parseInt(obj2.sort);
        if (val1 > val2) {
          return -1;
        } else if (val1 < val2) {
          return 1;
        } else {
          return 0;
        }
      };
      //console.log(sub_order.process.sort(compare));
      sub_order.process = sub_order.process.sort(compare);
    }
  }
};
</script>



<style scoped lang="less">
@import "../style/mixin";
.avatar-uploader {
    display: inline-block;
    vertical-align: middle;
}
.hide_plus .el-upload {
    display: none;
}
.search_item {
  margin-top: 10px;
}

.pre_info {
  display: inline-block;
  width: 140px;
}
.block {
  margin: 10px 0;
  padding: 10px;
  padding-top: 0;
  border: 1px dashed #aaa;
  width: 800px;
  position: relative;
}

.more_btn {
  font-size: 12px;
  background: ;
  border-radius: 20px;
  padding: 5px;
  width: 120px;
  text-align: center;
}
.del_block {
  position: absolute;
  top: 10px;
  right: 10px;
  color: red;
  cursor: pointer;
}
.del_block:hover {
  color: rgb(200, 100, 100);
}
.add_block {
  border: 1px dashed #333;
  font-size: 12px;
  width: 800px;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  background: #fafaff;
}
.add_block:hover {
  border-color: #409eff;
  color: #409eff;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 45%;
}
</style>
