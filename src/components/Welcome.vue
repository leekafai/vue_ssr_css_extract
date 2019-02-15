<template>
  <div class="welcome">
    welcome to
    <span class="test">{{welcome}}</span>
  </div>
</template>

<script>
export default {
  name: "welcome",
  props: {
    name: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      welcome: "xx"
    };
  }
};
</script>

<style lang="scss" scoped>
.test {
  color: red;
}
</style>