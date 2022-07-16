<template>
    <div>
        <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Add3') != -1">主要按钮</el-button>
    </div>
</template>

<script>
export default {
    name: 'Test2'
}
</script>

<style>
</style>