<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>类型:</span>
                <el-select v-model="cid" placeholder="类型">
                    <el-option
                            v-for="item in categories"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>型号:</span>
                <el-input clearable placeholder="请输入型号" v-model="code" style="width: 350px">
                </el-input>
            </div>

            <!--<div class="search_item">-->
                <!--<span class="pre_info" style="font-size: 14px;">示例图片(帽子正面图):</span>-->
                <!--<el-upload-->

                        <!--class="avatar-uploader"-->
                        <!--:action="upload_url"-->
                        <!--:show-file-list="false"-->
                        <!--:on-success="handleAvatarSuccess"-->
                        <!--:before-upload="beforeAvatarUpload">-->
                    <!--<img v-if="img" :src="img" class="avatar">-->
                    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--</el-upload></el-input>-->
            <!--</div>-->
            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {product_edit,product_info} from '@/api/getDataproduct'
    import {product_category_all_list} from '@/api/getDataproduct_category'
    import {beforeAvatarUpload} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                code:'',
                cid:'',
                img:'',
                categories:[],
                upload_url:this.$store.state.constant.upload_url,
            }

        },
        components: {
            headTop
        },
        created(){

        },
        mounted(){

        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;
//                console.log(vm.id )
            if (vm.id && vm.id > 0) {
                vm.get_info();
            } else {
                vm.init();
            }
            vm.get_product_category_all_list();

        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.code = '';
                this.cid = '';
                this.img = '';
            },
            get_info() {
                product_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.code = res.data.code;
                        this.cid = res.data.cid;
                        this.img = res.data.img;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            get_product_category_all_list(){
                return product_category_all_list().then(function(res){
                    return new Promise(function(resolve,reject){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.categories = res.data
                        }
                        resolve();
                    }.bind(this));

                }.bind(this));
            },
            submit: function () {

                if (!this.code) {
                    var error_msg = '请填写型号';
                }
                if (!this.cid) {
                    var error_msg = '请选择类型';
                }

                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    product_edit({id:this.id,code:this.code,cid:this.cid,img:this.img}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'product',query:{}});
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }.bind(this));

                }.bind(this)).catch(() => {

                }).finally(function(){
                    this.loading = false;
                }.bind(this));

            },
            handleAvatarSuccess(res, file) {
                this.img = res.data[0];
            },

            beforeAvatarUpload(file) {

                return beforeAvatarUpload(file, this);
            },

        }
    }
</script>

<style>
    .avatar-uploader{
        width: 50px;
        display: inline-block;
        vertical-align: middle;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }
    .avatar {
        width: 50px;
        height: 50px;
        display: block;
    }
    .ql-editor{
        min-height: 300px;
    }
</style>

<style scoped lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

    .pre_info{
        display:inline-block ;
        width: 140px;
    }

</style>
