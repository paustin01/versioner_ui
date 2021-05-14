

<script>
import ArrayHelpers from '../../utils/array_helpers.js';
import StrHelpers from '../../utils/str_helpers.js';
import {locals} from '../../utils/locals.js';

import VersionGroup from './VersionGroup.vue';
import VersionBlock from './VersionBlock.vue';
import Modal from '../ui/Modal.vue';

import FilterMenu from '../ui/FilterMenu.vue';
import GroupMenu from '../ui/GroupMenu.vue';

   
export default {
    name:'VersionFilter',

    components:{
        VersionGroup,
        VersionBlock,
        Modal,
        FilterMenu,
        GroupMenu,
    },

    props:{
        data:{type:Array},
        products:{type:Array},
        envs:{type:Array},
    },
    data(){
        return {
            selected_env:[],
            selected_products:[],
            search_product_tag:"",
            search_version_keyword:"",
            search_products:"",
            
            selected_versions:{},
            flag_version:{},
            
            groups:[],
            group_name:'',
            selected_group:'',
            group_form_errors:[],

            search_affects_table:false,
            
            relsases:[],
            rel_tag_exect_match:true,
            
            show_modal: false,
            show_group_modal:false,
            show_rel_tag_filter:'',  
            show_rel_tag:true,
            show_bad_tag:false,

            

        }
    },


 

    created(){
        let saved_envs = locals.store.getjson('versions_selected_envs', []);
        this.selected_env = [...saved_envs].sort();
        let saved_products = locals.store.getjson('versions_selected_products', []);
        this.show_rel_tag = StrHelpers.toBool(locals.store.get('show_rel_tag', this.show_rel_tag));
        //this.rel_tag_exect_match = StrHelpers.toBool(locals.store.get('rel_tag_exect_match', this.rel_tag_exect_match));
        this.selected_products = [...saved_products];
        this.concatVersionArray();
        this.groups = this.getSavedGroups();
        this.relsases = [];

         this.data.filter( d => {
            if(d.jira_release != '' && this.relsases.indexOf(d.JIRA_RELEASE) == -1){
                this.relsases.push(d.JIRA_RELEASE);
            }
            return false;
        });

        this.relsases.sort()
        

    },

    methods:{

        triggerPreviousVersions(product){
            this.$emit('previousversions', product);
        },

        setRelTag(){
            this.show_rel_tag = !this.show_rel_tag;
            return locals.store.set('show_rel_tag', StrHelpers.toBool(this.show_rel_tag) ? true : false );
        },

        /*
        Group methods 
         */
        getGroup(grp){
            this.drainVersionArray();
            this.selected_env = [...grp.env].sort();
            this.selected_products = [...grp.products]; 
            this.selected_group = grp.name;
            this.concatVersionArray();
        },

        cleanGroupName(){
            this.group_name = StrHelpers.trimSpecial(this.group_name);
        },

        getSavedGroups(){
            let grpstr = locals.store.get('groups');
            return (grpstr == undefined) ? [] :  JSON.parse(grpstr);
        },

        deleteGroup(idx){
          this.$delete(this.groups, idx);
          locals.store.set('groups', JSON.stringify(this.groups)); 
        },

       updateGroup(){
            let grps = locals.store.getjson('groups');
            let grp_idx = 0;
            grps.forEach((g, i) => { if(g.name==this.selected_group){ grp_idx = i;  } });
            grps[grp_idx]['env'] = this.selected_env; 
            grps[grp_idx]['products'] = this.selected_products;
            locals.store.setjson('groups', grps); 
       }, 

        createGroup(){
          this.group_form_errors = [];
          let grpstr = locals.store.get('groups');
          let groups = (grpstr == undefined) ? [] : JSON.parse(grpstr)
          let gfilter = groups.filter(g=>g.name == this.group_name);

          if(gfilter.length > 0){
            this.group_form_errors.push(this.group_name + ' Already exists in groups.');
          }

          if(this.group_name.length == 0){
            this.group_form_errors.push('Group name can not be blank');
          }
          
          if(this.selected_products.length == 0){
            this.group_form_errors.push('Select at least one Product');
          }

          if(this.selected_env.length == 0){
            this.group_form_errors.push('Select at least one Environment');
          }

          if(this.group_form_errors.length > 0){return false;}

          let data = { env:this.selected_env, products:this.selected_products, name: this.group_name};

          groups.push(data);
          locals.store.set('groups', JSON.stringify(groups)); 
          this.groups = groups;
          this.group_name = "";
          this.showModal(true);
        },

        setEnv(idx, evt){
            this.upsertVersionArray(evt.target.innerHTML.trim(), this.selected_env);
        },    

        setEnvClass(env){
            return this.selected_env.indexOf(env) == -1 ? 'btn-grp' : 'btn-active btn-grp';
        },

        setProduct(idx, evt){
            this.upsertVersionArray(evt.target.innerHTML.trim(), this.selected_products, true);
        },

        setProductClass(prod){
            return this.selected_products.indexOf(prod) == -1 ? 'btn-grp' : 'btn-active btn-grp';
        },

        selectAllProducts(){
            this.selectNoProducts();
            this.selected_products = [...this.products];
            this.concatVersionArray();
        },

        selectNoProducts(){
            this.drainVersionArray();
            this.selected_products = [];
            this.show_rel_tag_filter = '';
        },

        selectVisibleProducts(){
            this.selectNoProducts();
            let prods = document.getElementById("product_tags").getElementsByTagName("button");
            for (var i = 0; i < prods.length; i++) {
               if( prods[i].style.display == ''){
                   this.selected_products.push(prods[i].innerHTML.trim());
               }
            }
            this.concatVersionArray();
        },

        selectBadVersionMatch(){
            let style = '.version-success';
            let goods = document.querySelectorAll(style);
            //console.log(this.show_bad_tag);
            for (var i = 0; i < goods.length; i++) {
                //goods[i].classList.toggle('version-good');
                this.show_bad_tag ?  goods[i].classList.add("version-good") : goods[i].classList.remove("version-good");
                goods[i].style.visibility = this.show_bad_tag ? "visible" : "collapse";
            }
            this.show_bad_tag = !this.show_bad_tag;
        },

        /*
            empty selected items array.
        */
        drainVersionArray(){
            this.selected_products.forEach((prod)=>{
                this.$set(this.flag_version, prod, []);
                this.$set(this.selected_versions, prod, []);
                delete this.selected_versions[prod];
            });
        },
        /*
            reset filter selctions. 
        */
        clearVersionData(){
            this.selectNoProducts();
            this.selected_env = [];
            this.show_bad_tag = false;
            locals.store.setjson('versions_selected_products', this.selected_products);
            locals.store.setjson('versions_selected_envs', this.selected_env);
        },
        
        /*
         concat main array on item upsert
        */
        concatVersionArray(){
            this.selected_products.forEach((prod)=>{
                this.$set(this.flag_version, prod, []);
                this.$set(this.selected_versions, prod, []);
                this.parseVersionData(prod);
            });

            this.searchProductsTable();
        },


        setRelTagExectMatch(evt, data){
            this.rel_tag_exect_match = data;
            locals.store.set('rel_tag_exect_match', StrHelpers.toBool(this.rel_tag_exect_match) );
        },

        /* if the user enters a rel tag
            update the selected product tags 
            by rel tag re-render the table. 
        */
        concatVersionArrayByRelTag(search=''){

            if(!search || search.trim() == ''){
                return false;
            }  

            //selected_products_filter
            this.show_rel_tag_filter = search.trim();
            let tag = this.show_rel_tag_filter
            let products = [];
            
            let exectMatch = (tag1, tag2) => {
                return (tag1 == tag2);
            }

            // let likeMatch = (tag1, tag2) => {
            //     return (tag1.indexOf(tag2) != -1);
            // }
            
            //let matchFunct = (this.rel_tag_exect_match) ? exectMatch : likeMatch;

            this.data.filter( d => {
                if(exectMatch(d.JIRA_RELEASE, tag)){
                    products.push(d.PRODUCT);
                }
                return ( exectMatch(d.JIRA_RELEASE, tag)  ); 
            });

            this.selectNoProducts();
            this.selected_products  = [...products];
            this.concatVersionArray();

        },

        /* 
        Called when a click event pushes 
        selected env. or products into the seleted array 
        */
        upsertVersionArray(val, arry, product=false){
            if(arry.indexOf(val) != -1){
                this.$delete(arry, arry.indexOf(val));
                if(product){
                    this.$set(this.selected_versions, val, []);
                    delete this.selected_versions[val];
                }
            }else{
                arry.unshift(val);
            }
            this.concatVersionArray();  
        },

        /*
            passed as a prop to the versionblock comp. 
            this inline function can change the state of the table row 
            without directly on the dom object so new prop values dont 
            have to be injected, serves as a statless update. 
        */
        flagVersion(index, settype='class'){
            let node = ArrayHelpers.all_match(this.flag_version[index]);
            let classname = this.show_bad_tag ? 'version-success' : 'version-good version-success';
            if (settype == 'class'){ return node ? classname : 'version-bad';}
            if (settype == 'style'){return node && this.show_bad_tag  ? ' visibility:collapse; ' : ' visibility:visible; ';}
            return "";
        },

        /*
            main un-packing method push json 
            response data into tablular form.
        */
        parseVersionData(prod){

            //filter by product
            let return_data = this.data.filter( d => {  
                return (prod == d.PRODUCT 
                        && this.selected_env.indexOf(d.ENVIRONMENT) != -1); 
            });

            //backfill empty rows
            return_data = this.backFillEnv(return_data, prod).sort(ArrayHelpers.dynamicSort('ENVIRONMENT'));            
            this.$set(this.selected_versions, prod, return_data);

            //save last selection in localstore
            locals.store.setjson('versions_selected_products', this.selected_products);
            locals.store.setjson('versions_selected_envs', this.selected_env);
        },

        /*
            Create a placeholder doc for products that do not have
            and entry in the versioner table to key the render table 
            symmetric. 
        */
        backFillEnv(arry, product){
           
            let skip_backfill = [];
            let all_versions  = [];

            arry.forEach( ( a )=>{
                skip_backfill.push(a.ENVIRONMENT);
                all_versions.push(a.PRODUCT_VERSION);
                a['style'] = 'active';  
            });

            this.selected_env.forEach( ( env )=>{  
                if( skip_backfill.indexOf(env) == -1  ){
                    arry.push( this.backFillVars(env, product) );
                    all_versions.push(-1);
                }
            });

            this.$set(this.flag_version, product, all_versions);

            return arry;
        },

        /*
            Create a placeholder json for missing product entry.
            see above backFillEnv
        */

        backFillVars(env, product){
            return { "id": 0, 
                "CREATED": '--', 
                "ENVIRONMENT": env, 
                "PRODUCT": product, 
                "PRODUCT_VERSION": "--",
                "DEPLOYER": "--", 
                "JIRA_RELEASE": "--", 
                "CALLER": "--",
                "STATE": "--",
                'style':'muted',
             };
        },
        /*
            search product tags by key word, 
            hide non-matching tags in product tag display . 
        */
        searchProductTags() {
            let filter = this.search_product_tag.toUpperCase();
            let btns   = document.getElementById("product_tags").getElementsByTagName("button");
            for (var i = 0; i < btns.length; i++) {
                let txt = btns[i].innerHTML.toUpperCase();
                btns[i].style.display = (txt.indexOf(filter) > -1) ? "" : "none";
            }
            //if(this.search_affects_table){ this.searchProducts();}
        },
        /*
            Note: Not in Use
            search product tags by key word, 
            hide non-matching tags in table . 
        */
        searchProducts(){
            let filter = this.search_product_tag.toUpperCase();
            let rows   = document.getElementsByClassName('data_product');
            for (var i = 0; i < rows.length; i++) {
                let txt = rows[i].getAttribute('data_product').toUpperCase();
                rows[i].style.display = (txt.indexOf(filter) > -1) ? "" : "none";
            }
        },

        /* 
        search render table by keyword and fade out 
        non-maching items in main display table. 
        */
        searchProductsTable(){
            let filter = this.search_version_keyword.toString().trim().toUpperCase();
            let rows   = document.getElementsByClassName('data_product_version');
            for (var i = 0; i < rows.length; i++) {
                let txt = rows[i].getAttribute('data_vesion').toUpperCase();
                rows[i].style.opacity = (txt.indexOf(filter) > -1) ? "1" : "0.2"; 
            }
        },

        /*
        Not used if set Tag Search Box will also filter version table. 
        uncomment::  //if(this.search_affects_table){ this.searchProducts();} above to enable. 
        */
        toggleSearchTableView(){
            this.search_affects_table = !this.search_affects_table;
            if(!this.search_affects_table){
                let rows   = document.getElementsByClassName('data_product');
                for (var i = 0; i < rows.length; i++) {
                    rows[i].style.display =  "";
                }
            }else{
                this.searchProducts();
            }
        },
        
        /* toggle open/close 
        standard modal */
        showModal(close=false){
            if(close == true){
                this.show_modal = false;
            }else{
                this.show_modal = true;
            }
        }

    },

}
</script>


<template>
    <div id="version-target">
            <div class="row">
                <div class="col margin-bottom-5px">
                <h4 class="margin-top-5px">Environment Tags  </h4>
                <div id="env_tags" class="vhight depth">
                <button v-for="(env, idx) in envs" :key="idx" v-on:click="setEnv(idx, $event)" 
                    :id="`env-${env}`" :class="setEnvClass(env)">{{env}}</button>
                </div>
                </div>
            </div>

            <div class="row">
                <div class="col margin-right-5px">

                    <GroupMenu :grplen="groups.length" 
                               :grpname="selected_group"
                               @showmodal="showModal"
                               @grpmodal="show_group_modal = true"
                               @updategroup="updateGroup" />

                    <div class="search-input-wrap">
                        <VersionGroup :groups="groups" @getgroup="getGroup"  />
                    </div>

                </div>

                <div class="col">

                <div class="pull-right">
                 <FilterMenu @togglesearchtableview="toggleSearchTableView"
                             @togglereltag="setRelTag"
                             @clearversiondata="clearVersionData"
                             @concatversionarraybyreltag="concatVersionArrayByRelTag"
                             @selectallproducts="selectAllProducts"
                             @selectnoproducts="selectNoProducts"
                             @reltagexectmatch="setRelTagExectMatch"
                             :rel_tags="relsases"
                             :search_affects_table="search_affects_table"
                             :rel_tag_exect_match="rel_tag_exect_match"
                             :show_rel_tag="show_rel_tag"/>
                </div>

                <div class="search-input-wrap">

                    <input v-model="search_product_tag" 
                        id="search_product_tag" 
                        class="search_input pull-right" 
                        v-on:keyup="searchProductTags" 
                        name="search_product_tag"  
                        placeholder="Search Products Tags"  />
                    
                    <div class="icon-warp">
                    <label for="search_product_tag"> 
                        <v-icon>mdi-book-search-outline</v-icon>
                    </label>
                    </div>
                
                </div>

                </div>
            </div>


        <div class="row">   
            <div class="col margin-bottom-5px">
            <div class="pull-right">
                
                <a v-if="this.search_product_tag.length > 0" 
                href="javascript:void(0)" 
                v-on:click="selectVisibleProducts" 
                class="margin-right-5px"><small>select visible</small></a> 
                <a v-if="selected_products.length != products.length && this.search_product_tag.length == 0" 
                    href="javascript:void(0)" 
                    v-on:click="selectAllProducts" 
                    class="margin-right-5px"><small>select all</small></a>
                <span v-if="selected_products.length != products.length 
                        && selected_products.length > 0
                        && this.search_product_tag.length == 0">| </span>
                <a v-if="selected_products.length > 0 && this.search_product_tag.length == 0" 
                    href="javascript:void(0)" 
                    v-on:click="selectNoProducts" 
                    class="margin-right-5px"><small>select none</small></a>
            
            </div>
                
                <h4 class="margin-top-5px">Product Tags</h4>
                <div id="product_tags" class="vhight depth">
                        <button v-for="(prod, idx) in products" :key="idx" 
                        :id="`prod-${prod}`"
                        v-on:click="setProduct(idx, $event)" 
                        :class="setProductClass(prod)">{{prod}}</button>
                </div>
            </div>
        </div>

        <v-flex xs12 sm12 class="py-1">
        <button v-on:click="$emit('refreshtable', $event)">  
            <v-icon small>mdi-refresh</v-icon>
        </button>

        <button v-on:click="selectBadVersionMatch">
          <v-icon v-if="show_bad_tag" style="color:red;" small>mdi-ladybug</v-icon>
          <v-icon v-else small title="display only mis-match versions">mdi-ladybug</v-icon>
        </button>


        <input 
            id="search_product_ver" 
            class="input pull-right depth v-card" 
            v-model="search_version_keyword"
            v-on:keyup="searchProductsTable"
            name="search_product_ver"  
            placeholder="Search Table Version"  />

    
            <VersionBlock :envs_length="selected_env.length" 
                          :envs="selected_env"
                          :callback="flagVersion" 
                          :show_rel_tag="show_rel_tag"
                          :version_keyword="search_version_keyword"
                          :selected_versions="selected_versions" 
                          @triggerpreviousversions="triggerPreviousVersions"
                          />
        </v-flex>




       
  <Modal v-if="show_modal" v-on:closemodal="showModal(true)">

        <h3 slot="header">Create Group</h3>
        <div v-if="group_form_errors"  class="form-error">
            <p v-for="(err, idx) in group_form_errors" :key="idx"> {{err}} </p>
        </div>    

        <input type="text" name="groupName" 
            v-model="group_name" 
            v-on:keyup="cleanGroupName" 
            placeholder="Group Name No Special Chars" class="fancy-input" />
            <br />
            <p>
            <br /> <v-btn color="primary" v-on:click="createGroup">Save</v-btn>
            </p>

  </Modal>



  <Modal v-if="show_group_modal" v-on:closemodal="show_group_modal = false">
        <h3 slot="header">Manage Groups</h3>
        <div v-if="groups.length > 0">
            <p> Click on the <em>group name</em> to delete it </p>
            <div v-for="(grp, idx) in groups" :key="grp.name" :value="idx">
            <a href="#" class="danger" v-on:click="deleteGroup(idx)" title="delete">delete: {{grp.name}}</a>
            </div>
        </div>

        <div v-else>
            <p>No Groups to Manage :)</p>
        </div>

  </Modal>


    </div>
</template>
