<template>
  <div id="app">
    <Image-Cropper></Image-Cropper>
  </div>
</template>

<script>
  import ImageCropper from './components/ImageCropper';

  export default {
    components: {
      ImageCropper
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
