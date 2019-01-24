<template>
    <div class="header_container">

		<el-dropdown @command="handleCommand" menu-align='start'>
			<!--<img :src="avatar" class="avator">-->
			<p style="height: 50px;line-height:50px;text-align: center;margin-right: 20px;cursor: pointer;color: #fff">{{user_info.show_name}}<i class="iconfont" style="font-size: 8px;margin-left: 5px;">&#xe60c;</i></p>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="show_edit_password">修改密码</el-dropdown-item>
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
			<el-form >
				<el-form-item label="密码">
					<el-input v-model="password" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="edit_password">确 定</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
	import {signout} from '@/api/getData'
	import {admin_user_edit} from '@/api/getDataEarth'
	import {baseImgPath} from '@/config/env'
	import {mapActions, mapState} from 'vuex'
	import {removeStore,getStore} from '@/config/mUtils'
	import avatar from '@/assets/img/avatar.png';
    export default {
    	data(){
    		return {
    			baseImgPath,
				avatar,
				user_info:'',
				dialogFormVisible:false,
				password:''
    		}
    	},
    	created(){
    		if (!this.adminInfo.id) {
    			//this.getAdminData()
    		}
			this.user_info = JSON.parse(getStore('user_info'));


    	},
    	computed: {
    		...mapState(['adminInfo']),
    	},
		methods: {
			...mapActions(['getAdminData']),
			async handleCommand(command) {
				if (command == 'home') {
					this.$router.push('/manage');
				}else if(command == 'singout'){
					removeStore('token');
					this.$message({
						type: 'success',
						message: '退出成功'
					});
					this.$router.push('/');
				} else if(command == 'show_edit_password'){
					this.dialogFormVisible = true;
					this.password = '';
				}
			},
			edit_password() {
				admin_user_edit({id:this.user_info.id,password:this.password}).then(function (res) {
					if (res.code == this.$store.state.constant.status_success) {
						this.$message({
							message: res.msg,
							type: 'success'
						});
						this.dialogFormVisible = false;
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

<style lang="less" scoped>
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}
	.el-dropdown-menu__item{
        text-align: center;
    }
</style>
