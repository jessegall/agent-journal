<script setup>
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {counted} from "../format/number.js";

defineProps({
    collection: {type: String, default: ""},
    removed: {type: Boolean, default: false},
    filed: {type: Number, default: 0},
    working: {type: Boolean, default: false},
    hasCollection: {type: Boolean, default: false},
});
const confirming = defineModel("confirming", {type: String, default: ""});
const emit = defineEmits(["confirmed"]);
</script>

<template>
    <footer class="dump-foot">
        <SwitchCase :value="confirming">
            <template #remove>
                <span class="dump-confirm">
                    Remove the collection and the {{ counted(filed, "thing", "things") }} in it? What you dropped is not touched.
                </span>
                <Btn small @click="confirming = ''">Keep it</Btn>
                <Btn kind="danger" small @click="emit('confirmed')">Remove</Btn>
            </template>
            <template #stop>
                <span class="dump-confirm">Stop filing? What is filed stays; the rest of the pile is not read.</span>
                <Btn small @click="confirming = ''">Keep filing</Btn>
                <Btn kind="danger" small @click="emit('confirmed')">Stop</Btn>
            </template>
            <template #default>
                <Icon name="inbox" :size="13" />
                <span class="dump-foot-label">Collection</span>
                <span class="dump-foot-name">{{ collection || (removed ? "Removed" : "Not named yet") }}</span>
                <span class="dump-foot-label">· {{ counted(filed, "thing", "things") }}</span>
                <span class="grow" />
                <template v-if="working">
                    <Btn small @click="confirming = 'stop'">Stop filing</Btn>
                </template>
                <template v-if="hasCollection && !removed">
                    <Btn small :disabled="!filed && working" @click="confirming = 'remove'">Remove the collection</Btn>
                </template>
            </template>
        </SwitchCase>
    </footer>
</template>

<style scoped>
.dump-foot {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    min-height: 52px;
    padding: 10px 20px;
    border-top: 1px solid var(--border);
    color: var(--text-3);
}

.dump-foot > :deep(.ico) {
    color: var(--accent-text);
}

.dump-foot-label {
    font-size: 12.5px;
    white-space: nowrap;
}

.dump-foot-name {
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    color: var(--text);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.dump-confirm {
    flex: 1;
    font-size: 12.5px;
    color: var(--text-2);
}

.grow {
    flex: 1;
}
</style>
