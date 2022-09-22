<script>
export default {
    name:"VersionGroup",
    props:{
        groups:{type:Array}
    },
    data(){
        return {
            selected_group:'',
        }
    },
    methods:{
        loadGroup(){
            if(this.selected_group === ''){
                return false;
            }
            let grp = this.groups[this.selected_group];
            this.$emit('getgroup', grp);
        }
    }
}

</script>

<template>
    <div class="rel">

        <select v-model="selected_group" v-on:change="loadGroup" name="group_select" id="group_select" class="fancy-input" >
            <option selected="selected" value=''>Select a group</option>
            <option v-for="(grp, idx) in groups" :key="grp.name" :value="idx">{{grp.name}}</option>
        </select>
        <div class="icon-warp">
        <label for="group_select"> 
            <v-icon>mdi-group</v-icon>
        </label>
        </div>
    </div>
</template>
