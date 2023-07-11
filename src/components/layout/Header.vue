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
        <div class="col" >
            <div style="padding:10px; margin-left: 20px;">
               <strong>Versioner</strong> 
            </div>
            <!-- <img class="logo" src="@/assets/company-logo.png" style="width:100%; min-width:100px; max-width:170px; margin-right:5px;" alt="DevOps"> -->
        </div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col" style="padding-left:60%; text-align:center;" title="Engineering">
              <v-icon>mdi-pirate</v-icon> <strong class="version-logo">Engineering</strong>
        </div>
    </div>
    </header>
</template>
