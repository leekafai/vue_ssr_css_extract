<template>
  <div class="home">
    {{xx}}12312312313
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      xx: "xcxc"
    };
  },
  mounted() {
    console.log("xxxxmounted");
  }
};
</script>
