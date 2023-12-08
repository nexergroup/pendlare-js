<script setup>
import {ref} from 'vue';

const props = defineProps(['trip']);

/*
AdvertisedTimeAtLocation (advertised, can be different from the schedule timetable)
DepartureDateOTN 
EstimatedTimeAtLocation (estimated departure or arrival, overrides PlannedEstimatedTimeAtLocation when PlannedEstimatedTimeAtLocationIsValid is false)
EstimatedTimeIsPreliminary
LocationDateTimeOTN
PlannedEstimatedTimeAtLocation (Estimated time, overrides AdvertisedTimeAtLocation)
PlannedEstimatedTimeAtLocationIsValid
ScheduledDepartureDateTime (Day only)
TimeAtLocation (Real departure/arrival)
Canceled (overrides all)
*/
let advertised = ref(props.trip.AdvertisedTimeAtLocation.substr(11,5));
let departed = ref(props.trip.TimeAtLocation?.substr(11,5));
let estimated = props.trip.EstimatedTimeAtLocation?.substr(11,5);
let planned = props.trip.PlannedEstimatedTimeAtLocation?.substr(11,5);
let canceled = props.trip.Canceled;

let advertisedIsCorrect = !(estimated || planned ) || advertised == estimated || advertised == planned;
let advertisedClass = (canceled ? ['canceled', 'text-bg-danger'] : (advertisedIsCorrect ? 'valid' : 'invalid'));
let calculatedExpected = ref(props.trip.PlannedEstimatedTimeAtLocationIsValid ? planned : estimated);
let expectedClass = ref(props.trip.EstimatedTimeIsPreliminary ? 'text-bg-warning' : 'text-bg-info');
</script>

<template>
    <div>
        <span :class="advertisedClass">{{ advertised }} </span>
        <span v-if="departed && departed !== advertised"> [{{ departed }}]</span>
        <span v-if="departed && departed == advertised">✓</span>
        <span v-if="! advertisedIsCorrect && !departed" :class="expectedClass"> ({{ calculatedExpected }})</span>
    </div>
</template>

<style scoped>

.canceled {
    text-decoration: line-through;
}
.invalid{
    text-decoration: line-through;
}

</style>