<template>
	<div class="manage_page fillcontain">

		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="height: 100%; ">
				<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
					<div style="background: rgb(255, 208, 75);height: 5px;"></div>


					<el-submenu index="3">
						<template slot="title"><i class="iconfont el-icon-cc">&#xe655;</i>后台用户管理</template>
						<el-menu-item index="admin_user">用户管理</el-menu-item>
						<el-menu-item index="admin_group">用户组管理</el-menu-item>

					</el-submenu>

					<el-submenu index="5">
						<template slot="title"><i class="el-icon-setting"></i>开发者设置</template>
						<el-menu-item index="admin_purview">权限管理</el-menu-item>
						<el-menu-item index="config">参数配置</el-menu-item>



					</el-submenu>
				</el-menu>
			</el-col>
			<el-col :span="20" style="height: 100%;overflow: auto;">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
    export default {
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			}
		},
    }
</script>


<style lang="less" scoped>
	@import '../style/mixin';
	.iconfont{
		vertical-align: middle;
		margin-right: 5px;
		width: 24px;
		text-align: center;
		font-size: 18px;
	}
</style>
