<template>
  <div class="dashboard-container">
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Card from './card/index.vue'
import Sale from './sale/index.vue'
import Observe from './observe/index.vue'
export default {
  name: "Dashboard",
  components: { Card, Sale, Observe },
  mounted() {
    this.$store.dispatch('getDateList')
  }
}
</script>

<style lang="scss" scoped>
</style>
