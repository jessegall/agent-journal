<script setup>
import {computed} from "vue";
import {useToggledSet} from "../composables/toggledSet.js";
import Chip from "./Chip.vue";
import SettingControl from "./SettingControl.vue";
import SettingHowButton from "./SettingHowButton.vue";
import Switch from "./Switch.vue";
import TextDisplay from "./TextDisplay.vue";
import {untitled} from "../domain/settingsCatalog.js";

const props = defineProps({group: {type: Object, required: true}, sheet: Boolean});
const emit = defineEmits(["change", "timing", "act"]);

const {members: opened, toggle} = useToggledSet();
const bare = computed(() => untitled(props.group));
const off = computed(() => Boolean(props.group.head && props.group.head.off));
</script>

<template>
    <section :data-spy="group.key" :class="['setting-group', {sheet}]">
        <template v-if="!bare">
            <header class="setting-group-head">
                <div class="setting-group-text">
                    <h2>{{ group.title }}</h2>
                    <p>
                        {{ group.line }}
                        <template v-if="group.explains">
                            <SettingHowButton :expanded="opened.has(group.key)" @click="toggle(group.key)" />
                        </template>
                    </p>
                </div>
                <template v-if="group.head">
                    <span class="setting-group-switch">
                        <template v-if="group.head.kind === 'always'">
                            <Chip>Always on</Chip>
                        </template>
                        <template v-else>
                            <span>{{ group.head.value ? "On" : "Off" }}</span>
                            <Switch
                                :on="group.head.value"
                                :large="sheet"
                                :title="group.title"
                                @change="emit('change', group.head, $event)"
                            />
                        </template>
                    </span>
                </template>
            </header>
        </template>
        <template v-if="opened.has(group.key)">
            <TextDisplay class="setting-help" :text="group.explains" />
        </template>
        <slot name="before" />
        <template v-if="!bare">
            <div class="setting-card">
                <template v-for="item in group.items" :key="item.key">
                    <template v-if="item.block">
                        <SettingControl
                            head
                            :row="item.head"
                            :sheet="sheet"
                            :dim="off"
                            @change="emit('change', item.head, $event)"
                            @timing="emit('timing', item.head, $event)"
                        >
                            <template v-if="item.explains" #title>
                                <SettingHowButton small :expanded="opened.has(item.key)" @click="toggle(item.key)" />
                            </template>
                        </SettingControl>
                        <template v-if="opened.has(item.key)">
                            <TextDisplay class="setting-help inside" :text="item.explains" />
                        </template>
                        <template v-for="row in item.rows" :key="row.key">
                            <SettingControl
                                child
                                :row="row"
                                :sheet="sheet"
                                :dim="off || item.head.off"
                                @change="emit('change', row, $event)"
                                @timing="emit('timing', row, $event)"
                                @act="emit('act', row, $event)"
                            />
                        </template>
                    </template>
                    <template v-else>
                        <SettingControl
                            :row="item"
                            :sheet="sheet"
                            :dim="off"
                            @change="emit('change', item, $event)"
                            @timing="emit('timing', item, $event)"
                            @act="emit('act', item, $event)"
                        >
                            <template v-if="item.explains" #title>
                                <SettingHowButton small :expanded="opened.has(item.key)" @click="toggle(item.key)" />
                            </template>
                        </SettingControl>
                        <template v-if="opened.has(item.key) && item.explains">
                            <TextDisplay class="setting-help inside" :text="item.explains" />
                        </template>
                    </template>
                </template>
                <template v-if="group.always.length">
                    <div class="setting-always">
                        <b>Always on</b>
                        <template v-for="(item, i) in group.always" :key="item.key">
                            <template v-if="i">
                                <span>·</span>
                            </template>
                            <span>{{ item.label }}</span>
                            <SettingHowButton small :expanded="opened.has(item.key)" @click="toggle(item.key)" />
                        </template>
                    </div>
                    <template v-for="item in group.always" :key="`${item.key}:explains`">
                        <template v-if="opened.has(item.key)">
                            <TextDisplay class="setting-help inside" :text="item.explains" />
                        </template>
                    </template>
                </template>
            </div>
        </template>
        <template v-if="group.danger.length">
            <div class="setting-card danger">
                <template v-for="row in group.danger" :key="row.key">
                    <SettingControl :row="row" :sheet="sheet" @act="emit('act', row, $event)" />
                </template>
            </div>
        </template>
    </section>
</template>

<style scoped>
.setting-group {
    scroll-margin-top: calc(var(--page-bar-height, 52px) + 20px);
}

.setting-group-head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 10px;
    padding-right: 15px;
}

.setting-group-text {
    flex: 1;
    min-width: 0;
}

.setting-group-head h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.005em;
}

.setting-group-head p {
    margin: 2px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.setting-group-switch {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text-3);
    font-size: 12px;
}

.setting-help {
    margin: 0 0 12px;
    padding: 10px 14px;
    border-left: 2px solid var(--border-2);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.55;
    white-space: pre-line;
}

.setting-help.inside {
    margin: 0 14px 10px 34px;
}

.setting-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.setting-card.danger {
    margin-top: 12px;
}

.setting-always {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    padding: 10px 14px;
    border-top: 1px solid var(--line);
    color: var(--text-3);
    font-size: 12px;
}

.setting-always b {
    color: var(--text-2);
    font-weight: 500;
}

.setting-group.sheet .setting-card {
    border-radius: 12px;
}

.setting-group.sheet .setting-group-head h2 {
    font-size: 22px;
}

.setting-group.sheet .setting-group-head p {
    font-size: 13.5px;
}
</style>
