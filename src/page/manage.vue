<template>
	<div class="manage_page fillcontain">

		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="height: 100%; ">
				<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<el-submenu index="2">
					<template slot="title"><i class="el-icon-phone"></i>电话销售</template>
					<el-menu-item index="phone_contact">慈溪电联记录</el-menu-item>
					</el-submenu>

					<el-submenu index="3">
						<template slot="title"><i class="el-icon-goods"></i>店长的推荐</template>

						<el-menu-item index="managerrecommend_template_list">模板列表</el-menu-item>
						<el-menu-item index="managerrecommend_template">制作模板</el-menu-item>
						<el-menu-item index="managerrecommend_user">用户管理</el-menu-item>
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
	.manage_page{
		
	}
</style>
