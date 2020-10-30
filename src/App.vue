<template>
  <div id="app">
    <v-app>
      <router-view/>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    this.$store.dispatch("initAuth")
  }
}
</script>

<style>
#app{
  background-color:lightgray
}
</style>
