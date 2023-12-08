<script setup>
    const props = defineProps(['trip']);
    const warnings = ['Buss', 'buss', 'Prel. tid', 'Sen tågvänd', 'Nästa avgång', 'Spårändrat', 'spårändrat', 'fel', 'ersätter'];
    const errors = ['Inställt', 'inställt', 'Polisinsats', 'Invänta info','Fordonsfel', 'incident', 'Obeh. i spår'];

    const hasErrors = (line) => errors.some((word) => line?.toLowerCase().includes(word?.toLocaleLowerCase()));
    const hasWarnings =  (line) => warnings.some((word) => line?.toLocaleLowerCase().includes(word?.toLocaleLowerCase()));
    const deviationClass = (line) => (hasErrors(line) ? 'text-bg-danger' : (hasWarnings(line) ? 'text-bg-warning' : ''));
</script>

<template>
    <div v-if="trip.Canceled" ><span class="text-bg-danger"> 🗙 Inställt</span></div>
    <span v-for="(deviation, index) in trip.Deviation" :class="deviationClass(deviation.Description)"> 🖾 {{ deviation.Description }}</span>
</template>

