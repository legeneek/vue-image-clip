# vue-image-clip

Image clip component based on vue2. Try the [demo](https://legeneek.github.io/vue-image-clip/index.html)

## Demo Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

```

## Usage

Just add `CustomCropper.vue` and `SelectBox.vue` in `src/components` to your project.

CustomCropper.vue require SelectBox.vue, you need to put them in the same directory

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

## License
MIT
