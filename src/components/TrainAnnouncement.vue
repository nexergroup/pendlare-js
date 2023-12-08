<script setup>
import useStationsStore from '../stores/stations.js';
import DestinationName from './DestinationName.vue';
import OriginName from './OriginName.vue';
import TrainName from './TrainName.vue';
import TrackName from './TrackName.vue';
import DepartureTime from './DepartureTime.vue';
import TripDeviation from './TripDeviations.vue';
import TrainInfo from './TrainInfo.vue';
import router from '../router';

const props = defineProps(['trip', 'showOrigin']);

function showTrain (trip) {
    router.push('/train/' + trip.AdvertisedTrainIdent);
}
let store = useStationsStore();
let mainClass = props.trip.Canceled ? 'border-danger' : props.trip.TimeAtLocation ? 'border-primary' : '';

</script>

<template>
    <div :class="['row', 'pt-4', 'border-start', 'border-top-0', 'border-bottom-0','border-end', 'border-5', mainClass]">
        <div class="col-2 fs-6"><DepartureTime v-if="trip" :trip="trip"></DepartureTime></div>
        <div class="col-7 clickable" @click="showTrain(trip);">
            <div class="fs-6">
                <OriginName :signature="trip.FromLocation[0].LocationName" v-if="showOrigin"></OriginName>
                <DestinationName :signature="trip.ToLocation[0].LocationName"></DestinationName>
            </div>
            <div class="fs-6"><TrainName :trip="trip"></TrainName></div>
        </div>
        <div class="col-3">
            <div class="fs-6"><TrackName :trip="trip" show-label="true"></TrackName></div>
            <div class="fs-6"><TripDeviation :trip="trip" v-if="trip.Deviation?.length > 0"></TripDeviation></div>
        </div>
    </div>
    <div :class="['row', 'pt-4', 'border-start', 'border-top-0', 'border-bottom-0','border-end', 'border-5', 'pb-4', mainClass]">
        <div class="col-12">
            <TrainInfo :trip= trip></TrainInfo>
        </div>
    </div>
    <div :class="['row', 'border-bottom', 'border-light-subtle']">
    </div>
</template>

<style scoped>

.clickable {
    cursor: pointer;
}

</style>