<script>
export default {
    name:"VersionBlock",
    components:{
    },
    props:{
            envs:{type:Array, default:()=>{return []}},
            envs_length:{type:Number, default:0},
            index:{ type:Number, default:0 },
            callback:{ type:Function, default:(evt)=>{return evt;}},
            selected_versions:{ type: Object, default:()=>{return {}; }},
            show_rel_tag:{ type:Boolean, default:false },
            version_keyword:{ type:String, default:'' }
        },
    data(){
        return {   
        }
    },      

  methods:{
        getWidth(){
            return Math.floor(100 / (this.envs_length + 1) );
        },

        getVis(ver){
            return ver;
        },

        getDeployList(product){
            this.$emit('triggerpreviousversions',product);
        },

        closeModal(){
            this.show_deploy_modal = false;
        }
    },

    computed:{
        sorted_envs(){
            let envs = this.envs;
            return envs.sort();
        }
    },

    created(){
    }
    
}

</script>

<style scoped>
    table{ font-size:90%}
    table th { text-align: left;}
    table td { padding:2px;}
    .gray{
        color:rgb(142, 142, 142);
    }
</style>

<template>
    <v-card class="margin-bottom-5px" style="padding:5px;">
    <table width="100%" id="Version_Table">
        <thead>
            <tr>
               <th :style="`width:${getWidth()}%`"> Product</th>
               <th v-for="(e,idx) in sorted_envs" :key="`env-${idx}`" :style="`width:${getWidth()}%`">{{e}}</th>     
            <tr/>
        </thead>
        <tbody>

            <tr class="data_product" v-for="(envsprods, index) in selected_versions"  
                :id="`product-${index}`" 
                :data_product="`${index.toUpperCase()}`" 
                :key="index" :class="callback(index)" :style="callback(index, 'style')">
                <td :style="`width:${getWidth()}%`">
                    <v-icon @click="getDeployList(index)" title="Display previous deploys"
                    style="cursor:pointer;" small>mdi-format-list-bulleted</v-icon>
                    <span @click="getDeployList(index)">{{index}}</span> 
                </td>
                <td v-for="(ev,idx) in envsprods" 
                :key="`versions-${idx}`" 
                :data_vesion="`${ev.product_version} ${ev.jira_release}`"
                class="data_product_version"
                :style="`width:${getWidth()}%  display:${getVis(ev.jira_release)}`"> 
                    
                <v-tooltip top>
                <template v-slot:activator="{ on }">

                    <span v-on="on">
                    
                    <span v-if="ev.in_spec === 'done' || ev.in_spec === 'success'">
                        {{ev.product_version}} 
                        <v-icon small class="green-txt">mdi-thumb-up-outline</v-icon>                       
                    </span>
                    <span v-else>
                        <span v-if="ev.product_version == '--'">
                            {{ev.product_version}}
                        </span>
                        <span v-else>
                            <strike>{{ev.product_version}}</strike> <v-icon small class="red-txt">mdi-thumb-down-outline</v-icon>     
                        </span>
                    </span>
                    
                    <small v-if="show_rel_tag" 
                    class="gray"> 
                    
                    <em v-if="ev.jira_release == ''" > (--) </em> 
                    <em v-else> ({{ev.jira_release}}) </em>
                    
                    </small>
                    </span>
            </template>
            <v-list small>
                <v-list-item>Version: {{ev.product_version}}</v-list-item>
                <v-list-item>Alias: {{ev.alias}}</v-list-item>
                <v-list-item>Release: {{ev.jira_release}}</v-list-item>
                <v-list-item>Deployer: {{ev.deployer}}  </v-list-item>
                <v-list-item>Created: {{ (ev.created !== '--') ? new Date(ev.created).toLocaleDateString('en-US') : '--'}} </v-list-item>
                <v-list-item>Env: {{ev.environment}}</v-list-item>
                <v-list-item>Spec: {{ev.in_spec}}</v-list-item>         
            </v-list>
            </v-tooltip>   
                    
            </td>
            </tr>
        </tbody>
    </table>



    </v-card> 


</template>
