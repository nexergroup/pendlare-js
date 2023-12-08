<script setup>
import useStationsStore from '../stores/stations.js';

const props = defineProps(['signature']);

let store = useStationsStore();

</script>

<template>
    <span class="">{{ store.getName(signature) }}</span>
    <span class=""> ➤ </span>
</template>