<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {DELETE_NOTE, closeNote, closeWord, word} from "../domain/spec.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({resource: {type: Object, required: true}});
const open = ref(false);
const anchor = ref(null);
const refusal = ref("");
const closed = computed(() => Boolean(props.resource.completed));

async function run(method, data) {
    open.value = false;
    refusal.value = "";
    try {
        await api.act(props.resource.type, props.resource.n, word(props.resource.type, method), data);
    } catch (e) {
        refusal.value = e.message;
    }
}
</script>

<template>
    <span class="resource-menu" @click.stop>
        <Btn ref="anchor" kind="icon" small :title="`Actions for ${resource.title}`" @click="open = !open">
            <Icon name="dots" :size="14" />
        </Btn>
        <template v-if="refusal">
            <span class="resource-menu-refusal">{{ refusal }}</span>
        </template>
        <template v-if="open">
            <MenuPanel :anchor="anchor.$el" :min-width="260" align="right" @close="open = false">
                <template v-if="closed">
                    <MenuItem description="Moves it back to Open" @click="run('reopen', {why: 'Reopened from the list'})">Reopen</MenuItem>
                </template>
                <template v-else>
                    <MenuItem :description="closeNote(resource.type)" @click="run('complete', {how: 'Closed from the list'})">
                        {{ closeWord(resource.type) }}
                    </MenuItem>
                </template>
                <MenuItem :description="DELETE_NOTE" @click="run('delete', {})">Delete</MenuItem>
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.resource-menu {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 8px;
}

.resource-menu-refusal {
    color: var(--danger);
    font-size: 12px;
}
</style>
