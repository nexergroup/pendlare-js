<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted } from 'vue';
import {getAllStations} from './stores/client.js';
import MainToolbar from './components/MainToolbar.vue';

onMounted(() => {
  getAllStations();
});

</script>

<template>
    <MainToolbar></MainToolbar>
  <div class="mt-1">
    <RouterView />
  </div>
</template>
