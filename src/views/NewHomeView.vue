<script setup>
import { computed, onMounted, onUpdated, ref } from 'vue'
import StationSelector from '../components/StationSelector.vue';
import TrainSchedule from '../components/TrainSchedule.vue';
import OriginName from '../components/OriginName.vue';
import DestinationName from '../components/DestinationName.vue';
import useStationsStore from '../stores/stations';
import useOptionsStore from '../stores/options';
import {getStationDepartures, getConnections, getStationArrivals} from '../stores/client';
import { useRoute, useRouter } from 'vue-router';

let store = useStationsStore();
let options = useOptionsStore();
let route = useRoute();
let router = useRouter();

let source = ref(route.params.from != '' ? route.params.from : options.getItem('source', ''));
let destination = ref(route.params.to != '' ? route.params.to : options.getItem('destination', ''));
let reverse = ref(options.getItem('reverse', false));


function invertTrip() {
  let tmp = source.value;
  source.value=destination.value;
  destination.value = tmp;
  if (source.value !== '') {
        if (destination.value !== '') {
            router.push('/' + source.value + '/' + destination.value);
        } else {
            router.push('/' + source.value);
        }
    }
  getTrips();
}

function refresh() {
    if (source.value !== '') {
        if (destination.value !== '') {
            router.push('/' + source.value + '/' + destination.value);
        } else {
            router.push('/' + source.value);
        }
    }
    getTrips();
}
function getTrips() {
  options.setItem('source', source.value);
  options.setItem('destination', destination.value);
  options.setItem('reverse', reverse.value);

  if(source.value.length > 0) {
    if(destination.value.length > 0 ) {
      if(reverse.value === true) {
        document.title = 'Ankomster till ' + store.getName(destination.value)  + ' från ' + store.getName(source.value);
        getConnections(destination.value, source.value);
      } else {
        document.title = 'Avgånger från ' + store.getName(source.value)  + ' till ' + store.getName(destination.value);
        getConnections(source.value, destination.value);
      }
    } else {
      if(reverse.value === true) {
        document.title = 'Ankomster till ' + store.getName(source.value);
        getStationArrivals(source.value);
      } else {
        document.title = 'Avgånger från ' + store.getName(source.value);
        getStationDepartures(source.value);
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
       <StationSelector v-model:station="source" @update:station="refresh()"></StationSelector>
      </div>
      <div class="col-1"><button class="btn btn-primary" @click="invertTrip()" :disabled="destination === ''">⇄</button></div>
      <div class="col-5">
        <StationSelector v-model:station="destination"  @update:station="refresh()"></StationSelector>
      </div>
      <div class="col-1"><button class="btn btn-primary" @click="destination=''; refresh();" :disabled="destination === ''">X</button></div>
    </div>
    <ul class="nav nav-tabs nav-fill" v-if="source != ''">
      <li class="nav-item">
        <a :class="['nav-link', reverse == true  ? '' : 'active']" aria-current="page" @click="setReverse(false);" href="#">
          <OriginName :signature="source"></OriginName>
          <DestinationName :signature="destination" v-if="destination != ''"></DestinationName>
        </a>
      </li>
      <li class="nav-item">
        <a :class="['nav-link', reverse == true ? 'active' : '']" @click="setReverse(true);" href="#">
          <OriginName :signature="destination" v-if="destination != ''"></OriginName>
          <DestinationName :signature="source" ></DestinationName>
        </a>
      </li>
    </ul>
    <TrainSchedule v-if="store.trips.length > 0" :show-origin="destination=='' "></TrainSchedule>
  </div>
  
</template>
