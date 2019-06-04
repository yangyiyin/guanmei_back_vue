<template>
    <div style="height: 500px;overflow-y: auto">
        <el-scrollbar style="height: 100%;">

            <p style="font-size: 16px;font-weight: bolder">2019.6.4重要更新内容:</p>
            <p style="line-height: 22px;">1.增加了用户vip,在用户管理中可通过设置点击按钮设置vip</p>
            <p style="line-height: 22px;">2.新增业务单的时候,可选择vip客户或普通客户</p>
            <p style="line-height: 22px;">3.vip用户可登陆系统后台,根据权限只能查看生产单进度和统计页面</p>
            <p style="line-height: 22px;">4.业务单列表页增加备注按钮,可保存自定义备注内容</p>
            <p style="line-height: 22px;">5.修复其他已知bug</p>
            <p style="height: 20px;"></p>
        </el-scrollbar>

    </div>
</template>
<script>
    export default {
        name: 'help',
        data () {
            return { editor: null
            }
        },
    }
</script>
