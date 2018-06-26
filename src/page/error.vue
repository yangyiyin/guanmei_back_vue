<template>
    <div class="fillcontain">
        404
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {cixi_list,entity_cixi_edit,entity_categories} from '@/api/getDataEarth'
    export default {
        data(){
            return {

            }
        },
        components: {
            headTop,
        },
        created(){
            this.entity_categories();
            this.cixi_list();
        },
        mounted(){

        },
        methods: {

        },
    }
</script>

<style lang="less">
    @import '../style/mixin';

</style>
