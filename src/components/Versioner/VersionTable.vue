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
          { text: 'Env', value: 'environment' },
          { text: 'Product', value: 'product' },
          { text: 'Version', value: 'product_version', sortable: true, },
          { text: 'Alias', value:'alias' },
          { text: 'Spec', value:'in_spec' },
          { text: 'Release Tag', value: 'jira_release', sortable: true, },
          { text: 'Deployed By', value: 'deployer' },
          { text: 'Deployed From', value: 'caller' },
          { text: 'Deployed On', value: 'created' }
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
        <td class="">{{ props.item.environment }}</td>
        <td class="">{{ props.item.product }}</td>
        <td class="" >{{ props.item.product_version }}</td> 
        <td class="" >{{ props.item.in_spec }}</td> 
        <td class="" >{{ props.item.jira_release }}</td> 
        <td class="">{{ props.item.deployer }}</td>
        <td>{{ props.item.caller }}</td>
        <td class="">{{ formatDate(new Date(props.item.created)) }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="mdi-warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>