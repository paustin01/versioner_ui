<script>
import Api from '../../utils/api.js';
import {locals} from '../../utils/locals.js';
import Loader from '../icons/Loading.vue';
import VersionTable from './VersionTable.vue';
import VersionFilter from './VersionFilter.vue';
import Modal from '../ui/Modal.vue';
import ArrayHelpers from '../../utils/array_helpers.js';

export default{

    name:'VersionIndex',

    components:{
        Modal,
        Loader,
        VersionTable,
        VersionFilter,       
    },

    data(){
        return {

            previous_deploy_modal:false,
            previous_selected_product:"",
            previous_versions:[],

            latest_versions: {result: []},
            distinct_products:[],
            distinct_envs:[],
            active_tab: null,
            tab_labels:['Version Table', 'Version Filter',],
            error_msg:'',
        }
    },

    created(){
        this.latest_versions_load();
        this.moveTab(this.getTab());
    },

    methods:{
        latest_versions_load(){

            Api.latest_versions().then(res => {
                if (res.ok){return res.json();}
            }).then(data => {

                this.latest_versions = data;
                this.distinct_envs = [...new Set(this.latest_versions.result.map(v=>v.ENVIRONMENT))];
                this.distinct_products = [...new Set(this.latest_versions.result.map(v=>v.PRODUCT))].sort();

            }).catch(e => {
                this.error_msg = "Shitters Full.." + e;
            });

            return true;
        },


        previous_versions_for_product(product){

            this.previous_deploy_modal = true;
            this.previous_selected_product = false;

            Api.previous_versions_for_product(product, 20).then(res => {
                if (res.ok){return res.json();}
            }).then(data => {
                
                let d = data.result.sort(ArrayHelpers.dynamicSort('ENVIRONMENT'))
                this.previous_versions = {}; 
                d.map((v)=>{

                    let obj = this.previous_versions
                    let key = v.ENVIRONMENT
                    let idx = Object.prototype.hasOwnProperty.call(obj, key);
                    if(!idx){ this.previous_versions[key] = [] }
                    this.previous_versions[key].push(v)
                })

                this.previous_selected_product = product;
                            

            }).catch(e => {
                this.error_msg = "Shitters Full.." + e;
            });

            return true;

        },


        refreshTable(){
            this.latest_versions = {result: []};
            this.latest_versions_load();
        },

        getTab(){
            let tabstr = locals.store.get('activetab');
            return (tabstr == undefined) ? 1 : parseInt(tabstr);
        },

        nextTab() {
            const active = parseInt(this.active_tab)
            this.active_tab = (active < 2 ? active + 1 : 0)
        },

        setTab(idx){
            locals.store.set('activetab', JSON.stringify(idx) ); 
        },

        moveTab(tab_num) {
            this.active_tab = tab_num;
        },

    }

}

</script>

<style scoped>
    .previous-table{
        padding: 5px;
        margin:2px 2px 10px 2px;
        border-collapse:separate !important;
        width: 100%;
        font-size: 80%;
        text-align: center;
    }

    .previous-highlight{
        color: #D9A43A;
    }

</style>

<template>
<div data-app>

    <v-tabs v-model="active_tab" slider-color="#D9A43A" ripple >

      <v-tab v-for="(tab, idx) in tab_labels" :key="idx" v-on:click="setTab(idx)">{{ tab }}</v-tab>
      
        <v-tab-item active-class='active-class'>
            <div v-if="latest_versions.result.length == 0"><Loader /></div>
            <div v-else>
                <VersionTable :table_data="latest_versions.result" @refreshtable="refreshTable"  />
            </div>
        </v-tab-item>


        <v-tab-item >
            <div v-if="latest_versions.result.length == 0">
                <Loader />
            </div>
            <div v-else>

                <VersionFilter :envs="distinct_envs" 
                               :products="distinct_products" 
                               :data="latest_versions.result"
                               @refreshtable="refreshTable"
                               @previousversions="previous_versions_for_product"
                                />
            </div>


            <Modal v-if="previous_deploy_modal" v-on:closemodal="previous_deploy_modal = false">
                    <div v-if="previous_selected_product == false">
                        <Loader />
                    </div>
                    <div v-else>
                        <h3 slot="header">Previous Deploys: <span class="previous-highlight">{{previous_selected_product}}</span></h3>

                        <div v-for="(pv, key) in previous_versions" :key="key" >


                            <table border="1" class="previous-table">
                                <thead> 
                                <tr>
                                    <th>Env</th>
                                    <th>Product</th>
                                    <th>Version</th>
                                    <th>Release</th>
                                    <th>Deployer</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(v, k) in pv" :key="k">
                                    <td width="10%"> {{v.ENVIRONMENT}} </td>
                                    <td width="30%"> {{v.PRODUCT}} </td>
                                    <td width="10%"> {{v.PRODUCT_VERSION}} </td>
                                    <td width="15%"> {{v.JIRA_RELEASE}} </td>
                                    <td width="15%"> {{v.DEPLOYER}} </td>
                                    <td width="10%"> {{v.STATE}} </td>
                                    <td width="10%"> {{new Date(v.CREATED).toLocaleDateString('en-US')}} </td>
                                </tr>
                                </tbody>

                            </table>



                        </div>


                    </div>
            </Modal>


        </v-tab-item>

    </v-tabs>

</div>
</template>
