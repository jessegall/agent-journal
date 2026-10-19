<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import ChatDock from "../kit/ChatDock.vue";
import CloseButton from "../kit/CloseButton.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import {store} from "../state/store.js";

const props = defineProps({dump: Object, folded: Boolean});
const scope = useScope();
const line = computed(() => {
    const things = (props.dump.filed || []).length;
    return `${things} thing${things === 1 ? "" : "s"} filed`;
});

function open() {
    store.dumpSelected = props.dump.id;
    store.dumping = true;
}
</script>

<template>
    <ChatDock label="Filed dump" :folded="folded">
        <template #head>
            <Icon name="inbox" class="dump-dock-icon" />
            <button type="button" class="dump-dock-label" title="Open the dump" @click="open">{{ dump.title || `Dump ${dump.id}` }} filed</button>
            <span class="dump-dock-line">· {{ line }}</span>
            <span class="dump-dock-acts chat-dock-acts">
                <Btn small @click="open">Open the dump</Btn>
            </span>
            <CloseButton title="Hide from chat; what it filed stays" @click="scope.api.act('dumps', dump.id, 'dismiss')" />
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
