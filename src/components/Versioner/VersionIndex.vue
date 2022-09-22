<script>
import Api from '../../utils/api.js';
import {locals} from '../../utils/locals.js';
import Loader from '../icons/Loading.vue';
import VersionTable from './VersionTable.vue';
import VersionFilter from './VersionFilter.vue';
import Modal from '../ui/Modal.vue';
import ArrayHelpers from '../../utils/array_helpers.js';
import vueInternetChecker from 'vue-internet-checker';

export default{

    name:'VersionIndex',

    components:{
        Modal,
        Loader,
        VersionTable,
        VersionFilter,
        vueInternetChecker,     
    },

    data(){
        return {
            onLine: true,
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
        this.onLine = window.navigator.onLine;

    },

    methods:{

        status(ele) {
                console.log(ele);
                this.onLine = ele;
        },
        event(ele) {
                console.log(ele);
                console.log(ele.type)
                if (ele.type === 'online'){
                    this.refreshTable();
                }
                
        },

        latest_versions_load(){
            this.error_msg = null;
            Api.latest_versions().then(res => {
                if (res.ok){return res.json();}
            }).then(data => {

                this.latest_versions = data;
                this.distinct_envs = [...new Set(this.latest_versions.result.map(v=>v.environment))];
                this.distinct_products = [...new Set(this.latest_versions.result.map(v=>v.product))].sort();

            }).catch(e => {
                console.log(e)
                this.error_msg = e;
            });

            return true;
        },


        previous_versions_for_product(product){

            this.previous_deploy_modal = true;
            this.previous_selected_product = false;
            this.error_msg = null;
            Api.previous_versions_for_product(product, 20).then(res => {
                if (res.ok){return res.json();}
            }).then(data => {
                
                let d = data.result.sort(ArrayHelpers.dynamicSort('environment'))
                this.previous_versions = {}; 
                d.map((v)=>{

                    let obj = this.previous_versions
                    let key = v.environment
                    let idx = Object.prototype.hasOwnProperty.call(obj, key);
                    if(!idx){ this.previous_versions[key] = [] }
                    this.previous_versions[key].push(v)
                })

                this.previous_selected_product = product;
                            
            }).catch(e => {
                this.error_msg =  e;
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
    <vue-internet-checker @status="status" @event="event" />
    
    <v-alert type="warning" v-if="error_msg"> {{error_msg}} <v-btn @click="refreshTable" small>Refresh App</v-btn>  </v-alert>
    <v-alert type="warning" v-if="!onLine"> No Internet Connection </v-alert>
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
                                    <th>Alias</th>
                                    <th>Product</th>
                                    <th>Version</th>
                                    <th>Release</th>
                                    <th>Deployer</th>
                                    <th>Spec</th>
                                    <th>Created</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(v, k) in pv" :key="k">
                                    <td width="10%"> {{v.environment}} </td>
                                    <td width="10%"> {{v.alias}} </td>
                                    <td width="20%"> {{v.product}} </td>
                                    <td width="10%"> {{v.product_version}} </td>
                                    <td width="15%"> {{v.jira_release}} </td>
                                    <td width="15%"> {{v.deployer}} </td>
                                    <td width="10%"> {{v.in_spec}} </td>
                                    <td width="10%"> {{new Date(v.created).toLocaleDateString('en-US')}} </td>
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
