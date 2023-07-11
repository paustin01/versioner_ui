<script>
export default {
    name:"VersionBlock",
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
            if (this.envs_length == 0){
                return 0;
            }
            return Math.floor(100 / (this.envs_length + 1) );
        },

        getVis(ver){
            return ver;
        },

        getDeployList(product){
            this.$emit('triggerpreviousversions',product);
        },

        goToRepo(product){
            const url = " https://github.com/plusco-product/"
            const anchor = document.createElement('a');
            anchor.href = `${url}/${product}`;
            anchor.target="_blank";
            anchor.click();
        },

        goToPipelines(product, version){
            const url = "https://github.com/plusco-product/"; 
            const anchor = document.createElement('a');
            anchor.href = `${url}/${product}/pipelines/results/${version}`;
            anchor.target="_blank";
            anchor.click();
        },

        formatCreateDate(d){
            try{
                const yymmdd = new Date(d).toISOString().slice(0, 10);
                const hhmmss = new Date(d).toLocaleTimeString('en-US');
                return `${yymmdd} : ${hhmmss}`;
            }catch(e){
                return d;
            }
        },


        closeModal(){
            this.show_deploy_modal = false;
        }
    },

    computed:{
        sorted_envs(){
          
            if ( !this.envs) {
                return [];
            }

            try{
                let envs = this.envs;
                return envs.sort();
            }catch(e){
                return [];
            }

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
    .gray{color:"#333";
    opacity: 0.5;
    }
</style>

<style scoped>
    .version-text {
        margin-left: 5px;
    }
</style>

<template>
    <v-card class="margin-bottom-5px" style="padding:5px;">
        <table width="100%" id="Version_Table">
        <thead>
            <tr>
               <th :style="`width:${getWidth()}%`"> Product</th>
               <th v-for="(e,idx) in sorted_envs" :key="`env-${idx}`" :style="`width:${getWidth()}%`">{{e}}
            </th>     
        </tr>
        </thead>
        <tbody v-if="selected_versions">

            <tr class="data_product" v-for="(envsprods, index) in selected_versions"  
                :id="`product-${index}`" 
                :data_product="`${index.toUpperCase()}`" 
                :key="index" :class="callback(index)" :style="callback(index, 'style')">
                <td :style="`width:${getWidth()}%`">
                    <v-icon @click="getDeployList(index)" title="Display previous deploys"
                    class="cursor-pointer" small>mdi-format-list-bulleted</v-icon>
                    <span @click="getDeployList(index)"></span> 
                    <span style="color:#1e1e1e">||</span> 
                    <span @click="goToRepo(index)" class="cursor-pointer">{{index}}</span>  
                </td>
                <td v-for="(ev,idx) in envsprods" 
                :key="`versions-${idx}`" 
                :data_vesion="`${ev.product_version} ${ev.jira_release}`"
                class="data_product_version"
                :style="`width:${getWidth()}%  display:${getVis(ev.jira_release)}`"> 
                    
                <v-tooltip top>
                <template v-slot:activator="{ on }">

                    <span v-if="ev.in_spec === 'done' || ev.in_spec === 'success'">
                        
                        <span class="cursor-pointer" @click="goToPipelines(index, ev.product_version)">
                            {{ev.product_version}} 
                        </span>
                        
                        <span v-on="on">
                            <v-icon small class="green-txt">mdi-thumb-up-outline</v-icon>
                        </span>

                    </span>
                    <span v-else>
                        <span v-if="ev.product_version == '--'">
                            {{ev.product_version}}
                        </span>
                        <span v-else>
                            <span v-if="ev.in_spec === 'done' || ev.in_spec === 'success'">
                                
                                <span class="cursor-pointer" @click="goToPipelines(index, ev.product_version)">
                                {{ev.product_version}} 
                                </span>
                                <span v-on="on">
                                    <v-icon small class="green-txt">mdi-thumb-up-outline</v-icon>
                                </span>
                            </span>
                            <span v-else>
                                <span class="stricken cursor-pointer" @click="goToPipelines(index, ev.product_version)" >{{ev.product_version}} </span> 

                                <span v-on="on">
                                    <v-icon small class="red-txt">mdi-thumb-down-outline</v-icon>
                                </span>
                            </span>
                        </span>
                    </span>
                    
                    <small v-if="show_rel_tag" class="gray"> 
                    <em v-if="ev.jira_release == ''" > (--) </em> 
                    <em v-else> ({{ev.jira_release}}) </em>
                    
                    </small>
                   
            </template>
            <v-list small>
                <v-list-item><strong>Version:</strong><span class="version-text">{{ ev.product_version}}</span></v-list-item>
                <v-list-item><strong>Alias:</strong><span class="version-text">{{ev.alias}}</span></v-list-item>
                <v-list-item><strong>Release:</strong><span class="version-text">{{ev.jira_release}}</span></v-list-item>
                <v-list-item><strong>Deployer:</strong><span class="version-text">{{ev.deployer}}</span></v-list-item>
                <v-list-item><strong>Created:</strong><span class="version-text">{{ (ev.created !== '--') ? formatCreateDate(ev.created) : '--'}}</span></v-list-item>
                <v-list-item><strong>Env:</strong><span class="version-text">{{ev.environment}}</span></v-list-item>
                <v-list-item><strong>Spec:</strong><span class="version-text">{{ev.in_spec}}</span></v-list-item>       
            </v-list>
            </v-tooltip>   
                    
            </td>
            </tr>
        </tbody>
    </table>



    </v-card> 


</template>
