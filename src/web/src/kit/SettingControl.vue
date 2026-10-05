<script setup>
import {computed, useId} from "vue";
import {same} from "../domain/settingsCatalog.js";
import Btn from "./Btn.vue";
import Chip from "./Chip.vue";
import ChoiceList from "./ChoiceList.vue";
import ColorSwatch from "./ColorSwatch.vue";
import FormField from "./FormField.vue";
import ResetButton from "./ResetButton.vue";
import Segmented from "./Segmented.vue";
import Switch from "./Switch.vue";
import SwitchCase from "./SwitchCase.vue";
import TextInput from "./TextInput.vue";
import TimingChip from "./TimingChip.vue";

const props = defineProps({row: {type: Object, required: true}, sheet: Boolean, dim: Boolean, head: Boolean, child: Boolean});
const emit = defineEmits(["change", "timing", "act"]);

const id = useId();
const field = computed(() => ["number", "text", "choice"].includes(props.row.kind));
const LONG = 50;
const stacked = computed(() => props.sheet || props.row.options.reduce((n, o) => n + o.label.length, 0) > LONG);
const choices = computed(() => props.row.options.map((o) => ({value: o.key, label: o.label, current: o.key === props.row.value})));
const resettable = computed(() => props.row.changed && (props.row.shipped !== undefined || props.row.timing));

function reset() {
    if (props.row.shipped !== undefined && !same(props.row.value, props.row.shipped)) emit("change", props.row.shipped);
    if (props.row.timing && props.row.timing.changed) emit("timing", props.row.timing.shipped);
}
</script>

<template>
    <template v-if="field">
        <div :class="['setting-row field', {child, indent: row.indent, dim, sheet}]">
            <FormField :label="row.label" :for="id" :help="row.example ? `With this choice: ${row.example}` : row.hint">
                <template #aside>
                    <template v-if="row.changed">
                        <span class="setting-dot" title="Changed from the default" />
                    </template>
                    <template v-if="resettable">
                        <ResetButton class="setting-reset" @click="reset" />
                    </template>
                </template>
                <SwitchCase :value="row.kind">
                    <template #number>
                        <TextInput
                            :id="id"
                            class="setting-number"
                            type="number"
                            min="0"
                            :value="row.value"
                            @change="emit('change', Number($event.target.value))"
                        >
                            <template #end>{{ row.unit }}</template>
                        </TextInput>
                    </template>
                    <template #text>
                        <TextInput :id="id" class="setting-text" :value="row.value" @change="emit('change', $event.target.value)" />
                    </template>
                    <template #choice>
                        <template v-if="stacked">
                            <ChoiceList stacked :choices="choices" @pick="emit('change', $event)" />
                        </template>
                        <template v-else>
                            <Segmented :options="row.options" :value="row.value" @pick="emit('change', $event)" />
                        </template>
                    </template>
                </SwitchCase>
            </FormField>
        </div>
    </template>
    <template v-else>
        <div :class="['setting-row', {head, child, indent: row.indent, dim, sheet}]">
            <div class="setting-label">
                <div class="setting-title">
                    <template v-if="row.changed">
                        <span class="setting-dot" title="Changed from the default" />
                    </template>
                    <span>{{ row.label }}</span>
                    <slot name="title" />
                </div>
                <template v-if="row.hint">
                    <div class="setting-hint">{{ row.hint }}</div>
                </template>
                <template v-if="sheet && row.timing">
                    <TimingChip
                        class="setting-timing"
                        sheet
                        :timing="row.timing"
                        :prefix="row.prefix"
                        :label="row.label"
                        @change="emit('timing', $event)"
                    />
                </template>
            </div>
            <div class="setting-control">
                <template v-if="resettable">
                    <ResetButton class="setting-reset" @click="reset" />
                </template>
                <template v-if="!sheet && row.timing">
                    <TimingChip :timing="row.timing" :prefix="row.prefix" :label="row.label" @change="emit('timing', $event)" />
                </template>
                <SwitchCase :value="row.kind">
                    <template #switch>
                        <Switch :on="row.value" :large="sheet" :title="row.label" @change="emit('change', $event)" />
                    </template>
                    <template #color>
                        <ColorSwatch :value="row.value" :label="row.label" @change="emit('change', $event)" />
                    </template>
                    <template #buttons>
                        <template v-for="button in row.buttons" :key="button.key">
                            <Btn
                                small
                                :href="button.href"
                                :target="button.href && button.key === 'store' ? '_blank' : undefined"
                                @click="!button.href && emit('act', button.key)"
                            >
                                {{ button.label }}
                            </Btn>
                        </template>
                    </template>
                    <template #danger>
                        <template v-for="button in row.buttons" :key="button.key">
                            <Btn small kind="danger" @click="emit('act', button.key)">{{ button.label }}</Btn>
                        </template>
                    </template>
                    <template #always>
                        <Chip>Always on</Chip>
                    </template>
                </SwitchCase>
            </div>
        </div>
    </template>
</template>

<style scoped>
.setting-row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 44px;
    padding: 9px 14px;
    border-top: 1px solid var(--line);
}

.setting-row:first-child {
    border-top: 0;
}

.setting-row.child,
.setting-row.indent {
    padding-left: 34px;
}

.setting-row.child.indent {
    padding-left: 54px;
}

.setting-row.indent .setting-title {
    color: var(--text-2);
}

.setting-row.head .setting-title {
    font-weight: 500;
}

.setting-row.dim > .setting-label,
.setting-row.dim > .setting-control {
    opacity: 0.42;
}

.setting-label {
    flex: 1;
    min-width: 0;
}

.setting-title {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text);
    font-size: 13px;
}

.setting-hint {
    margin-top: 1px;
    color: var(--text-3);
    font-size: 12px;
}

.setting-dot {
    width: 6px;
    height: 6px;
    flex: none;
    border-radius: 50%;
    background: var(--accent);
}

.setting-control {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
}

.setting-reset {
    visibility: hidden;
}

.setting-row:hover .setting-reset,
.setting-reset:focus-visible {
    visibility: visible;
}

.setting-row.field {
    display: block;
}

.setting-row.field :deep(.choices.stacked) {
    align-self: flex-start;
}

.setting-number {
    width: 200px;
}

.setting-text {
    width: 100%;
    max-width: 420px;
}

.setting-timing {
    margin-top: 6px;
}

.setting-row.sheet {
    min-height: 52px;
    padding: 10px 14px;
}

.setting-row.sheet.child,
.setting-row.sheet.indent {
    padding-left: 30px;
}

.setting-row.sheet .setting-title {
    font-size: 14.5px;
}

.setting-row.sheet .setting-hint {
    font-size: 13px;
}

.setting-row.sheet .setting-reset {
    visibility: visible;
}
</style>
