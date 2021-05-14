<script>
    export default {
        name: 'app',
        props:{
            title:{type:String},
            sub_header:{type:String, default:''}

        },
        created() {
            document.title = this.title;
        }
    }
</script>
<template>
  <h2 v-if="sub_header != ''">{{sub_header}}</h2>
</template>
