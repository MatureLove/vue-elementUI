<template>
    <div>
        <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Add1') != -1">主要按钮</el-button>
        <el-button type="success" v-show="$store.state.user.buttons.indexOf('btn.Add2') != -1">成功按钮</el-button>
    </div>
</template>

<script>
export default {
    name: 'Test1'
}
</script>

<style>
</style>