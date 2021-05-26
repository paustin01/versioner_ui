<script>
export default {
  name: 'Header',
  props: {},
  data(){
      return {
      }
  }
}
</script>
<template>
    <header> 
        <div class="row">
        <div class="col" style="">
            <img class="logo" src="@/assets/clear-capital-logo.png" style="width:100%; min-width:100px; max-width:170px; margin-right:5px;" alt="Data Team">
        </div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col" style="padding-left:60%; text-align:center;" title="Data Team Tools">
              <v-icon>mdi-pirate</v-icon> <strong class="version-logo">Pipeline Tools</strong> 
        </div>
    </div>
    </header>
</template>
