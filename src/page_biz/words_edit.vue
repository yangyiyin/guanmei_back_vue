<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">



            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">标题:</span>
                <el-input clearable placeholder="请输入标题" v-model="title" style="width: 250px"></el-input>

            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;vertical-align: top">描述:</span>
                <el-input style="width: 300px" placeholder="内容..." v-model="content" type="textarea" :rows="2" >

                </el-input>
            </div>


            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {words_edit,words_info} from '@/api/getDataEarth'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                title:'',
                content:'',
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

                this.title = '';

                this.content='';

            },

            get_info() {
                words_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {

                        this.title = res.data.title;
                        this.content = res.data.content;

                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.title) {
                    var error_msg = '请填写标题';
                }


                this.loading = true;
                words_edit({
                    id:this.id,
                    title:this.title,
                    desc:this.content
                }).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.$message({
                            message: res.msg,
                            type: 'success'
                        });
                        this.$router.push({path:'words',query:{}});
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));

            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

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
        width: 200px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 200px;
        height: 100px;
        display: block;
    }
    .ql-editor{
        min-height: 300px;
    }
    .pre_info{
        display:inline-block ;
        width: 120px;
    }
</style>
