<script setup>
import { computed, onMounted, ref } from 'vue'
import StationSelector from '../components/StationSelector.vue';
import TrainSchedule from '../components/TrainSchedule.vue';
import OriginName from '../components/OriginName.vue';
import DestinationName from '../components/DestinationName.vue';
import useStationsStore from '../stores/stations';
import useOptionsStore from '../stores/options';
import {getStationDepartures, getConnections, getStationArrivals} from '../stores/client';

let store = useStationsStore();
let options = useOptionsStore();

let source = ref(options.getItem('source') ?? '');
let destination = ref(options.getItem('destination') ?? '');
let reverse = ref(options.getItem('reverse') ?? false);

function invertTrip() {
  let tmp = source.value;
  source.value=destination.value;
  destination.value = tmp;
  getTrips();
}

function getTrips() {
  options.setItem('source', source.value);
  options.setItem('destination', destination.value);
  options.setItem('reverse', reverse.value);

  if(source.value != '') {
    if(destination.value != '' ) {
      if(!reverse.value) {
        getConnections(source.value, destination.value);
      } else {
        getConnections(destination.value, source.value);
      }
    } else {
      if(! reverse.value) {
        getStationDepartures(source.value);
      } else {
        getStationArrivals(source.value);
      }
    }
  } else {
    store.trips = [];
  }
}

function setReverse(value) {
  if (reverse.value != value) {
    reverse.value = value;
    getTrips();
  }
}
onMounted(() => {
  getTrips();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row mb-4">
      <div class="col-5">
        <StationSelector v-model:station="source" @update:station="getTrips()"></StationSelector>
      </div>
      <div class="col-1"><button class="btn btn-primary" @click="invertTrip()" :disabled="destination === ''">⇄</button></div>
      <div class="col-5">
        <StationSelector v-model:station="destination"  @update:station="getTrips()"></StationSelector>
      </div>
      <div class="col-1"><button class="btn btn-primary" @click="destination=''; getTrips();" :disabled="destination === ''">X</button></div>
    </div>
    <ul class="nav nav-tabs nav-fill" v-if="source != ''">
      <li class="nav-item">
        <a :class="['nav-link', reverse ? '' : 'active']" aria-current="page" @click="setReverse(false);" href="#">
          <OriginName :signature="source"></OriginName>
          <DestinationName :signature="destination" v-if="destination != ''"></DestinationName>
        </a>
      </li>
      <li class="nav-item">
        <a :class="['nav-link', reverse ? 'active' : '']" @click="setReverse(true);" href="#">
          <OriginName :signature="destination" v-if="destination != ''"></OriginName>
          <DestinationName :signature="source" ></DestinationName>
        </a>
      </li>
    </ul>
    <TrainSchedule v-if="store.trips.length > 0" :show-origin="destination=='' "></TrainSchedule>
  </div>
</template>
