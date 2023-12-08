<script setup>
import {useRouter} from 'vue-router';
import  {computed, ref, watch, reactive } from 'vue';

let router = useRouter();
let back = ref(router.options.history.state.position);

router.afterEach(() => {
    back.value = router.options.history.state.position 
})

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
        <div class="container-fluid">
            <button class="btn btn-outline-success m-1" @click="router.go(-1)" :disabled="back <= 1"> ＜ </button>
            <div class="navbar-brand">
                Pendlare
            </div>
            <div class="btn-group text-end" role="toolbar">
                <button class="btn btn-outline-success m-1" @click="router.push('/');"> 🚆 Tåg</button>
                <button class="btn btn-outline-success m-1" @click="router.push('/messages');"> ✉ Meddelanden</button>
                <button class="btn btn-outline-success m-1" @click="router.push('/settings');"> ⚙ Inställningar</button>
            </div>
        </div>
    </nav>
</template>