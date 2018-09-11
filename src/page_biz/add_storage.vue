<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>类型:</span>
                <el-select v-model="type" placeholder="类型">
                    <el-option
                            v-for="item in types"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>名称:</span>
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">

                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>数量(kg):</span>
                <el-input clearable placeholder="请输入数量" v-model="sum" style="width: 350px">

                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>存放位置:</span>
                <el-input clearable placeholder="请输入存放位置" v-model="place" style="width: 350px">

                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">图片:</span>
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
    import {storage_edit,storage_info} from '@/api/getDatastorage'
    import {beforeAvatarUpload} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                sum:'',
                place:'',
                img:'',
                type:0,
                types:[{id:0,name:'主料'},{id:1,name:'装饰、辅料'}],
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
                this.sum = '';
                this.place = '';
                this.img = '';
                this.type = 0;
            },
            get_info() {
                storage_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.sum = res.data.sum;
                        this.place = res.data.place;
                        this.img = res.data.img;
                        this.type = parseInt(res.data.type);
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

                if (!this.sum) {
                    var error_msg = '请填写数量';
                }
                if (!this.place) {
                    var error_msg = '存放位置';
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
                    storage_edit({id:this.id,name:this.name,sum:this.sum,place:this.place,img:this.img,type:this.type}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'storage',query:{}});
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
                return beforeAvatarUpload(file);
            }

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
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }
    .avatar {
        width: 150px;
        height: 150px;
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
