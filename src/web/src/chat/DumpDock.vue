<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {api} from "../api/client.js";
import {go, route} from "../route.js";
import {rows} from "../sync/rows.js";
import {dumpCollection} from "../domain/docks.js";

const props = defineProps({dump: Object, folded: Boolean});
const collection = computed(() => rows("collection").find((c) => c.n === dumpCollection(props.dump)) || null);
const line = computed(() => {
    if (!collection.value) return "";
    const things = collection.value.refs.filter((ref) => ref !== props.dump.ref).length;
    return `${things} thing${things === 1 ? "" : "s"} in ${collection.value.title}`;
});

function open() {
    const n = dumpCollection(props.dump);
    if (n) go(route.value.env, "collection", n);
}
</script>

<template>
    <ChatDock label="Filed dump" :folded="folded">
        <template #head>
            <Icon name="inbox" class="dump-dock-icon" />
            <button type="button" class="dump-dock-label" title="Open the collection" @click="open">{{ dump.title }} filed</button>
            <template v-if="line">
                <span class="dump-dock-line">· {{ line }}</span>
            </template>
            <span class="dump-dock-acts chat-dock-acts">
                <Btn small @click="open">Open the collection</Btn>
            </span>
            <CloseButton title="Take this dump out of the chat; its collection stays" @click="api.act('dump', dump.n, 'dismiss')" />
        </template>
    </ChatDock>
</template>

<style scoped>
.dump-dock-icon {
    flex: none;
    color: var(--text-3);
}

.dump-dock-label {
    flex: none;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-weight: 500;
    cursor: pointer;
}

.dump-dock-label:hover {
    text-decoration: underline;
    text-decoration-color: var(--text-4);
    text-underline-offset: 3px;
}

.dump-dock-line {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
}

.dump-dock-acts {
    flex: none;
    display: flex;
    align-items: center;
    margin-left: auto;
}
</style>
