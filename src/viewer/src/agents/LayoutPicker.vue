<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import PresetList from "../kit/PresetList.vue";

const props = defineProps({list: {type: Object, required: true}, tip: {type: String, default: "Switch the layout of this page"}});
const open = ref(false);
const opener = ref(null);

function pick(key) {
    open.value = false;
    props.list.apply(key);
}
</script>

<template>
    <span ref="opener">
        <Btn small data-presets v-tip="tip" @click.stop="open = !open">
            <Icon name="layout" :size="12" />
            Presets
        </Btn>
    </span>
    <template v-if="open">
        <MenuPanel :anchor="opener" align="end" :min-width="240" :max-width="300" @click.stop @close="open = false">
            <template v-if="list.notice.value">
                <p class="layout-notice" role="alert">{{ list.notice.value }}</p>
            </template>
            <PresetList
                :presets="list.presets.value"
                savable
                @pick="pick"
                @save="list.save"
                @update="list.update"
                @rename="list.rename"
                @remove="list.remove"
                @share="list.share"
                @import="list.importLayout"
            />
        </MenuPanel>
    </template>
</template>

<style scoped>
.layout-notice {
    margin: 0;
    padding: 6px 10px;
    color: var(--text-2);
    font-size: 12px;
}
</style>
