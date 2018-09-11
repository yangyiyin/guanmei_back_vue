<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>名称:</span>

                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">

                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">示例图片(帽子正面图):</span>
                <el-upload

                        class="avatar-uploader"
                        :action="upload_url"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="img" :src="img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload></el-input>
            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {product_category_edit,product_category_info} from '@/api/getDataproduct_category'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                img:'',
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

        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.img = '';
            },
            get_info() {
                product_category_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.img = res.data.img;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.name) {
                    var error_msg = '请填写名称';
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
                    product_category_edit({id:this.id,name:this.name,img:this.img}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'product_category',query:{}});
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
                this.fullscreenLoading = true
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 1;

                if (!isJPG) {
                    this.fullscreenLoading = false
                    this.$message.error('图片格式只支持jpg和png!');
                }
                if (!isLt2M) {
                    this.fullscreenLoading = false
                    this.$message.error('图片大小不能超过 1MB!');
                }
                return  isLt2M;
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
