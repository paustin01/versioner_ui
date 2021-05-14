<script>
  import ReleaseTagDropDown from './ReleaseTagDropDown';
  export default {
    name:'FilterMenu', 

    components:{
      ReleaseTagDropDown
    },

    props:{
          search_affects_table:{ type: Boolean, default: false },
          show_rel_tag:{type: Boolean, default:true},
          rel_tags:{type: Array, default:()=>{return [];}},
          rel_tag_exect_match:{type:Boolean},
    },

  created() {
    this.table_search = this.search_affects_table;
    this.show_rel = this.show_rel_tag;
  },

  data: () => ({
    menu: false,
    table_search:false,
    show_rel: true,
    selected_rel_tag:'',
  }),

  methods:{
    clearFilters(){
      this.$emit('clearversiondata', this.$event);
    },

    onSearchByRelTag(val){
        this.$emit('concatversionarraybyreltag', val)
    }

  }

  }
</script>

<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="250" offset-x>

      <template v-slot:activator="{ on }">
        <v-btn small v-on="on"> Filter Options </v-btn>
      </template>

      <div class="pad-10px white">
        
        <v-switch v-model="show_rel" color="blue" 
        v-on:click="$emit('togglereltag', $event)"
        label="Show Release Tag In Table"></v-switch>
        
      
        <ReleaseTagDropDown :items="rel_tags" label="Filter By Release" @onsearchbyreltag="onSearchByRelTag" />

<div class="mt-3" ></div>
<strong>Product Tag List:</strong>
         <p>
              <v-btn v-on:click="$emit('selectallproducts', $event)">Select All</v-btn> 
              <v-btn v-on:click="$emit('selectnoproducts', $event)">Select None</v-btn> 
              <v-btn v-on:click="clearFilters">Clear Selection</v-btn> 
              <v-btn text @click="menu = false">Close</v-btn>  
         </p>
      </div>
    </v-menu>
  </div>
</template>

