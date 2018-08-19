<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">报名类型:</span>
                <el-select v-model="type" placeholder="类型">
                    <el-option
                            v-for="item in blocks"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">考试类型:</span>
                <el-select v-model="form_type" placeholder="类型">
                    <el-option
                            v-for="item in blocks_form_type"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">支付金额(元):</span>
                <el-input clearable placeholder="请输入金额" v-model="pay_sum" style="width: 250px"></el-input>
                <span style="font-size: 12px;color: red">不填则表示无需支付</span>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;">考试标题:</span>
                <el-input clearable placeholder="请输入标题" v-model="title" style="width: 250px">
                </el-input>
            </div>

            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;">考试时间:</span>
                <el-date-picker
                        v-model="examination_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>


            <div class="block search_item">
                <span class="pre_info" style="font-size: 14px;">报名截止:</span>
                <el-date-picker
                        v-model="sign_end_time"
                        type="datetime"
                        value-format="timestamp"
                        placeholder="选择日期时间">
                </el-date-picker>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;vertical-align: top">考试内容:</span>
                <el-input style="width: 300px" placeholder="内容..." v-model="content" type="textarea" :rows="2" >

                </el-input>
            </div>

            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;vertical-align: top">考试可见范围:</span>
                <el-checkbox v-model="all_visible">全部可见</el-checkbox>

            </div>

            <div style="border: 1px dashed #999;padding: 10px;" class="search_item" v-if="!all_visible">
                <span  style="font-size: 14px;vertical-align: top;color: red;margin-left: 20px;padding: 10px">可见范围:请选择课程,报名对应课程的学员将看到此考试信息:</span>
                <div >
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox style="margin-left: 30px;" v-for="item in courselist" :label="item.courseid">{{item.coursename}}</el-checkbox>
                    </el-checkbox-group>
                </div>

            </div>
            <div class="search_item" v-if="!all_visible">
                对应课程结束
                <el-input clearable placeholder="" v-model="visible_time_limit" style="width: 100px">
                </el-input>天后学生依然可见
            </div>
            <!--<p class="search_item" style="font-size: 12px">上传图片:</p>-->
            <!--<el-upload-->

                    <!--class="avatar-uploader"-->
                    <!--:action="upload_url"-->
                    <!--:show-file-list="false"-->
                    <!--:on-success="handleAvatarSuccess"-->
                    <!--:before-upload="beforeAvatarUpload">-->
                <!--<img v-if="img" :src="img" class="avatar">-->
                <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->



            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">发布</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {examination_edit,examination_info,get_course_list} from '@/api/getDataEarth'
    import { quillEditor } from 'vue-quill-editor'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                title:'',
                img:'',
                pay_sum:'',
                content:'',
                examination_time:'',
                sign_end_time:'',
                checkList:[],
                all_visible:true,
                visible_time_limit:360,
                editorOption:{},
                upload_url:this.$store.state.constant.upload_url,
                blocks:[
                    {id:1,name:'只限内部报名'},
                    {id:2,name:'内外都可报名'},
                ],
                blocks_form_type:[
                    {id:1,name:'新生入学'},
                    {id:2,name:'综合实验班'},
                    {id:3,name:'晋级考'},
                ],
                courselist:[],
                type:1,
                form_type:1,

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
            this.get_course_list();
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
                this.type = 1;
                this.form_type = 1;
                this.pay_sum = 0;
                this.title = '';
                this.img = '';
                this.content='';
                this.examination_time='';
                this.sign_end_time='';
                this.checkList=[];
                this.all_visible=true;
                this.visible_time_limit=360;
            },
            get_course_list() {
                get_course_list({}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.courselist = res.data
                    } else {
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }.bind(this));
            },
            get_info() {
                examination_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.type = parseInt(res.data.type);
                        this.form_type = parseInt(res.data.form_type);
                        this.pay_sum = res.data.pay_sum;
                        this.title = res.data.title;
                        this.content = res.data.content;
                        this.img = res.data.img;
                        this.examination_time=res.data.examination_time;
                        this.sign_end_time=res.data.sign_end_time;
                        this.checkList=res.data.checkList ? res.data.checkList : [];
                        this.all_visible=res.data.all_visible;
                        this.visible_time_limit=res.data.visible_time_limit;

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
//                if (!this.img) {
//                    var error_msg = '请上传图片';
//                }
//                if (!this.examination_time) {
//                    var error_msg = '请选择考试时间';
//                }
                if (!this.sign_end_time) {
                    var error_msg = '请选择报名截止时间';
                }
                if (!this.content) {
                    var error_msg = '请填写内容描述';
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
                    examination_edit({
                        id:this.id,title:this.title,type:this.type,form_type:this.form_type,
                        pay_sum:this.pay_sum,img:this.img,content:this.content,sign_end_time:this.sign_end_time,
                        examination_time:this.examination_time,
                        checkList:this.checkList,
                        all_visible:this.all_visible,
                        visible_time_limit:this.visible_time_limit
                    }).then(function (res) {
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

    .ql-editor{
        min-height: 300px;
    }
    .pre_info{
        display:inline-block ;
        width: 120px;
    }
</style>
