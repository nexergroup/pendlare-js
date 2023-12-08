<script setup>
import useStationsStore from '../stores/stations.js';
import DepartureTime from './DepartureTime.vue';
import TrackName from './TrackName.vue';

const props = defineProps(['stop']);
let store = useStationsStore();

</script>

<template>
    <div class="row train-stop  border-bottom border-light-subtle">
        <div class="col-3">{{ store.getName(stop.LocationSignature) }}</div>
        <div class="col-4"><span v-if="stop.Ankomst"><DepartureTime :trip="stop.Ankomst"></DepartureTime></span></div>
        <div class="col-4"><span v-if="stop.Avgang"><DepartureTime :trip="stop.Avgang"></DepartureTime></span></div>
        <div class="col-1"><TrackName :trip="stop.Avgang ? stop.Avgang : stop.Ankomst"></TrackName></div>
    </div>
</template>

<style scoped>
.train-stop{
    font-size: 0.9rem;
}

</style>