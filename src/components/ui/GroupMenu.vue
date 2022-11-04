<template>
  <div class="text-left">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="250" offset-x>

      <template v-slot:activator="{ on }">
        <v-btn small v-on="on"> Group Options </v-btn>
      </template>

      <div class="pad-10px black">

                    <v-btn
                    v-on:click="$emit('showmodal', $event)" >Create Group</v-btn>  

                    <v-btn v-if="grplen > 0"
                    v-on:click="$emit('grpmodal', $event)" >Manage Groups</v-btn> 

                    <!-- <v-btn v-if="grplen > 0 && grpname != ''"
                    v-on:click="$emit('updategroup', $event)" >Update {{grpname}}</v-btn>  -->

              <br />

              <v-btn text @click="menu = false">Close</v-btn>

      </div>

    </v-menu>
  </div>
</template>

<script>
  export default {
    name:'FilterMenu', 

    props:{
          grpname:{type:String, default: ''},
          grplen:{ type: Number, default: 0},
    },

  created() {

  },

    data: () => ({
      menu: false,
    }),


  

  }
</script>