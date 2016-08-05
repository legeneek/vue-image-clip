# vue-image-clip

Image clip component based on vue

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

## Useage

Just add CustomCropper.vue and SelectBox.vue to your project, then use it like this:

```
<template>
  <div id="app">
    <Custom-Cropper></Custom-Cropper>
  </div>
</template>

<script>
  import CustomCropper from './YourPath/CustomCropper';

  export default {
    components: {
      CustomCropper
    }
  };
</script>

```

modify the ui as you wish