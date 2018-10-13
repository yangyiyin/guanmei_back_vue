<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container" style="padding:20px">

            <div class="search_item">
                <el-input clearable placeholder="请输入名称" v-model="name" style="width: 350px">
                    <template slot="prepend">颜色名称(带编号)</template>
                </el-input>
            </div>

            <!--<div class="search_item">-->
                <!--<el-input clearable placeholder="请输入颜色编号" v-model="code" style="width: 350px">-->
                    <!--<template slot="prepend">编号</template>-->
                <!--</el-input>-->
            <!--</div>-->
            <div class="search_item">
                <span class="pre_info" style="font-size: 14px;color: #666">选择颜色外观</span>
                <el-color-picker style="vertical-align: middle" v-model="value"></el-color-picker>
            </div>



            <el-button type="success" style="margin-top: 20px;" v-on:click="submit" :loading="loading">提交</el-button>


        </div>

    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {color_edit,color_info} from '@/api/getDatacolor'
    export default {
        data(){
            return {
                id:0,
                loading:false,
                name:'',
                code:'',
                value:'#409EFF'
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
                this.code = '';
                this.value = '#409EFF';
            },
            get_info() {
                color_info({id:this.id}).then(function (res) {
                    if (res.code == this.$store.state.constant.status_success) {
                        this.name = res.data.name;
                        this.code = res.data.code;
                        this.value = res.data.value;
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

//                if (!this.code) {
//                    var error_msg = '请填写编号';
//                }
                if (!this.value) {
                    var error_msg = '请选择颜色外观';
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
                    color_edit({id:this.id,name:this.name,value:this.value,type:2}).then(function (res) {
                        if (res.code == this.$store.state.constant.status_success) {
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({path:'color_material',query:{}});
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

<style scoped lang="less">
    @import '../style/mixin';
    .search_item{

        margin-top: 10px;

    }

</style>
