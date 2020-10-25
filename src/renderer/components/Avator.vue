<template>
  <div>
    <img :src="avator_url" class="avator_image" />
  </div>
</template>

<script>
    const storageRef = firebase.storage().ref();

    export default {
        name: "Avator",
        props: ["user"],
        data(){
            return{
                imagesRef: storageRef.child('images'),
            }
        },
        computed: {
            avator_url() {
                // console.log(this.user);
                return this.imagesRef.child(this.user);
            }
        }
    };
</script>