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
          { text: 'Deployed On', value: 'created', formatter: (d) => {
            const yymmdd = new Date(d).toISOString().slice(0, 10);
            const hhmmss = new Date(d).toLocaleTimeString('en-US');
            return `${yymmdd} : ${hhmmss}`;
          }
        
        }
        ],
        tdata: this.table_data,
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

      <template v-for="header in headers.filter(h=>h.hasOwnProperty('formatter'))" v-slot:[`item.${header.value}`]="{ header, value }">
        {{ header.formatter(value) }}
      </template>

      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="mdi-warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>