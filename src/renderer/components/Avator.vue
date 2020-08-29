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
      const icons = {
        'rishun@418.com': '4UnnY8TZEvZNHj2Wu1PkqCWpeKz2',
        "ree0432@gmail.com" : '63bl93zP0VP2TwKaqnYizox6vzx2',
        'rishun@test.com' : 'K0uBlsViQhhUi0FOnUQB8YfdX8v2',
        'tatsuya@418.com' : 'uv4temUr8OPGCvE4yUQlN9N1tDf1'
      };
      return "https://reerishun.com/418/" + icons[this.user] + '.jpg';
    }
  }
};
</script>