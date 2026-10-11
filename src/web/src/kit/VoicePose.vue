<script setup>
import {computed, watch} from "vue";
import {loadRig, rigs} from "../composables/voiceRigs.js";
import RigPlayer from "./RigPlayer.vue";

const props = defineProps({voice: {type: String, default: ""}, size: {type: Number, default: 150}});
const rig = computed(() => rigs.value[props.voice]?.rig || null);

watch(() => props.voice, loadRig, {immediate: true});
</script>

<template>
    <template v-if="voice">
        <span class="voice-pose" :style="{width: `${size}px`, height: `${size}px`}">
            <template v-if="rig">
                <RigPlayer :voice="voice" :rig="rig" :size="size" />
            </template>
        </span>
    </template>
</template>

<style scoped>
.voice-pose {
    display: inline-block;
    flex: none;
}
</style>
