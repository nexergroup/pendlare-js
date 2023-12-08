<script setup>
import useStationsStore from '../stores/stations.js';
import {getStationDepartures} from '../stores/client.js';
import TrainAnnouncement from './TrainAnnouncement.vue';
const props=defineProps(['showOrigin']);
let store = useStationsStore();

</script>

<template>
    <h2 v-if="store.trips.length == 0"> NO TRIPS FOUND</h2>
    <TrainAnnouncement v-for="(trip, index) in store.trips" :trip="trip" :show-origin="showOrigin"></TrainAnnouncement>
</template>