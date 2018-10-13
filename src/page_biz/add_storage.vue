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

            <div  v-if="type==0" class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>颜色:</span>
                <div style="display: inline-block;vertical-align: top">
                    <div style="margin-bottom: 3px;" v-for="(sub, index)  in subs">

                        <el-select v-model="sub.color" placeholder="请选择" value-key="id">
                            <el-option
                                    v-for="item in material_colors"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-input type="number" clearable placeholder="数量" v-model="sub.sum" style="width: 120px"></el-input>

                        <el-button type="danger" @click="del_color(index)" round size="mini">删除</el-button>

                    </div>
                    <el-button @click="add_color()" type="danger" round size="mini"><i class="iconfont" style="font-size: 10px;">&#xe658;</i>添加更多颜色</el-button>
                </div>

            </div>

            <div v-if="type==1" class="search_item">
                <span class="pre_info" style="font-size: 14px;"><i style="color:red;">*</i>数量(默认单位):</span>
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
    import {storage_edit,storage_info,material_colors} from '@/api/getDatastorage'
    import {beforeAvatarUpload} from '@/config/mUtils'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                subs:[],
                sum:'',
                place:'',
                img:'',
                type:0,
                types:[{id:0,name:'主料'},{id:1,name:'装饰、辅料'}],
                upload_url:this.$store.state.constant.upload_url,
                material_colors:[]
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
            vm.init_material_colors().then(function() {
                if (vm.id && vm.id > 0) {
                    vm.get_info();
                } else {
                    vm.init();
                }
            });

        })
        },
        methods: {

            init() {
                this.loading = false;
                this.name = '';
                this.sum = '';
                this.subs = [];
                this.place = '';
                this.img = '';
                this.type = 0;
            },
            init_material_colors() {
                return material_colors().then(function (res) {
                    return new Promise(function(resolve,reject){
                        if (res.code == this.$store.state.constant.status_success) {
                            this.material_colors = res.data;
                        } else {
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                        resolve();
                    }.bind(this));

                }.bind(this));
            },
            get_info() {
                storage_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.sum = res.data.sum;
                        this.subs = res.data.subs;
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

                if (this.type == 1 && !this.sum) {
                    var error_msg = '请填写数量';
                }

                if (this.type == 0 && (!this.subs || !this.subs.length)) {
                    var error_msg = '请填写颜色及对应数量';
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
                var data = {id:this.id,name:this.name,sum:this.sum, subs:this.subs,place:this.place,img:this.img,type:this.type};

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    storage_edit(data).then(function (res) {
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
                return beforeAvatarUpload(file, this);
            },
            add_color() {
                var item = {
                    color:{
                        id:'',
                        name:''
                    },
                    sum:'',

                };
                this.subs.push(item);
            },
            del_color(index) {
                this.subs.splice(index,1);
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
