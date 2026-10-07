<script setup>
import {onMounted, ref} from "vue";
import {endsOf, linksOf, stopShare, viewsOf} from "../composables/shares.js";
import Button from "./kit/Button.vue";
import Cell from "./kit/Cell.vue";
import CellGroup from "./kit/CellGroup.vue";
import {toast} from "./kit/toast.js";

const props = defineProps({target: {type: String, required: true}});
const links = ref([]);
const stopping = ref(0);

const load = async () => (links.value = await linksOf(props.target).catch(() => []));

async function stop(link) {
    stopping.value = link.n;
    try {
        await stopShare(link);
        toast("The link is stopped");
        await load();
    } catch (error) {
        toast(error.message);
    } finally {
        stopping.value = 0;
    }
}

onMounted(load);
defineExpose({load});
</script>

<template>
    <template v-if="links.length">
        <h3 class="links-head">Links that work now</h3>
        <CellGroup>
            <template v-for="link in links" :key="link.n">
                <Cell :label="link.abstract.replace(/^https:\/\/[^/]+/, '')" :sub="`${viewsOf(link)} · ${endsOf(link)}`" still>
                    <template #end>
                        <Button kind="link" :busy="stopping === link.n" @click="stop(link)">Stop</Button>
                    </template>
                </Cell>
            </template>
        </CellGroup>
    </template>
</template>

<style scoped>
.links-head {
    margin: 0 4px 6px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}
</style>
