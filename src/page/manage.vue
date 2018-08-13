<template>
	<div class="manage_page fillcontain">

		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="height: 100%; ">
				<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
					<el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
					<!--<el-submenu index="2">-->
					<!--<template slot="title"><i class="el-icon-news"></i>新闻管理</template>-->
					<!--<el-menu-item index="news">新闻管理</el-menu-item>-->
					<!--</el-submenu>-->

					<el-submenu index="3">
						<template slot="title"><i class="el-icon-goods"></i>学校管理</template>
						<el-menu-item index="news">新闻管理</el-menu-item>
						<!--<el-menu-item index="sign">课程报名管理</el-menu-item>-->
						<el-menu-item index="examination">考试管理</el-menu-item>
						<el-menu-item index="users">微信小程序用户管理</el-menu-item>
						<el-menu-item index="suggest">家长反馈</el-menu-item>
					</el-submenu>

					<!--<el-submenu index="4">-->
						<!--<template slot="title"><i class="el-icon-view"></i>用户管理</template>-->

						<!--<el-menu-item index="users">微信小程序用户管理</el-menu-item>-->
					<!--</el-submenu>-->

					<el-submenu index="5">
						<template slot="title"><i class="el-icon-setting"></i>系统设置</template>

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
	.manage_page{
		
	}
</style>
