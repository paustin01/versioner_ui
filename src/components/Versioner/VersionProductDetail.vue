<template>
    <div style="width:100%; height: 100vh; background-color: black;">
    <v-card class="pad-10px">
        <v-btn icon dark @click="$emit('closemodal')" >
            <v-icon>mdi-close</v-icon>
          </v-btn>   
    <v-card-title>

        Previous Deploys: 
            <span @click="goToRepo(previous_selected_product)" class="previous-highlight cursor-pointer hover-effect">
                
                <span v-if="!items || items.length === 0">
                    Loading...
                </span>
                <span v-else>
                    {{product_name}}
                </span>
            </span>      

    </v-card-title>

    <v-data-table
      class="elevation-2"
      :headers="headers"
      :items="items">
      <template v-for="header in headers.filter(h=>h.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>

    <template v-slot:item.product="{ item }">
        <span class="cursor-pointer hover-effect" @click="goToRepo(item.product)">{{ item.product }}</span>     
    </template>


    <template v-slot:item.product_version="{ item }">
        <span v-if="item.in_spec === 'done' || item.in_spec === 'success'">
        <span class="cursor-pointer hover-effect" 
        @click="goToPipelines(item.product, item.product_version)">{{ item.product_version }}</span> 
    </span>

        <span v-else>
        <span class="stricken cursor-pointer" 
        @click="goToPipelines(item.product, item.product_version)" >{{item.product_version}}</span> 
    </span>

    </template>

    <template v-slot:item.alias="{ item }">
        <span class="cursor-pointer hover-effect" 
        @click="goToRundeck(item.alias)">{{ item.alias }}</span>     
    </template>



    <template v-slot:item.in_spec="{ item }">
        <span v-if="item.in_spec === 'done' || item.in_spec === 'success'">
            {{item.in_spec}} <v-icon small class="green-txt">mdi-thumb-up-outline</v-icon>
        </span> 
        <span v-else>
            {{item.in_spec}} <v-icon small class="red-txt">mdi-thumb-down-outline</v-icon>
        </span>
    </template>

    


    </v-data-table>

    <v-card-actions>
        <v-btn @click="$emit('closemodal')">Close</v-btn>
    </v-card-actions>
    

  </v-card>

</div>

</template>


<style scoped>


    .previous-highlight{
        margin-left: 10px;
        color: #7d8084;
    }

</style>


<script>
export default {
    name:"VersionGroup",
    props:{
        product_name:{type:String, default: ""},
        items: {type:Array, default:()=>{return []}}
    },
    data(){
        return {
            headers:[{text: "Env", value: "environment"},
            {text: "Alias", value: "alias"},
            {text: "Product", value: "product"},
            {text: "Version", value: "product_version"},
            {text: "Release", value: "jira_release"},
            {text: "Deployer", value: "deployer"},
            {text: "Spec", value: "in_spec"},
            {text: 'Deployed On', value: 'created', formatter:this.formatCreateDate }
            ],
        }
    },

    methods:{

        renderClick(str){
            return `<a href="https://google.com" target="_blank">${str}</a>`;
        },

        openWindow(url){
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target="_blank";
            anchor.click();
        },
        goToRundeck(jobstr){
            const url = "https://rundeck.data-dev.clearcollateral.com/execution/show";
            const job = jobstr.replace(/[^0-9]+/g, '');
            this.openWindow(`${url}/${job}`);
        },

        goToRepo(product){
            const url = "https://bitbucket.org/clearcapital"
            this.openWindow(`${url}/${product}`);
        },

        goToPipelines(product, version){
            const url = "https://bitbucket.org/clearcapital"; 
            this.openWindow(`${url}/${product}/pipelines/results/${version}`);            
        },

        formatCreateDate(d){
            
            try{
                const yymmdd = new Date(d).toISOString().slice(0, 10);
                const hhmmss = new Date(d).toLocaleTimeString('en-US');
                return `${yymmdd} : ${hhmmss}`;
            }catch(e){
                return d;
            }
            
        }


    }
}

</script>