<script setup>
const props = defineProps(['trip', 'ignoreInfo']);
const warnings = ['buss', 'prel. tid', 'sen tågvänd', 'nästa avgång', 'Bakre delen: slutstation', 'endast', 'stannar ej', 'ingen påstigning', 'låst', 'ej avst.'];

const hasWarnings =  (line) => warnings.some((word) => line?.toLowerCase().includes(word?.toLowerCase()));
const infoClass = (line) => (hasWarnings(line) ? 'text-bg-warning' : '');

</script>

<template>
    <span v-for="(info, index) in trip.Booking?.filter(item => ! ignoreInfo?.includes(item.Description))" :class="infoClass(info.Description)"> 🎫 {{ info.Description }} </span>
    <span v-for="(info, index) in trip.TrainComposition?.filter(item => ! ignoreInfo?.includes(item.Description))" :class="infoClass(info.Description)"> 🚆 {{ info.Description }} </span>
    <span v-for="(info, index) in trip.Service?.filter(item => ! ignoreInfo?.includes(item.Description))" :class="infoClass(info.Description)"> 🍴 {{ info.Description }} </span>
    <span v-for="(info, index) in trip.OtherInformation?.filter(item => ! ignoreInfo?.includes(item.Description))" :class="infoClass(info.Description)"> 👁 {{ info.Description }} </span> 
</template>