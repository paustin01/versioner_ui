<script>
  export default {
    name:'ReleaseTagDropDown', 

    props:{
          items:{type: Array, default:()=>{return [];}},
          label:{type: String, default:"Select From List"}
    },

  created() {
    this.release_tags = this.items;
  },

  data(){
      return {
          release_tags:[],
          selected_value:'',
          search_term:'',
      };
  },

  methods:{
      setValue(evt){
          let item = evt.target.getAttribute('name');
          this.selected_value = item;
          this.$emit('onsearchbyreltag', this.selected_value);
      },

      setClass(item){
        return this.selected_value == item ? 'rel_link rel_active' : 'rel_link';
      },
      
      searchItems(){
          
          if(this.search_term.trim() == ''){
            this.release_tags = [];
            this.release_tags = this.items;
            return true;
          }

         let keywrd = this.search_term.trim().toUpperCase(); 
         let tags = [];
         tags = this.release_tags.filter( d => {
            if(d && d != '' && d.trim().toUpperCase().indexOf(keywrd) != -1){
                return true;
            }
            return false;
        });

          this.release_tags = [];
          this.release_tags = [...tags];

      }

  }

  }
</script>

<style scoped>
    .rel_box{
        max-height: 200px;
        overflow-y: auto;
    }
    .rel_active{
        color:orange;
    }
    .rel_item{
        
    }

    .rel_link{
      cursor: pointer;
    }
</style>

<template>
  <div class="">
    <strong>{{label}}:</strong>
    <input type="text" value="" style="width:100%;" placeholder="Search Release Tags" 
    class="input v-card" v-on:keyup="searchItems" v-model="search_term" >
  <div class="rel_box" >
        
        <div v-for="(item, key) in release_tags" :key="key" class="rel_item">
           <em v-on:click="setValue" :name="item" :class="setClass(item)"  > {{ item }} </em>
        </div>
  </div>
  

  </div>


</template>