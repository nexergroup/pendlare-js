<script setup>
const props = defineProps(['trip']);
</script>

<template>
    <span v-for="(company, index) in trip.ProductInformation" class="train-company">{{ company?.Description }} </span>
    <span class="train-number"> 🚆 {{ trip.AdvertisedTrainIdent }}</span>
</template>

<style scoped>
    .train-company{
        display: inline-block;
        padding-right: 0.2rem;
    }
    .train-number {
        display: inline-block;
    }
</style>