<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container" style="padding:20px">
      <!-- 客户单号 -->
      <div class="search_item">
        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>客户单号:</span>
        <el-input clearable placeholder="请输入单号" v-model="order_no" style="width: 350px">
        </el-input>
      </div>
      <!-- 制单日期 -->
      <div class="search_item">
        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>制单日期:</span>
        <el-date-picker
          v-model="order_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <!-- 交货日期 -->
      <div class="search_item">
        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>交货日期:</span>
        <el-date-picker
          v-model="delivery_date"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <!-- 客户姓名 -->
      <div class="search_item">
        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>客户姓名:</span>
        <el-input clearable placeholder="请输入客户姓名" v-model="custom_name" style="width: 350px">
        </el-input>
      </div>
      <!-- 业务员 -->
      <div class="search_item">
        <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>业务员:</span>
        <el-input clearable placeholder="请输入业务员姓名" v-model="sales_man" style="width: 350px">
        </el-input>
      </div>
      <!-- 订单子项 -->
      <div class="block" v-for="(sub_order, index) in sub_orders" :key='index'>
        <!-- 帽型 -->
        <div class="search_item">
            <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>帽型:</span>
            <el-select v-model="sub_order.product_cat" placeholder="请选择" @change="change_product_cat(sub_order)" value-key="id">
                <el-option
                        v-for="item in options.options_product_cat"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                </el-option>
            </el-select>
            <el-select v-model="sub_order.product" placeholder="请选择"  @change="change_product(sub_order)" value-key="id">
                <el-option
                        v-for="item in sub_order.options_product_cat_product"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                </el-option>
            </el-select>
        </div>
        <!-- 颜色 -->
        <div class="search_item">
          <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>颜色:</span>
          <div style="display: inline-block;vertical-align: top">
            <div style="padding: 10px;" v-for="(color, index2)  in sub_order.colors" :key='index2'>
              <div>
                <div style="display: inline-block;border: 1px dashed #999;padding: 10px;position: relative">
                  <div style="position:absolute;right: 0;top:0;padding: 3px;background: rgb(65, 144, 243);font-size: 10px;color: #fff">颜色{{index2+1}}</div>
                  <i style="color:red;">*</i><el-select v-model="color.color" placeholder="请选择" value-key="id" @change="change_color(color,sub_order)" style="width:160px;">
                    <el-option
                            v-for="item in options.options_color"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                    </el-option>
                  </el-select>
                  <el-input v-if="color.id == -1" clearable placeholder="颜色" v-model="color.name" style="width: 220px"></el-input>
                  <el-input clearable placeholder="代号" v-model="color.custom_model" style="width: 120px"></el-input>

                  <div style="vertical-align: top;margin-top: 10px;">
                    <p style="font-size: 12px;color: #333"><i style="color:red;">*</i>详细信息:</p>
                    <div style="text-align: center;">
                      <div style="display: inline-block;width: 140px;text-align: left;font-size: 12px;color: #333">尺寸:</div>
                      <div style="display: none;width: 140px;text-align: left;font-size: 12px;color: #333">型号:</div>
                      <div style="display: inline-block;width: 140px;text-align: left;font-size: 12px;color: #333">去向:</div>
                      <div style="display: inline-block;width: 140px;text-align: left;font-size: 12px;color: #333">数量:</div>
                      <div v-for="(item, idx)  in color.color_details" :key='idx' style="margin-top: 5px;">

                        <el-input type="text" clearable placeholder="尺寸" v-model="item.size" style="width: 140px"></el-input>
                        <el-input type="text" clearable placeholder="型号" v-model="item.model" style="width: 140px;display: none"></el-input>
                        <el-input type="text" clearable placeholder="去向" v-model="item.go" style="width: 140px"></el-input>
                        <el-input type="number" clearable placeholder="数量" v-model="item.sum" style="width: 135px"></el-input>

                        <el-button type="danger" @click="del_color_detail(color, idx)" round size="mini"><i class="iconfont" style="font-size: 10px;margin-right: 0">&#xe603;</i></el-button>
                        <!--<i class="iconfont" @click="del_color_options(index, idx)" style="cursor:pointer;font-size: 10px;color: red">&#xe603;</i>-->
                      </div>

                      <el-button @click="add_color_detail(color)" type="danger" round size="mini" style="margin:0 auto;margin-top: 10px;"><i class="iconfont" style="font-size: 10px;margin-right: 0">&#xe658;</i></el-button>
                    </div>

                  </div>
                </div>



                <el-button type="danger" @click="del_color(index, index2)" round size="mini">删除</el-button>
              </div>
            </div>
            <el-button @click="add_color(index)" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多颜色</el-button>
          </div>

        </div>

        <!--<div class="search_item">-->
            <!--<span class="pre_info" style="font-size: 14px;">材质:</span>-->
            <!--<el-select multiple v-model="sub_order.material" placeholder="请选择" value-key="id">-->
                <!--<el-option-->
                        <!--v-for="item in options.options_material"-->
                        <!--:key="item.id"-->
                        <!--:label="item.name"-->
                        <!--:value="item">-->
                <!--</el-option>-->
            <!--</el-select>-->
        <!--</div>-->

        <!-- 材料 -->
        <div class="search_item">
          <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>材料:</span>
          <el-input type="textarea" clearable placeholder="请输入材料" v-model="sub_order.raw_material" style="width: 350px;vertical-align: middle"></el-input>
        </div>
        <!-- <div class="search_item">
          <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>材料:</span>
          <el-input type="textarea" clearable placeholder="请输入材料" v-model="sub_order.material" style="width: 350px;vertical-align: middle"></el-input>
          <div style="display: inline-block;vertical-align: top">
              <template v-if="sub_order.material && sub_order.material.length" v-for="(material_obj, index3) in sub_order.material">
                  <div style="font-size: 14px;color: #000;margin: 5px;background: #eee;width: 50px;text-align: center;" :key='index3'>{{material_obj.belong_color.name}}:</div>
                  <div style="margin-bottom: 3px;" v-for="(material, index2)  in material_obj.data" :key='index2'>

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


                      <el-button type="danger" @click="del_material(material_obj, index2)" round size="mini">删除</el-button>

                  </div>
                  <el-button @click="add_material(material_obj)" type="danger" round size="mini" :key='index3'><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多材料</el-button>
              </template>
          </div>
        </div> -->

        <!-- 流程 -->
        <div class="search_item">
          <span class="pre_info" style="font-size: 14px;">流程:</span>
          <el-select multiple v-model="sub_order.process" placeholder="请选择" value-key="id" @change="change_process(sub_order)">
            <el-option
                v-for="item in options.options_process"
                :key="item.id"
                :label="item.name"
                :value="item">
            </el-option>
          </el-select>
        </div>

        <!-- 装饰说明 -->
        <div class="search_item">
          <span class="pre_info" style="font-size: 14px;">装饰说明:</span>
          <el-input type="textarea" clearable placeholder="请输入装饰说明" v-model="sub_order.decoration" style="width: 350px;vertical-align: middle"></el-input>
        </div>
        
        <!-- 样品图片 -->
        <div class="search_item">
          <span class="pre_info" style="font-size: 14px;">样品图片:</span>

          <el-upload
              class="avatar-uploader"
              :class="(!sub_order.sample_imgs || sub_order.sample_imgs.length < limit) ? 'show_plus' : 'hide_plus'"
              :action="upload_url"
              multiple
              list-type="picture-card"
              :file-list="sub_order.sample_imgs"
              :on-success="(res,file,fileList)=>{return handleAvatarSuccess(res,file, fileList,sub_order)}"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
              :on-exceed="handleExceed"
              :limit="limit"
              :on-remove="(file,fileList)=>{return handleRemove(file, fileList,index)}">
              <i  class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        
        <!-- 备注说明 -->
        <div class="search_item">
            <span class="pre_info" style="font-size: 14px;">备注说明:</span>
            <el-input  type="textarea" clearable placeholder="请输入备注说明" v-model="sub_order.sample_info" style="width: 350px;vertical-align: middle"></el-input>
        </div>

        <!-- 客户款式/型号 -->
        <div class="search_item">
            <span class="pre_info" style="font-size: 14px;">客户款式/型号:</span>
            <el-input clearable placeholder="请输入客户款式" v-model="sub_order.custom_model" style="width: 350px;vertical-align: middle"></el-input>
        </div>

        <!-- <i class="iconfont del_block" @click="del_block(index)">&#xe603;</i> -->
      </div>

      <!-- <div class="search_item add_block" @click="add_block"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>增加订单子项</div> -->

      <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  sales_order_edit,
  sales_order_info,
  init_select_options
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
      clone: false,
      loading: false,
      upload_url: this.$store.state.constant.upload_url,
      dialogImageUrl: "",
      dialogVisible: false,
      order_date: "",
      delivery_date: "",
      custom_name: "",
      order_no: "",
      sales_man: "",
      sub_orders: [
        {
          product_cat: {},
          product: {},
          colors: [],
          material: [],
          raw_material: "",
          decoration: "",
          process: [],
          sample_imgs: [],
          sample_info: "",
          custom_model: "",
          options_product_cat_product: []
        }
      ],
      file_list: [],
      limit: 3,
      type: 0,
      types: [{ id: 0, name: "主料" }, { id: 1, name: "装饰、辅料" }],
      options: {
        options_product_cat: [],
        options_process: []
      }
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
      // console.log(vm.id);
      vm.init_select_options().then(function() {
        if (vm.id && vm.id > 0) {
          vm.clone = to.query.clone ? true : false;
          vm.get_info();
        } else {
          vm.init();
        }
      });
    });
  },
  methods: {
    init() {
      this.loading = false;
      this.order_date = "";
      this.delivery_date = "";
      this.custom_name = "";
      this.order_no = "";
      this.sales_man = this.user_info.show_name;
      this.sub_orders = [
        {
          product_cat: {},
          product: {},
          colors: [],
          material: [],
          raw_material: "",
          decoration: "",
          process: [],
          sample_imgs: [],
          sample_info: "",
          custom_model: "",
          options_product_cat_product: []
        }
      ];

      //草稿中获取
      var sales_order_edit_data = getStore("sales_order_edit_data_20181016");
      sales_order_edit_data = JSON.parse(sales_order_edit_data);
      if (sales_order_edit_data) {
        this.order_date = sales_order_edit_data.order_date;
        this.delivery_date = sales_order_edit_data.delivery_date;
        this.custom_name = sales_order_edit_data.custom_name;
        this.order_no = sales_order_edit_data.order_no;
        this.sales_man = sales_order_edit_data.sales_man
          ? sales_order_edit_data.sales_man
          : this.sales_man;
        this.sub_orders = sales_order_edit_data.sub_orders;
      }
      console.log(sales_order_edit_data, "草稿中获取");

      this.order_date = new Date().toLocaleDateString();
    },
    // 获取复制时的数据
    get_info() {
      sales_order_info({ id: this.id }).then(
        function(res) {
          if (res.code == this.$store.state.constant.status_success) {
            this.order_date = res.data.order_date;
            this.delivery_date = res.data.delivery_date;
            this.custom_name = res.data.custom_name;
            this.order_no = res.data.custom_order_no;
            this.sales_man = res.data.sales_man;
            this.sub_orders = res.data.sales_order_sub;
            this.gen_options_product_cat_product();
            this.gen_material_color();
//            console.log(this.sub_orders, "get_info--sub_orders");
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
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
                this.options.options_color.unshift({ id: "-1", name: "其他颜色(自定义)" });
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

    // 保存
    submit: function() {
      var data = {
        id: this.id,
        order_date: this.order_date,
        delivery_date: this.delivery_date,
        custom_name: this.custom_name,
        order_no: this.order_no,
        sales_man: this.sales_man,
        sub_orders: this.sub_orders
      };
      if (this.clone) {
        data.id = null;
      }
      var error_msg = "";
      if (!data.order_no) error_msg = "请填写客户单号";
      if (!data.order_date) error_msg = "请填写制单日期";
      if (!data.delivery_date) error_msg = "请填写交货日期";
      if (!data.custom_name) error_msg = "请填写客户姓名";

      if (!data.sales_man) error_msg = "请填写业务员姓名";
      if (!data.sub_orders || data.sub_orders.length < 1)
        error_msg = "请添加订单子项";

      data.sub_orders.forEach(
        function(val, index) {
          if (!val.product_cat_id)
            error_msg = "请选择帽型类别";
          if (!val.product_id)
            error_msg = "请选择帽型型号";
          if (!val.colors || !val.colors.length) {
            error_msg = "请添加颜色";
          }
          else {
            val.colors.forEach(function(color) {
              if (!color.id || !color.name || !color.color_details || !color.color_details.length) {
                error_msg = "请检查颜色各项及详细是否设置完整";
              }
              color.color_details.forEach(function(detail) {
                if (!detail.sum) {
                  error_msg = "请检查颜色详细信息里的数量是否设置完整";
                }
              })


            });
          }

          if (!val.raw_material) error_msg = "请输入材料";

          // if (!val.material || !val.material.length) {
          //   error_msg = "第" + (index + 1) + "个子项,请添加材料";
          // } else {
          //   val.material.forEach(function(_item) {
          //     if (!_item.data || !_item.data.length) {
          //       error_msg =
          //         "第" + (index + 1) + "个子项,请检查材料是否添加完整";
          //     } else {
          //       _item.data.forEach(function(item) {
          //         if (!item.material || !item.sub || !item.num) {
          //           error_msg =
          //             "第" + (index + 1) + "个子项,请检查材料是否设置完整";
          //         }
          //       });
          //     }
          //   });
          // }

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
      //console.log(data);return;
      this.loading = true;
      this.$confirm("确认无误, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(
          function() {
            this.loading = true;
            sales_order_edit(data).then(
              function(res) {
                if (res.code == this.$store.state.constant.status_success) {
                  var sales_order_edit_data = {
                    order_date: data.order_date,
                    delivery_date: data.delivery_date,
                    custom_name: data.custom_name,
                    order_no: data.order_no,
                    sales_man: data.sales_man,
                    sub_orders: data.sub_orders
                  };
                  // console.log(sales_order_edit_data);
                  setStore(
                    "sales_order_edit_data_20181016",
                    sales_order_edit_data
                  );
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.$router.push({ path: "sales_order", query: {} });
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
        .catch(() => {
        this.loading = false;
      })
        .finally(
          function() {
//            this.loading = false;
          }.bind(this)
        );
    },
    // 样品图片start
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
    // 样品图片end
    // add_block() {
    //   var sub_order = {
    //     product_cat: {},
    //     product: {},
    //     colors: [],
    //     material: [],
    //     raw_material: "",
    //     decoration: "",
    //     process: [],
    //     sample_imgs: [],
    //     sample_info: "",
    //     custom_model: "",
    //     options_product_cat_product: []
    //   };
    //   this.sub_orders.push(sub_order);
    // },
    // del_block(index) {
    //   this.sub_orders.splice(index, 1);
    // },
    add_color_detail(item) {
      var color_detail = {
        size: "",
        model: "",
        go: "",
        sum:""
      };
      if (!item.color_details) {
//        item.color_details = [];
//        var new_item = item;
        this.$set(item,'color_details',[color_detail]);
      } else {
        item.color_details.push(color_detail);
      }
      console.log(this.sub_orders);


//      console.log(index, "index");
//      console.log(this.sub_orders[index].color_options, "color_options");
    },
    del_color_detail(item, index) {
      if (item.color_details.length <=1) {
        this.$message({
          message: '最后一个不能删除',
          type: "warning"
        });
        return;
      }
      item.color_details.splice(index, 1);
    },
    add_color(index) {
      var color = {
        _id: new Date(),
        id: "",
        name: "",
        sum: "",
        color: {},
        color_details:[
          {
            size: "",
            model: "",
            go: "",
            sum:""
          }
        ]
      };
      this.sub_orders[index].colors.push(color);

//      this.sub_orders[index].color_options = [
//        {
//          size: "",
//          model: "",
//          go: ""
//        }
//      ];

      this.sub_orders[index].material.push({
        _id: color._id,
        belong_color: { id: color.id, name: color.name },
        data: []
      });
    },
    del_color(index1, index2) {
      this.sub_orders[index1].material.forEach(
        function(val, i) {
          if (val._id == this.sub_orders[index1].colors[index2]._id) {
            this.sub_orders[index1].material.splice(i, 1);
          }
        }.bind(this)
      );
      this.sub_orders[index1].colors.splice(index2, 1);
    },
    change_product_cat(sub_order) {
      sub_order.product_cat_id = sub_order.product_cat.id;
      sub_order.product_cat_name = sub_order.product_cat.name;

      sub_order.options_product_cat_product = [];
      sub_order.product = {};
      this.change_product(sub_order,1);
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
            function(val2) {
              if (val2.data) {
                val2.data.forEach(
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
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },

    change_product(sub_order,clear) {
//      console.log(sub_order);
      if (clear) {
        sub_order.product_id = 0;
        sub_order.product_name = '';
      } else {
        sub_order.product_id = sub_order.product.id;
        sub_order.product_name = sub_order.product.name;
      }

    },
    change_color(color, sub_order) {
//      console.log(color, "change_color");
      color.id = color.color.id;
      color.name = color.color.name;
      if (sub_order.material.length) {
        sub_order.material.forEach(function(val) {
          if (val._id == color._id) {
            val.belong_color = { id: color.id, name: color.name };
          }
        });
      }
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
    },
    add_material(material_obj) {
      var material = {
        material: [],
        sub: [],
        num: ""
      };
      material_obj.data.push(material);
      //console.log(this.sub_orders[index].material);
    },
    del_material(material_obj, index2) {
      material_obj.data.splice(index2, 1);
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
  width: 1100px;
  position: relative;
}

.more_btn {
  font-size: 12px;

  border-radius: 20px;
  padding: 5px;
  width: 120px;
  text-align: center;
}
.colorOptions {
  margin: 10px 0;
  padding: 10px;
  padding-top: 0;
  border: 1px dashed #aaa;
  width: 820px;
   position: relative;
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
</style>
