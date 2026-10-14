<script setup>
import BigTitle from "./BigTitle.vue";
import NavBar from "./NavBar.vue";
import {useScrolled} from "./scrolled.js";
import ScreenFoot from "./ScreenFoot.vue";

defineProps({title: {type: String, required: true}, sub: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const {under, scrolled} = useScrolled();
</script>

<template>
    <div class="screen">
        <NavBar :title="title" :back="back" :under="under" @back="emit('back')">
            <slot name="end" />
        </NavBar>
        <div class="screen-scroll" data-scroller @scroll.passive="scrolled">
            <BigTitle :title="title" :sub="sub" />
            <slot />
        </div>
        <ScreenFoot :shown="Boolean($slots.foot)"><slot name="foot" /></ScreenFoot>
    </div>
</template>
