<script>
  export default {

    props:{
        table_data: {type: Array},
    },
    data () {
      return {
        search: '',
        
          pagination: {
                ascending: true,
                sortBy:"name",
                rowsPerPageItems: [5, 10, 25, 50, 100],
                rowsPerPage: 50,
                page: 1
            },

        headers: [
          //{ text: 'ID', align: 'left', sortable: true, value: 'ID'},
          { text: 'Env', value: 'ENVIRONMENT' },
          { text: 'Product', value: 'PRODUCT' },
          { text: 'Version', value: 'PRODUCT_VERSION', sortable: true, },
          { text: 'Status', value:'STATE' },
          { text: 'Release Tag', value: 'JIRA_RELEASE', sortable: true, },
          { text: 'Deployed By', value: 'DEPLOYER' },
          { text: 'Deployed On', value: 'CREATED' }
          
        ],
        tdata: this.table_data,
      }
    },

    methods:{
      formatDate(d){
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      }
    }
  }
</script>

        

<template>
  <v-card>
    <v-card-title>
      All Products Versions <button v-on:click="$emit('refreshtable', $event)">  
         <v-icon>mdi-refresh</v-icon>
      </button>
      <v-spacer></v-spacer>
      <v-text-field 
        v-model="search"
        append-icon="mdi-search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="elevation-2"
      :items-per-page="10"
      :headers="headers"
      :items="tdata"
      :search="search">
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td class="">{{ props.item.ENVIRONMENT }}</td>
        <td class="">{{ props.item.PRODUCT }}</td>
        <td class="" >{{ props.item.PRODUCT_VERSION }}</td> 
        <td class="" >{{ props.item.STATE }}</td> 
        <td class="" >{{ props.item.JIRA_RELEASE }}</td> 
        <td class="">{{ props.item.DEPLOYER }}</td>
        <td class="">{{ formatDate(new Date(props.item.CREATED)) }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="mdi-warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>