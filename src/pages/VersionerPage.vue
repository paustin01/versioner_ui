
<script>
import Meta from '../components/ui/Meta.vue';
import VersionIndex from '../components/Versioner/VersionIndex.vue';

export default {
name:'IndexPage',
components:{
	Meta,
	VersionIndex,
	}
}
</script>

<template>
<div>
	<Meta title="Versioner" />
	<VersionIndex />
</div>
</template>