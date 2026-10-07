<script setup>
import {ref} from "vue";
import {useAnchoredAction} from "../composables/anchored.js";
import {deleteReason} from "../composables/profiles.js";
import AlertDialog from "../kit/AlertDialog.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["duplicate", "remove"]);
const {anchor, toggle} = useAnchoredAction();
const asking = ref(false);
const reason = () => deleteReason(props.row);

function duplicate() {
    anchor.value = null;
    emit("duplicate", props.row);
}

function remove() {
    asking.value = false;
    emit("remove", props.row);
}
</script>

<template>
    <span class="profile-menu" @click.stop>
        <button type="button" class="profile-menu-more" :aria-label="`More for ${row.title}`" :aria-expanded="!!anchor" @click="toggle">
            <Icon name="dots" :size="14" />
        </button>
        <template v-if="anchor">
            <MenuPanel :anchor="anchor" :min-width="260" :max-width="300" @close="anchor = null">
                <MenuItem description="Makes a copy under Your profiles that you can change." @click="duplicate">Make a copy</MenuItem>
                <MenuItem
                    :disabled="Boolean(reason())"
                    :description="reason() || 'Removes it for good.'"
                    @click="(anchor = null), (asking = true)"
                >
                    Delete
                </MenuItem>
            </MenuPanel>
        </template>
        <template v-if="asking">
            <Teleport to="body">
                <AlertDialog :title="`Delete ${row.title}?`">
                    <p>It is removed for good.</p>
                    <template #actions>
                        <Btn @click="asking = false">Keep it</Btn>
                        <Btn kind="danger" @click="remove">Delete it</Btn>
                    </template>
                </AlertDialog>
            </Teleport>
        </template>
    </span>
</template>

<style scoped>
.profile-menu-more {
    display: inline-grid;
    width: 28px;
    height: 28px;
    place-items: center;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.profile-menu-more:hover,
.profile-menu-more[aria-expanded="true"] {
    background: var(--hover);
    color: var(--text);
}
</style>
