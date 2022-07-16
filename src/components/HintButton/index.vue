<template>
    <a :title="title" style="margin:10px">
        <!-- $atts父组件给子组件穿的属性，绑定事件 -->
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
</template>

<script>
export default {
    name: 'HintButton',
    props: ['title'],
    // mounted() {
    //     console.log(this)
    // }
}
</script>

<style>
</style>