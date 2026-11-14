<script setup>
import {ref, watch} from "vue";
import Skeleton from "../src/kit/Skeleton.vue";
import {afterSkeletonMinimum} from "./skeletonMinimum.js";

// the body under a window's InnerTabs: each time another tab is chosen it shows a skeleton for the minimum, while the tab's content is already mounted and reading behind it
const props = defineProps({tab: {type: Object, default: null}, shape: {type: String, default: "rows"}});
const holding = ref(false);
let latestSwitch = 0;

watch(() => props.tab?.key, () => {
    const thisSwitch = ++latestSwitch;
    holding.value = true;
    afterSkeletonMinimum(performance.now(), () => {
        if (thisSwitch === latestSwitch) holding.value = false;
    });
});
</script>

<template>
    <div class="tab-body" data-tab-body>
        <template v-if="holding">
            <Skeleton :shape="shape" data-tab-skeleton />
        </template>
        <div v-show="!holding" data-tab-content>
            <slot />
        </div>
    </div>
</template>

<style scoped>
[data-tab-content] {
    display: contents;
}
</style>
