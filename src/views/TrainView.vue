<script setup>
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getStops } from '../stores/client';
import useStationsStore from '../stores/stations';
import TrainStop from '../components/TrainStop.vue';
import DestinationName from '../components/DestinationName.vue';
import OriginName from '../components/OriginName.vue';
import TrainName from '../components/TrainName.vue';
import TrainInfo from '../components/TrainInfo.vue';

let store = useStationsStore();
let route = useRoute();
let id = ref(route.params.id);
watch(() => route.params.id,
      newId => {
        id.value = newId.id;
        getStops(id.value);
      });
onMounted(() => {
  getStops(id.value);
});
const ignoreInfo = () => {
  let result = [];
  if (store.stopData.firstAnnouncement?.Booking?.length > 0) {
    result = result.concat(store.stopData.firstAnnouncement?.Booking)
  }
  if (store.stopData.firstAnnouncement?.TrainComposition?.length > 0) {
    result = result.concat(store.stopData.firstAnnouncement?.TrainComposition)
  }
  if (store.stopData.firstAnnouncement?.Service?.length > 0) {
    result = result.concat(store.stopData.firstAnnouncement?.Service)
  }
  if (store.stopData.firstAnnouncement?.OtherInformation?.length > 0) {
    result = result.concat(store.stopData.firstAnnouncement?.OtherInformation)
  }
  return result;
}

</script>

<template>
  <div class="container-fluid" v-if="store.stopData">
    <div class="row"><div class="col-12 fs-4">
      <OriginName :signature="store.stopData.firstAnnouncement?.FromLocation[0].LocationName" v-if="store.stopData.firstAnnouncement?.FromLocation"></OriginName>
      <DestinationName :signature="store.stopData.lastAnnouncement?.ToLocation[0].LocationName" v-if="store.stopData.lastAnnouncement?.ToLocation"></DestinationName>
    </div></div>
    <div class="row"><div class="col-12 fs-5">
      <TrainName :trip="store.stopData.firstAnnouncement"></TrainName>
    </div></div>
    <div class="row"><div class="col-12">
      <div v-if="store.stopData.nextDeparture">
        Nästa avgång (estimerade): {{ store.getName(store.stopData.nextDeparture.LocationSignature) }}: 
        <TrainInfo :trip="store.stopData.nextDeparture"></TrainInfo>
      </div>
      <div v-if="store.stopData.nextArrival && ! store.stopData.nextDeparture">
        Nästa ankomst (estimerade): {{ store.getName(store.stopData.nextArrival.LocationSignature) }}: 
        <TrainInfo :trip="store.stopData.nextArrival"></TrainInfo>
      </div>
      
      <TrainInfo :trip="store.stopData.nextArrival" v-if="! store.stopData.nextDeparture && store.stopData.nextArrival"></TrainInfo>
    </div></div>
    <div class="row text-bg-info">
      <div class="col-3">Station</div>
      <div class="col-4">Ankomst</div>
      <div class="col-4">Avgång</div>
      <div class="col-1">Spår</div>
    </div>
    <TrainStop v-for="(stop, signature) in store.stopData.stops" :stop="stop" :ignore-info="ignoreInfo()"></TrainStop>
  </div>
</template>
