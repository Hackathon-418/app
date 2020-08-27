<template>
  <div>
    <img :src="avator_url" class="avator_image" />
  </div>
</template>

<script>
export default {
  name: "Avator",
  props: ["user"],
  computed: {
    avator_url() {
      return "https://i.pravatar.cc/50?u=" + this.user;
    }
  }
};
</script>