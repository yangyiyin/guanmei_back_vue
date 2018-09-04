<template>
	<div class="manage_page fillcontain">

		<el-row style="height: 100%;">
	  		<el-col :span="4"  style="height: 100%; ">
				<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
					<div style="background: rgb(255, 208, 75);height: 5px;"></div>


					<el-submenu  v-for="(item, index) in menu" :index="item.uri" :key="item.id">
						<template slot="title"><i class="iconfont el-icon-cc" v-html="item.ico"></i>{{item.name}}</template>
						<template v-if="item.children">
							<el-menu-item v-for="item in item.children" :index="item.uri" :key="item.id">{{item.name}}</el-menu-item>
						</template>

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
	import {get_menu} from '@/api/getDataEarth'
    export default {
		data(){
			return {
				menu:[]
			}

		},
		created(){
			this.get_menu();
		},
		methods: {
			get_menu(){
				get_menu().then(function (res) {
					if (res.code == this.$store.state.constant.status_success) {
						this.menu = res.data;
					} else {
						this.$message({
							message: res.msg,
							type: 'warning'
						});
					}

				}.bind(this));
			},
		},
		computed: {
			defaultActive: function(){
				var index = this.$route.path.replace('/', '');
				index = index.replace('add_', '');
				return index;
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
