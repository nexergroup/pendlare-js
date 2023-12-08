<script setup>
// import {defineProps, defineEmits} from 'vue';
import useStationsStore from '../stores/stations.js';
import {getAllStations} from '../stores/client.js';

import {computed} from 'vue';
const props = defineProps(['station']);
const emits = defineEmits(['update:station']);

var store = useStationsStore();
var stationList = computed(() => store.stations);

function update(event){
  emits('update:station', event.target.value);
}
</script>

<template>
  <select class="form-select" :value="station" @input="update($event)">
    <option value="" disabled hidden>Välj station</option>
    <option v-for="(station, index) in stationList" :key="station.AdvertisedLocationName" :value="station.LocationSignature">{{ station.AdvertisedLocationName }}</option>
  </select>
</template>