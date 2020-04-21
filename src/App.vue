<template>
  <div id="app">
    <Board/>
  </div>
</template>

<script>
  import Board from './components/Board.vue'

  export default {
    name: 'App',
    components: {
      Board
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1 {
    text-align: center;
  }
</style>
