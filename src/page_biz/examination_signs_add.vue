<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">考试:</span>
                <span style="font-size: 14px;width: 500px">{{examination.title}}</span>
            </div>
            <div class="search_item" v-if="examination.form_type == 2">
                <span class="pre_info" style="font-size: 14px;vertical-align: top">是否新生:</span>
                <el-checkbox v-model="data.is_new">是新生</el-checkbox>

            </div>
            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">学生姓名:</span>
                <el-input clearable placeholder="请输入学生姓名" v-model="data.content.name" style="width: 250px"></el-input><span style="color: red">*</span>
            </div>
            <template v-if="data.is_new">
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">所属学校:</span>
                    <el-input clearable placeholder="请输入所属学校" v-model="data.content.school" style="width: 250px"></el-input><span style="color: red">*</span>
                </div>
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">曾经就读学校:</span>
                    <el-input clearable placeholder="请输入曾经就读学校" v-model="data.content.school_before" style="width: 250px"></el-input>
                </div>
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">曾经获得奖项:</span>
                    <el-input clearable placeholder="请输入曾经获得奖项" v-model="data.content.prise_before" style="width: 250px"></el-input>
                </div>

                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">下学期年级:</span>
                    <el-select v-model="data.content.grade" placeholder="类型">
                        <el-option
                                v-for="item in grades"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select></el-input><span style="color: red">*</span>
                </div>

                <div class="search_item" v-if="examination.form_type == 1">
                    <span class="pre_info" style="font-size: 14px;">需要培训课程:</span>
                    <el-select v-model="data.content.lession" placeholder="类型">
                        <el-option
                                v-for="item in lessions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select></el-input><span style="color: red">*</span>
                </div>
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">培训地点:</span>
                    <el-select v-model="data.content.address" placeholder="类型">
                        <el-option
                                v-for="item in addresses"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select></el-input><span style="color: red">*</span>
                </div>
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">父亲电话:</span>
                    <el-input clearable placeholder="请输入父亲电话" v-model="data.content.father_tel" style="width: 250px"></el-input></el-input><span style="color: red">*</span>
                </div>
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">母亲电话:</span>
                    <el-input clearable placeholder="请输入父亲电话" v-model="data.content.mother_tel" style="width: 250px"></el-input></el-input><span style="color: red">*</span>
                </div>
            </template>
            <template v-if="!data.is_new">
                <div class="search_item">
                    <span class="pre_info" style="font-size: 14px;">父亲手机号(麦田报名手机号):</span>
                    <el-input clearable placeholder="请输入麦田报名手机号" v-model="data.content.father_tel" style="width: 250px"></el-input></el-input><span style="color: red">*</span>
                </div>
            </template>
            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">电子邮箱:</span>
                <el-input clearable placeholder="请输入电子邮箱" v-model="data.email" style="width: 250px"></el-input>
            </div>


            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">上传学员照片:</span>
                <el-upload

                        class="avatar-uploader"
                        :action="upload_url"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                    <img v-if="data.content.avatar" :src="data.content.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload></el-input><span style="color: red">*</span>
            </div>





            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examination_signs_edit,examination_sign_options,examination_info,check_bind_student} from '@/api/getDataEarth'

    export default {
        data(){
            return {
                id:'',
                examination:{},
                loading:false,
                img:'',
                upload_url:this.$store.state.constant.upload_url,
                grades:[],
                lessions:[],
                addresses:[],

                //表单字段
                data:{
                    from:0,
                    is_new:true,
                    out_id:'',
                    student_name:'',
                    email:'',
                    content:{
                        name:'',
                        school:'',
                        school_before:'',
                        prise_before:'',
                        grade:'',
                        lession:'',
                        address:'',
                        father_tel:'',
                        mother_tel:'',
                        avatar:''
                    }
                }
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
                vm.id = to.query.id ? to.query.id : {};
                vm.get_info().then(function (res) {

                    if (res.code == vm.$store.state.constant.status_success) {
                        vm.examination = res.data;
                        vm.data.out_id = vm.examination.id;
                        if (vm.examination.form_type == 1) {
                            vm.data.is_new = true;
                        } else if (vm.examination.form_type == 3) {
                            vm.data.is_new = false;
                        }
                        vm.get_examination_sign_options();

                    } else {
                        vm.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                });
            })
        },
        methods: {
            get_info(){
                return examination_info({
                    id:this.id
                })
            },
            get_examination_sign_options(){
                examination_sign_options({
                    type:this.examination.form_type
                }).then(function (res) {

                    if (res.code == this.$store.state.constant.status_success) {
                        this.grades = res.data.options_grade;
                        this.lessions = res.data.options_lession;
                        this.addresses = res.data.options_address;
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }
                }.bind(this));
            },
            submit: function () {

                if (!this.data.content.name) {
                    var error_msg = '请填写姓名';
                }
                if (this.data.is_new) {
                    if (!this.data.content.school) {
                        var error_msg = '请填写所属学校';
                    }
                    if ((this.examination.form_type == 1 || this.examination.form_type == 2) && !this.data.content.grade) {
                        var error_msg = '请选择下学期年级';
                    }
                    if ((this.examination.form_type == 1) &&!this.data.content.lession) {
                        var error_msg = '请选择培训课程';
                    }
                    if ((this.examination.form_type == 1 || this.examination.form_type == 2) &&!this.data.content.address) {
                        var error_msg = '请选择培训地点';
                    }
                    if (!this.data.content.mother_tel) {
                        var error_msg = '请填写母亲电话';
                    }

                }

                if (!this.data.content.father_tel) {
                    var error_msg = '请填写父亲电话';
                }

                if (!this.data.content.avatar) {
                    var error_msg = '请上传头像';
                }
                if (error_msg) {
                    this.$message({
                        type: 'warning',
                        message: error_msg
                    });
                    return;
                }
                this.data.student_name = this.data.content.name;
                this.data.user_tel = this.data.content.father_tel;

                this.$confirm('确认无误, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function(){
                    this.loading = true;
                    if (!this.data.is_new) {
                        var result = check_bind_student({
                            name:this.data.content.name,
                            user_tel:this.data.content.father_tel,
                        }).then(function(res){
                            if (res.code == this.$store.state.constant.status_success) {
                                return examination_signs_edit(this.data);
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
//                                return false;
                            }
                        }.bind(this)).then(function (res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$router.push({path:'examination',query:{}});
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }

                        }.bind(this));
                    } else {
                        var result = examination_signs_edit(this.data).then(function (res) {
                            if (res.code == this.$store.state.constant.status_success) {
                                this.$message({
                                    message: res.msg,
                                    type: 'success'
                                });
                                this.$router.push({path:'examination',query:{}});
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }

                        }.bind(this));
                    }


                }.bind(this)).catch(() => {

                }).finally(function(){
                    this.loading = false;
                }.bind(this));

            },
            handleAvatarSuccess(res, file) {
                this.data.content.avatar = res.data[0];
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

<style lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }
    .avatar-uploader{
        width: 100rpx;
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
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
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
