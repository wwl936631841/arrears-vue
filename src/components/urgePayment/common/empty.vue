<template>
  <div id="empty" v-if="isEmptyShow">
    <img src="../../../assets/img/audit/empty@2x.png" alt="" width="128" height="119"/>
  </div>
</template>

<script>
  export default {
    name: "empty",
    props: {
      isEmptyShow:{
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped lang="stylus">
  #empty
    margin-top: 30px;
    text-align: center
    height 70vh

</style>
