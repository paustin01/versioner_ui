<script>
  export default {
      name:'Nav',
      data(){
        return {
          links:[
              {path:'', name:'table-view', label:"Table"},
              {path:'', name:'grid-view', label:"Filter"},
          ]
        }
      }
  }
</script>

<template>
    <nav>
      <ul>
          
          <li v-for="(link, idx) in links" v-bind:key="link.name">
            <router-link tag="a" :id="`link-${idx}`" active-class="active" exact :to="link.path">{{link.label}}</router-link>
          </li>
        </ul>
    </nav>
</template>