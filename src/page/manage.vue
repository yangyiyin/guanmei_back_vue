<template>
	<div class="manage_page fillcontain">
		<el-header style="background: #4190F3;height:8%">
			<p style="line-height:60px;font-size: 24px;color: #fff;float: left">
				冠美帽业管理系统
			</p>
			<head-top-userinfo style="float: right;width: 120px;background: none;text-align: right"></head-top-userinfo>
		</el-header>
		<el-row style="height: 92%;">
	  		<el-col :span="3"  style="height: 100%;background: rgb(84, 92, 100)">
				<el-scrollbar style="height: 100%;">
					<el-menu :default-active="defaultActive" style="min-height: 100%;"   background-color="#545c64"  text-color="#fff" active-text-color="#ffd04b" router>
						<template v-for="(item, index) in menu" v-if="item.children && item.children.length > 1">
							<el-submenu  :index="item.uri" :key="item.id">
								<template slot="title" style="background-color:#fff">{{item.name}}</template>
								<template v-if="item.children">
									<el-menu-item v-for="item in item.children" :index="item.uri" :key="item.id">{{item.name}}</el-menu-item>
								</template>

							</el-submenu>
						</template>
						<template v-else-if="item.children && item.children.length == 1">
							<el-menu-item :index="item.children[0].uri" :key="item.children[0].id">{{item.children[0].name}}</el-menu-item>
						</template>

						<template v-else>
							<el-menu-item >{{item.name}}</el-menu-item>
						</template>

					</el-menu>
				</el-scrollbar>
				<!--<el-row >-->
					<!--<el-col :span="24">-->
						<!--<div class="item-box">业务单</div>-->
					<!--</el-col>-->
					<!--<el-col :span="24">-->
						<!--<div class="item-box">业务单</div>-->
					<!--</el-col>-->
					<!--<el-col :span="24">-->
						<!--<div class="item-box">业务单</div>-->
					<!--</el-col>-->
					<!--<el-col :span="24">-->
						<!--<div class="item-box">业务单</div>-->
					<!--</el-col>-->
					<!--&lt;!&ndash;<el-col :span="12">&ndash;&gt;-->
						<!--&lt;!&ndash;生产单&ndash;&gt;-->
					<!--&lt;!&ndash;</el-col>&ndash;&gt;-->
				<!--</el-row>-->
			</el-col>
			<el-col :span="21" style="height: 100%;overflow: auto;">
				<keep-alive>
					<el-scrollbar style="height: 100%;">
						<router-view></router-view>

					</el-scrollbar>
				</keep-alive>
			</el-col>
		</el-row>
  	</div>
</template>

<script>
	import {get_menu} from '@/api/getDataEarth'
    import headTopUserinfo from '../components/headTopUserinfo'
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
						res.data.forEach(function(ele){
							ele.children.forEach(function(e){
								e.uri = e.uri.replace('menu_', '');
							})
						})
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
        components: {
            headTopUserinfo
        },
    }
</script>


<style lang="less" >
	@import '../style/mixin';
	.iconfont{
		vertical-align: middle;
		margin-right: 5px;
		width: 24px;
		text-align: center;
		font-size: 18px;
	}
	.el-menu-item{
		background-color: #eee!important;
		width: 80%!important;
		margin: 10px auto!important;
		color: #333!important;
		border-radius: 10px!important;
		text-align: center!important;

	}
	.el-submenu{
		width: 80%!important;
		margin: 10px auto!important;
		color: #333!important;
		border-radius: 10px!important;
		text-align: center!important;

	}
	.el-submenu.is-opened{
		background-color: rgba(0,0,0,0)!important;
	}
	.el-submenu.is-active{
		background-color: rgba(0,0,0,0)!important;
	}
	.el-submenu .el-menu-item{
		width: 80%!important;
		min-width: 80%!important;
		padding: 0!important;
		height:40px;
		line-height: 40px;
	}
	.el-submenu .el-submenu__title{
		background-color: #eee!important;
		margin: 10px auto!important;
		color: #333!important;
		border-radius: 10px!important;
		text-align: center!important;

	}
	/*.el-menu-item:hover{*/
		/*background-color: rgb(60, 70, 80)!important;*/
	/*}*/
	.el-menu-item.is-active,.el-submenu.is-active .el-submenu__title{
		background-color: rgb(60, 70, 70)!important;
		color: #fff!important;
	}
	.el-menu{
		border-right:none;
	}
</style>
