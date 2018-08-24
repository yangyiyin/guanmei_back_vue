<template>
    <div id="app" class="fillcontain">
        <el-progress v-if="percentage" :percentage="percentage" style="position: absolute;top: 0px;left: 0px;z-index: 999;width: 100%" :show-text="false"></el-progress>
		    <router-view></router-view>
    </div>
</template>

<script>
    export default {
        computed: {
            percentage () {
                return this.$store.state.percentage
            }
        }
    }
</script>

<style lang="less">
	@import './style/common';
</style>
