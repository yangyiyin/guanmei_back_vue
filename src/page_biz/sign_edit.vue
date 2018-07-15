<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <el-input clearable placeholder="请输入标题" v-model="title" style="width: 250px">
                    <template slot="prepend">标题</template>
                </el-input>
            </div>

            <p class="search_item" style="font-size: 12px">上传图片:</p>
            <el-upload

                    class="avatar-uploader"
                    :action="upload_url"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="img" :src="img" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>


            <div class="search_item">
                <quill-editor :content="content" :options = "editorOption" @change="onEditorChange($event)"></quill-editor>

            </div>

            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {sign_edit,sign_info_default} from '@/api/getDataEarth'
    import { quillEditor } from 'vue-quill-editor'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                title:'',
                img:'',
                content:'',
                editorOption:{},
                upload_url:this.$store.state.constant.upload_url
            }

        },
        components: {
            headTop,
            quillEditor
        },
        created(){

        },
        mounted(){

            //console.log(this.$route.query);
        },

        beforeRouteEnter (to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
                vm.id = to.query.id ? to.query.id : 0;

                vm.get_info();

            })
        },
        methods: {

            handleAvatarSuccess(res, file) {
                this.img = res.data[0];
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 1;

                if (!isJPG) {
                    this.$message.error('图片格式只支持jpg和png!');
                }
                if (!isLt2M) {
                    this.$message.error('图片大小不能超过 1MB!');
                }
                return isJPG && isLt2M;
            },
            onEditorChange({ editor, html, text }) {//富文本编辑器  文本改变时 设置字段值
                this.content = html
            },
            init() {
                this.loading = false;
                this.title = '';
                this.img = '';
                this.content='';
            },
            get_info() {
                sign_info_default({}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.id = res.data.id;
                        this.title = res.data.title;
                        this.content = res.data.content;
                        this.img = res.data.img;
                    } else {
//                        this.$message({
//                            message: res.msg,
//                            type: 'warning'
//                        });
                    }

                }.bind(this));
            },
            submit: function () {

                if (!this.title) {
                    var error_msg = '请填写标题';
                }
                if (!this.img) {
                    var error_msg = '请上传图片';
                }
                if (!this.content) {
                    var error_msg = '请填写内容';
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
                    sign_edit({id:this.id,title:this.title,img:this.img,content:this.content}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            //this.$router.push({path:'news',query:{}});
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
</style>
