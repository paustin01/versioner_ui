

<script>
export default {
    name:"VersionItem",
    props:{

        envs_length:{type:Number, default:1},
        envs_and_products:{type:Array},
        callback:{type:Function},
        index:{type:String}
    },

    methods:{

        getWidth(){
            return Math.floor(100 / this.envs_length);
        }
    }
}
</script>

<style scopped>

.gray{
    color:#ccc;
}
</style>

<template>
    <table width="100%" :class="callback(index)">

        <tr>
        <td v-for="(ver, idx) in envs_and_products" :key="`vers-${idx}`" :class="ver.style" :style="`width:${getWidth()}%`"> 
            <span>{{ver.ENVIRONMENT}}<br />
            <small v-if="ver.JIRA_RELEASE == ''" class="gray">--</small>
            <small v-else class="gray">{{ver.JIRA_RELEASE}}</small>
            </span>
        </td>
        </tr>
        <tr>
        <td v-for="(ver, idx) in envs_and_products" :key="`pvers-${idx}`" :class="ver.style"> 
            <span :title="ver.DEPLOYER" >{{ver.PRODUCT_VERSION}}</span>
        </td>
        </tr>

    </table>
</template>
