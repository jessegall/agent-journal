<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {actsOf} from "../domain/acts.js";
import {DELETE_NOTE} from "../domain/tables.js";
import AlertDialog from "../kit/AlertDialog.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["gone"]);
const open = ref(false);
const asking = ref(false);
const anchor = ref(null);
const refusal = ref("");
const acts = computed(() => actsOf(props.resource));

async function run(act) {
    open.value = false;
    refusal.value = "";
    try {
        await api.act(props.resource.table, props.resource.id, act.name, {});
        if (act.name === "delete") emit("gone");
    } catch (e) {
        refusal.value = e.message;
    }
}

const press = (act) => (act.danger ? ((open.value = false), (asking.value = act)) : run(act));

function sure() {
    const act = asking.value;
    asking.value = false;
    return run(act);
}
</script>

<template>
    <template v-if="acts.length">
        <span class="resource-menu" @click.stop>
            <Btn ref="anchor" kind="icon" small v-tip="'Actions'" @click="open = !open">
                <Icon name="dots" :size="14" />
            </Btn>
            <template v-if="refusal">
                <span class="resource-menu-refusal">{{ refusal }}</span>
            </template>
            <template v-if="open">
                <MenuPanel :anchor="anchor.$el" :min-width="260" align="right" @close="open = false">
                    <template v-for="act in acts" :key="act.name">
                        <MenuItem :danger="act.danger" :description="act.danger ? `${DELETE_NOTE} Asks first.` : ''" @click="press(act)">
                            {{ act.label }}
                        </MenuItem>
                    </template>
                </MenuPanel>
            </template>
            <template v-if="asking">
                <Teleport to="body">
                    <AlertDialog :title="`${asking.label}?`">
                        <p>
                            {{ DELETE_NOTE }}
                        </p>
                        <template #actions>
                            <Btn @click="asking = false">Keep it</Btn>
                            <Btn kind="danger" @click="sure">{{ asking.label }}</Btn>
                        </template>
                    </AlertDialog>
                </Teleport>
            </template>
        </span>
    </template>
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
