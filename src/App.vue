<template>
  <div id="app">
    <Custom-Cropper></Custom-Cropper>
  </div>
</template>

<script>
  import CustomCropper from './components/CustomCropper';

  export default {
    components: {
      CustomCropper
    }
  };
</script>

<style>
  html {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }
</style>
