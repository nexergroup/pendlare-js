<script setup>
const props = defineProps(['trip', 'showLabel']);
let canceled = props.trip.Canceled;
</script>

<template>
    <span class="" v-if="!canceled"><span v-if="showLabel">Spår </span>{{ trip.TrackAtLocation }}</span>
</template>
