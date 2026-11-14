<script setup>
import {computed} from "vue";
import {ago} from "../src/format/time.js";
import {useNow} from "./useNow.js";

// how long ago something happened, "just now" or "4m ago", kept current as time passes; at is a row's ISO time or epoch seconds
const props = defineProps({at: {type: [String, Number], default: ""}});
const now = useNow();
const date = computed(() => new Date(typeof props.at === "number" ? props.at * 1000 : props.at));
</script>

<template>
    <time :datetime="typeof at === 'number' ? date.toISOString() : at" :title="at ? date.toLocaleString() : ''" data-time-ago>{{ ago(at, now) }}</time>
</template>
