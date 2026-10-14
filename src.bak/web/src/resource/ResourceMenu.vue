<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {DELETE_NOTE, MENUED, closeNote, closeWord, word} from "../domain/spec.js";
import {startedBy} from "../domain/triggerWords.js";
import AddToCollection from "./AddToCollection.vue";
import AlertDialog from "../kit/AlertDialog.vue";
import Dialog from "../kit/Dialog.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["gone"]);
const open = ref(false);
const asking = ref(false);
const collecting = ref(false);
const anchor = ref(null);
const refusal = ref("");
const closed = computed(() => Boolean(props.resource.completed));
const sequences = computed(() => (props.resource.type === "trigger" ? startedBy(props.resource.n) : []));
const asks = computed(() => MENUED.includes(props.resource.type));
const name = computed(() => `${props.resource.type} ${props.resource.n}`);

async function run(method, data) {
    open.value = false;
    refusal.value = "";
    try {
        await api.act(props.resource.type, props.resource.n, word(props.resource.type, method), data);
        if (method === "delete") emit("gone");
    } catch (e) {
        refusal.value = e.message;
    }
}

const collect = () => ((open.value = false), (collecting.value = true));

const erase = () => (asks.value ? ((open.value = false), (asking.value = true)) : run("delete", {}));

function sure() {
    asking.value = false;
    return run("delete", {});
}
</script>

<template>
    <span class="resource-menu" @click.stop>
        <Btn ref="anchor" kind="icon" small v-tip="`Actions for ${resource.title}`" @click="open = !open">
            <Icon name="dots" :size="14" />
        </Btn>
        <template v-if="refusal">
            <span class="resource-menu-refusal">{{ refusal }}</span>
        </template>
        <template v-if="open">
            <MenuPanel :anchor="anchor.$el" :min-width="260" align="right" @close="open = false">
                <template v-if="asks">
                    <MenuItem description="Puts it in a collection with related items." @click="collect">Add to collection</MenuItem>
                </template>
                <template v-if="closed">
                    <MenuItem description="Moves it back to Open" @click="run('reopen', {why: 'Reopened from the list'})">Reopen</MenuItem>
                </template>
                <template v-else>
                    <MenuItem :description="closeNote(resource.type)" @click="run('complete', {how: 'Closed from the list'})">
                        {{ closeWord(resource.type) }}
                    </MenuItem>
                </template>
                <MenuItem danger :description="asks ? `${DELETE_NOTE} Asks first.` : DELETE_NOTE" @click="erase">Delete</MenuItem>
            </MenuPanel>
        </template>
        <template v-if="collecting">
            <Teleport to="body">
                <Dialog small title="Add to collection" @close="collecting = false">
                    <AddToCollection :resource="resource" @done="collecting = false" />
                </Dialog>
            </Teleport>
        </template>
        <template v-if="asking">
            <Teleport to="body">
                <AlertDialog :title="`Delete ${name}?`">
                    <p>
                        It leaves every list and the agent no longer uses it. Its history stays in Activity.
                        <template v-if="sequences.length">
                            {{ sequences.length === 1 ? "The sequence it starts" : `The ${sequences.length} sequences it starts` }} will
                            then start only when you or the agent start {{ sequences.length === 1 ? "it" : "them" }}.
                        </template>
                    </p>
                    <template #actions>
                        <Btn @click="asking = false">Keep it</Btn>
                        <Btn kind="danger" @click="sure">Delete it</Btn>
                    </template>
                </AlertDialog>
            </Teleport>
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
