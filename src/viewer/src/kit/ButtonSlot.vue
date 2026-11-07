<script setup>
import {computed, ref} from "vue";
import Btn from "./Btn.vue";
import ButtonForm from "./ButtonForm.vue";
import MenuItem from "./MenuItem.vue";
import SplitButton from "./SplitButton.vue";
import {buttonCatalogue, buttonsAt} from "@journal/window-kit";
import {pressButton} from "../chat/markButtons.js";

const props = defineProps({
    name: {type: String, required: true},
    row: {type: Object, default: null},
    environment: {type: String, required: true},
    readOnly: Boolean,
    externalFailure: Boolean,
    objectName: {type: String, default: ""},
});
const emit = defineEmits(["done", "failure"]);
const catalogue = computed(() => buttonCatalogue(props.environment));
const waiting = computed(
    () => !props.readOnly && catalogue.value?.loading.value && (!catalogue.value.loaded.value || catalogue.value.failed.value)
);
const failed = computed(() => !props.readOnly && catalogue.value?.failed.value);
const reload = () => catalogue.value.load().catch(() => {});
const buttons = computed(() => (props.readOnly ? [] : buttonsAt(props.environment, props.name, props.row)));
const asking = ref(null);
const confirming = ref(null);
const failure = ref("");
const sending = ref(false);
const tip = (button) => [button.from ? `From ${button.from}` : "", button.tip, button.warning].filter(Boolean).join(" · ");
const iconOf = (button) => button.icon || (button.warning ? "dot" : "");

function press(button) {
    if (sending.value || props.readOnly) return;
    if (button.fields.length) {
        asking.value = button;
        return;
    }
    if (button.confirm) {
        confirming.value = button;
        return;
    }
    return run(button);
}

async function run(button) {
    confirming.value = null;
    failure.value = "";
    emit("failure", "");
    sending.value = true;
    const answer = await pressButton(button, props.row, props.environment);
    sending.value = false;
    failure.value = answer.ok ? "" : answer.error;
    const action = button.label.toLowerCase() + (props.objectName && !button.label.includes(" ") ? ` the ${props.objectName}` : "");
    emit("failure", answer.ok ? "" : `Could not ${action}: ${answer.error}`);
    if (answer.ok) emit("done");
}
</script>

<template>
    <span :class="['button-slot', {loading: waiting}]" :aria-busy="Boolean(waiting)">
        <template v-if="!waiting && failed">
            <span class="button-slot-failure" role="alert">Buttons could not be loaded.</span>
            <Btn small @click="reload">Try again</Btn>
        </template>
        <template v-else-if="!waiting && confirming">
            <span class="button-slot-confirm" data-button-confirm>
                <span class="button-slot-confirm-text">{{ confirming.confirm }}</span>
                <Btn small :variant="confirming.danger ? 'ghost' : 'primary'" :bordered="confirming.danger" :class="{danger: confirming.danger}" data-button-confirm-yes @click="run(confirming)">{{ confirming.label }}</Btn>
                <Btn small variant="ghost" data-button-confirm-back @click="confirming = null">Back</Btn>
            </span>
        </template>
        <template v-else-if="!waiting">
            <template v-for="button in buttons" :key="button.name">
                <template v-if="button.menu.length">
                    <SplitButton
                        small
                        :variant="button.primary ? 'primary' : 'ghost'"
                        :disabled="sending"
                        :menu-label="button.menu_label || 'More ways'"
                        :title="tip(button)"
                        :data-button="button.name"
                        @main="press(button)"
                    >
                        {{ button.label }}
                        <template #menu="{close}">
                            <template v-for="item in button.menu" :key="item.label">
                                <MenuItem :description="item.description" @click="(close(), press({...button, ...item, menu: []}))">
                                    {{ item.label }}
                                </MenuItem>
                            </template>
                        </template>
                    </SplitButton>
                </template>
                <template v-else>
                    <Btn
                        small
                        :variant="button.primary ? 'primary' : 'ghost'"
                        :bordered="!button.primary"
                        :class="{danger: button.danger}"
                        :icon="iconOf(button)"
                        :disabled="sending"
                        :title="tip(button)"
                        :data-button="button.name"
                        @click="press(button)"
                    >
                        {{ button.label }}
                    </Btn>
                </template>
            </template>
            <template v-if="failure && !readOnly && !externalFailure">
                <span class="button-slot-failure" role="alert">{{ failure }}</span>
            </template>
            <template v-if="asking && !readOnly">
                <ButtonForm
                    :key="asking.runs"
                    :button="asking"
                    :row="row"
                    :environment="environment"
                    @close="asking = null"
                    @done="emit('done')"
                />
            </template>
        </template>
    </span>
</template>

<style scoped>
.button-slot {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
}
.button-slot.loading {
    min-height: 24px;
}
.button-slot-confirm {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
}
.button-slot-confirm-text {
    color: var(--text-2);
    font-size: 12.5px;
}
.danger {
    border-color: color-mix(in oklab, var(--danger) 55%, var(--border-2));
    color: var(--danger);
}
.button-slot-failure {
    color: var(--danger);
    font-size: 12px;
}
</style>
